import type { Coach } from "@/lib/firebase";

interface CoachCardProps {
  coach: Coach;
}

export function CoachCard({ coach }: CoachCardProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start bg-white border border-gray-100 rounded-2xl p-8 shadow-sm max-w-xl">
      <div className="flex-shrink-0 w-20 h-20 rounded-full bg-carleton-blue flex items-center justify-center overflow-hidden">
        {coach.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coach.photoUrl} alt={coach.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl text-carleton-maize font-bold select-none">
            {coach.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-gray-900">{coach.name}</p>
        <p className="text-sm font-semibold text-carleton-blue uppercase tracking-wider mt-1">
          {coach.role}
        </p>
        {coach.bio && (
          <p className="mt-3 text-gray-500 leading-relaxed">{coach.bio}</p>
        )}
      </div>
    </div>
  );
}
