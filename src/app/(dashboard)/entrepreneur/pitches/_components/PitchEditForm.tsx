"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Save,
  ChevronLeft,
  Plus,
  Trash2,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { IPitch, IInvestorTierDoc } from "@/types/pitch.type";
import { updatePitchAction, addTiersAction } from "@/lib/actions/pitch.actions";

// ── Schema ────────────────────────────────────────────────────────────────────

const EditSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  tagline: z.string().min(10, "Tagline must be at least 10 characters").max(200),
  industry: z.enum(["technology", "healthcare", "finance", "education", "ecommerce", "real_estate", "energy", "agriculture", "entertainment", "other"]),
  fundingStage: z.enum(["pre_seed", "seed", "series_a", "series_b", "series_c", "growth"]),
  location: z.string().optional(),
  teamSize: z.coerce.number().int().min(1).optional().or(z.literal("")),
  foundedYear: z.coerce.number().int().min(1900).max(new Date().getFullYear()).optional().or(z.literal("")),
  websiteUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().min(50, "Description must be at least 50 characters").max(5000),
  tags: z.string().optional(),
  fundingGoal: z.coerce.number().min(1000, "Funding goal must be at least $1,000"),
  equityOffered: z.coerce.number().min(0.01).max(100),
  minInvestment: z.coerce.number().min(1),
  maxInvestment: z.coerce.number().optional().or(z.literal("")),
  useOfFunds: z.array(
    z.object({
      category: z.string().min(1, "Category is required"),
      percentage: z.coerce.number().min(1).max(100),
      description: z.string().optional(),
    })
  ).optional(),
  tiers: z.array(
    z.object({
      name: z.string().min(1, "Tier name is required"),
      minimumInvestment: z.coerce.number().min(1),
      benefits: z.string().min(1, "At least one benefit is required"),
      equityPercentage: z.coerce.number().min(0).max(100),
      availableSlots: z.coerce.number().int().min(1),
    })
  ).min(1, "At least one tier is required").max(5),
});

type EditFormData = z.infer<typeof EditSchema>;

// ── Constants ─────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  { value: "technology", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "real_estate", label: "Real Estate" },
  { value: "energy", label: "Energy" },
  { value: "agriculture", label: "Agriculture" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

const STAGES = [
  { value: "pre_seed", label: "Pre-Seed" },
  { value: "seed", label: "Seed" },
  { value: "series_a", label: "Series A" },
  { value: "series_b", label: "Series B" },
  { value: "series_c", label: "Series C" },
  { value: "growth", label: "Growth" },
];

const SECTIONS = ["Basic Info", "Description", "Financials", "Tiers"] as const;
type Section = (typeof SECTIONS)[number];

const STATUS_INFO: Record<string, { label: string; color: string; note: string }> = {
  draft: { label: "Draft", color: "bg-slate-50 text-slate-700 border-slate-200", note: "This pitch is still a draft. Complete all sections and save before submitting for review." },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-700 border-red-200", note: "This pitch was rejected. Review the admin feedback below, update accordingly, and re-submit." },
  changes_requested: { label: "Changes Requested", color: "bg-amber-50 text-amber-700 border-amber-200", note: "The admin has requested changes. Update the pitch and re-submit when ready." },
};

// ── Shared UI ─────────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-input bg-background text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary hover:border-primary/40";
const selectCls =
  "w-full h-10 px-3 rounded-lg border border-input bg-background text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary hover:border-primary/40 cursor-pointer";
const textareaCls =
  "w-full p-3 rounded-lg border border-input bg-background text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary hover:border-primary/40 resize-y";

// ── Main Component ────────────────────────────────────────────────────────────

interface PitchEditFormProps {
  pitch: IPitch;
  tiers: IInvestorTierDoc[];
}

export default function PitchEditForm({ pitch, tiers }: PitchEditFormProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>("Basic Info");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSections, setSavedSections] = useState<Set<Section>>(new Set());
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(pitch.coverImageUrl ?? null);

  const form = useForm<EditFormData>({
    resolver: zodResolver(EditSchema) as any,
    defaultValues: {
      title: pitch.title ?? "",
      tagline: pitch.tagline ?? "",
      industry: pitch.industry ?? "technology",
      fundingStage: pitch.fundingStage ?? "pre_seed",
      location: pitch.location ?? "",
      teamSize: (pitch.teamSize as any) ?? "",
      foundedYear: (pitch.foundedYear as any) ?? "",
      websiteUrl: pitch.websiteUrl ?? "",
      description: pitch.description ?? "",
      tags: pitch.tags?.join(", ") ?? "",
      fundingGoal: pitch.fundingGoal ?? 10000,
      equityOffered: pitch.equityOffered ?? 5,
      minInvestment: pitch.minInvestment ?? 1000,
      maxInvestment: (pitch.maxInvestment as any) ?? "",
      useOfFunds: pitch.useOfFunds?.length
        ? pitch.useOfFunds.map((u) => ({ ...u, description: u.description ?? "" }))
        : [{ category: "", percentage: 100, description: "" }],
      tiers: tiers.length
        ? tiers.map((t) => ({
            name: t.name,
            minimumInvestment: t.minimumInvestment,
            benefits: Array.isArray(t.benefits) ? t.benefits.join(", ") : (t.benefits as string),
            equityPercentage: t.equityPercentage,
            availableSlots: t.availableSlots,
          }))
        : [{ name: "", minimumInvestment: 1000, benefits: "", equityPercentage: 0, availableSlots: 10 }],
    },
  });

  const { fields: uofFields, append: appendUof, remove: removeUof } = useFieldArray({ control: form.control, name: "useOfFunds" });
  const { fields: tierFields, append: appendTier, remove: removeTier } = useFieldArray({ control: form.control, name: "tiers" });
  const errors = form.formState.errors;

  // ── Section save handlers ─────────────────────────────────────────────────

  const markSaved = (s: Section) => setSavedSections((prev) => new Set(prev).add(s));

  const saveBasicInfo = async () => {
    const valid = await form.trigger(["title", "tagline", "industry", "fundingStage", "location", "teamSize", "foundedYear", "websiteUrl"]);
    if (!valid) return;
    const data = form.getValues();
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", data.title);
      fd.append("tagline", data.tagline);
      fd.append("industry", data.industry);
      fd.append("fundingStage", data.fundingStage);
      if (data.location) fd.append("location", data.location);
      if (data.teamSize) fd.append("teamSize", data.teamSize.toString());
      if (data.foundedYear) fd.append("foundedYear", data.foundedYear.toString());
      if (data.websiteUrl) fd.append("websiteUrl", data.websiteUrl);
      if (coverImageFile) fd.append("coverImage", coverImageFile);
      const res = await updatePitchAction(pitch._id, fd);
      if (!res.success) throw new Error(res.message);
      toast.success("Basic info saved successfully");
      markSaved("Basic Info");
    } catch (err: any) {
      toast.error(err.message || "Failed to save basic info");
    } finally {
      setIsSaving(false);
    }
  };

  const saveDescription = async () => {
    const valid = await form.trigger(["description", "tags"]);
    if (!valid) return;
    const data = form.getValues();
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("description", data.description);
      if (data.tags) {
        data.tags.split(",").map((t) => t.trim()).filter(Boolean).forEach((t) => fd.append("tags[]", t));
      }
      const res = await updatePitchAction(pitch._id, fd);
      if (!res.success) throw new Error(res.message);
      toast.success("Description saved successfully");
      markSaved("Description");
    } catch (err: any) {
      toast.error(err.message || "Failed to save description");
    } finally {
      setIsSaving(false);
    }
  };

  const saveFinancials = async () => {
    const valid = await form.trigger(["fundingGoal", "equityOffered", "minInvestment", "maxInvestment", "useOfFunds"]);
    if (!valid) return;
    const data = form.getValues();
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("fundingGoal", data.fundingGoal.toString());
      fd.append("equityOffered", data.equityOffered.toString());
      fd.append("minInvestment", data.minInvestment.toString());
      if (data.maxInvestment) fd.append("maxInvestment", data.maxInvestment.toString());
      if (data.useOfFunds?.length) fd.append("useOfFunds", JSON.stringify(data.useOfFunds));
      const res = await updatePitchAction(pitch._id, fd);
      if (!res.success) throw new Error(res.message);
      toast.success("Financials saved successfully");
      markSaved("Financials");
    } catch (err: any) {
      toast.error(err.message || "Failed to save financials");
    } finally {
      setIsSaving(false);
    }
  };

  const saveTiers = async () => {
    const valid = await form.trigger(["tiers"]);
    if (!valid) return;
    const data = form.getValues();
    setIsSaving(true);
    try {
      const payload = {
        tiers: data.tiers.map((t) => ({
          ...t,
          benefits: t.benefits.split(",").map((b) => b.trim()).filter(Boolean),
        })),
      };
      const res = await addTiersAction(pitch._id, payload);
      if (!res.success) throw new Error(res.message);
      toast.success("Tiers saved successfully");
      markSaved("Tiers");
    } catch (err: any) {
      toast.error(err.message || "Failed to save tiers");
    } finally {
      setIsSaving(false);
    }
  };

  const SAVERS: Record<Section, () => Promise<void>> = {
    "Basic Info": saveBasicInfo,
    Description: saveDescription,
    Financials: saveFinancials,
    Tiers: saveTiers,
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImageFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // Admin feedback (rejection reason / change notes)
  const adminFeedback =
    (pitch as any).rejectionReason || (pitch as any).adminNotes || pitch.reviewNote;

  const statusMeta = STATUS_INFO[pitch.status];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* ── Status / Admin Feedback Banner ───────────────────── */}
      {statusMeta && (
        <div className={cn("rounded-xl border p-4 flex items-start gap-3", statusMeta.color)}>
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold">{statusMeta.label}</p>
            <p className="text-xs opacity-80">{statusMeta.note}</p>
            {adminFeedback && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-white/60 border border-current/20">
                <p className="text-xs font-medium opacity-90">
                  Admin feedback: &ldquo;{adminFeedback}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main Card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Section tab bar */}
        <div className="flex border-b border-border overflow-x-auto scrollbar-none">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px",
                activeSection === section
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-slate-50"
              )}
            >
              {savedSections.has(section) && (
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              )}
              {section}
            </button>
          ))}
        </div>

        {/* Section body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* ── BASIC INFO ──────────────────────────────────────── */}
          {activeSection === "Basic Info" && (
            <>
              <div>
                <h2 className="text-base font-semibold text-foreground">Basic Information</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Core details about your startup.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Startup Title *" error={errors.title?.message}>
                  <input {...form.register("title")} className={inputCls} placeholder="e.g. AquaTech Solutions" />
                </Field>
                <Field label="Tagline *" error={errors.tagline?.message}>
                  <input {...form.register("tagline")} className={inputCls} placeholder="Short catchy phrase about your startup" />
                </Field>
                <Field label="Industry *" error={errors.industry?.message}>
                  <select {...form.register("industry")} className={selectCls}>
                    {INDUSTRIES.map((i) => (
                      <option key={i.value} value={i.value}>{i.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Funding Stage *" error={errors.fundingStage?.message}>
                  <select {...form.register("fundingStage")} className={selectCls}>
                    {STAGES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Location" error={errors.location?.message}>
                  <input {...form.register("location")} className={inputCls} placeholder="e.g. Kathmandu, Nepal" />
                </Field>
                <Field label="Website URL" error={errors.websiteUrl?.message}>
                  <input {...form.register("websiteUrl")} className={inputCls} placeholder="https://yoursite.com" />
                </Field>
                <Field label="Team Size" error={errors.teamSize?.message}>
                  <input type="number" {...form.register("teamSize")} className={inputCls} placeholder="e.g. 5" min={1} />
                </Field>
                <Field label="Founded Year" error={errors.foundedYear?.message}>
                  <input type="number" {...form.register("foundedYear")} className={inputCls} placeholder={`e.g. ${new Date().getFullYear()}`} />
                </Field>
              </div>

              {/* Cover Image upload */}
              <div className="space-y-2 pt-2">
                <label className="text-sm font-medium text-foreground">Cover Image</label>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 rounded-xl border border-border overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={22} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="block w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border file:border-border file:text-xs file:font-medium file:bg-white hover:file:bg-slate-50 transition-colors cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">JPG, PNG or WebP · Max 5 MB · Recommended 16:9</p>
                    {coverPreview && pitch.coverImageUrl && coverPreview !== pitch.coverImageUrl && (
                      <p className="text-xs text-primary font-medium">New image selected — will be saved on &quot;Save Basic Info&quot;</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── DESCRIPTION ─────────────────────────────────────── */}
          {activeSection === "Description" && (
            <>
              <div>
                <h2 className="text-base font-semibold text-foreground">Problem &amp; Solution</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Tell investors your story — the problem, solution, and market opportunity.</p>
              </div>
              <Field
                label="Full Description *"
                error={errors.description?.message}
                hint="Minimum 50 characters. Be specific about the problem, your unique solution, and why now."
              >
                <textarea
                  {...form.register("description")}
                  rows={14}
                  className={cn(textareaCls, "min-h-[220px]")}
                  placeholder="Describe the problem you're solving, your unique approach, market size, and current traction..."
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-muted-foreground">
                    {form.watch("description")?.length ?? 0} / 5000 chars
                  </span>
                </div>
              </Field>
              <Field
                label="Tags"
                error={errors.tags?.message}
                hint="Comma-separated keywords investors use to find pitches."
              >
                <input {...form.register("tags")} className={inputCls} placeholder="e.g. AI, SaaS, B2B, Climate Tech" />
              </Field>
            </>
          )}

          {/* ── FINANCIALS ──────────────────────────────────────── */}
          {activeSection === "Financials" && (
            <>
              <div>
                <h2 className="text-base font-semibold text-foreground">Business Model &amp; Financials</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Define your funding needs and how you will allocate the capital.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Funding Goal ($) *" error={errors.fundingGoal?.message}>
                  <input type="number" {...form.register("fundingGoal")} className={inputCls} placeholder="50000" min={1000} />
                </Field>
                <Field label="Equity Offered (%) *" error={errors.equityOffered?.message}>
                  <input type="number" step="0.01" {...form.register("equityOffered")} className={inputCls} placeholder="10.5" />
                </Field>
                <Field label="Min Investment ($) *" error={errors.minInvestment?.message}>
                  <input type="number" {...form.register("minInvestment")} className={inputCls} placeholder="1000" min={1} />
                </Field>
                <Field label="Max Investment ($)" error={errors.maxInvestment?.message} hint="Optional — leave blank for no upper limit.">
                  <input type="number" {...form.register("maxInvestment")} className={inputCls} placeholder="100000" />
                </Field>
              </div>

              {/* Use of Funds */}
              <div className="space-y-3 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Use of Funds</h3>
                    <p className="text-xs text-muted-foreground">How will you allocate the capital raised?</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => appendUof({ category: "", percentage: 0, description: "" })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-slate-50 transition-colors"
                  >
                    <Plus size={13} /> Add Category
                  </button>
                </div>

                <div className="space-y-3">
                  {uofFields.map((field, idx) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-[1fr_100px_1fr_auto] gap-3 items-start p-4 rounded-xl bg-slate-50 border border-border">
                      <Field label="Category" error={errors.useOfFunds?.[idx]?.category?.message}>
                        <input {...form.register(`useOfFunds.${idx}.category`)} className={inputCls} placeholder="e.g. Marketing" />
                      </Field>
                      <Field label="%" error={errors.useOfFunds?.[idx]?.percentage?.message}>
                        <input type="number" {...form.register(`useOfFunds.${idx}.percentage`)} className={inputCls} placeholder="30" min={1} max={100} />
                      </Field>
                      <Field label="Description" error={errors.useOfFunds?.[idx]?.description?.message}>
                        <input {...form.register(`useOfFunds.${idx}.description`)} className={inputCls} placeholder="Brief note..." />
                      </Field>
                      <div className="flex items-end pb-0.5">
                        <button
                          type="button"
                          onClick={() => removeUof(idx)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {uofFields.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl">
                      No categories yet.{" "}
                      <button
                        type="button"
                        onClick={() => appendUof({ category: "", percentage: 0, description: "" })}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        Add one
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── TIERS ───────────────────────────────────────────── */}
          {activeSection === "Tiers" && (
            <>
              <div>
                <h2 className="text-base font-semibold text-foreground">Investor Tiers</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Define investment levels and perks for each tier (up to 5).</p>
              </div>
              {errors.tiers?.message && (
                <p className="text-xs text-destructive flex items-center gap-1.5">
                  <AlertCircle size={13} />
                  {errors.tiers.message}
                </p>
              )}
              <div className="space-y-4">
                {tierFields.map((field, idx) => (
                  <div key={field.id} className="relative p-5 rounded-xl border border-border bg-gradient-to-br from-slate-50 to-white space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Tier {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTier(idx)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Tier Name *" error={errors.tiers?.[idx]?.name?.message}>
                        <select {...form.register(`tiers.${idx}.name`)} className={inputCls}>
                          <option value="">Select a tier...</option>
                          <option value="supporter">Supporter</option>
                          <option value="stakeholder">Stakeholder</option>
                          <option value="partner">Partner</option>
                        </select>
                      </Field>
                      <Field label="Benefits (comma-separated) *" error={errors.tiers?.[idx]?.benefits?.message}>
                        <input {...form.register(`tiers.${idx}.benefits`)} className={inputCls} placeholder="e.g. Board seat, Monthly reports" />
                      </Field>
                      <Field label="Min Investment ($) *" error={errors.tiers?.[idx]?.minimumInvestment?.message}>
                        <input type="number" {...form.register(`tiers.${idx}.minimumInvestment`)} className={inputCls} placeholder="5000" min={1} />
                      </Field>
                      <Field label="Equity (%)" error={errors.tiers?.[idx]?.equityPercentage?.message}>
                        <input type="number" step="0.01" {...form.register(`tiers.${idx}.equityPercentage`)} className={inputCls} placeholder="2.5" />
                      </Field>
                      <Field label="Available Slots *" error={errors.tiers?.[idx]?.availableSlots?.message}>
                        <input type="number" {...form.register(`tiers.${idx}.availableSlots`)} className={inputCls} placeholder="10" min={1} />
                      </Field>
                    </div>
                  </div>
                ))}
                {tierFields.length < 5 && (
                  <button
                    type="button"
                    onClick={() => appendTier({ name: "", minimumInvestment: 1000, benefits: "", equityPercentage: 0, availableSlots: 10 })}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
                  >
                    <Plus size={16} className="group-hover:scale-110 transition-transform" />
                    Add Tier
                  </button>
                )}
              </div>
            </>
          )}

          {/* ── Action bar ──────────────────────────────────────── */}
          <div className="flex items-center justify-between pt-6 mt-2 border-t border-border">
            <button
              type="button"
              onClick={() => router.push("/entrepreneur/pitches")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft size={15} />
              Back to Pitches
            </button>

            <div className="flex items-center gap-3">
              {/* Quick section switcher */}
              <div className="hidden sm:flex items-center gap-0.5 text-xs text-muted-foreground">
                {SECTIONS.map((s, i) => (
                  <span key={s} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setActiveSection(s)}
                      className={cn(
                        "px-2 py-1 rounded transition-colors",
                        activeSection === s
                          ? "text-primary font-semibold bg-primary/8"
                          : "hover:text-foreground hover:bg-slate-100"
                      )}
                    >
                      {s}
                    </button>
                    {i < SECTIONS.length - 1 && <span className="text-slate-300 select-none">›</span>}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => SAVERS[activeSection]()}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
              >
                {isSaving ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                {isSaving ? "Saving..." : `Save ${activeSection}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
