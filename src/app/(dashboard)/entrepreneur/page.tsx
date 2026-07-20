import React from "react";
import KYCGuard from "@/components/kyc/KYCGuard";
import { fetchMyPitchesAction } from "@/lib/actions/pitch.actions";
import Link from "next/link";
import {
  FileText,
  PlusCircle,
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IPitch, PitchStatus } from "@/types/pitch.type";

export const metadata = {
  title: "Entrepreneur Dashboard | PitchPal",
};

const STATUS_STYLES: Record<PitchStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  review: "bg-amber-100 text-amber-700",
  live: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  changes_requested: "bg-orange-100 text-orange-700",
  edit_requested: "bg-blue-100 text-blue-700",
  deleted: "bg-slate-100 text-slate-500",
};

export default async function EntrepreneurDashboard() {
  const result = await fetchMyPitchesAction({ page: 1, limit: 5 });
  const pitches: IPitch[] = result?.data ?? [];
  const meta = result?.meta ?? { total: 0 };

  const stats = {
    total: meta.total,
    drafts: pitches.filter((p) => p.status === "draft").length,
    submitted: pitches.filter((p) => ["review"].includes(p.status)).length,
    approved: pitches.filter((p) => ["live"].includes(p.status)).length,
    rejected: pitches.filter((p) => p.status === "rejected").length,
  };

  const totalRaised = pitches.reduce((sum, p) => sum + (p.fundingRaised ?? 0), 0);
  const totalGoal = pitches.reduce((sum, p) => sum + (p.fundingGoal ?? 0), 0);

  return (
    <KYCGuard role="entrepreneur">
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1A6B4A] to-emerald-500 p-8 text-white shadow-lg overflow-hidden relative">
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 flex items-center justify-end pr-8 pointer-events-none">
            <TrendingUp size={160} />
          </div>
          <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
              Entrepreneur Dashboard
            </h1>
            <p className="text-emerald-100 text-base max-w-xl">
              Manage your pitches, track fundraising progress, and connect with investors.
            </p>
            <Link
              href="/entrepreneur/pitches/create"
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#1A6B4A] font-semibold text-sm hover:bg-emerald-50 transition-colors shadow-sm"
            >
              <PlusCircle size={16} />
              Create New Pitch
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Pitches", value: stats.total, icon: FileText, color: "text-primary bg-primary/10" },
            { label: "In Review", value: stats.submitted, icon: Clock, color: "text-amber-600 bg-amber-50" },
            { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500 bg-red-50" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl border border-border p-5 shadow-sm flex items-center gap-4"
            >
              <div className={cn("w-11 h-11 rounded-lg flex items-center justify-center shrink-0", stat.color)}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Fundraising Progress */}
        {totalGoal > 0 && (
          <div className="bg-white rounded-xl border border-border p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-foreground">Overall Fundraising</h2>
            <div className="flex items-end justify-between mb-2 text-sm">
              <span className="text-muted-foreground">
                Total raised across all pitches
              </span>
              <span className="font-semibold text-emerald-600">
                ${totalRaised.toLocaleString()} / ${totalGoal.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min((totalRaised / totalGoal) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalRaised / totalGoal) * 100).toFixed(1)}% of total goal reached
            </p>
          </div>
        )}

        {/* Recent Pitches */}
        <div className="bg-white rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="font-bold text-foreground">Recent Pitches</h2>
            <Link
              href="/entrepreneur/pitches"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all →
            </Link>
          </div>
          {pitches.length === 0 ? (
            <div className="p-10 text-center space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center">
                <FileText size={24} className="text-slate-400" />
              </div>
              <div>
                <p className="font-semibold text-foreground">No pitches yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first pitch and start raising capital.
                </p>
              </div>
              <Link
                href="/entrepreneur/pitches/create"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <PlusCircle size={15} />
                Create Pitch
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pitches.map((pitch) => (
                <div
                  key={pitch._id}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{pitch.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">{pitch.industry}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium shrink-0 capitalize",
                      STATUS_STYLES[pitch.status],
                    )}
                  >
                    {pitch.status.replace("_", " ")}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {pitch.status === "draft" && (
                      <Link
                        href={`/entrepreneur/pitches/create?edit=${pitch._id}`}
                        className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-slate-100 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                    )}
                    <Link
                      href={`/entrepreneur/pitches/${pitch._id}`}
                      className="p-1.5 text-muted-foreground hover:text-primary rounded-md hover:bg-slate-100 transition-colors"
                      title="View"
                    >
                      <Send size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </KYCGuard>
  );
}
