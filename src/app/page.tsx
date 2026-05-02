"use client";

import { useEffect, useState } from "react";
import { getNextMatch, type ScheduleGame } from "@/lib/firebase";
import { MatchRow } from "@/components/ui/MatchRow";

export default function HomePage() {
  const [nextMatch, setNextMatch] = useState<ScheduleGame | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNextMatch()
      .then(setNextMatch)
      .catch((err) => {
        console.error("[home/nextMatch]", err);
        setError(err?.message ?? "Failed to load next match.");
        setNextMatch(null);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <section className="py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-carleton-blue mb-3">
          Carleton College
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-4">Club Soccer</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Schedules, roster, and season stats for Carleton&apos;s club soccer team.
        </p>
      </section>

      <section className="pb-20 max-w-3xl">
        <h2 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-4">
          Next Match
        </h2>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-mono">
            {error}
          </div>
        )}
        {nextMatch === undefined && !error && (
          <div className="h-16 rounded-xl bg-gray-100 animate-pulse" />
        )}
        {nextMatch === null && !error && (
          <p className="text-gray-400 text-sm">No upcoming matches scheduled.</p>
        )}
        {nextMatch && <MatchRow game={nextMatch} />}
      </section>
    </div>
  );
}
