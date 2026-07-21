import { fetchPublicPitchesAction } from "@/lib/actions/pitch.actions";
import PitchGrid from "./_components/PitchGrid";
import MarketplaceFilters from "./_components/MarketplaceFilters";
import KYCGuard from "@/components/kyc/KYCGuard";
import { Rocket } from "lucide-react";
import Link from "next/link";

interface InvestorPitchesPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
    industry?: string;
    fundingStage?: string;
  }>;
}

export const metadata = {
  title: "Startup Marketplace | PitchPal Investor",
  description: "Discover and invest in promising startups.",
};


export default async function InvestorPitchesPage({ searchParams }: InvestorPitchesPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10) || 1;
  const limit = parseInt(params.size ?? "12", 10) || 12;
  const search = params.search ?? "";
  const industry = params.industry ?? "";
  const fundingStage = params.fundingStage ?? "";

  const result = await fetchPublicPitchesAction({
    page,
    limit,
    ...(search && { search }),
    ...(industry && { industry }),
    ...(fundingStage && { fundingStage }),
  });

  const pitches = result?.data ?? [];
  const meta = result?.meta ?? { page: 1, limit: 12, total: 0, totalPages: 0 };
  const hasError = !result?.success;

  return (
    <KYCGuard role="investor">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-slate-900 rounded-2xl p-8 md:p-12 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
            <Rocket size={200} />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Discover Tomorrow&#39;s Innovations
            </h1>
            <p className="text-slate-300 text-lg">
              Explore curated startups actively raising capital. Filter by industry, stage, and find the perfect addition to your portfolio.
            </p>
          </div>
        </div>

        {/* Filters — client component for live navigation */}
        <MarketplaceFilters
          initialSearch={search}
          initialIndustry={industry}
          initialFundingStage={fundingStage}
        />

        {/* Result summary */}
        {!hasError && (
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{pitches.length}</span> of{" "}
            <span className="font-medium text-foreground">{meta.total}</span> startups
            {search && <> matching &quot;<strong>{search}</strong>&quot;</>}
            {industry && <> in <strong>{industry.replace("_", " ")}</strong></>}
          </p>
        )}

        {/* Error state */}
        {hasError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center space-y-2">
            <p className="text-sm font-medium text-destructive">Failed to load marketplace</p>
            <p className="text-xs text-muted-foreground">{result?.message}</p>
          </div>
        )}

        {/* Grid */}
        {!hasError && <PitchGrid pitches={pitches} />}

        {/* Pagination */}
        {!hasError && meta.totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-6">
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/investor/pitches?page=${i + 1}${search ? `&search=${search}` : ""}${industry ? `&industry=${industry}` : ""}${fundingStage ? `&fundingStage=${fundingStage}` : ""}`}
                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                  page === i + 1
                    ? "bg-primary text-white"
                    : "bg-white border border-border text-slate-600 hover:bg-slate-50"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </KYCGuard>
  );
}
