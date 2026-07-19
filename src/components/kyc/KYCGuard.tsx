"use client";

import React, { useEffect, useState } from "react";
import { getKYCStatusAction } from "@/lib/actions/kyc.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ShieldCheck, ShieldX, Clock } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

interface KYCGuardProps {
  children: React.ReactNode;
  role: "investor" | "entrepreneur";
}

export default function KYCGuard({ children, role }: KYCGuardProps) {
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const res = await getKYCStatusAction();
        if (res?.data) {
          setKycStatus(res.data.kycStatus);
          if (res.data.kycRejectionReason) {
            setRejectionReason(res.data.kycRejectionReason);
          }
        } else {
          setKycStatus("none");
        }
      } catch (error) {
        console.error("Failed to fetch KYC status", error);
        setKycStatus("none");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="h-8 w-8 rounded-full border-2 border-[#1A6B4A] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (kycStatus === "verified") {
    return <>{children}</>;
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh] px-4">
      <Card className="max-w-md w-full border-0 shadow-lg relative overflow-hidden">
        {kycStatus === "pending" && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />}
        {kycStatus === "rejected" && <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />}
        {kycStatus === "none" && <div className="absolute top-0 left-0 w-full h-1 bg-[#1A6B4A]" />}
        
        <CardContent className="pt-10 pb-8 px-8 text-center flex flex-col items-center">
          {/* Icon */}
          <div className="mb-6">
            {kycStatus === "none" && (
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <ShieldAlert className="w-10 h-10 text-[#1A6B4A]" />
              </div>
            )}
            {kycStatus === "pending" && (
              <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="w-10 h-10 text-amber-500" />
              </div>
            )}
            {kycStatus === "rejected" && (
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                <ShieldX className="w-10 h-10 text-red-500" />
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold font-heading mb-3">
            {kycStatus === "none" && "KYC Verification Required"}
            {kycStatus === "pending" && "KYC Under Review"}
            {kycStatus === "rejected" && "KYC Verification Rejected"}
          </h2>

          {/* Description */}
          <div className="text-gray-600 mb-8 min-h-[60px]">
            {kycStatus === "none" && role === "investor" && (
              <p>You need to complete KYC verification before you can invest in any startup.</p>
            )}
            {kycStatus === "none" && role === "entrepreneur" && (
              <p>You need to complete KYC verification before you can create or publish a pitch.</p>
            )}
            {kycStatus === "pending" && (
              <p>Your documents are under review. Admin will verify within 24–48 hours.</p>
            )}
            {kycStatus === "rejected" && (
              <div className="text-left">
                <p className="mb-2">Your KYC was rejected. Reason:</p>
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded border border-red-100 mb-2">
                  {rejectionReason || "Please resubmit with correct documents."}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="w-full mb-6">
            {kycStatus === "none" && (
              <Link href={ROUTES.KYC} className="w-full">
                <Button className="w-full bg-[#1A6B4A] hover:bg-[#124d35] text-white">
                  Complete KYC Verification
                </Button>
              </Link>
            )}
            {kycStatus === "pending" && (
              <Link href={ROUTES.KYC} className="w-full">
                <Button variant="outline" className="w-full border-amber-500 text-amber-600 hover:bg-amber-50">
                  Check Status
                </Button>
              </Link>
            )}
            {kycStatus === "rejected" && (
              <Link href={ROUTES.KYC} className="w-full">
                <Button className="w-full bg-[#1A6B4A] hover:bg-[#124d35] text-white">
                  Resubmit Documents
                </Button>
              </Link>
            )}
          </div>

          <p className="text-xs text-gray-400">
            KYC is required by SEBON regulations to protect investors and entrepreneurs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
