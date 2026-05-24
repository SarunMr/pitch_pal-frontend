import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export default function Navbar(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface)] backdrop-blur-md bg-opacity-80 transition-colors duration-200">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo/Branding */}
        <div className="flex items-center">
          <Link
            href={ROUTES.HOME}
            className="text-2xl font-black tracking-tight text-[var(--md-sys-color-primary)] hover:opacity-90 transition-opacity"
          >
            PitchPal
          </Link>
        </div>

        {/* Right Side: Auth Actions */}
        <div className="flex items-center gap-4">
          <Button variant="ghost">
            <Link
              href={ROUTES.LOGIN}
              className="font-semibold text-[var(--md-sys-color-inverse-surface)]"
            >
              Log in
            </Link>
          </Button>

          <Button variant="default">
            <Link href={ROUTES.REGISTER} className="font-semibold">
              Register
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
