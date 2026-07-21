"use client";

import React, { useEffect, useState } from "react";
import { getKYCStatusAction } from "@/lib/actions/kyc.actions";
import KYCStatusCard from "./_components/KYCStatusCard";
import KYCUploadForm from "./_components/KYCUploadForm";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function KYCPage() {
  const [kycData, setKycData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchStatus = async () => {
    try {
      setIsLoading(true);
      const res = await getKYCStatusAction();
      if (res?.data) {
        setKycData(res.data);
      } else {
        setKycData({ kycStatus: "none" });
      }
    } catch (error) {
      console.error("Failed to fetch KYC status", error);
      setKycData({ kycStatus: "none" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16 h-[60vh]">
        <div className="h-10 w-10 rounded-full border-4 border-[#1A6B4A] border-t-transparent animate-spin" />
      </div>
    );
  }

  const status = kycData?.kycStatus || "none";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-[#1A6B4A] mb-2">
          KYC Verification
        </h1>
        <p className="text-gray-600">
          Verify your identity to unlock full access to PitchPal
        </p>
      </div>

      {/* Always show status card if data is available */}
      <KYCStatusCard 
        status={status}
        submittedAt={kycData?.kycSubmittedAt}
        reviewedAt={kycData?.kycReviewedAt}
        rejectionReason={kycData?.kycRejectionReason}
        documentUrl={kycData?.kycDocumentUrl}
        panNumber={kycData?.panNumber}
      />

      {/* Conditional Rendering based on status */}
      {status === "verified" && (
        <Card className="border-green-200 bg-green-50 shadow-sm mt-8">
          <CardContent className="p-8 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your account is fully verified</h3>
            <p className="text-gray-600 mb-6">
              You have complete access to all PitchPal features including investing and creating pitches.
            </p>
            <Button 
              onClick={() => router.back()}
              className="bg-[#1A6B4A] hover:bg-[#124d35] text-white"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      )}

      {status === "pending" && (
        <Card className="border-0 bg-blue-50/50 shadow-sm mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">What happens next?</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <div className="mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">1</div>
                </div>
                <span>Our admin team will carefully review your submitted documents.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">2</div>
                </div>
                <span>You will receive an email notification once your KYC is processed.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">3</div>
                </div>
                <span>Expected processing time is usually within 24–48 hours.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      {(status === "none" || status === "rejected") && (
        <>
          <Card className="border-0 shadow-sm mb-6 bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What you need</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Valid citizenship card or passport</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Clear photo or scanned copy</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>File size under 5MB (JPG, PNG, PDF)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <KYCUploadForm onSuccess={fetchStatus} />
        </>
      )}
    </div>
  );
}
