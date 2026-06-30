import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-heading font-bold text-red-600 mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Please make sure you are logged in with the appropriate role.
        </p>
        <Link href="/">
          <Button className="w-full bg-[#1A6B4A] hover:bg-[#145238]">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
