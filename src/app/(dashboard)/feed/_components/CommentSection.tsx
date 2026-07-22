"use client";

import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, Pencil, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { CommentFormSchema, CommentFormData } from "./schema";
import {
  fetchCommentsAction,
  addCommentAction,
  updateCommentAction,
  deleteCommentAction,
} from "@/lib/actions/post.actions";
import { IComment } from "@/lib/api/posts/post.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReportDialog } from "@/components/ReportDialog";

interface CommentSectionProps {
  postId: string;
  currentUserId: string;
  currentUserRole: string;
  initialCount: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US");
}

export default function CommentSection({
  postId,
  currentUserId,
  currentUserRole,
  initialCount,
}: CommentSectionProps) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<CommentFormData>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: { content: "" },
  });

  const loadComments = async () => {
    setIsLoading(true);
    const res = await fetchCommentsAction(postId);
    if (res?.success) setComments(res.data || []);
    setIsLoaded(true);
    setIsLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleSubmit = (data: CommentFormData) => {
    startTransition(async () => {
      const res = await addCommentAction(postId, data.content);
      if (res?.success) {
        setComments((prev) => [...prev, res.data]);
        form.reset();
        toast.success("Comment added");
      } else {
        toast.error(res?.message || "Failed to add comment");
      }
    });
  };

  const handleEditSave = (commentId: string) => {
    if (!editContent.trim()) return;
    startTransition(async () => {
      const res = await updateCommentAction(commentId, editContent.trim());
      if (res?.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? { ...c, content: editContent.trim() } : c))
        );
        setEditingId(null);
        toast.success("Comment updated");
      } else {
        toast.error(res?.message || "Failed to update comment");
      }
    });
  };

  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      const res = await deleteCommentAction(commentId);
      if (res?.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.success("Comment deleted");
      } else {
        toast.error(res?.message || "Failed to delete comment");
      }
    });
  };

  const authorName = (c: IComment) => {
    const a = c.authorId;
    if (a.firstName || a.lastName) return `${a.firstName || ""} ${a.lastName || ""}`.trim();
    if (a.username) return a.username;
    if (a.email) return a.email;
    return "Unknown User";
  };

  const avatarInitial = (c: IComment) => authorName(c).charAt(0).toUpperCase();

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
      {/* Comment List */}
      {isLoading && (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-2 animate-pulse">
              <div className="h-7 w-7 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 h-12 rounded-lg bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {isLoaded && comments.length === 0 && (
        <p className="text-xs text-center text-gray-400 py-2">No comments yet — be the first!</p>
      )}

      {comments.map((comment) => {
        const isOwner = comment.authorId._id === currentUserId;
        const isAdmin = currentUserRole === "admin";
        const isEditing = editingId === comment._id;

        return (
          <div key={comment._id} className="flex gap-2.5">
            <Avatar className="h-7 w-7 shrink-0 mt-0.5">
              <AvatarImage src={comment.authorId.profilePicture} />
              <AvatarFallback className="bg-[#1A6B4A]/10 text-[#1A6B4A] text-xs font-semibold">
                {avatarInitial(comment)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="bg-slate-50 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-gray-800">{authorName(comment)}</span>
                  <span className="text-[10px] text-gray-400 shrink-0">
                    {timeAgo(comment.createdAt)}
                  </span>
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <input
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="flex-1 text-sm px-2 py-1 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#1A6B4A]"
                      onKeyDown={(e) => e.key === "Enter" && handleEditSave(comment._id)}
                      autoFocus
                    />
                    <button onClick={() => handleEditSave(comment._id)} disabled={isPending} className="p-1 text-green-600 hover:text-green-700">
                      <Check size={14} />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 mt-0.5">{comment.content}</p>
                )}
              </div>

              {/* Actions */}
              {!isEditing && (
                <div className="flex items-center gap-2 mt-1 ml-1">
                  {(isOwner || isAdmin) && (
                    <>
                      {isOwner && (
                        <button
                          onClick={() => { setEditingId(comment._id); setEditContent(comment.content); }}
                          className="text-[10px] text-gray-400 hover:text-[#1A6B4A] transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(comment._id)}
                        disabled={isPending}
                        className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                  {!isOwner && (
                    <ReportDialog
                      targetType="comment"
                      targetId={comment._id}
                      triggerElement={
                        <button className="text-[10px] text-gray-400 hover:text-amber-600 transition-colors">
                          Report
                        </button>
                      }
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Add Comment */}
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2 mt-2">
        <input
          {...form.register("content")}
          placeholder="Write a comment..."
          className="flex-1 h-9 px-3 text-sm rounded-full border border-gray-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#1A6B4A] focus:border-[#1A6B4A] transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          className="h-9 w-9 rounded-full bg-[#1A6B4A] text-white flex items-center justify-center hover:bg-[#155a3d] transition-colors disabled:opacity-60 shrink-0"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </form>
      {form.formState.errors.content && (
        <p className="text-xs text-red-500 -mt-1">{form.formState.errors.content.message}</p>
      )}
    </div>
  );
}
