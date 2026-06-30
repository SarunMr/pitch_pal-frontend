"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getTokenCookie } from "@/lib/cookie";
import axiosInstance from "@/lib/api/axios-instance";
import { resetPasswordSchema, type ResetPasswordValues } from "./schema";

export default function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onResetPasswordSubmit = async (data: ResetPasswordValues) => {
    setIsLoading(true);
    try {
      const token = await getTokenCookie();
      const response = await axiosInstance.put(
        "/auth/reset-password",
        { currentPassword: data.currentPassword, newPassword: data.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Password updated successfully!");
        resetForm.reset();
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Ensure your account is using a long, random password to stay secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={resetForm.handleSubmit(onResetPasswordSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" {...resetForm.register("currentPassword")} />
            {resetForm.formState.errors.currentPassword && (
              <p className="text-sm text-red-500">{resetForm.formState.errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" {...resetForm.register("newPassword")} />
            {resetForm.formState.errors.newPassword && (
              <p className="text-sm text-red-500">{resetForm.formState.errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input id="confirmNewPassword" type="password" {...resetForm.register("confirmNewPassword")} />
            {resetForm.formState.errors.confirmNewPassword && (
              <p className="text-sm text-red-500">{resetForm.formState.errors.confirmNewPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#E8A020] hover:bg-[#c2851a] text-white font-medium"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
