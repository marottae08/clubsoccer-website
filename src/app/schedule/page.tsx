"use client";

import { useEffect, useState } from "react";
import { getSchedule, type ScheduleGame } from "@/lib/firebase";
import { MatchRow } from "@/components/ui/MatchRow";

export default function SchedulePage() {
  const [games, setGames] = useState<ScheduleGame[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    getSchedule()
      .then(setGames)
      .catch((err) => {
        console.error("[schedule]", err);
        setError(err?.message ?? "Failed to load schedule.");
        setGames([]);
      });
  }, []);

  const upcoming = games?.filter((g) => g.date >= today) ?? [];
  const past = games?.filter((g) => g.date < today).reverse() ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Schedule</h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-mono">
          {error}
        </div>
      )}

      {games === null && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {games !== null && games.length === 0 && !error && (
        <p className="text-gray-400 text-sm">No games scheduled.</p>
      )}

      {games !== null && games.length > 0 && (
        <div className="space-y-10">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Upcoming
              </h2>
              <div className="space-y-3">
                {upcoming.map((game) => (
                  <MatchRow key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Results
              </h2>
              <div className="space-y-3">
                {past.map((game) => (
                  <MatchRow key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
