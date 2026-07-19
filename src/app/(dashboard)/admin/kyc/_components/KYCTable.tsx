"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface KYCUser {
  _id: string;
  username: string;
  email: string;
  kycStatus: string;
  kycDocumentUrl: string;
  kycDocumentName: string;
  panNumber?: string;
  kycSubmittedAt: string;
}

interface KYCTableProps {
  users: KYCUser[];
  onVerify: (userId: string) => Promise<void>;
  onReject: (userId: string) => void;
  isLoading: boolean;
  verifyingId: string | null;
}

export default function KYCTable({ users, onVerify, onReject, isLoading, verifyingId }: KYCTableProps) {
  if (users.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-4">
        <p className="text-gray-500">No KYC submissions found for this status.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">PAN Number</th>
              <th className="px-6 py-4 font-medium">Document</th>
              <th className="px-6 py-4 font-medium">Submitted</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-[#1A6B4A]/10 text-[#1A6B4A]">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{user.username}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {user.panNumber || <span className="text-gray-400">Not provided</span>}
                </td>
                <td className="px-6 py-4">
                  <a
                    href={user.kycDocumentUrl.startsWith("http") ? user.kycDocumentUrl : `http://localhost:5000${user.kycDocumentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A6B4A] hover:underline font-medium text-xs bg-green-50 px-3 py-1.5 rounded-full inline-block"
                  >
                    View Document
                  </a>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {formatDate(user.kycSubmittedAt)}
                </td>
                <td className="px-6 py-4">
                  {user.kycStatus === "pending" && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800">
                      Pending
                    </span>
                  )}
                  {user.kycStatus === "verified" && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                  {user.kycStatus === "rejected" && (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800">
                      Rejected
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.kycStatus === "pending" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => onVerify(user._id)}
                          disabled={isLoading || verifyingId === user._id}
                          className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
                        >
                          {verifyingId === user._id ? "Verifying..." : "Verify"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onReject(user._id)}
                          disabled={isLoading || verifyingId === user._id}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-8 text-xs"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
