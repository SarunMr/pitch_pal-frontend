"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormValues } from "./schema";
import { ROUTES } from "@/constants/routes";
import { handleLogin } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";
import { googleAuth } from "@/lib/api/auth/auth.api";
import { setTokenCookie, storeUserData } from "@/lib/cookie";

// ── Google Icon ───────────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

// ── Field wrapper with error ──────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>
  );
}

// ── Login Component ───────────────────────────────────────────────────────────
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await handleLogin(data);
      if (result.success) {
        toast.success(result.message || "Login successful");
        const role = result.data?.role;
        if (role === "investor") {
          router.push(ROUTES.DASHBOARD.INVESTOR);
        } else if (role === "entrepreneur") {
          router.push(ROUTES.DASHBOARD.ENTREPRENEUR);
        } else if (role === "admin") {
          router.push(ROUTES.DASHBOARD.ADMIN);
        } else {
          router.push(ROUTES.HOME);
        }
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      console.log("Google sign in");
      await new Promise((r) => setTimeout(r, 1000));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className=" flex items-center justify-center bg-background px-6 py-12">
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
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        {/* Google Button */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const res = await googleAuth(credentialResponse.credential!);
                const resData = res.data || res;
                const token = resData.token || resData.accessToken;
                const user = resData.user;
                const needsOnboarding = resData.needsOnboarding || !user?.role;

                if (token && user) {
                  await setTokenCookie(token);
                  await storeUserData(user);
                  toast.success("Google login successful!");
                  
                  if (needsOnboarding || !user.role) {
                    router.push(ROUTES.ONBOARDING);
                  } else if (user.role === "admin") {
                    router.push(ROUTES.DASHBOARD.ADMIN);
                  } else if (user.role === "entrepreneur") {
                    router.push(ROUTES.DASHBOARD.ENTREPRENEUR);
                  } else {
                    router.push(ROUTES.DASHBOARD.INVESTOR);
                  }
                } else {
                  toast.error("Failed to retrieve authentication token");
                }
              } catch (error: any) {
                toast.error(error.message || "Google sign in failed");
              }
            }}
            onError={() => {
              toast.error("Google sign in was unsuccessful");
            }}
            text="continue_with"
            shape="rectangular"
            width="384px"
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-semibold">
              Email
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

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-semibold">
                Password
              </Label>
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-xs text-primary hover:underline underline-offset-4 font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className={cn(
                  "pl-9 pr-10 h-10",
                  errors.password &&
                    "border-destructive focus-visible:ring-destructive/20",
                )}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <FieldError message={errors.password?.message} />
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
                Sign in <ArrowRight size={15} />
              </>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.REGISTER}
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
