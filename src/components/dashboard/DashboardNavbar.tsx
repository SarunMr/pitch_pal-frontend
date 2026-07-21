"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, User as UserIcon, Settings, LogOut, Briefcase, Rss } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserData } from "@/lib/cookie";
import { handleLogout } from "@/lib/actions/auth.actions";
import { getKYCStatusAction, getAdminKYCListAction } from "@/lib/actions/kyc.actions";
import { Shield } from "lucide-react";

export const DashboardNavbar = () => {
  const [user, setUser] = useState<any>(null);
  const [kycStatus, setKycStatus] = useState<string>("none");
  const [adminPendingKycCount, setAdminPendingKycCount] = useState<number>(0);

  const fetchUser = async () => {
    const data = await getUserData();
    setUser(data);
    
    // Fetch KYC info based on role
    if (data) {
      try {
        if (data.role === "admin") {
          const res = await getAdminKYCListAction("pending", 1, 1);
          if (res?.success) setAdminPendingKycCount(res.data?.total || 0);
        } else {
          const res = await getKYCStatusAction();
          if (res?.data) setKycStatus(res.data.kycStatus);
        }
      } catch (err) {
        console.error("Failed to fetch KYC info for navbar", err);
      }
    }
  };

  useEffect(() => {
    fetchUser();

    // Listen for profile updates from profile page
    const handleUserUpdate = () => fetchUser();
    window.addEventListener("user-profile-updated", handleUserUpdate);
    return () => window.removeEventListener("user-profile-updated", handleUserUpdate);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-[#1A6B4A]" />
          <span className="text-xl font-bold font-heading text-[#1A6B4A]">
            PitchPal
          </span>
        </a>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-6">
          <a
            href={user?.role === "entrepreneur" ? "/entrepreneur" : user?.role === "admin" ? "/admin" : "/investor"}
            className="text-sm font-medium hover:text-[#1A6B4A]"
          >
            Dashboard
          </a>

          {/* Feed — visible to entrepreneur and investor */}
          {(user?.role === "entrepreneur" || user?.role === "investor") && (
            <a
              href="/feed"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1A6B4A]"
            >
              <Rss className="w-4 h-4" />
              Feed
            </a>
          )}

          {/* Admin Nav */}
          {user?.role === "admin" && (
            <>
              <a href="/admin/users" className="text-sm font-medium text-gray-500 hover:text-[#1A6B4A]">
                Users
              </a>
              <a
                href="/admin/pitches"
                className="text-sm font-medium text-gray-500 hover:text-[#1A6B4A]"
              >
                Pitch Queue
              </a>
              <a
                href="/admin/kyc"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1A6B4A]"
              >
                <Shield className="w-4 h-4" />
                KYC Queue
                {adminPendingKycCount > 0 && (
                  <span className="flex h-5 items-center justify-center rounded-full bg-amber-100 px-2 text-[10px] font-bold text-amber-600">
                    {adminPendingKycCount}
                  </span>
                )}
              </a>
            </>
          )}

          {/* Entrepreneur Nav */}
          {user?.role === "entrepreneur" && (
            <>
              <a href="/entrepreneur/pitches" className="text-sm font-medium text-gray-500 hover:text-[#1A6B4A]">
                My Pitches
              </a>
              <a
                href="/kyc"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1A6B4A]"
              >
                <Shield className="w-4 h-4" />
                KYC
                {(kycStatus === "pending" || kycStatus === "none") && (
                  <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                )}
              </a>
            </>
          )}

          {/* Investor Nav */}
          {user?.role === "investor" && (
            <>
              <a href="/investor/pitches" className="text-sm font-medium text-gray-500 hover:text-[#1A6B4A]">
                Marketplace
              </a>
              <a
                href="/kyc"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1A6B4A]"
              >
                <Shield className="w-4 h-4" />
                KYC
                {(kycStatus === "pending" || kycStatus === "none") && (
                  <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                )}
              </a>
              <a
                href="/investor/portfolio"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-[#1A6B4A]"
              >
                <Briefcase className="w-4 h-4" />
                Portfolio
              </a>
            </>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border-2 border-[#1A6B4A]/20 focus:outline-none focus:ring-2 focus:ring-[#1A6B4A] focus:ring-offset-2 transition-all">
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={
                      user.profilePicture
                        ? user.profilePicture.startsWith("http")
                          ? user.profilePicture
                          : `http://localhost:5000${encodeURI(user.profilePicture)}`
                        : ""
                    }
                    alt={user.username}
                  />
                  <AvatarFallback className="bg-[#1A6B4A] text-white font-semibold">
                    {user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                {/* User info — must be inside a Group for Base UI */}
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName || user.lastName
                          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                          : user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {/* Action items — each group required by Base UI */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => (window.location.href = "/profile")}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => (window.location.href = "/admin/users")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>User Management</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => handleLogout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
};
