import { 
  fetchPitchByIdAction, 
  fetchPitchTiersAction, 
  fetchPitchMilestonesAction 
} from "@/lib/actions/pitch.actions";
import PitchDetailView from "@/components/pitch/PitchDetailView";
import MilestoneForm from "../_components/MilestoneForm";
import KYCGuard from "@/components/kyc/KYCGuard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface EntrepreneurPitchDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Pitch Details | PitchPal",
};

export default async function EntrepreneurPitchDetailPage({ params }: EntrepreneurPitchDetailPageProps) {
  const { id } = await params;

  const [pitchRes, tiersRes, milestonesRes] = await Promise.all([
    fetchPitchByIdAction(id),
    fetchPitchTiersAction(id),
    fetchPitchMilestonesAction(id),
  ]);

  if (!pitchRes?.success || !pitchRes?.data) {
    notFound();
  }

  const pitch = pitchRes.data;
  const tiers = tiersRes?.data ?? [];
  const milestones = milestonesRes?.data ?? [];

  return (
    <KYCGuard role="entrepreneur">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/entrepreneur/pitches"
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-muted-foreground transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Pitch Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              Manage your pitch and post updates for investors.
            </p>
          </div>
        </div>

        <PitchDetailView pitch={pitch} tiers={tiers} milestones={milestones} />

        {/* Milestone Posting Section (Only if approved, but we can allow it generally or restrict it) */}
        {pitch.status !== "draft" && (
          <div className="max-w-3xl">
            <MilestoneForm pitchId={pitch._id} />
          </div>
        )}
      </div>
    </KYCGuard>
  );
}
