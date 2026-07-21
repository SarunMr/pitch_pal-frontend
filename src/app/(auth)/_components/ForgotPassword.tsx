"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ForgotPasswordSchema, type ForgotPasswordFormData } from "./schema";
import { ROUTES } from "@/constants/routes";
import { forgotPassword } from "@/lib/api/auth/auth.api";
import { toast } from "sonner";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>
  );
}

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await forgotPassword(data.email);
      toast.success(response.message || "Reset link sent!");
      setIsSuccess(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
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
            Forgot Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-6 text-center lg:text-left">
            <div className="p-4 bg-[#1A6B4A]/10 text-[#1A6B4A] rounded-xl text-sm font-medium">
              Check your email — we sent a password reset link
            </div>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive it? Check spam
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email address
              </Label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={cn(
                    "pl-9 h-10",
                    errors.email &&
                      "border-destructive focus-visible:ring-destructive/20",
                  )}
                  {...register("email")}
                />
              </div>
              <FieldError message={errors.email?.message} />
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
                  Send Reset Link <ArrowRight size={15} />
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
