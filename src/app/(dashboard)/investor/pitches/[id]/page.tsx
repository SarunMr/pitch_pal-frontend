import { 
  fetchPitchByIdAction, 
  fetchPitchTiersAction, 
  fetchPitchMilestonesAction 
} from "@/lib/actions/pitch.actions";
import PitchDetailView from "@/components/pitch/PitchDetailView";
import KYCGuard from "@/components/kyc/KYCGuard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface InvestorPitchDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Startup Details | PitchPal",
};

export default async function InvestorPitchDetailPage({ params }: InvestorPitchDetailPageProps) {
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
    <KYCGuard role="investor">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/investor/pitches"
            className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-muted-foreground transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">Startup Profile</h1>
            <p className="text-xs text-muted-foreground">
              Review details, milestones, and investment tiers.
            </p>
          </div>
        </div>

        <PitchDetailView pitch={pitch} tiers={tiers} milestones={milestones} />
        
      </div>
    </KYCGuard>
  );
}
