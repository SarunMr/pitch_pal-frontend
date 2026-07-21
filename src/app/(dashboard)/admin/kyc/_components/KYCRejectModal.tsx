"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface KYCRejectModalProps {
  isOpen: boolean;
  userId: string | null;
  onClose: () => void;
  onConfirm: (userId: string, reason: string) => Promise<void>;
}

export default function KYCRejectModal({ isOpen, userId, onClose, onConfirm }: KYCRejectModalProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !userId) return null;

  const handleConfirm = async () => {
    if (reason.length < 10) return;
    try {
      setIsSubmitting(true);
      await onConfirm(userId, reason);
      setReason("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold font-heading">Reject KYC Verification</h2>
          <button 
            onClick={handleClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6 text-sm">
          Please provide a reason for rejecting this document. This will be emailed directly to the user to help them correct the issue.
        </p>

        <div className="space-y-2 mb-6">
          <label className="text-sm font-semibold text-gray-900 block">
            Rejection Reason
          </label>
          <textarea
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A6B4A] focus:border-transparent min-h-[100px] resize-none"
            placeholder="e.g. Document is blurry. Please resubmit a clearer photo of your citizenship card."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Minimum 10 characters</span>
            <span className={reason.length < 10 && reason.length > 0 ? "text-red-500" : ""}>
              {reason.length}/100
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={reason.length < 10 || isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Rejecting...
              </>
            ) : (
              "Confirm Rejection"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
