"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createUserAction } from "@/lib/actions/admin-user.actions";
import { ROUTES } from "@/constants/routes";

// ── Schema (mirrors RegisterSchema on the backend, role required) ─────────────
const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be under 30 characters"),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["entrepreneur", "investor", "admin"], {
    required_error: "Role is required",
  }),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>;
}

export default function CreateUserForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: "investor" },
  });

  const onSubmit = async (data: CreateUserFormValues) => {
    setIsLoading(true);
    try {
      const result = await createUserAction(data);
      if (result?.success) {
        toast.success("User created successfully");
        router.push(ROUTES.ADMIN_USERS);
      } else {
        toast.error(result?.message || "Failed to create user");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Username */}
      <div className="space-y-1.5">
        <Label htmlFor="create-username" className="text-sm font-semibold">
          Username
        </Label>
        <div className="relative">
          <User
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            id="create-username"
            type="text"
            placeholder="johndoe"
            className={cn("pl-9 h-10", errors.username && "border-destructive")}
            {...register("username")}
          />
        </div>
        <FieldError message={errors.username?.message} />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="create-email" className="text-sm font-semibold">
          Email
        </Label>
        <div className="relative">
          <Mail
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            id="create-email"
            type="email"
            placeholder="john@example.com"
            className={cn("pl-9 h-10", errors.email && "border-destructive")}
            {...register("email")}
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="create-password" className="text-sm font-semibold">
          Password
        </Label>
        <div className="relative">
          <Lock
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            id="create-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className={cn("pl-9 h-10", errors.password && "border-destructive")}
            {...register("password")}
          />
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      {/* Role */}
      <div className="space-y-1.5">
        <Label htmlFor="create-role" className="text-sm font-semibold">
          Role
        </Label>
        <select
          id="create-role"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            errors.role && "border-destructive",
          )}
          {...register("role")}
        >
          <option value="investor">Investor</option>
          <option value="entrepreneur">Entrepreneur</option>
          <option value="admin">Admin</option>
        </select>
        <FieldError message={errors.role?.message} />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 h-10"
          onClick={() => router.push(ROUTES.ADMIN_USERS)}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1 h-10 font-semibold gap-2" disabled={isLoading}>
          {isLoading ? (
            <span className="size-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
          ) : (
            <>
              Create user <ArrowRight size={14} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
