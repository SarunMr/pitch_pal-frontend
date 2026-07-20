import { z } from "zod";

// ── Shared Schemas ────────────────────────────────────────────────────────────

export const PitchIndustrySchema = z.enum([
  "technology",
  "healthcare",
  "finance",
  "education",
  "ecommerce",
  "real_estate",
  "energy",
  "agriculture",
  "entertainment",
  "other",
]);

export const FundingStageSchema = z.enum([
  "pre_seed",
  "seed",
  "series_a",
  "series_b",
  "series_c",
  "growth",
]);

// ── Wizard Step 1: Basic Info ────────────────────────────────────────────────

export const Step1Schema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  tagline: z
    .string()
    .min(10, "Tagline must be at least 10 characters")
    .max(200, "Tagline cannot exceed 200 characters"),
  industry: PitchIndustrySchema,
  fundingStage: FundingStageSchema,
  location: z.string().optional(),
  teamSize: z.coerce.number().int().min(1, "Minimum team size is 1").optional().or(z.literal("")),
  foundedYear: z.coerce
    .number()
    .int()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional()
    .or(z.literal("")),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});
export type Step1FormData = z.infer<typeof Step1Schema>;


// ── Wizard Step 2: Problem & Solution ────────────────────────────────────────

export const Step2Schema = z.object({
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description cannot exceed 5000 characters"),
  tags: z.string().optional(), // We'll parse this as comma-separated
});
export type Step2FormData = z.infer<typeof Step2Schema>;


// ── Wizard Step 3: Business Model & Use of Funds ─────────────────────────────

export const UseOfFundsSchema = z.object({
  category: z.string().min(1, "Category is required"),
  percentage: z.coerce
    .number()
    .min(1, "Percentage must be at least 1")
    .max(100, "Percentage cannot exceed 100"),
  description: z.string().optional(),
});

export const Step3Schema = z.object({
  fundingGoal: z.coerce.number().min(1000, "Funding goal must be at least 1000"),
  equityOffered: z.coerce
    .number()
    .min(0.01, "Equity offered must be greater than 0")
    .max(100, "Equity offered cannot exceed 100"),
  minInvestment: z.coerce.number().min(1, "Minimum investment must be greater than 0"),
  maxInvestment: z.coerce.number().optional().or(z.literal("")),
  useOfFunds: z.array(UseOfFundsSchema).optional(),
});
export type Step3FormData = z.infer<typeof Step3Schema>;


// ── Wizard Step 4: Tiers ──────────────────────────────────────────────────────

export const TierSchema = z.object({
  name: z.string().min(1, "Tier name is required"),
  minimumInvestment: z.coerce.number().min(1, "Minimum investment must be greater than 0"),
  maximumInvestment: z.coerce.number().optional().or(z.literal("")),
  benefits: z.string().min(1, "At least one benefit is required"), // We'll parse comma-separated
  equityPercentage: z.coerce
    .number()
    .min(0, "Cannot be negative")
    .max(100, "Cannot exceed 100"),
  availableSlots: z.coerce.number().int().min(1, "Must be at least 1"),
});

export const Step4Schema = z.object({
  tiers: z.array(TierSchema).min(1, "At least one tier is required").max(5, "Maximum 5 tiers"),
});
export type Step4FormData = z.infer<typeof Step4Schema>;


// ── Admin Review Schema ───────────────────────────────────────────────────────

export const AdminReviewSchema = z.object({
  action: z.enum(["approve", "reject", "request_changes"]),
  reviewNote: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.action !== "approve" && (!data.reviewNote || data.reviewNote.trim().length < 10)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Review note must be at least 10 characters",
      path: ["reviewNote"],
    });
  }
});
export type AdminReviewFormData = z.infer<typeof AdminReviewSchema>;


// ── Add Milestone Schema ──────────────────────────────────────────────────────

export const MilestoneSchema = z.object({
  title: z.string().min(1, "Milestone title is required"),
  description: z.string().min(1, "Milestone description is required"),
  targetDate: z.string().min(1, "Target date is required"),
  fundingRequired: z.coerce.number().min(0, "Funding required cannot be negative"),
  status: z.enum(["pending", "in_progress", "completed", "delayed"]).default("pending"),
});
export type MilestoneFormData = z.infer<typeof MilestoneSchema>;
