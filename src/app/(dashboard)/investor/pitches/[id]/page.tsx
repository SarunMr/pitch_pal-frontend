"use client";

import { useState, useEffect, use } from "react";
import { 
  fetchPitchByIdAction, 
  fetchPitchTiersAction, 
  fetchPitchMilestonesAction,
  getRecentInvestorsAction
} from "@/lib/actions/pitch.actions";
import PitchDetailView from "@/components/pitch/PitchDetailView";
import KYCGuard from "@/components/kyc/KYCGuard";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { InvestmentModal } from "../_components/InvestmentModal";
import { ReportDialog } from "@/components/ReportDialog";

interface InvestorPitchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function InvestorPitchDetailPage({ params }: InvestorPitchDetailPageProps) {
  const { id } = use(params);

  const [pitch, setPitch] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [recentInvestors, setRecentInvestors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [lastInvestment, setLastInvestment] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [pitchRes, tiersRes, milestonesRes, investorsRes] = await Promise.all([
        fetchPitchByIdAction(id),
        fetchPitchTiersAction(id),
        fetchPitchMilestonesAction(id),
        getRecentInvestorsAction(id)
      ]);

      if (pitchRes?.success) setPitch(pitchRes.data);
      if (tiersRes?.success) setTiers(tiersRes.data);
      if (milestonesRes?.success) setMilestones(milestonesRes.data);
      if (investorsRes?.success) setRecentInvestors(investorsRes.data);
      
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <KYCGuard role="investor">
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="h-[400px] bg-gray-200 rounded-xl w-full"></div>
        </div>
      </KYCGuard>
    );
  }

  if (!pitch) {
    return (
      <KYCGuard role="investor">
        <div className="p-8 text-center text-gray-500">
          Pitch not found
        </div>
      </KYCGuard>
    );
  }

  return (
    <KYCGuard role="investor">
      <div className="space-y-6 pb-24">
        <div className="flex items-center justify-between">
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
          
          <ReportDialog targetType="pitch" targetId={pitch._id} />
        </div>

        <PitchDetailView 
          pitch={pitch} 
          tiers={tiers} 
          milestones={milestones} 
          viewerRole="investor"
          recentInvestors={recentInvestors}
          onInvestClick={() => setShowInvestModal(true)}
        />
        
        {showInvestModal && (
          <InvestmentModal
            pitch={pitch}
            tiers={tiers}
            isOpen={showInvestModal}
            onClose={() => setShowInvestModal(false)}
            onSuccess={(investment) => {
              setLastInvestment(investment);
              setShowInvestModal(false);
              fetchPitchByIdAction(id).then(r => {
                if (r.success) setPitch(r.data);
              });
            }}
          />
        )}
      </div>
    </KYCGuard>
  );
}
