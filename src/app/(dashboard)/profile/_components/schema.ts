import * as z from "zod";

export const editProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

export const resetPasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number"),
  confirmNewPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

export type EditProfileValues = z.infer<typeof editProfileSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
