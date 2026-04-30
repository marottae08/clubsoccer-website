import type { ScheduleGame } from "@/lib/firebase";

interface MatchRowProps {
  game: ScheduleGame;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function MatchRow({ game }: MatchRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white border border-gray-100 rounded-xl px-5 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-400 w-24 flex-shrink-0">
          {formatDate(game.date)}
        </span>
        <div>
          <p className="font-semibold text-gray-900">vs. {game.opponent}</p>
          <p className="text-sm text-gray-500">{game.location}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:flex-shrink-0">
        <span
          className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-full ${
            game.isHome
              ? "bg-carleton-maize/20 text-carleton-blue"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {game.isHome ? "Home" : "Away"}
        </span>
        {game.result && (
          <span className="text-sm font-mono font-bold text-gray-900">{game.result}</span>
        )}
      </div>
    </div>
  );
}
