"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  Eye,
  Pencil,
  Trash2,
  Send,
  X,
  FileEdit,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IPitch, PitchStatus } from "@/types/pitch.type";
import { submitPitchAction, deletePitchAction, requestEditAccessAction } from "@/lib/actions/pitch.actions";

interface PitchListTableProps {
  pitches: IPitch[];
}

const STATUS_STYLES: Record<PitchStatus, string> = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  review: "bg-amber-100 text-amber-700 border-amber-200",
  live: "bg-emerald-100 text-emerald-700 border-emerald-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  changes_requested: "bg-orange-100 text-orange-700 border-orange-200",
  edit_requested: "bg-blue-100 text-blue-700 border-blue-200",
  deleted: "bg-slate-100 text-slate-500 border-slate-200",
};

const STATUS_LABELS: Record<PitchStatus, string> = {
  draft: "Draft",
  review: "In Review",
  live: "Live",
  rejected: "Rejected",
  changes_requested: "Changes Requested",
  edit_requested: "Edit Requested",
  deleted: "Deleted",
};

// ── Request Edit Modal ────────────────────────────────────────────────────────

interface RequestEditModalProps {
  pitch: IPitch;
  onClose: () => void;
}

function RequestEditModal({ pitch, onClose }: RequestEditModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const charCount = reason.trim().length;
  const isValid = charCount >= 10;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      const res = await requestEditAccessAction(pitch._id, reason.trim());
      if (!res.success) throw new Error(res.message);
      toast.success("Edit access requested! The admin will review your request.");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to request edit access");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200 border border-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <FileEdit size={18} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Request Edit Access</h2>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {pitch.title}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-6 space-y-4">
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-2.5">
              <AlertCircle size={15} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">
                This pitch is currently <strong>live</strong>. Requesting edit access will temporarily pause investor activity until the admin approves your request.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Reason for edit request *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Explain what you need to update and why. Be specific so the admin can approve quickly..."
                className="w-full p-3 rounded-xl border border-input bg-background text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:border-primary hover:border-primary/40 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className={cn("text-xs", !isValid && charCount > 0 ? "text-destructive" : "text-muted-foreground")}>
                  {charCount < 10
                    ? `${10 - charCount} more character${10 - charCount === 1 ? "" : "s"} required`
                    : `${charCount} characters`}
                </span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 w-6 rounded-full transition-colors",
                        charCount >= (i + 1) * 20
                          ? "bg-primary"
                          : charCount >= (i + 1) * 10
                          ? "bg-primary/40"
                          : "bg-slate-200"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className="flex-1 h-10 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <><Loader2 size={14} className="animate-spin" /> Requesting...</>
                ) : (
                  <><FileEdit size={14} /> Submit Request</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass?: string;
  onConfirm: () => void;
  onClose: () => void;
  isLoading?: boolean;
}

function ConfirmDialog({ title, description, confirmLabel, confirmClass, onConfirm, onClose, isLoading }: ConfirmDialogProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-border animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-4">
            <h2 className="text-base font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={cn(
                  "flex-1 h-10 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
                  confirmClass ?? "bg-primary hover:bg-primary/90"
                )}
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : null}
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Table ─────────────────────────────────────────────────────────────────

export default function PitchListTable({ pitches }: PitchListTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [requestEditPitch, setRequestEditPitch] = useState<IPitch | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<IPitch | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState<IPitch | null>(null);

  const handleDelete = async (pitch: IPitch) => {
    setLoadingId(`del-${pitch._id}`);
    try {
      const res = await deletePitchAction(pitch._id);
      if (!res.success) throw new Error(res.message);
      toast.success(res.message || "Pitch deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete pitch");
    } finally {
      setLoadingId(null);
      setConfirmDelete(null);
    }
  };

  const handleSubmit = async (pitch: IPitch) => {
    setLoadingId(pitch._id);
    try {
      const res = await submitPitchAction(pitch._id);
      if (!res.success) throw new Error(res.message);
      toast.success("Pitch submitted for review");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit pitch");
    } finally {
      setLoadingId(null);
      setConfirmSubmit(null);
    }
  };

  return (
    <>
      {/* Request Edit Modal */}
      {requestEditPitch && (
        <RequestEditModal pitch={requestEditPitch} onClose={() => setRequestEditPitch(null)} />
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete Pitch"
          description={`Are you sure you want to permanently delete "${confirmDelete.title}"? This action cannot be undone.`}
          confirmLabel="Delete"
          confirmClass="bg-destructive hover:bg-destructive/90"
          onConfirm={() => handleDelete(confirmDelete)}
          onClose={() => setConfirmDelete(null)}
          isLoading={loadingId === `del-${confirmDelete._id}`}
        />
      )}

      {/* Confirm Submit */}
      {confirmSubmit && (
        <ConfirmDialog
          title="Submit for Review"
          description={`Submit "${confirmSubmit.title}" for admin review? Once submitted you won't be able to edit until reviewed.`}
          confirmLabel="Submit"
          onConfirm={() => handleSubmit(confirmSubmit)}
          onClose={() => setConfirmSubmit(null)}
          isLoading={loadingId === confirmSubmit._id}
        />
      )}

      <div className="w-full overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
        <table className="w-full text-sm" aria-label="Pitches table">
          <thead>
            <tr className="border-b border-border bg-slate-50/80">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Pitch
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Goal / Raised
              </th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Created
              </th>
              <th className="text-right py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pitches.map((pitch, idx) => (
              <tr
                key={pitch._id}
                className={cn(
                  "border-b border-border/60 transition-colors hover:bg-slate-50",
                  idx === pitches.length - 1 && "border-b-0"
                )}
              >
                <td className="py-3 px-4">
                  <div className="min-w-0 max-w-[200px] sm:max-w-[300px]">
                    <p className="font-medium text-foreground truncate">{pitch.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{pitch.industry}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                      STATUS_STYLES[pitch.status]
                    )}
                  >
                    {STATUS_LABELS[pitch.status]}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs">
                  <div>
                    <span className="font-medium">${pitch.fundingGoal.toLocaleString()}</span> goal
                  </div>
                  {pitch.fundingRaised > 0 && (
                    <div className="text-emerald-600 mt-0.5">
                      ${pitch.fundingRaised.toLocaleString()} raised
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-muted-foreground text-xs">
                  {new Date(pitch.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 justify-end">
                    {/* Edit — draft, rejected, changes_requested → goes to dedicated edit page */}
                    {(pitch.status === "draft" || pitch.status === "rejected" || pitch.status === "changes_requested") && (
                      <Link
                        href={`/entrepreneur/pitches/${pitch._id}/edit`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
                        title="Edit Pitch"
                      >
                        <Pencil size={16} />
                      </Link>
                    )}

                    {/* Request Edit Access — live pitches only */}
                    {pitch.status === "live" && (
                      <button
                        onClick={() => setRequestEditPitch(pitch)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 transition-all"
                        title="Request Edit Access"
                      >
                        <FileEdit size={13} />
                        <span className="hidden sm:inline">Request Edit</span>
                      </button>
                    )}

                    {/* edit_requested badge */}
                    {pitch.status === "edit_requested" && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200">
                        <Loader2 size={11} className="animate-spin" />
                        <span className="hidden sm:inline">Pending Review</span>
                      </span>
                    )}

                    {/* Submit — draft, rejected, changes_requested */}
                    {(pitch.status === "draft" || pitch.status === "rejected" || pitch.status === "changes_requested") && (
                      <button
                        onClick={() => setConfirmSubmit(pitch)}
                        disabled={loadingId === pitch._id}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                        title="Submit for Review"
                      >
                        <Send size={16} />
                      </button>
                    )}

                    {/* View */}
                    <Link
                      href={`/entrepreneur/pitches/${pitch._id}`}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/8 transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </Link>

                    {/* Delete — draft or rejected */}
                    {(pitch.status === "draft" || pitch.status === "rejected") && (
                      <button
                        onClick={() => setConfirmDelete(pitch)}
                        disabled={loadingId === `del-${pitch._id}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete Pitch"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {pitches.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                  No pitches found. Create your first pitch to get started!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
