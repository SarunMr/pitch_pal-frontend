"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter } from "lucide-react";
import { useCallback, useState } from "react";

const INDUSTRIES = [
  { value: "", label: "All Industries" },
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "real_estate", label: "Real Estate" },
  { value: "energy", label: "Energy" },
  { value: "agriculture", label: "Agriculture" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

const FUNDING_STAGES = [
  { value: "", label: "All Stages" },
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b", label: "Series B" },
  { value: "series_c", label: "Series C" },
  { value: "growth", label: "Growth" },
];

interface MarketplaceFiltersProps {
  initialSearch?: string;
  initialIndustry?: string;
  initialFundingStage?: string;
}

export default function MarketplaceFilters({
  initialSearch = "",
  initialIndustry = "",
  initialFundingStage = "",
}: MarketplaceFiltersProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams();
      if (search && key !== "search") params.set("search", search);
      if (key === "search" && value) params.set("search", value);

      if (initialIndustry && key !== "industry") params.set("industry", initialIndustry);
      if (key === "industry" && value) params.set("industry", value);

      if (initialFundingStage && key !== "fundingStage") params.set("fundingStage", initialFundingStage);
      if (key === "fundingStage" && value) params.set("fundingStage", value);

      router.push(`/investor/pitches?${params.toString()}`);
    },
    [search, initialIndustry, initialFundingStage, router],
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", search);
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        <form onSubmit={handleSearchSubmit} className="w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search startups by name or keyword..."
            className="w-full pl-10 pr-4 h-10 rounded-lg border border-input bg-slate-50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary transition-colors"
          />
        </form>
      </div>

      {/* Industry Filter */}
      <div className="relative">
        <Filter
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10"
          size={16}
        />
        <select
          value={initialIndustry}
          onChange={(e) => updateFilter("industry", e.target.value)}
          className="h-10 pl-9 pr-8 rounded-lg border border-input bg-slate-50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary appearance-none font-medium text-slate-700 cursor-pointer"
          aria-label="Filter by industry"
        >
          {INDUSTRIES.map((ind) => (
            <option key={ind.value} value={ind.value}>
              {ind.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Funding Stage Filter */}
      <div className="relative">
        <select
          value={initialFundingStage}
          onChange={(e) => updateFilter("fundingStage", e.target.value)}
          className="h-10 pl-4 pr-8 rounded-lg border border-input bg-slate-50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary appearance-none font-medium text-slate-700 cursor-pointer"
          aria-label="Filter by funding stage"
        >
          {FUNDING_STAGES.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Clear Filters (visible when any filter is active) */}
      {(initialSearch || initialIndustry || initialFundingStage) && (
        <button
          onClick={() => {
            setSearch("");
            router.push("/investor/pitches");
          }}
          className="h-10 px-4 rounded-lg border border-border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
