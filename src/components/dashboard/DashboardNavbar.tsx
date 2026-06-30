"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, User as UserIcon, Settings, LogOut } from "lucide-react";
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

export const DashboardNavbar = () => {
  const [user, setUser] = useState<any>(null);

  const fetchUser = async () => {
    const data = await getUserData();
    setUser(data);
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
          {user?.role === "admin" && (
            <a
              href="/admin/users"
              className="text-sm font-medium text-gray-500 hover:text-[#1A6B4A]"
            >
              Users
            </a>
          )}
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#1A6B4A]">
            Explore
          </a>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-[#1A6B4A]">
            Portfolio
          </a>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="relative flex h-9 w-9 items-center justify-center rounded-full overflow-hidden border-2 border-[#1A6B4A]/20 focus:outline-none focus:ring-2 focus:ring-[#1A6B4A] focus:ring-offset-2 transition-all">
                <Avatar className="h-full w-full">
                  <AvatarImage
                    src={user.profilePicture ? `http://localhost:5000${encodeURI(user.profilePicture)}` : ""}
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
