import Link from "next/link";
import { PlusCircle, FileText } from "lucide-react";
import { fetchMyPitchesAction } from "@/lib/actions/pitch.actions";
import PitchListTable from "./_components/PitchListTable";
import KYCGuard from "@/components/kyc/KYCGuard";

interface MyPitchesPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
  }>;
}

export const metadata = {
  title: "My Pitches | PitchPal Entrepreneur",
  description: "Manage your startup pitches and track fundraising progress.",
};

export default async function MyPitchesPage({ searchParams }: MyPitchesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10) || 1;
  const limit = parseInt(params.size ?? "10", 10) || 10;

  const result = await fetchMyPitchesAction({ page, limit });
  const pitches = result?.data ?? [];
  const meta = result?.meta ?? { page: 1, limit: 10, total: 0, totalPages: 0 };
  const hasError = !result?.success;

  return (
    <KYCGuard role="entrepreneur">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileText size={18} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">My Pitches</h1>
              <p className="text-xs text-muted-foreground">
                {meta.total} {meta.total === 1 ? "pitch" : "pitches"} total
              </p>
            </div>
          </div>
          <Link
            href="/entrepreneur/pitches/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <PlusCircle size={15} />
            New Pitch
          </Link>
        </div>

        {/* Error state */}
        {hasError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-2">
            <p className="text-sm font-medium text-destructive">Failed to load your pitches</p>
            <p className="text-xs text-muted-foreground">{result?.message}</p>
          </div>
        )}

        {/* List */}
        {!hasError && (
          <PitchListTable
            pitches={pitches}
          />
        )}
      </div>
    </KYCGuard>
  );
}
