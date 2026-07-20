import Link from "next/link";
import { IPitch } from "@/types/pitch.type";
import { Building2, MapPin, TrendingUp, Users } from "lucide-react";

interface PitchGridProps {
  pitches: IPitch[];
}

export default function PitchGrid({ pitches }: PitchGridProps) {
  if (pitches.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-12 text-center space-y-3 shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <Building2 size={22} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-foreground">No pitches found</p>
        <p className="text-xs text-muted-foreground">Try adjusting your filters or search term.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {pitches.map((pitch) => (
        <Link
          key={pitch._id}
          href={`/investor/pitches/${pitch._id}`}
          className="group flex flex-col bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
        >
          {/* Cover Image */}
          <div className="aspect-[16/9] w-full bg-slate-100 relative overflow-hidden">
            {pitch.coverImageUrl ? (
              <img
                src={pitch.coverImageUrl}
                alt={pitch.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <Building2 size={40} />
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-700 shadow-sm uppercase tracking-wider">
                {pitch.industry}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded bg-primary/90 backdrop-blur-sm text-[10px] font-bold text-white shadow-sm uppercase tracking-wider">
                {pitch.fundingStage.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {pitch.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2 min-h-[40px]">
              {pitch.tagline}
            </p>

            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{pitch.location || "Location N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{pitch.teamSize ? `${pitch.teamSize} members` : "Team N/A"}</span>
              </div>
            </div>

            {/* Financials */}
            <div className="mt-4 pt-4 border-t border-border mt-auto">
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Target</p>
                  <p className="font-bold text-foreground">${pitch.fundingGoal.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Equity</p>
                  <p className="font-bold text-primary">{pitch.equityOffered}%</p>
                </div>
              </div>
              
              {pitch.fundingRaised > 0 && (
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all" 
                    style={{ width: `${Math.min((pitch.fundingRaised / pitch.fundingGoal) * 100, 100)}%` }} 
                  />
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
