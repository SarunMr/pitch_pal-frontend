"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ShieldCheck, Clock, ShieldX } from "lucide-react";
import { 
  getAdminKYCListAction, 
  adminVerifyKYCAction, 
  adminRejectKYCAction 
} from "@/lib/actions/kyc.actions";
import KYCTable, { KYCUser } from "./_components/KYCTable";
import KYCRejectModal from "./_components/KYCRejectModal";
import UserPagination from "../users/_components/UserPagination";
import { ROUTES } from "@/constants/routes";

export default function AdminKYCPage() {
  const [users, setUsers] = useState<KYCUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  
  const [counts, setCounts] = useState({ pending: 0, verified: 0, rejected: 0 });
  const [rejectModal, setRejectModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null,
  });
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const fetchCounts = async () => {
    try {
      const [pendingRes, verifiedRes, rejectedRes] = await Promise.all([
        getAdminKYCListAction("pending", 1, 1),
        getAdminKYCListAction("verified", 1, 1),
        getAdminKYCListAction("rejected", 1, 1),
      ]);
      setCounts({
        pending: pendingRes?.data?.total || 0,
        verified: verifiedRes?.data?.total || 0,
        rejected: rejectedRes?.data?.total || 0,
      });
    } catch (err) {
      console.error("Failed to fetch counts", err);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAdminKYCListAction(statusFilter, page, 10);
      if (res?.success) {
        setUsers(res.data?.users || []);
        setTotal(res.data?.total || 0);
        setTotalPages(res.data?.totalPages || 1);
      } else {
        setUsers([]);
        setTotal(0);
        setTotalPages(1);
      }
      
      // Update counts silently
      fetchCounts();
    } catch (err) {
      console.error("Failed to fetch KYC list", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleVerify = async (userId: string) => {
    try {
      setVerifyingId(userId);
      const res = await adminVerifyKYCAction(userId);
      if (!res?.success) throw new Error(res?.message || "Verification failed");
      
      alert("KYC verified successfully"); 
      fetchUsers();
    } catch (error: any) {
      console.error("Failed to verify", error);
      alert(error.message || "Failed to verify KYC");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleRejectClick = (userId: string) => {
    setRejectModal({ isOpen: true, userId });
  };

  const handleConfirmReject = async (userId: string, reason: string) => {
    try {
      const res = await adminRejectKYCAction(userId, reason);
      if (!res?.success) throw new Error(res?.message || "Rejection failed");
      
      alert("KYC rejected successfully");
      fetchUsers();
    } catch (error: any) {
      console.error("Failed to reject", error);
      alert(error.message || "Failed to reject KYC");
      throw error;
    }
  };

  const handleTabClick = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  // Extract parameters for pagination
  const currentParams = {
    status: statusFilter,
    size: "10"
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          KYC Verification Queue
        </h1>
        <p className="text-gray-600">
          Review and verify user identity documents
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Pending Review</p>
            <h3 className="text-2xl font-bold text-amber-600">{counts.pending}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Verified</p>
            <h3 className="text-2xl font-bold text-green-600">{counts.verified}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Rejected</p>
            <h3 className="text-2xl font-bold text-red-600">{counts.rejected}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <ShieldX className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            statusFilter === "pending"
              ? "border-[#1A6B4A] text-[#1A6B4A]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => handleTabClick("pending")}
        >
          Pending
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            statusFilter === "verified"
              ? "border-[#1A6B4A] text-[#1A6B4A]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => handleTabClick("verified")}
        >
          Verified
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
            statusFilter === "rejected"
              ? "border-[#1A6B4A] text-[#1A6B4A]"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
          onClick={() => handleTabClick("rejected")}
        >
          Rejected
        </button>
      </div>

      {/* Loading state overlay inside container */}
      <div className="relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center backdrop-blur-sm">
            <div className="h-8 w-8 rounded-full border-2 border-[#1A6B4A] border-t-transparent animate-spin" />
          </div>
        )}
        
        {/* Table */}
        <KYCTable
          users={users}
          onVerify={handleVerify}
          onReject={handleRejectClick}
          isLoading={isLoading}
          verifyingId={verifyingId}
        />
      </div>

      {/* Pagination component from User Management */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
          <p className="text-xs text-muted-foreground">
            Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} submissions
          </p>
          <UserPagination
            page={page}
            totalPages={totalPages}
            basePath={ROUTES.ADMIN_KYC}
            searchParams={currentParams}
          />
        </div>
      )}

      {/* Reject Modal */}
      <KYCRejectModal
        isOpen={rejectModal.isOpen}
        userId={rejectModal.userId}
        onClose={() => setRejectModal({ isOpen: false, userId: null })}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
