"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, ArrowRight, TrendingUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ResetPasswordSchema, type ResetPasswordFormData } from "./schema";
import { ROUTES } from "@/constants/routes";
import { resetPassword } from "@/lib/api/auth/auth.api";
import { toast } from "sonner";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>
  );
}

export default function ResetPassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword(token, data.newPassword);
      toast.success(response.message || "Password reset successfully!");
      setIsSuccess(true);
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm space-y-7">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center lg:justify-start">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <TrendingUp
              size={18}
              className="text-primary-foreground stroke-[2.5]"
            />
          </div>
          <span className="text-2xl font-black tracking-tight text-foreground">
            PitchPal
          </span>
        </div>

        {/* Header */}
        <div className="space-y-1 text-center lg:text-left">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Set your new password below
          </p>
        </div>

        {!token ? (
          <div className="space-y-6 text-center lg:text-left">
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="size-5 shrink-0" />
              <span>Invalid reset link. Please request a new one.</span>
            </div>
            <div className="flex justify-center">
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="font-semibold text-primary hover:underline underline-offset-4 text-sm"
              >
                Go to Forgot Password
              </Link>
            </div>
          </div>
        ) : isSuccess ? (
          <div className="p-4 bg-[#1A6B4A]/10 text-[#1A6B4A] rounded-xl text-sm font-medium text-center">
            Password reset successfully! Redirecting to login...
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="newPassword" className="text-sm font-semibold">
                New Password
              </Label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(
                    "pl-9 pr-10 h-10",
                    errors.newPassword &&
                      "border-destructive focus-visible:ring-destructive/20",
                  )}
                  {...register("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <FieldError message={errors.newPassword?.message} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={cn(
                    "pl-9 pr-10 h-10",
                    errors.confirmPassword &&
                      "border-destructive focus-visible:ring-destructive/20",
                  )}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <FieldError message={errors.confirmPassword?.message} />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 font-semibold gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="size-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
              ) : (
                <>
                  Reset Password <ArrowRight size={15} />
                </>
              )}
            </Button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={ROUTES.LOGIN}
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
