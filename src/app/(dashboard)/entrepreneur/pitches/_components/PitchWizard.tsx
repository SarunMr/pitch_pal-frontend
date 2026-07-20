"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Save, Upload, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Step1Schema,
  Step2Schema,
  Step3Schema,
  Step4Schema,
  Step1FormData,
  Step2FormData,
  Step3FormData,
  Step4FormData,
} from "./schema";
import { createPitchAction, updatePitchAction, uploadPitchVideoAction, submitPitchAction, addTiersAction } from "@/lib/actions/pitch.actions";
import { IPitch } from "@/types/pitch.type";

interface PitchWizardProps {
  initialData?: IPitch;
}

export default function PitchWizard({ initialData }: PitchWizardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = pathname.includes("/admin");
  const [step, setStep] = useState(1);
  const [pitchId, setPitchId] = useState<string | null>(initialData?._id || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Forms
  const form1 = useForm<Step1FormData>({
    resolver: zodResolver(Step1Schema) as any,
    defaultValues: {
      title: initialData?.title || "",
      tagline: initialData?.tagline || "",
      industry: initialData?.industry || "technology",
      fundingStage: initialData?.fundingStage || "pre_seed",
      location: initialData?.location || "",
      teamSize: initialData?.teamSize || "",
      foundedYear: initialData?.foundedYear || "",
      websiteUrl: initialData?.websiteUrl || "",
    },
  });

  const form2 = useForm<Step2FormData>({
    resolver: zodResolver(Step2Schema) as any,
    defaultValues: {
      description: initialData?.description || "",
      tags: initialData?.tags?.join(", ") || "",
    },
  });

  const form3 = useForm<Step3FormData>({
    resolver: zodResolver(Step3Schema) as any,
    defaultValues: {
      fundingGoal: initialData?.fundingGoal || 10000,
      equityOffered: initialData?.equityOffered || 5,
      minInvestment: initialData?.minInvestment || 1000,
      maxInvestment: initialData?.maxInvestment || "",
      useOfFunds: initialData?.useOfFunds || [{ category: "", percentage: 100, description: "" }],
    },
  });

  const { fields: uofFields, append: appendUof, remove: removeUof } = useFieldArray({
    control: form3.control,
    name: "useOfFunds",
  });

  const form4 = useForm<Step4FormData>({
    resolver: zodResolver(Step4Schema) as any,
    defaultValues: {
      // If we don't have tiers populated in initialData, start with 1 empty tier
      tiers: [{ name: "", minimumInvestment: 1000, benefits: "", equityPercentage: 0, availableSlots: 10 }],
    },
  });

  const { fields: tierFields, append: appendTier, remove: removeTier } = useFieldArray({
    control: form4.control,
    name: "tiers",
  });

  const handleNextStep1 = async (data: Step1FormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("tagline", data.tagline);
      formData.append("industry", data.industry);
      formData.append("fundingStage", data.fundingStage);
      if (data.location) formData.append("location", data.location);
      if (data.teamSize) formData.append("teamSize", data.teamSize.toString());
      if (data.foundedYear) formData.append("foundedYear", data.foundedYear.toString());
      if (data.websiteUrl) formData.append("websiteUrl", data.websiteUrl);
      
      // Temporary description since it's required by backend on create
      formData.append("description", initialData?.description || "Draft description pending. Please complete this section in the next step to provide full details about your startup.");
      formData.append("fundingGoal", initialData?.fundingGoal?.toString() || "10000");
      formData.append("equityOffered", initialData?.equityOffered?.toString() || "5");
      formData.append("minInvestment", initialData?.minInvestment?.toString() || "1000");

      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      if (pitchId) {
        const res = await updatePitchAction(pitchId, formData);
        if (!res.success) throw new Error(res.message);
        toast.success("Draft updated");
      } else {
        const res = await createPitchAction(formData);
        if (!res.success) throw new Error(res.message);
        setPitchId(res.data._id);
        toast.success("Draft created");
      }
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Failed to save step 1");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep2 = async (data: Step2FormData) => {
    if (!pitchId) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("description", data.description);
      if (data.tags) {
        const tagsArray = data.tags.split(",").map(t => t.trim()).filter(t => t);
        tagsArray.forEach(t => formData.append("tags[]", t)); // Send as array
      }

      const res = await updatePitchAction(pitchId, formData);
      if (!res.success) throw new Error(res.message);
      toast.success("Draft updated");
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || "Failed to save step 2");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep3 = async (data: Step3FormData) => {
    if (!pitchId) return;
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("fundingGoal", data.fundingGoal.toString());
      formData.append("equityOffered", data.equityOffered.toString());
      formData.append("minInvestment", data.minInvestment.toString());
      if (data.maxInvestment) formData.append("maxInvestment", data.maxInvestment.toString());
      
      if (data.useOfFunds) {
        formData.append("useOfFunds", JSON.stringify(data.useOfFunds));
      }

      const res = await updatePitchAction(pitchId, formData);
      if (!res.success) throw new Error(res.message);
      toast.success("Draft updated");
      setStep(4);
    } catch (err: any) {
      toast.error(err.message || "Failed to save step 3");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep4 = async (data: Step4FormData) => {
    if (!pitchId) return;
    try {
      setIsSubmitting(true);
      
      const payload = {
        tiers: data.tiers.map(t => ({
          ...t,
          benefits: t.benefits.split(",").map(b => b.trim()).filter(b => b)
        }))
      };

      const res = await addTiersAction(pitchId, payload);
      if (!res.success) throw new Error(res.message);
      toast.success("Tiers saved");
      setStep(5);
    } catch (err: any) {
      toast.error(err.message || "Failed to save tiers");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFinal = async () => {
    if (!pitchId) return;
    try {
      setIsSubmitting(true);
      
      if (videoFile) {
        const formData = new FormData();
        formData.append("video", videoFile);
        const resVid = await uploadPitchVideoAction(pitchId, formData);
        if (!resVid.success) throw new Error(resVid.message);
      }

      const resSubmit = await submitPitchAction(pitchId);
      if (!resSubmit.success) throw new Error(resSubmit.message);
      
      toast.success("Pitch submitted successfully!");
      router.push(isAdmin ? "/admin/pitches" : "/entrepreneur/pitches");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit pitch");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm p-6 sm:p-10 max-w-4xl mx-auto">
      {/* Stepper Header */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 gap-4">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex flex-col items-center gap-2 min-w-[80px]">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                step === s
                  ? "bg-primary text-primary-foreground"
                  : step > s
                  ? "bg-primary/20 text-primary"
                  : "bg-slate-100 text-slate-400"
              )}
            >
              {s}
            </div>
            <span
              className={cn(
                "text-xs font-medium whitespace-nowrap",
                step >= s ? "text-primary" : "text-slate-400"
              )}
            >
              {s === 1 && "Basic Info"}
              {s === 2 && "Problem/Solution"}
              {s === 3 && "Business"}
              {s === 4 && "Tiers"}
              {s === 5 && "Video & Submit"}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <form onSubmit={form1.handleSubmit(handleNextStep1)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Title</label>
              <input
                {...form1.register("title")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Startup Name"
              />
              {form1.formState.errors.title && <p className="text-xs text-destructive">{form1.formState.errors.title.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Tagline</label>
              <input
                {...form1.register("tagline")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Short catchy phrase"
              />
              {form1.formState.errors.tagline && <p className="text-xs text-destructive">{form1.formState.errors.tagline.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Industry</label>
              <select
                {...form1.register("industry")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="ecommerce">E-commerce</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Funding Stage</label>
              <select
                {...form1.register("fundingStage")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="pre_seed">Pre-Seed</option>
                <option value="seed">Seed</option>
                <option value="series_a">Series A</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                {...form1.register("location")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Team Size</label>
              <input
                type="number"
                {...form1.register("teamSize")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Founded Year</label>
              <input
                type="number"
                {...form1.register("foundedYear")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring file:border-0 file:bg-transparent file:text-sm file:font-medium"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={form2.handleSubmit(handleNextStep2)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Detailed Description (Problem & Solution)</label>
              <textarea
                {...form2.register("description")}
                rows={10}
                className="w-full p-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                placeholder="Describe the problem you are solving and your unique solution..."
              />
              {form2.formState.errors.description && <p className="text-xs text-destructive">{form2.formState.errors.description.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Tags (comma separated)</label>
              <input
                {...form2.register("tags")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="e.g. AI, SaaS, B2B"
              />
            </div>
          </div>
          <div className="flex justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-accent transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form onSubmit={form3.handleSubmit(handleNextStep3)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Funding Goal ($)</label>
              <input
                type="number"
                {...form3.register("fundingGoal")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {form3.formState.errors.fundingGoal && <p className="text-xs text-destructive">{form3.formState.errors.fundingGoal.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Equity Offered (%)</label>
              <input
                type="number"
                step="0.01"
                {...form3.register("equityOffered")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              {form3.formState.errors.equityOffered && <p className="text-xs text-destructive">{form3.formState.errors.equityOffered.message}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Min Investment ($)</label>
              <input
                type="number"
                {...form3.register("minInvestment")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">Max Investment ($)</label>
              <input
                type="number"
                {...form3.register("maxInvestment")}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Use of Funds</h3>
              <button
                type="button"
                onClick={() => appendUof({ category: "", percentage: 0, description: "" })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent transition-colors"
              >
                <Plus size={14} /> Add Category
              </button>
            </div>
            
            {uofFields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-slate-50/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Category</label>
                    <input
                      {...form3.register(`useOfFunds.${index}.category`)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
                      placeholder="e.g. Marketing"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Percentage (%)</label>
                    <input
                      type="number"
                      {...form3.register(`useOfFunds.${index}.percentage`)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Description</label>
                    <input
                      {...form3.register(`useOfFunds.${index}.description`)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeUof(index)}
                  className="mt-6 p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-accent transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <form onSubmit={form4.handleSubmit(handleNextStep4)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Investor Tiers</h3>
                <p className="text-xs text-muted-foreground">Define different levels of investment and their benefits.</p>
              </div>
              <button
                type="button"
                onClick={() => appendTier({ name: "", minimumInvestment: 1000, benefits: "", equityPercentage: 0, availableSlots: 10 })}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-accent transition-colors"
              >
                <Plus size={14} /> Add Tier
              </button>
            </div>
            
            {form4.formState.errors.tiers && <p className="text-xs text-destructive">{form4.formState.errors.tiers.message}</p>}

            {tierFields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-lg border border-border bg-slate-50/50 space-y-4 relative">
                <button
                  type="button"
                  onClick={() => removeTier(index)}
                  className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-destructive transition-colors bg-white rounded-md border border-border shadow-sm"
                >
                  <Trash2 size={14} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Tier Name</label>
                    <input
                      {...form4.register(`tiers.${index}.name`)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
                      placeholder="e.g. Platinum Partner"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Benefits (comma separated)</label>
                    <input
                      {...form4.register(`tiers.${index}.benefits`)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
                      placeholder="e.g. Board seat, Monthly updates"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Min Investment ($)</label>
                    <input
                      type="number"
                      {...form4.register(`tiers.${index}.minimumInvestment`)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Equity (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      {...form4.register(`tiers.${index}.equityPercentage`)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Available Slots</label>
                    <input
                      type="number"
                      {...form4.register(`tiers.${index}.availableSlots`)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-accent transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save & Continue"}
              <ChevronRight size={16} />
            </button>
          </div>
        </form>
      )}

      {/* STEP 5 */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="p-8 border-2 border-dashed border-border rounded-xl text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Upload Pitch Video</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Max size 100MB. Supported formats: .mp4, .mov, .avi
              </p>
            </div>
            <input
              type="file"
              accept="video/mp4,video/quicktime,video/x-msvideo"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              className="mx-auto block w-full max-w-xs text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors"
            />
            {videoFile && <p className="text-xs text-emerald-600 font-medium">{videoFile.name} selected</p>}
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm font-semibold hover:bg-accent transition-colors"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              onClick={handleSubmitFinal}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {isSubmitting ? "Submitting..." : "Submit Pitch"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
