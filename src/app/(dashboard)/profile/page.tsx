"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getTokenCookie, storeUserData } from "@/lib/cookie";
import axiosInstance from "@/lib/api/axios-instance";
import EditProfile from "./_components/EditProfile";
import ResetPasswordForm from "./_components/ResetPasswordForm";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"edit" | "reset">("edit");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getTokenCookie();
        if (token) {
          const response = await axiosInstance.get("/auth/whoami", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data?.data;
          if (data) {
            await storeUserData(data);
            setUser(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="h-8 w-8 rounded-full border-2 border-[#1A6B4A] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold text-[#1A6B4A]">Profile Settings</h1>
        <div className="mt-4 sm:mt-0 flex bg-gray-100 p-1 rounded-lg gap-1">
          <Button
            variant={activeTab === "edit" ? "default" : "ghost"}
            className={
              activeTab === "edit"
                ? "bg-white text-[#1A6B4A] shadow-sm hover:bg-white"
                : "text-gray-600 hover:text-[#1A6B4A]"
            }
            onClick={() => setActiveTab("edit")}
          >
            Edit Profile
          </Button>
          <Button
            variant={activeTab === "reset" ? "default" : "ghost"}
            className={
              activeTab === "reset"
                ? "bg-white text-[#1A6B4A] shadow-sm hover:bg-white"
                : "text-gray-600 hover:text-[#1A6B4A]"
            }
            onClick={() => setActiveTab("reset")}
          >
            Reset Password
          </Button>
        </div>
      </div>

      {/* Tabs */}
      {activeTab === "edit" ? (
        <EditProfile user={user} onUserUpdate={setUser} />
      ) : (
        <ResetPasswordForm />
      )}
    </div>
  );
}
