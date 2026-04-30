"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getLeadership,
  getLeadershipSeasons,
  addLeadershipEntry,
  updateLeadershipEntry,
  deleteLeadershipEntry,
  type LeadershipEntry,
} from "@/lib/firebase";

const ROLES = [
  "Club President",
  "Club Vice President",
  "Club Treasurer",
  "Captain",
  "Social Captain",
  "Freshman Liaison",
];

const ROLE_ORDER = ROLES;

const emptyForm = { name: "", role: ROLES[0], season: "", bio: "" };

function roleIndex(role: string) {
  const i = ROLE_ORDER.indexOf(role);
  return i === -1 ? ROLE_ORDER.length : i;
}

export default function AdminLeadersPage() {
  const [seasons, setSeasons] = useState<string[]>([]);
  const [entries, setEntries] = useState<LeadershipEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [addForm, setAddForm] = useState(emptyForm);
  const [showNewSeason, setShowNewSeason] = useState(false);
  const [newSeason, setNewSeason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const [s, all] = await Promise.all([getLeadershipSeasons(), getLeadership()]);
    setSeasons(s);
    setEntries(all);
    if (s.length > 0 && !selectedSeason) {
      setSelectedSeason(s[0]);
      setAddForm((f) => ({ ...f, season: s[0] }));
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = entries
    .filter((e) => e.season === selectedSeason)
    .sort((a, b) => roleIndex(a.role) - roleIndex(b.role));

  function switchSeason(s: string) {
    setSelectedSeason(s);
    setEditingId(null);
    setAddForm((f) => ({ ...f, season: s }));
  }

  function startEdit(entry: LeadershipEntry) {
    setEditingId(entry.id);
    setEditForm({ name: entry.name, role: entry.role, season: entry.season, bio: entry.bio ?? "" });
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      const data = { ...editForm };
      if (!data.bio) delete (data as Partial<typeof data>).bio;
      await updateLeadershipEntry(editingId, data);
      setEditingId(null);
      await load();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!addForm.season) return;
    setSaving(true);
    setError(null);
    try {
      const data = { ...addForm };
      if (!data.bio) delete (data as Partial<typeof data>).bio;
      await addLeadershipEntry(data);
      setAddForm({ ...emptyForm, season: selectedSeason, role: ROLES[0] });
      await load();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove ${name}?`)) return;
    try {
      await deleteLeadershipEntry(id);
      await load();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  async function handleCreateSeason(e: React.FormEvent) {
    e.preventDefault();
    if (!newSeason.trim()) return;
    const s = newSeason.trim();
    setSeasons((prev) => [s, ...prev]);
    switchSeason(s);
    setNewSeason("");
    setShowNewSeason(false);
  }

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-carleton-blue";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/admin" className="text-sm text-gray-400 hover:text-carleton-blue transition-colors mb-6 inline-block">
        ← Admin
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Leadership</h1>
        <div className="flex items-center gap-3">
          {seasons.length > 0 && (
            <select
              value={selectedSeason}
              onChange={(e) => switchSeason(e.target.value)}
              className={inputCls + " bg-white"}
            >
              {seasons.map((s) => <option key={s}>{s}</option>)}
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
          <button type="submit" className="bg-carleton-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Create
          </button>
          <button type="button" onClick={() => setShowNewSeason(false)} className="border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-100">
            Cancel
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      )}

      {!loading && (
        <>
          <div className="space-y-2 mb-10">
            {visible.length === 0 && (
              <p className="text-gray-400 text-sm">No members listed for this season. Add one below.</p>
            )}
            {visible.map((entry) =>
              editingId === entry.id ? (
                <form key={entry.id} onSubmit={handleUpdate} className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Name</label>
                      <input required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={inputCls + " w-full"} placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Role</label>
                      <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className={inputCls + " w-full bg-white"}>
                        {ROLES.map((r) => <option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bio (optional)</label>
                    <input value={editForm.bio} onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} className={inputCls + " w-full"} placeholder="Short bio or note" />
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={saving} className="bg-carleton-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                      {saving ? "Saving…" : "Save"}
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div key={entry.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-3 shadow-sm gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{entry.name}</p>
                    <p className="text-sm text-carleton-blue font-medium">{entry.role}</p>
                    {entry.bio && <p className="text-xs text-gray-400 truncate">{entry.bio}</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button onClick={() => startEdit(entry)} className="text-sm text-carleton-blue hover:opacity-70 transition-opacity">Edit</button>
                    <button onClick={() => handleDelete(entry.id, entry.name)} className="text-sm text-red-400 hover:text-red-600 transition-colors">✕</button>
                  </div>
                </div>
              )
            )}
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">Add Member</h2>
            <form onSubmit={handleAdd} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name</label>
                  <input required value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} className={inputCls + " w-full"} placeholder="Full name" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Role</label>
                  <select value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })} className={inputCls + " w-full bg-white"}>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Bio (optional)</label>
                <input value={addForm.bio} onChange={(e) => setAddForm({ ...addForm, bio: e.target.value })} className={inputCls + " w-full"} placeholder="Short bio or note" />
              </div>
              <button type="submit" disabled={saving || !selectedSeason} className="bg-carleton-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
                {saving ? "Adding…" : "Add Member"}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
