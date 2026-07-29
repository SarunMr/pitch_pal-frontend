// Matching backend types

export type PitchStatus =
  | "draft"
  | "review"
  | "live"
  | "rejected"
  | "changes_requested"
  | "edit_requested"
  | "deleted";

export type PitchIndustry =
  | "technology"
  | "healthcare"
  | "finance"
  | "education"
  | "ecommerce"
  | "real_estate"
  | "energy"
  | "agriculture"
  | "entertainment"
  | "other";

export type FundingStage =
  | "pre_seed"
  | "seed"
  | "series_a"
  | "series_b"
  | "series_c"
  | "growth";

export interface IUseOfFunds {
  category: string;
  percentage: number;
  description?: string;
}

export interface IInvestorTier {
  name: string;
  minimumInvestment: number;
  maximumInvestment?: number;
  benefits: string[];
  equityPercentage: number;
  availableSlots: number;
}

export interface IInvestorTierDoc extends IInvestorTier {
  _id: string;
  pitchId: string;
  slotsRemaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface IMilestone {
  title: string;
  description: string;
  targetDate: string | Date;
  fundingRequired: number;
  status: "pending" | "in_progress" | "completed" | "delayed";
}

export interface IMilestoneDoc extends IMilestone {
  _id: string;
  pitchId: string;
  mediaUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IPitch {
  _id: string;
  entrepreneurId: any; // Populated user object or string ID
  
  // Core details
  title: string;
  tagline: string;
  description: string;
  industry: PitchIndustry;
  fundingStage: FundingStage;
  status: PitchStatus;
  
  // Financials
  fundingGoal: number;
  fundingRaised: number;
  equityOffered: number;
  minInvestment: number;
  maxInvestment?: number;
  valuationCap?: number;
  tiers?: any[];
  
  // Media
  coverImageUrl?: string;
  pitchDeckUrl?: string;
  businessPlanUrl?: string;
  videoUrl?: string;
  videoName?: string;
  websiteUrl?: string;
  
  // Additional info
  location?: string;
  teamSize?: number;
  foundedYear?: number;
  tags?: string[];
  useOfFunds?: IUseOfFunds[];
  
  // Admin review
  reviewNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;

  // Edit Request
  editRequested?: boolean;

  // Delete Request
  deleteRequested?: boolean;
  
  // Analytics (optional, populated by backend)
  viewCount?: number;
  investorCount?: number;
  
  // Timestamps
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── AI Score (Phase 4) ────────────────────────────────────────────────────────

export interface IAIScoreBreakdown {
  clarity: number;
  videoQuality: number;
  teamStrength: number;
  marketOpportunity: number;
  financialRealism: number;
  dealStructure: number;
}

export interface IAISuggestion {
  type: 'warning' | 'info' | 'success';
  text: string;
}

export interface IAIScore {
  hasScore: boolean;
  score?: number;
  grade?: 'A' | 'B' | 'C';
  breakdown?: IAIScoreBreakdown;
  suggestions?: IAISuggestion[];
  generatedAt?: string;
  message?: string;
}

// ── Investment System (Phase 5) ───────────────────────────────────────────────

export interface IInvestment {
  _id: string;
  investorId: string | { _id: string; name: string; email: string; avatar?: string };
  pitchId: string | {
    _id: string;
    title: string;
    sector?: string;
    industry?: string;
    province?: string;
    status: string;
    fundingGoal: number;
    fundingRaised: number;
    equityOffered: number;
    valuationCap?: number;
    thumbnailUrl?: string;
    expiresAt?: string;
  };
  amount: number;
  tierType: string;
  equityPercent: number;
  isMock: boolean;
  isSigned: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentGateway: string;
  paymentRef: string;
  createdAt: string;
}

export interface IPortfolioSummary {
  totalInvested: number;
  totalInvestments: number;
  pitchCount: number;
}

export interface IPortfolioResponse {
  investments: IInvestment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: IPortfolioSummary;
}
