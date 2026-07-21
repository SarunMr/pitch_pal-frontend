"use client";

import { useState, useTransition, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2, Pencil, ImagePlus, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PostFormSchema, PostFormData } from "./schema";
import { IPost } from "@/lib/api/posts/post.api";
import { API } from "@/lib/api/endpoints";
import axiosInstance from "@/lib/api/axios-instance";

// Note: server actions cannot accept File objects, so we call the API directly here
// using the token from localStorage (set by auth flow)

async function getToken(): Promise<string | null> {
  // Next.js stores auth cookie — access via document.cookie in client
  const match = document.cookie.match(/auth_token=([^;]+)/);
  return match ? match[1] : null;
}

interface CreatePostDialogProps {
  onPostCreated: (post: IPost) => void;
  editPost?: IPost | null;
  onEditDone?: () => void;
  /** Pre-fill content (e.g. from pitch submission redirect) */
  prefillContent?: string;
  /** If true, open immediately (for pitch-submit flow) */
  autoOpen?: boolean;
}

export default function CreatePostDialog({
  onPostCreated,
  editPost,
  onEditDone,
  prefillContent,
  autoOpen = false,
}: CreatePostDialogProps) {
  const [open, setOpen] = useState(autoOpen);
  const [isPending, startTransition] = useTransition();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editPost?.imageUrl || null);
  const [removeImage, setRemoveImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PostFormData>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: { content: editPost?.content || prefillContent || "" },
  });

  const handleOpen = () => {
    form.reset({ content: editPost?.content || prefillContent || "" });
    setImagePreview(editPost?.imageUrl || null);
    setImageFile(null);
    setRemoveImage(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    form.reset();
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    onEditDone?.();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }
    setImageFile(file);
    setRemoveImage(false);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (data: PostFormData) => {
    startTransition(async () => {
      const token = await getToken();
      if (!token) {
        toast.error("Not authenticated");
        return;
      }

      const formData = new FormData();
      formData.append("content", data.content);
      if (imageFile) formData.append("image", imageFile);
      if (removeImage) formData.append("removeImage", "true");

      try {
        let res;
        if (editPost) {
          const response = await axiosInstance.put(API.POST.UPDATE(editPost._id), formData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          });
          res = response.data;
        } else {
          const response = await axiosInstance.post(API.POST.CREATE, formData, {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
          });
          res = response.data;
        }

        if (res?.success) {
          toast.success(editPost ? "Post updated" : "Post published!");
          onPostCreated(res.data);
          handleClose();
        } else {
          toast.error(res?.message || "Failed to save post");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || "Failed to save post");
      }
    });
  };

  return (
    <>
      {/* Trigger */}
      {!autoOpen && (
        editPost ? (
          <button
            onClick={handleOpen}
            className="p-1.5 rounded-md text-muted-foreground hover:text-[#1A6B4A] hover:bg-green-50 transition-colors"
            title="Edit post"
          >
            <Pencil size={15} />
          </button>
        ) : (
          <button
            onClick={handleOpen}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A6B4A] text-white text-sm font-semibold hover:bg-[#155a3d] transition-colors"
          >
            <Pencil size={15} />
            Create Post
          </button>
        )
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">
                {editPost ? "Edit Post" : "Create Post"}
              </h2>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Textarea */}
              <div>
                <textarea
                  {...form.register("content")}
                  rows={4}
                  placeholder="What's on your mind? Share thoughts, updates, or milestones..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-slate-50 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1A6B4A]/30 focus:border-[#1A6B4A] resize-none transition-colors"
                />
                {form.formState.errors.content && (
                  <p className="mt-1 text-xs text-red-500">{form.formState.errors.content.message}</p>
                )}
                <p className="mt-1 text-right text-xs text-gray-400">
                  {form.watch("content")?.length || 0} / 2000
                </p>
              </div>

              {/* Image preview */}
              {imagePreview && (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img src={imagePreview} alt="Post image preview" className="w-full max-h-60 object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              )}

              {/* Image picker + submit */}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    id="post-image-input"
                  />
                  <label
                    htmlFor="post-image-input"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <ImagePlus size={15} />
                    {imagePreview ? "Change photo" : "Add photo"}
                  </label>
                  <p className="text-[10px] text-gray-400 mt-1 ml-0.5">JPEG, PNG, WebP · max 10MB</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1A6B4A] text-white text-sm font-semibold hover:bg-[#155a3d] transition-colors disabled:opacity-60"
                  >
                    {isPending && <Loader2 size={14} className="animate-spin" />}
                    {editPost ? "Save Changes" : "Publish"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
