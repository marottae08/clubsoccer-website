import type { Player } from "@/lib/firebase";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-carleton-blue text-carleton-maize font-bold text-sm flex-shrink-0">
        {player.number}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{player.name}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wider">{player.position}</p>
      </div>
    </div>
  );
}
