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
  
  // Timestamps
  submittedAt?: string;
  createdAt: string;
  updatedAt: string;
}
