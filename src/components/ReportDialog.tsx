"use client";

import React, { useState } from "react";
import { createReportAction } from "@/lib/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Flag, X } from "lucide-react";

interface ReportDialogProps {
  targetType: "pitch" | "comment";
  targetId: string;
  triggerElement?: React.ReactNode;
}

export const ReportDialog: React.FC<ReportDialogProps> = ({
  targetType,
  targetId,
  triggerElement,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (reason.length < 10) {
      setError("Reason must be at least 10 characters long.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await createReportAction(targetType, targetId, reason);
      if (res?.success) {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          setReason("");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {triggerElement || (
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 gap-2">
            <Flag className="w-4 h-4" />
            <span className="hidden sm:inline">Report</span>
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Report {targetType}</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {success ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Flag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Report Submitted</h3>
                  <p className="text-sm text-gray-500 mt-2">Thank you. Our admins will review this shortly.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500">
                    Please provide a detailed reason for reporting this {targetType}. Our admins will review this shortly.
                  </p>
                  <textarea
                    placeholder="Reason (min 10 characters)..."
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setError(null);
                    }}
                    className="w-full min-h-[100px] border border-gray-300 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {error && <p className="text-sm text-red-500">{error}</p>}
                </>
              )}
            </div>

            {!success && (
              <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                <Button variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={loading || reason.length < 10}>
                  {loading ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
