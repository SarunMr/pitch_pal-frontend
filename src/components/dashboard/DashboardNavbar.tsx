"use client";

import React, { useEffect, useState } from "react";
import { User as UserIcon, LogOut, CreditCard, Shield } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
import { NotificationBell } from "./NotificationBell";

export const DashboardNavbar = () => {
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  const fetchUser = async () => {
    const data = await getUserData();
    setUser(data);
  };

  const onLogout = async () => {
    try {
      await handleLogout();
    } catch {
      router.push("/login");
    }
  };

  useEffect(() => {
    fetchUser();
    const handleUserUpdate = () => fetchUser();
    window.addEventListener("user-profile-updated", handleUserUpdate);
    return () => window.removeEventListener("user-profile-updated", handleUserUpdate);
  }, []);

  const getPageTitle = () => {
    if (pathname === "/entrepreneur" || pathname === "/investor" || pathname === "/admin") return "Dashboard";
    if (pathname.includes("/feed")) return "Feed";
    if (pathname.includes("/pitches")) return "Pitches";
    if (pathname.includes("/network")) return "Network";
    if (pathname.includes("/profile")) return "Profile";
    if (pathname.includes("/payment")) return "Payment Methods";
    if (pathname.includes("/kyc")) return "KYC";
    if (pathname.includes("/users")) return "Users";
    return "Dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Page Title/Breadcrumb */}
        <div className="flex items-center">
          {/* Show the logo on mobile since sidebar is hidden */}
          <div className="md:hidden flex items-center gap-2 mr-4 border-r pr-4">
            <span className="text-lg font-bold font-heading text-[#1A6B4A]">
              PitchPal
            </span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">{getPageTitle()}</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user && <NotificationBell />}
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
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => (window.location.href = "/profile")}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => (window.location.href = "/kyc")}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    <span>KYC</span>
                  </DropdownMenuItem>
                  {user?.role !== "admin" && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => (window.location.href = "/payment")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Payment Methods</span>
                    </DropdownMenuItem>
                  )}
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
