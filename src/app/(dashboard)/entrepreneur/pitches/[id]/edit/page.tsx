import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import DashboardWarningBanner from "@/components/dashboard/DashboardWarningBanner";
import PitchEditForm from "../../_components/PitchEditForm";
import {
  fetchPitchByIdAction,
  fetchPitchTiersAction,
} from "@/lib/actions/pitch.actions";
import { IInvestorTierDoc } from "@/types/pitch.type";

export const metadata = {
  title: "Edit Pitch | PitchPal",
};

interface EditPitchPageProps {
  params: Promise<{ id: string }>;
}

// Only allow editing in these statuses
const EDITABLE_STATUSES = ["draft", "rejected", "changes_requested"];

export default async function EditPitchPage({ params }: EditPitchPageProps) {
  const { id } = await params;

  const [pitchRes, tiersRes] = await Promise.all([
    fetchPitchByIdAction(id),
    fetchPitchTiersAction(id),
  ]);

  if (!pitchRes?.success || !pitchRes?.data) {
    notFound();
  }

  const pitch = pitchRes.data;

  // Guard: only editable statuses
  if (!EDITABLE_STATUSES.includes(pitch.status)) {
    notFound();
  }

  const tiers: IInvestorTierDoc[] = tiersRes?.data ?? [];

  return (
    <>
      <div className="space-y-6">
        <DashboardWarningBanner role="entrepreneur" />
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/entrepreneur/pitches"
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-muted-foreground transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Edit Pitch</h1>
            <p className="text-xs text-muted-foreground">
              Update your pitch details. Changes are saved per section.
            </p>
          </div>
        </div>

        <PitchEditForm pitch={pitch} tiers={tiers} />
      </div>
    </>
  );
}
