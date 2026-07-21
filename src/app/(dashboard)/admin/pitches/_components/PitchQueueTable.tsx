"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { IPitch, PitchStatus } from "@/types/pitch.type";
import { ROUTES } from "@/constants/routes";
import { deletePitchAction, adminHandleEditRequestAction } from "@/lib/actions/pitch.actions";

interface PitchQueueTableProps {
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

export default function PitchQueueTable({ pitches }: PitchQueueTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const handleEditRequest = async (id: string, approve: boolean) => {
    if (!confirm(`Are you sure you want to ${approve ? "approve" : "reject"} this edit request?`)) return;
    try {
      setLoadingId(`edit-req-${id}`);
      const res = await adminHandleEditRequestAction(id, { approve });
      if (!res.success) throw new Error(res.message);
      toast.success(res.message || `Edit request ${approve ? "approved" : "rejected"}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to handle edit request");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this pitch?")) return;
    
    try {
      setLoadingId(id);
      const res = await deletePitchAction(id);
      if (!res.success) throw new Error(res.message);
      toast.success(res.message || "Pitch deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete pitch");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
      <table className="w-full text-sm" aria-label="Pitch Queue table">
        <thead>
          <tr className="border-b border-border bg-slate-50/80">
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Pitch
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Entrepreneur
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
              Submitted
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
                idx === pitches.length - 1 && "border-b-0",
              )}
            >
              <td className="py-3 px-4">
                <div className="min-w-0 max-w-[200px] sm:max-w-[300px]">
                  <p className="font-medium text-foreground truncate">{pitch.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{pitch.industry}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-primary uppercase">
                      {pitch.entrepreneurId?.username?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="font-medium">{pitch.entrepreneurId?.username || "Unknown"}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                    STATUS_STYLES[pitch.status],
                  )}
                >
                  {STATUS_LABELS[pitch.status]}
                </span>
              </td>
              <td className="py-3 px-4 text-muted-foreground text-xs">
                {pitch.submittedAt ? new Date(pitch.submittedAt).toLocaleDateString("en-US") : "-"}
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-end gap-2">
                  {pitch.status === "edit_requested" && (
                    <>
                      <button
                        onClick={() => handleEditRequest(pitch._id, true)}
                        disabled={loadingId === `edit-req-${pitch._id}`}
                        className="p-1.5 text-muted-foreground hover:text-emerald-600 transition-colors disabled:opacity-50"
                        title="Approve Edit Request"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleEditRequest(pitch._id, false)}
                        disabled={loadingId === `edit-req-${pitch._id}`}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                        title="Reject Edit Request"
                      >
                        <XCircle size={16} />
                      </button>
                    </>
                  )}

                  <Link
                    href={`/admin/pitches/${pitch._id}`}
                    className="p-1.5 text-muted-foreground hover:text-emerald-600 transition-colors"
                    title="Review Pitch"
                  >
                    <Eye size={16} />
                  </Link>

                  {/* Admin delete (always available) */}
                  <button
                    onClick={() => handleDelete(pitch._id)}
                    disabled={loadingId === pitch._id}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                    title="Delete Pitch"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {pitches.length === 0 && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-muted-foreground text-sm">
                Queue is empty.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
