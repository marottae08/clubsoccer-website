import type { Player } from "@/lib/firebase";

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
      <div className="w-12 h-12 rounded-full overflow-hidden bg-carleton-blue text-carleton-maize font-bold text-sm flex-shrink-0">
        {player.photoUrl ? (
          <img
            src={player.photoUrl}
            alt={player.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {player.number}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{player.name}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          #{player.number} · {player.position}
        </p>
      </div>
    </div>
  );
}
