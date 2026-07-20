"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MilestoneSchema, MilestoneFormData } from "./schema";
import { addMilestoneAction } from "@/lib/actions/pitch.actions";
import { Plus } from "lucide-react";

interface MilestoneFormProps {
  pitchId: string;
}

export default function MilestoneForm({ pitchId }: MilestoneFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const form = useForm<MilestoneFormData>({
    resolver: zodResolver(MilestoneSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      targetDate: "",
      fundingRequired: 0,
      status: "pending",
    },
  });

  const onSubmit = async (data: MilestoneFormData) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("targetDate", data.targetDate);
      formData.append("fundingRequired", data.fundingRequired.toString());
      formData.append("status", data.status);

      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      const res = await addMilestoneAction(pitchId, formData);
      if (!res.success) throw new Error(res.message);

      toast.success("Milestone posted successfully");
      form.reset();
      setMediaFiles([]);
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to post milestone");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors w-full justify-center mt-6 border border-primary/20"
      >
        <Plus size={16} /> Add Milestone
      </button>
    );
  }

  return (
    <div className="mt-6 p-6 bg-slate-50 border border-border rounded-xl shadow-inner">
      <h3 className="font-bold text-foreground mb-4">Post a New Milestone</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium">Title</label>
            <input
              {...form.register("title")}
              className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
              placeholder="E.g., Prototype Launch"
            />
            {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Target Date</label>
            <input
              type="date"
              {...form.register("targetDate")}
              className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
            />
            {form.formState.errors.targetDate && <p className="text-xs text-destructive">{form.formState.errors.targetDate.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Funding Required ($)</label>
            <input
              type="number"
              {...form.register("fundingRequired")}
              className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium">Status</label>
            <select
              {...form.register("status")}
              className="w-full h-9 px-3 rounded-md border border-input bg-white text-sm"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium">Description</label>
          <textarea
            {...form.register("description")}
            rows={3}
            className="w-full p-3 rounded-md border border-input bg-white text-sm resize-none"
            placeholder="Details about this milestone..."
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Media (Images - max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                const files = Array.from(e.target.files).slice(0, 5);
                setMediaFiles(files);
              }
            }}
            className="w-full h-9 px-3 py-1.5 rounded-md border border-input bg-white text-sm file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary"
          />
          <p className="text-[10px] text-muted-foreground">{mediaFiles.length} file(s) selected</p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Posting..." : "Post Milestone"}
          </button>
        </div>
      </form>
    </div>
  );
}
