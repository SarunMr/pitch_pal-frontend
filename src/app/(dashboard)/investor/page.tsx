import React from "react";
import KYCGuard from "@/components/kyc/KYCGuard";
import { fetchPublicPitchesAction } from "@/lib/actions/pitch.actions";
import Link from "next/link";
import {
  Rocket,
  TrendingUp,
  Search,
  ArrowRight,
  DollarSign,
  Building2,
  Target,
} from "lucide-react";
import { IPitch } from "@/types/pitch.type";

export const metadata = {
  title: "Investor Dashboard | PitchPal",
};

export default async function InvestorDashboard() {
  const result = await fetchPublicPitchesAction({ page: 1, limit: 4 });
  const pitches: IPitch[] = result?.data ?? [];
  const meta = result?.meta ?? { total: 0 };

  const totalFunding = pitches.reduce((sum, p) => sum + (p.fundingGoal ?? 0), 0);

  return (
    <KYCGuard role="investor">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white shadow-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 flex items-center justify-end pr-8 pointer-events-none">
            <Rocket size={160} />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
              Investor Dashboard
            </h1>
            <p className="text-slate-300 text-base max-w-xl">
              Discover promising startups, evaluate investment opportunities, and grow your portfolio.
            </p>
            <Link
              href="/investor/pitches"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-slate-900 font-semibold text-sm hover:bg-slate-100 transition-colors shadow-sm"
            >
              <Search size={16} />
              Browse Marketplace
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground leading-none">{meta.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Active Pitches</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground leading-none">
                ${(totalFunding / 1_000_000).toFixed(1)}M+
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total Capital Sought</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-border p-5 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Target size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground leading-none">
                {pitches.length > 0
                  ? `${Math.round(pitches.reduce((s, p) => s + p.equityOffered, 0) / pitches.length)}%`
                  : "–"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Avg. Equity Offered</p>
            </div>
          </div>
        </div>

        {/* Featured Pitches */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground text-lg">Featured Opportunities</h2>
            <Link
              href="/investor/pitches"
              className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {pitches.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-10 text-center shadow-sm space-y-3">
              <Building2 size={40} className="mx-auto text-slate-300" />
              <p className="font-semibold text-foreground">No pitches available yet</p>
              <p className="text-sm text-muted-foreground">
                Check back soon — startups are actively onboarding.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pitches.map((pitch) => (
                <Link
                  key={pitch._id}
                  href={`/investor/pitches/${pitch._id}`}
                  className="group flex gap-4 items-start bg-white rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
                >
                  {/* Cover/Icon */}
                  <div className="w-14 h-14 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                    {pitch.coverImageUrl ? (
                      <img
                        src={pitch.coverImageUrl}
                        alt={pitch.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Building2 size={22} className="text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {pitch.title}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary shrink-0">
                        {pitch.equityOffered}% eq.
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{pitch.tagline}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500 capitalize">
                        {pitch.industry.replace("_", " ")} · {pitch.fundingStage.replace("_", " ")}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        ${pitch.fundingGoal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </KYCGuard>
  );
}
