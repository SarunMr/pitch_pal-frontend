"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Mail, Phone, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { updateUserAction } from "@/lib/actions/admin-user.actions";
import { ROUTES } from "@/constants/routes";

// ── Schema mirrors UpdateProfileSchema + status field ─────────────────────────
const editUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  phone: z.string().optional(),
  role: z.enum(["entrepreneur", "investor", "admin"]).optional(),
  status: z.enum(["active", "suspended", "banned"]).optional(),
});

type EditUserFormValues = z.infer<typeof editUserSchema>;

interface EditUserFormProps {
  userId: string;
  defaultValues: {
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    phone?: string;
    role?: string;
    status?: string;
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-destructive">{message}</p>;
}

export default function EditUserForm({ userId, defaultValues }: EditUserFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: defaultValues.username ?? "",
      firstName: defaultValues.firstName ?? "",
      lastName: defaultValues.lastName ?? "",
      bio: defaultValues.bio ?? "",
      phone: defaultValues.phone ?? "",
      role: (defaultValues.role as any) ?? "investor",
      status: (defaultValues.status as any) ?? "active",
    },
  });

  const onSubmit = async (data: EditUserFormValues) => {
    // Strip empty strings to avoid overwriting with empty values
    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "" && v !== undefined),
    );

    setIsLoading(true);
    try {
      const result = await updateUserAction(userId, payload);
      if (result?.success) {
        toast.success("User updated successfully");
        router.push(ROUTES.ADMIN_USERS);
      } else {
        toast.error(result?.message || "Failed to update user");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Email (read-only) */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold text-muted-foreground">Email (read-only)</Label>
        <div className="relative">
          <Mail
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="email"
            value={defaultValues.email ?? ""}
            readOnly
            className="pl-9 h-10 bg-muted/50 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-username" className="text-sm font-semibold">
          Username
        </Label>
        <div className="relative">
          <User
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            id="edit-username"
            type="text"
            className={cn("pl-9 h-10", errors.username && "border-destructive")}
            {...register("username")}
          />
        </div>
        <FieldError message={errors.username?.message} />
      </div>

      {/* First + Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edit-firstName" className="text-sm font-semibold">
            First Name
          </Label>
          <Input
            id="edit-firstName"
            type="text"
            placeholder="John"
            className={cn("h-10", errors.firstName && "border-destructive")}
            {...register("firstName")}
          />
          <FieldError message={errors.firstName?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit-lastName" className="text-sm font-semibold">
            Last Name
          </Label>
          <Input
            id="edit-lastName"
            type="text"
            placeholder="Doe"
            className={cn("h-10", errors.lastName && "border-destructive")}
            {...register("lastName")}
          />
          <FieldError message={errors.lastName?.message} />
        </div>
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-phone" className="text-sm font-semibold">
          Phone
        </Label>
        <div className="relative">
          <Phone
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            id="edit-phone"
            type="tel"
            placeholder="+1 234 567 8900"
            className="pl-9 h-10"
            {...register("phone")}
          />
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1.5">
        <Label htmlFor="edit-bio" className="text-sm font-semibold">
          Bio
        </Label>
        <div className="relative">
          <FileText
            size={15}
            className="absolute left-3 top-3 text-muted-foreground pointer-events-none"
          />
          <textarea
            id="edit-bio"
            rows={3}
            placeholder="Short bio…"
            className={cn(
              "flex w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "resize-none",
              errors.bio && "border-destructive",
            )}
            {...register("bio")}
          />
        </div>
        <FieldError message={errors.bio?.message} />
      </div>

      {/* Role + Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edit-role" className="text-sm font-semibold">
            Role
          </Label>
          <select
            id="edit-role"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

        <div className="space-y-1.5">
          <Label htmlFor="edit-status" className="text-sm font-semibold">
            Status
          </Label>
          <select
            id="edit-status"
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              errors.status && "border-destructive",
            )}
            {...register("status")}
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <FieldError message={errors.status?.message} />
        </div>
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
              Save changes <ArrowRight size={14} />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
