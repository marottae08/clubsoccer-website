"use client";

import { useEffect, useState } from "react";
import { getCoach, type Coach } from "@/lib/firebase";
import { CoachCard } from "@/components/ui/CoachCard";

export default function CoachPage() {
  const [coach, setCoach] = useState<Coach | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCoach()
      .then(setCoach)
      .catch((err) => {
        console.error("[coach]", err);
        setError(err?.message ?? "Failed to load coach.");
        setCoach(null);
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Coach</h1>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-mono">
          {error}
        </div>
      )}

      {coach === undefined && (
        <div className="h-36 rounded-2xl bg-gray-100 animate-pulse max-w-xl" />
      )}

      {coach === null && !error && (
        <p className="text-gray-400 text-sm">No coach listed yet.</p>
      )}

      {coach && <CoachCard coach={coach} />}
    </div>
  );
}
