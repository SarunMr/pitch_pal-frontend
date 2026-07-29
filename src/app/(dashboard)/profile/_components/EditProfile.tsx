"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { User as UserIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleUpdateUser } from "@/lib/actions/auth.actions";
import { editProfileSchema, type EditProfileValues } from "./schema";

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

interface EditProfileProps {
  user: any;
  onUserUpdate: (updatedUser: any) => void;
}

export default function EditProfile({ user, onUserUpdate }: EditProfileProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const editForm = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      phone: user.phone || "",
      bio: user.bio || "",
    },
  });

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
        onUserUpdate(result.data);
        setPreviewImage(null);
        setSelectedImage(null);
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

  const avatarFallback = user.username?.charAt(0).toUpperCase() || "U";

  return (
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
                <UserIcon size={14} />
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
              <div className="space-y-4 md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-gray-500 text-xs">Email Address (Read Only)</Label>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-[#1A6B4A]/10 text-[#1A6B4A] rounded-full text-sm font-semibold capitalize">
                    {user.role}
                  </span>
                </div>
                
                {user.profileCompletion !== undefined && user.role !== "admin" && (
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-gray-700">Profile Completion</span>
                      <span className={user.profileCompletion >= 75 ? "text-green-600 font-bold" : "text-amber-600 font-bold"}>
                        {user.profileCompletion}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${user.profileCompletion >= 75 ? 'bg-green-500' : 'bg-amber-500'}`}
                        style={{ width: `${user.profileCompletion}%` }}
                      />
                    </div>
                    {user.profileCompletion < 75 && (
                      <p className="text-[10px] text-amber-600 mt-1.5">
                        Complete at least 75% of your profile (add bio, phone, mock payment card, KYC) to enable transactions.
                      </p>
                    )}
                  </div>
                )}
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
            <Button type="submit" disabled={isLoading} className="bg-[#1A6B4A] hover:bg-[#145238] font-semibold">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
