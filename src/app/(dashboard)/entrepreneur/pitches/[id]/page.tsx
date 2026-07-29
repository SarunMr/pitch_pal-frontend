"use client";

import { useState, useEffect, use } from "react";
import { 
  fetchPitchByIdAction, 
  fetchPitchTiersAction, 
  fetchPitchMilestonesAction,
  getPitchInvestorsAction
} from "@/lib/actions/pitch.actions";
import PitchDetailView from "@/components/pitch/PitchDetailView";
import MilestoneForm from "../_components/MilestoneForm";
import DashboardWarningBanner from "@/components/dashboard/DashboardWarningBanner";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { formatNPR, formatDate } from "@/lib/utils";
import { ReportDialog } from "@/components/ReportDialog";

interface EntrepreneurPitchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EntrepreneurPitchDetailPage({ params }: EntrepreneurPitchDetailPageProps) {
  const { id } = use(params);

  const [pitch, setPitch] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [pitchRes, tiersRes, milestonesRes, investorsRes] = await Promise.all([
        fetchPitchByIdAction(id),
        fetchPitchTiersAction(id),
        fetchPitchMilestonesAction(id),
        getPitchInvestorsAction(id, 1)
      ]);

      if (pitchRes?.success) setPitch(pitchRes.data);
      if (tiersRes?.success) setTiers(tiersRes.data);
      if (milestonesRes?.success) setMilestones(milestonesRes.data);
      if (investorsRes?.success && investorsRes.data?.investments) {
        setInvestors(investorsRes.data.investments);
      }
      
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <>
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="h-[400px] bg-gray-200 rounded-xl w-full"></div>
        </div>
      </>
    );
  }

  if (!pitch) {
    return (
      <>
        <div className="p-8 text-center text-gray-500">
          Pitch not found
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6 pb-12">
        <DashboardWarningBanner role="entrepreneur" />
        <div className="flex items-center justify-between">
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
          
          <ReportDialog targetType="pitch" targetId={pitch._id} />
        </div>

        <PitchDetailView pitch={pitch} tiers={tiers} milestones={milestones} viewerRole="entrepreneur" />

        {(pitch.status === "live" || pitch.status === "funded") && (
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Investors ({investors.length})</h2>
            
            {investors.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No investors yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 font-medium">Investor</th>
                      <th className="px-4 py-3 font-medium">Tier</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Equity</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {investors.map((inv) => (
                      <tr key={inv._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            {inv.investorId?.avatar ? (
                              <img src={inv.investorId.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-gray-500">
                                {inv.investorId?.name?.charAt(0) || 'U'}
                              </span>
                            )}
                          </div>
                          <span className="font-medium whitespace-nowrap">{inv.investorId?.name || 'Unknown User'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {inv.tierType}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-green-600">
                          {formatNPR(inv.amount)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-medium">
                          {inv.equityPercent > 0 ? `${inv.equityPercent}%` : '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {formatDate(inv.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {pitch.status !== "draft" && (
          <div className="max-w-3xl">
            <MilestoneForm pitchId={pitch._id} />
          </div>
        )}
      </div>
    </>
  );
}
