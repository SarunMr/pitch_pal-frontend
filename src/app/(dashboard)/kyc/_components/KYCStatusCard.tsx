"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, XCircle } from "lucide-react";

interface KYCStatusCardProps {
  status: "none" | "pending" | "verified" | "rejected";
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  documentUrl?: string;
  panNumber?: string;
}

export default function KYCStatusCard({
  status,
  submittedAt,
  reviewedAt,
  rejectionReason,
  documentUrl,
  panNumber,
}: KYCStatusCardProps) {
  const getBadge = () => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800">Pending</span>;
      case "verified":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">Verified</span>;
      case "rejected":
        return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const baseCardClasses = "relative overflow-hidden mb-8 border";
  let cardClasses = `${baseCardClasses} border-gray-200 bg-gray-50/50`;
  
  if (status === "pending") cardClasses = `${baseCardClasses} border-amber-200 bg-amber-50/30`;
  if (status === "verified") cardClasses = `${baseCardClasses} border-green-200 bg-green-50/30`;
  if (status === "rejected") cardClasses = `${baseCardClasses} border-red-200 bg-red-50/30`;

  return (
    <Card className={cardClasses}>
      <CardContent className="p-6">
        <div className="flex items-start gap-5">
          {/* Icon */}
          <div className="mt-1">
            {status === "none" && <FileText className="w-8 h-8 text-gray-400" />}
            {status === "pending" && <Clock className="w-8 h-8 text-amber-500" />}
            {status === "verified" && <CheckCircle className="w-8 h-8 text-green-500" />}
            {status === "rejected" && <XCircle className="w-8 h-8 text-red-500" />}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <h3 className="text-xl font-bold font-heading text-gray-900">
                {status === "none" && "No Documents Submitted"}
                {status === "pending" && "Under Review"}
                {status === "verified" && "KYC Verified"}
                {status === "rejected" && "Verification Rejected"}
              </h3>
              {getBadge()}
            </div>
            
            <div className="text-gray-600 mb-4">
              {status === "none" && (
                <p>Submit your citizenship or passport to get verified.</p>
              )}
              {status === "pending" && (
                <>
                  <p>Submitted on {formatDate(submittedAt)}</p>
                  <p className="text-sm mt-1">Admin will review within 24–48 hours</p>
                </>
              )}
              {status === "verified" && (
                <>
                  <p>Verified on {formatDate(reviewedAt)}</p>
                  <p className="text-sm mt-1">You have full access to PitchPal</p>
                </>
              )}
              {status === "rejected" && (
                <>
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm mb-3">
                    <span className="font-semibold block mb-1">Reason for Rejection:</span>
                    {rejectionReason || "Please resubmit with correct documents."}
                  </div>
                  <p>Please resubmit with correct documents.</p>
                </>
              )}
            </div>

            {/* Additional details if submitted */}
            {status !== "none" && (
              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-200/60 mt-4">
                {panNumber && (
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">PAN Number</span>
                    <span className="text-sm font-medium">{panNumber}</span>
                  </div>
                )}
                {documentUrl && (
                  <div>
                    <span className="block text-xs text-gray-500 mb-1">Document</span>
                    <a
                      href={documentUrl.startsWith("http") ? documentUrl : `http://localhost:5000${documentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#1A6B4A] hover:underline flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" /> View submitted document
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
