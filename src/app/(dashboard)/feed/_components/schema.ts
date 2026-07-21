import { z } from "zod";

export const PostFormSchema = z.object({
  content: z
    .string()
    .min(1, "Post content cannot be empty")
    .max(2000, "Post content cannot exceed 2000 characters"),
});

export type PostFormData = z.infer<typeof PostFormSchema>;

export const CommentFormSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment cannot exceed 1000 characters"),
});

export type CommentFormData = z.infer<typeof CommentFormSchema>;
