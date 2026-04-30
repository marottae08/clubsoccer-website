"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCoach, saveCoach, deleteCoach, type Coach } from "@/lib/firebase";

const ROLES = ["Head Coach", "Assistant Coach", "Goalkeeper Coach", "Fitness Coach"];

const empty = { name: "", role: "Head Coach", bio: "" };

export default function AdminCoachPage() {
  const [coach, setCoach] = useState<Coach | null | undefined>(undefined);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function load() {
    const c = await getCoach();
    setCoach(c);
    if (c) setForm({ name: c.name, role: c.role, bio: c.bio ?? "" });
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await saveCoach(coach?.id ?? null, { name: form.name, role: form.role, bio: form.bio });
      await load();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!coach || !confirm(`Remove ${coach.name}?`)) return;
    setDeleting(true);
    try {
      await deleteCoach(coach.id);
      setCoach(null);
      setForm(empty);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/admin" className="text-sm text-gray-400 hover:text-carleton-blue transition-colors mb-6 inline-block">
        ← Admin
      </Link>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Coach</h1>

      {coach === undefined && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {coach !== undefined && (
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-carleton-blue"
              placeholder="Coach full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-carleton-blue bg-white"
            >
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-carleton-blue resize-none"
              placeholder="Short bio (optional)"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">Saved.</p>}

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-carleton-blue text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {saving ? "Saving…" : coach ? "Save Changes" : "Create Coach"}
            </button>

            {coach && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? "Removing…" : "Remove Coach"}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
