"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getSchedule,
  addGame,
  updateGame,
  deleteGame,
  type ScheduleGame,
} from "@/lib/firebase";

type GameForm = Omit<ScheduleGame, "id">;

const emptyForm: GameForm = {
  date: "",
  opponent: "",
  location: "",
  isHome: true,
  result: "",
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default function AdminSchedulePage() {
  const [games, setGames] = useState<ScheduleGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<GameForm>(emptyForm);
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<GameForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setGames(await getSchedule());
    setLoading(false);
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function startEdit(game: ScheduleGame) {
    setEditingId(game.id);
    setEditForm({ date: game.date, opponent: game.opponent, location: game.location, isHome: game.isHome, result: game.result ?? "" });
    setAdding(false);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      const data = { ...editForm };
      if (!data.result) delete data.result;
      await updateGame(editingId, data);
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
    setSaving(true);
    setError(null);
    try {
      const data = { ...addForm };
      if (!data.result) delete data.result;
      await addGame(data);
      setAdding(false);
      setAddForm(emptyForm);
      await load();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, opponent: string) {
    if (!confirm(`Remove game vs ${opponent}?`)) return;
    try {
      await deleteGame(id);
      await load();
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  }

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-carleton-blue w-full";

  function GameForm({ form, setForm, onSubmit, onCancel, label }: {
    form: GameForm;
    setForm: (f: GameForm) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    label: string;
  }) {
    return (
      <form onSubmit={onSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Opponent</label>
            <input required value={form.opponent} onChange={(e) => setForm({ ...form, opponent: e.target.value })} className={inputCls} placeholder="St. Olaf College" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputCls} placeholder="Carleton Athletic Complex" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Result (optional)</label>
            <input value={form.result ?? ""} onChange={(e) => setForm({ ...form, result: e.target.value })} className={inputCls} placeholder="W 2-1" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isHome}
              onChange={(e) => setForm({ ...form, isHome: e.target.checked })}
              className="rounded accent-carleton-blue"
            />
            Home game
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-carleton-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
            {saving ? "Saving…" : label}
          </button>
          <button type="button" onClick={onCancel} className="border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/admin" className="text-sm text-gray-400 hover:text-carleton-blue transition-colors mb-6 inline-block">
        ← Admin
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Schedule</h1>
        {!adding && (
          <button onClick={() => { setAdding(true); setEditingId(null); }} className="bg-carleton-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            + Add Game
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-6">
          <GameForm form={addForm} setForm={setAddForm} onSubmit={handleAdd} onCancel={() => setAdding(false)} label="Add Game" />
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      )}

      {!loading && games.length === 0 && (
        <p className="text-gray-400 text-sm">No games yet.</p>
      )}

      <div className="space-y-3">
        {games.map((game) =>
          editingId === game.id ? (
            <GameForm
              key={game.id}
              form={editForm}
              setForm={setEditForm}
              onSubmit={handleUpdate}
              onCancel={() => setEditingId(null)}
              label="Save Changes"
            />
          ) : (
            <div key={game.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-5 py-3 shadow-sm gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-sm text-gray-400 flex-shrink-0">{formatDate(game.date)}</span>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">vs. {game.opponent}</p>
                  <p className="text-xs text-gray-400 truncate">{game.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${game.isHome ? "bg-carleton-maize/20 text-carleton-blue" : "bg-gray-100 text-gray-500"}`}>
                  {game.isHome ? "Home" : "Away"}
                </span>
                {game.result && <span className="text-sm font-mono font-bold text-gray-700">{game.result}</span>}
                <button onClick={() => startEdit(game)} className="text-sm text-carleton-blue hover:opacity-70 transition-opacity">Edit</button>
                <button onClick={() => handleDelete(game.id, game.opponent)} className="text-sm text-red-400 hover:text-red-600 transition-colors">✕</button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
