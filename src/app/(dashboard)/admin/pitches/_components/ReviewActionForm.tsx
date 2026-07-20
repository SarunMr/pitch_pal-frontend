"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AdminReviewSchema, AdminReviewFormData } from "@/app/(dashboard)/entrepreneur/pitches/_components/schema";
import { adminReviewPitchAction } from "@/lib/actions/pitch.actions";

interface ReviewActionFormProps {
  pitchId: string;
  currentStatus: string;
}

export default function ReviewActionForm({ pitchId, currentStatus }: ReviewActionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdminReviewFormData>({
    resolver: zodResolver(AdminReviewSchema),
    defaultValues: {
      action: "approve",
      reviewNote: "",
    },
  });

  const onSubmit = async (data: AdminReviewFormData) => {
    try {
      setIsSubmitting(true);
      const res = await adminReviewPitchAction(pitchId, data);
      if (!res.success) throw new Error(res.message);

      toast.success("Pitch review submitted successfully");
      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
      <h3 className="font-bold text-foreground mb-4">Admin Review Action</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium">Action</label>
          <select
            {...form.register("action")}
            className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
          >
            <option value="approve">Approve Pitch (Go Live)</option>
            <option value="reject">Reject Pitch</option>
            <option value="request_changes">Request Changes</option>
          </select>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium">Review Notes (Required for rejection/changes)</label>
          <textarea
            {...form.register("reviewNote")}
            rows={4}
            className="w-full p-3 rounded-md border border-input bg-white text-sm resize-none"
            placeholder="Provide feedback or reasons for your decision..."
          />
          {form.formState.errors.reviewNote && (
            <p className="text-xs text-destructive">{form.formState.errors.reviewNote.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 rounded-md bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
