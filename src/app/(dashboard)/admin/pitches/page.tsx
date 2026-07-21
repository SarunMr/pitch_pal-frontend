import { fetchAdminQueueAction } from "@/lib/actions/pitch.actions";
import PitchQueueTable from "./_components/PitchQueueTable";
import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface AdminPitchesPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    status?: string;
  }>;
}

export const metadata = {
  title: "Pitch Queue | PitchPal Admin",
  description: "Review and manage startup pitches.",
};

export default async function AdminPitchesPage({ searchParams }: AdminPitchesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10) || 1;
  const limit = parseInt(params.size ?? "20", 10) || 20;
  // Default to "review" if no status provided, otherwise use the selected status (or empty for all)
  const status = params.status !== undefined ? params.status : "review";

  const result = await fetchAdminQueueAction({
    page,
    limit,
    ...(status && { status }),
  });

  const pitches = result?.data ?? [];
  const meta = result?.meta ?? { page: 1, limit: 20, total: 0, totalPages: 0 };
  const hasError = !result?.success;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <ClipboardList size={18} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Pitch Queue</h1>
            <p className="text-xs text-muted-foreground">
              {meta.total} {meta.total === 1 ? "pitch" : "pitches"} found
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 pb-2">
        {["review", "live", "edit_requested", "changes_requested", "rejected", "deleted", ""].map((s) => (
          <Link
            key={s}
            href={`/admin/pitches${s ? `?status=${s}` : '?status='}`}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              status === s 
                ? "bg-slate-800 text-white border-slate-800" 
                : "bg-white text-slate-600 border-border hover:bg-slate-50"
            }`}
          >
            {s ? s.replace("_", " ").toUpperCase() : "ALL"}
          </Link>
        ))}
      </div>

      {/* Error state */}
      {hasError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-2">
          <p className="text-sm font-medium text-destructive">Failed to load pitch queue</p>
          <p className="text-xs text-muted-foreground">{result?.message}</p>
        </div>
      )}

      {/* Table */}
      {!hasError && <PitchQueueTable pitches={pitches} />}
    </div>
  );
}
