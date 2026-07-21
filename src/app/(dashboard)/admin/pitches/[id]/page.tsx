import { 
  fetchPitchByIdAction, 
  fetchPitchTiersAction, 
  fetchPitchMilestonesAction 
} from "@/lib/actions/pitch.actions";
import PitchDetailView from "@/components/pitch/PitchDetailView";
import ReviewActionForm from "../_components/ReviewActionForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface AdminPitchDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Review Pitch | PitchPal Admin",
};

export default async function AdminPitchDetailPage({ params }: AdminPitchDetailPageProps) {
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/pitches"
          className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-muted-foreground transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Review Pitch</h1>
          <p className="text-xs text-muted-foreground">
            Review details and take action on this pitch.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          <PitchDetailView pitch={pitch} tiers={tiers} milestones={milestones} />
        </div>
        
        <div className="xl:col-span-1">
          <div className="sticky top-24">
            <ReviewActionForm pitchId={pitch._id} currentStatus={pitch.status} />
          </div>
        </div>
      </div>
    </div>
  );
}
