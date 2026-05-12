"use client";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getRosters,
  createSeason,
  addPlayerToRoster,
  updatePlayerInRoster,
  removePlayerFromRoster,
  storage,
  type Roster,
  type Player,
} from "@/lib/firebase";

const POSITIONS = ["GK", "DEF", "MID", "FWD"];
const emptyPlayer = { photoUrl: "", name: "", number: "", position: "MID" };

export default function AdminRosterPage() {
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyPlayer);
  const [addForm, setAddForm] = useState(emptyPlayer);
  const [newSeason, setNewSeason] = useState("");
  const [showNewSeason, setShowNewSeason] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addPhotoFile, setAddPhotoFile] = useState<File | null>(null);
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    const data = await getRosters();
    setRosters(data);
    if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const roster = rosters.find((r) => r.id === selectedId) ?? null;
  const players = roster?.players.slice().sort((a, b) => a.number - b.number) ?? [];

  function startEdit(player: Player) {
    setEditingId(player.id);
    setEditForm({ photoUrl: player.photoUrl ?? "", name: player.name, number: String(player.number), position: player.position });
  }

  async function handleUpdate(e: React.FormEvent) {
  e.preventDefault();
  if (!editingId || !selectedId) return;
  setSaving(true);
  setError(null);

  try {
    let photoUrl = editForm.photoUrl.trim() || undefined;

    if (editPhotoFile) {
      photoUrl = await uploadPlayerPhoto(editPhotoFile);
    }

    await updatePlayerInRoster(selectedId, editingId, {
      photoUrl,
      name: editForm.name,
      number: Number(editForm.number),
      position: editForm.position,
    });

    setEditingId(null);
    setEditPhotoFile(null);
    await load();
  } catch (err: unknown) {
    setError((err as Error).message);
  } finally {
    setSaving(false);
  }
}
  async function uploadPlayerPhoto(file: File): Promise<string> {
    const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
    const filePath = `players/${Date.now()}-${safeName}`;
    const storageRef = ref(storage, filePath);
  
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  async function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  if (!selectedId) return;
  setSaving(true);
  setError(null);

  try {
    let photoUrl = addForm.photoUrl.trim() || undefined;

    if (addPhotoFile) {
      photoUrl = await uploadPlayerPhoto(addPhotoFile);
    }

    await addPlayerToRoster(selectedId, {
      photoUrl,
      name: addForm.name,
      number: Number(addForm.number),
      position: addForm.position,
    });

    setAddForm(emptyPlayer);
    setAddPhotoFile(null);
    await load();
  } catch (err: unknown) {
    setError((err as Error).message);
  } finally {
    setSaving(false);
  }
}

  async function handleRemove(playerId: string, name: string) {
    if (!selectedId || !confirm(`Remove ${name}?`)) return;
    try {
      await removePlayerFromRoster(selectedId, playerId);
      await load();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  async function handleCreateSeason(e: React.FormEvent) {
    e.preventDefault();
    if (!newSeason.trim()) return;
    setSaving(true);
    try {
      const id = await createSeason(newSeason.trim());
      setNewSeason("");
      setShowNewSeason(false);
      await load();
      setSelectedId(id);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-carleton-blue";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/admin" className="text-sm text-gray-400 hover:text-carleton-blue transition-colors mb-6 inline-block">
        ← Admin
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Roster</h1>
        <div className="flex items-center gap-3">
          {rosters.length > 0 && (
            <select
              value={selectedId}
              onChange={(e) => { setSelectedId(e.target.value); setEditingId(null); }}
              className={inputCls + " bg-white"}
            >
              {rosters.map((r) => <option key={r.id} value={r.id}>{r.season}</option>)}
            </select>
          )}
          <button
            onClick={() => setShowNewSeason(!showNewSeason)}
            className="border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            + Season
          </button>
        </div>
      </div>

      {showNewSeason && (
        <form onSubmit={handleCreateSeason} className="flex gap-3 mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4">
          <input
            required
            value={newSeason}
            onChange={(e) => setNewSeason(e.target.value)}
            placeholder="2026-2027"
            className={inputCls + " flex-1"}
          />
          <button type="submit" disabled={saving} className="bg-carleton-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
            {saving ? "Creating…" : "Create"}
          </button>
          <button type="button" onClick={() => setShowNewSeason(false)} className="border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-100">
            Cancel
          </button>
        </form>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {!loading && roster && (
        <>
          <div className="space-y-2 mb-8">
            {players.length === 0 && (
              <p className="text-gray-400 text-sm">No players yet. Add one below.</p>
            )}
            {players.map((player) =>
              editingId === player.id ? (
                <form key={player.id} onSubmit={handleUpdate} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <div className="w-48">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditPhotoFile(e.target.files?.[0] ?? null)}
                    className={inputCls + " w-full"}
                  />
                </div>
                  <input
                    type="number"
                    required
                    min={1}
                    max={99}
                    value={editForm.number}
                    onChange={(e) => setEditForm({ ...editForm, number: e.target.value })}
                    className={inputCls + " w-16 text-center"}
                    placeholder="#"
                  />
                  <input
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={inputCls + " flex-1"}
                    placeholder="Player name"
                  />
                  <select
                    value={editForm.position}
                    onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                    className={inputCls + " bg-white w-20"}
                  >
                    {POSITIONS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <button type="submit" disabled={saving} className="bg-carleton-blue text-white px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                    {saving ? "…" : "Save"}
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 text-sm px-2">
                    Cancel
                  </button>
                </form>
              ) : (
                <div key={player.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-carleton-blue text-carleton-maize text-xs font-bold">
                      {player.number}
                    </span>
                    <span className="font-medium text-gray-900">{player.name}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{player.position}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => startEdit(player)} className="text-sm text-carleton-blue hover:opacity-70 transition-opacity">Edit</button>
                    <button onClick={() => handleRemove(player.id, player.name)} className="text-sm text-red-400 hover:text-red-600 transition-colors">✕</button>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Add Player</h2>
            <form onSubmit={handleAdd} className="flex items-end gap-3 flex-wrap">
                <div className="w-48">
                <label className="block text-xs text-gray-500 mb-1">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAddPhotoFile(e.target.files?.[0] ?? null)}
                  className={inputCls + " w-full"}
                />
              </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">#</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={99}
                  value={addForm.number}
                  onChange={(e) => setAddForm({ ...addForm, number: e.target.value })}
                  className={inputCls + " w-16 text-center"}
                  placeholder="10"
                />
              </div>
              <div className="flex-1 min-w-40">
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  className={inputCls + " w-full"}
                  placeholder="Player name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Position</label>
                <select
                  value={addForm.position}
                  onChange={(e) => setAddForm({ ...addForm, position: e.target.value })}
                  className={inputCls + " bg-white"}
                >
                  {POSITIONS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <button type="submit" disabled={saving} className="bg-carleton-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                {saving ? "Adding…" : "Add Player"}
              </button>
            </form>
          </div>
        </>
      )}

      {!loading && rosters.length === 0 && (
        <p className="text-gray-400 text-sm">No seasons yet. Create one above.</p>
      )}
    </div>
  );
}
