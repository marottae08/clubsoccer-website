"use client";

import { useEffect, useState } from "react";
import { getRosters, type Roster } from "@/lib/firebase";
import { PlayerCard } from "@/components/ui/PlayerCard";

export default function RosterPage() {
  const [rosters, setRosters] = useState<Roster[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>("");

  useEffect(() => {
    getRosters()
      .then((data) => {
        setRosters(data);
        if (data.length > 0) setSelectedSeason(data[0].season);
      })
      .catch((err) => {
        console.error("[rosters]", err);
        setError(err?.message ?? "Failed to load roster.");
        setRosters([]);
      });
  }, []);

  const seasons = rosters?.map((r) => r.season) ?? [];
  const current = rosters?.find((r) => r.season === selectedSeason) ?? null;
  const players = current?.players.slice().sort((a, b) => a.number - b.number) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Roster</h1>

        {seasons.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="season" className="text-sm text-gray-500 font-medium">
              Season
            </label>
            <select
              id="season"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-carleton-blue"
            >
              {seasons.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-mono">
          {error}
        </div>
      )}

      {rosters === null && (
        <div className="grid sm:grid-cols-2 gap-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {rosters?.length === 0 && !error && (
        <p className="text-gray-400 text-sm">No roster available yet.</p>
      )}

      {players.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}
