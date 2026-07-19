import React from "react";
import KYCGuard from "@/components/kyc/KYCGuard";

export default function InvestorDashboard() {
  return (
    <KYCGuard role="investor">
      <div className="bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-heading font-bold text-[#1A6B4A] mb-4">
          Investor Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to your investor dashboard. Here you can explore startups and manage your portfolio.
        </p>
      </div>
    </KYCGuard>
  );
}
