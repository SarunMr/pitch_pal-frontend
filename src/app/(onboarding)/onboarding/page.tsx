"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import axiosInstance from "@/lib/api/axios-instance";
import { getTokenCookie, getUserData, storeUserData } from "@/lib/cookie";

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<"investor" | "entrepreneur" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error("Please select a role to continue.");
      return;
    }

    setIsLoading(true);
    try {
      const token = await getTokenCookie();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        router.push("/login");
        return;
      }

      // Convert data to multipart form data as update API expects it if profile update
      // But role update can be just JSON if backend supports it. The backend auth.controller.ts says:
      // const body = UpdateUserDTO.safeParse(req.body);
      // Wait, UpdateUserDTO does not include role! Let me check UpdateProfileSchema.
      // Ah, UpdateProfileSchema in auth.type.ts: firstName, lastName, username, profilePicture, bio, phone. No role!
      // But the user's prompt says: "On selecting a role, call PUT http://localhost:5000/api/auth/update with body { role: selectedRole }"
      // If the backend doesn't support updating role, this API call will fail validation.
      // I must update the backend UpdateProfileSchema to include `role` as optional.
      // Wait, I will do that via a separate tool call.
      
      const formData = new FormData();
      formData.append("role", selectedRole);

      const response = await axiosInstance.put("/auth/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Role updated successfully!");
        const userData = await getUserData();
        if (userData) {
          await storeUserData({ ...userData, role: selectedRole });
        }
        router.push(`/${selectedRole}`);
      } else {
        toast.error(response.data.message || "Failed to update role");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-heading font-bold text-[#1A6B4A] mb-4">Choose Your Path</h1>
          <p className="text-xl text-gray-600">Select how you want to use PitchPal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card 
            className={`cursor-pointer transition-all border-2 ${selectedRole === "investor" ? "border-[#1A6B4A] shadow-lg ring-2 ring-[#1A6B4A] ring-opacity-50" : "border-transparent hover:border-gray-200"}`}
            onClick={() => setSelectedRole("investor")}
          >
            <CardHeader className="text-center pt-8">
              <div className="mx-auto w-16 h-16 bg-[#1A6B4A]/10 rounded-full flex items-center justify-center mb-4 text-[#1A6B4A]">
                <Briefcase className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#1A6B4A]">Investor</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <CardDescription className="text-base text-gray-600">
                I want to fund promising startups
              </CardDescription>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all border-2 ${selectedRole === "entrepreneur" ? "border-[#E8A020] shadow-lg ring-2 ring-[#E8A020] ring-opacity-50" : "border-transparent hover:border-gray-200"}`}
            onClick={() => setSelectedRole("entrepreneur")}
          >
            <CardHeader className="text-center pt-8">
              <div className="mx-auto w-16 h-16 bg-[#E8A020]/10 rounded-full flex items-center justify-center mb-4 text-[#E8A020]">
                <Lightbulb className="w-8 h-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#E8A020]">Entrepreneur</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <CardDescription className="text-base text-gray-600">
                I want to pitch my startup and raise funds
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button 
            className="w-full md:w-auto px-12 py-6 text-lg bg-[#1A6B4A] hover:bg-[#145238] transition-colors"
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
          >
            {isLoading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
