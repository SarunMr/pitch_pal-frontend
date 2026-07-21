"use client";

import { useState, useEffect } from "react";
import { getPortfolioAction } from "@/lib/actions/pitch.actions";
import { IPortfolioResponse } from "@/types/pitch.type";
import { Briefcase } from "lucide-react";
import { formatNPR, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = useState<IPortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsLoading(true);
      const res = await getPortfolioAction(page, 10);
      if (res.success && res.data) {
        setPortfolioData(res.data);
      }
      setIsLoading(false);
    };
    fetchPortfolio();
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Portfolio</h1>
        <p className="text-sm text-muted-foreground">Track your startup investments</p>
      </div>

      {portfolioData && portfolioData.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Mock Invested</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatNPR(portfolioData.summary.totalInvested)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Total Investments</h3>
            <p className="text-3xl font-bold text-gray-900">
              {portfolioData.summary.totalInvestments}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Startups Backed</h3>
            <p className="text-3xl font-bold text-gray-900">
              {portfolioData.summary.pitchCount}
            </p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4 animate-pulse pt-4">
          <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
          <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
        </div>
      ) : !portfolioData || portfolioData.investments.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed py-16 px-6 text-center space-y-4 mt-8">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold">No investments yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Discover live pitches and start building your portfolio.
          </p>
          <div className="pt-4">
            <Link href="/investor/pitches">
              <Button className="bg-green-600 hover:bg-green-700">Browse Pitches</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4 mt-8">
          {portfolioData.investments.map((inv: any) => {
            const pitch = inv.pitchId as any;
            return (
              <div key={inv._id} className="bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary text-xl">
                        {pitch?.title?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div>
                      <Link href={`/investor/pitches/${pitch?._id}`} className="font-bold text-lg hover:underline">
                        {pitch?.title || 'Unknown Startup'}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        {pitch?.industry && (
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded uppercase font-medium">
                            {pitch.industry}
                          </span>
                        )}
                        <span className="text-[10px] bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 rounded uppercase font-bold">
                          MOCK
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 md:text-center space-y-1">
                    <span className="inline-block text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1">
                      {inv.tierType}
                    </span>
                    <div className="font-bold text-green-600 text-lg">
                      {formatNPR(inv.amount)}
                    </div>
                    {inv.equityPercent > 0 ? (
                      <div className="text-xs text-green-700 font-medium">Equity: {inv.equityPercent}%</div>
                    ) : (
                      <div className="text-xs text-gray-500">Perks Only</div>
                    )}
                  </div>

                  <div className="text-right space-y-1 md:min-w-[150px]">
                    <div className="text-xs text-gray-500 font-medium">
                      Invested {formatDate(inv.createdAt)}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      Ref: {inv.paymentRef}
                    </div>
                  </div>
                </div>

                {pitch && typeof pitch.fundingRaised === 'number' && typeof pitch.fundingGoal === 'number' && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-[11px] font-medium text-gray-500 mb-1.5">
                      <span>{Math.min(Math.round((pitch.fundingRaised / pitch.fundingGoal) * 100), 100)}% funded</span>
                      <span>{formatNPR(pitch.fundingRaised)} / {formatNPR(pitch.fundingGoal)}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min((pitch.fundingRaised / pitch.fundingGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {portfolioData.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-6">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center px-4 text-sm font-medium">
                Page {page} of {portfolioData.totalPages}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPage(p => Math.min(portfolioData.totalPages, p + 1))}
                disabled={page === portfolioData.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
