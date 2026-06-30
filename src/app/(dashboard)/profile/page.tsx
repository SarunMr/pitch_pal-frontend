"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTokenCookie, storeUserData } from "@/lib/cookie";
import axiosInstance from "@/lib/api/axios-instance";
import { handleUpdateUser } from "@/lib/actions/auth.actions";
import { User } from "lucide-react";

const editProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, "Bio must be at most 500 characters").optional(),
});

const resetPasswordSchema = z.object({
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

type EditProfileValues = z.infer<typeof editProfileSchema>;
type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const BACKEND_URL = "http://localhost:5000";

function UserAvatar({ src, fallback, size = 128 }: { src?: string; fallback: string; size?: number }) {
  if (src) {
    return (
      <div
        className="relative rounded-full overflow-hidden border-4 border-white shadow-lg"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt="Profile picture"
          fill
          className="object-cover"
          sizes={`${size}px`}
          unoptimized={src.startsWith("blob:")}
        />
      </div>
    );
  }
  return (
    <div
      className="rounded-full border-4 border-white shadow-lg bg-[#1A6B4A] flex items-center justify-center text-white font-bold"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {fallback}
    </div>
  );
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"edit" | "reset">("edit");
  const [user, setUser] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const editForm = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { firstName: "", lastName: "", username: "", phone: "", bio: "" },
  });

  const resetForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getTokenCookie();
        if (token) {
          const response = await axiosInstance.get("/auth/whoami", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = response.data?.data;
          if (data) {
            await storeUserData(data);
            setUser(data);
            editForm.reset({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              username: data.username || "",
              phone: data.phone || "",
              bio: data.bio || "",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUser();
  }, [editForm]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const getAvatarSrc = (profilePicture?: string) => {
    if (!profilePicture) return undefined;
    return `${BACKEND_URL}${encodeURI(profilePicture)}`;
  };

  const onEditProfileSubmit = async (data: EditProfileValues) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (data.firstName) formData.append("firstName", data.firstName);
      if (data.lastName) formData.append("lastName", data.lastName);
      if (data.username) formData.append("username", data.username);
      if (data.phone) formData.append("phone", data.phone);
      if (data.bio) formData.append("bio", data.bio);
      if (selectedImage) formData.append("profilePicture", selectedImage);

      const result = await handleUpdateUser(formData);

      if (result.success) {
        toast.success(result.message || "Profile updated successfully!");
        const updatedUser = result.data;
        setUser(updatedUser);
        // Clear local preview — now show the persisted server image
        setPreviewImage(null);
        setSelectedImage(null);
        // Notify Navbar to re-read the cookie
        window.dispatchEvent(new Event("user-profile-updated"));
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

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

  if (!user) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="h-8 w-8 rounded-full border-2 border-[#1A6B4A] border-t-transparent animate-spin" />
      </div>
    );
  }

  const avatarFallback = user.username?.charAt(0).toUpperCase() || "U";
  const displayName =
    user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : user.username;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <h1 className="text-3xl font-heading font-bold text-[#1A6B4A]">Profile Settings</h1>
        <div className="mt-4 sm:mt-0 flex bg-gray-100 p-1 rounded-lg gap-1">
          <Button
            variant={activeTab === "edit" ? "default" : "ghost"}
            className={
              activeTab === "edit"
                ? "bg-white text-[#1A6B4A] shadow-sm hover:bg-white"
                : "text-gray-600 hover:text-[#1A6B4A]"
            }
            onClick={() => setActiveTab("edit")}
          >
            Edit Profile
          </Button>
          <Button
            variant={activeTab === "reset" ? "default" : "ghost"}
            className={
              activeTab === "reset"
                ? "bg-white text-[#1A6B4A] shadow-sm hover:bg-white"
                : "text-gray-600 hover:text-[#1A6B4A]"
            }
            onClick={() => setActiveTab("reset")}
          >
            Reset Password
          </Button>
        </div>
      </div>

      {/* Edit Profile Tab */}
      {activeTab === "edit" && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal information and profile picture.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editForm.handleSubmit(onEditProfileSubmit)} className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar + Upload */}
                <div className="flex flex-col items-center space-y-3">
                  <UserAvatar
                    src={previewImage || getAvatarSrc(user.profilePicture)}
                    fallback={avatarFallback}
                    size={128}
                  />
                  <label
                    htmlFor="picture"
                    className="cursor-pointer text-sm font-medium text-[#1A6B4A] hover:underline flex items-center gap-1"
                  >
                    <User size={14} />
                    Change Picture
                  </label>
                  <Input
                    id="picture"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {selectedImage && (
                    <p className="text-xs text-gray-500 max-w-[120px] truncate">{selectedImage.name}</p>
                  )}
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {/* Read-only info */}
                  <div className="space-y-2 md:col-span-2 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <Label className="text-gray-500">Email Address (Read Only)</Label>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                    <span className="px-3 py-1 bg-[#1A6B4A]/10 text-[#1A6B4A] rounded-full text-sm font-semibold capitalize">
                      {user.role}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...editForm.register("firstName")} placeholder="John" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...editForm.register("lastName")} placeholder="Doe" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" {...editForm.register("username")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...editForm.register("phone")} placeholder="+1 (555) 000-0000" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      {...editForm.register("bio")}
                      placeholder="Tell us about yourself..."
                    />
                    {editForm.formState.errors.bio && (
                      <p className="text-sm text-red-500">{editForm.formState.errors.bio.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading} className="bg-[#1A6B4A] hover:bg-[#145238]">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reset Password Tab */}
      {activeTab === "reset" && (
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
                  className="bg-[#E8A020] hover:bg-[#c2851a] text-white"
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
