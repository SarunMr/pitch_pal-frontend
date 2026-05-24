"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function Navbar(): React.JSX.Element {
  const pathname = usePathname();

  // Determine which actions should be visible based on the current pathname
  const showLogin = pathname === ROUTES.HOME || pathname === ROUTES.REGISTER;
  const showRegister = pathname === ROUTES.HOME || pathname === ROUTES.LOGIN;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-primary backdrop-blur-md transition-colors duration-200">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo/Branding */}
        <div className="flex items-center">
          <Link
            href={ROUTES.HOME}
            className="text-2xl font-black tracking-tight text-primary-foreground hover:opacity-90 transition-opacity"
          >
            PitchPal
          </Link>
        </div>

        {/* Right Side: Dynamic Auth Actions */}
        <div className="flex items-center gap-3">
          {showLogin && (
            <Button
              variant="ghost"
              className="font-semibold text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            >
              <Link href={ROUTES.LOGIN}>Log in</Link>
            </Button>
          )}

          {showRegister && (
            <Button className="font-semibold bg-white text-primary hover:bg-white/90 border-0 shadow-none">
              <Link href={ROUTES.REGISTER}>Register</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
