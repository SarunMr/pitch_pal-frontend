"use client";

import React, { useEffect, useState } from "react";
import { getKYCStatusAction } from "@/lib/actions/kyc.actions";
import { ChevronRight, ShieldAlert, CreditCard } from "lucide-react";
import Link from "next/link";
import { getPaymentCardAction } from "@/lib/actions/payment.actions";

export default function DashboardWarningBanner({ role }: { role: string }) {
  const [warnings, setWarnings] = useState<{ id: string; msg: string; link: string; icon: any }[]>([]);

  useEffect(() => {
    const checkStatus = async () => {
      const newWarnings = [];
      const [kycRes, cardRes] = await Promise.all([
        getKYCStatusAction(),
        getPaymentCardAction()
      ]);

      if (!kycRes?.data || kycRes.data.kycStatus !== "verified") {
        newWarnings.push({
          id: "kyc",
          msg: role === "investor" 
            ? "Complete KYC verification to enable investing." 
            : "Complete KYC verification to create and publish pitches.",
          link: "/kyc",
          icon: ShieldAlert
        });
      }

      if (!cardRes?.data) {
        newWarnings.push({
          id: "card",
          msg: "Add a payment method to unlock transactions.",
          link: "/payment",
          icon: CreditCard
        });
      }

      setWarnings(newWarnings);
    };

    checkStatus();
  }, [role]);

  if (warnings.length === 0) return null;

  return (
    <div className="space-y-3 mb-8">
      {warnings.map((warn) => (
        <div key={warn.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-800">
            <warn.icon className="w-5 h-5" />
            <p className="text-sm font-medium">{warn.msg}</p>
          </div>
          <Link href={warn.link} className="text-xs font-bold text-amber-700 hover:text-amber-900 bg-amber-100/50 hover:bg-amber-200/50 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
            Resolve <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      ))}
    </div>
  );
}
