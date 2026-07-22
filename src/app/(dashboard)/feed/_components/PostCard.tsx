"use client";

import { useState } from "react";
import { MessageCircle, Trash2, ExternalLink, Zap, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IPost } from "@/lib/api/posts/post.api";
import { deletePostAction } from "@/lib/actions/post.actions";
import ReactionBar from "./ReactionBar";
import CommentSection from "./CommentSection";
import CreatePostDialog from "./CreatePostDialog";
import { cn } from "@/lib/utils";

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

const POST_TYPE_BADGE: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pitch_created: {
    label: "Pitch Launched",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <TrendingUp size={11} />,
  },
  investment_made: {
    label: "Investment Made",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <Zap size={11} />,
  },
};

interface PostCardProps {
  post: IPost;
  currentUserId: string;
  currentUserRole: string;
  onDeleted: (postId: string) => void;
  onUpdated: (post: IPost) => void;
}

export default function PostCard({ post, currentUserId, currentUserRole, onDeleted, onUpdated }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [reactionCounts, setReactionCounts] = useState(post.reactionCounts || {});
  const [userReaction, setUserReaction] = useState(post.userReaction ?? null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSystemPost = post.type === "pitch_created" || post.type === "investment_made";
  const isOwner = post.authorId._id === currentUserId;
  const isAdmin = currentUserRole === "admin";
  const badge = POST_TYPE_BADGE[post.type];

  const authorName = (() => {
    const a = post.authorId;
    if (a.firstName || a.lastName) return `${a.firstName || ""} ${a.lastName || ""}`.trim();
    if (a.username) return a.username;
    if (a.email) return a.email;
    return "Unknown User";
  })();

  const avatarSrc = post.authorId.profilePicture
    ? post.authorId.profilePicture.startsWith("http")
      ? post.authorId.profilePicture
      : `http://localhost:5000${encodeURI(post.authorId.profilePicture)}`
    : "";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setIsDeleting(true);
    const res = await deletePostAction(post._id);
    if (res?.success) {
      toast.success("Post deleted");
      onDeleted(post._id);
    } else {
      toast.error(res?.message || "Failed to delete post");
      setIsDeleting(false);
    }
  };

  return (
    <div className={cn(
      "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-shadow hover:shadow-md",
      isDeleting && "opacity-50 pointer-events-none"
    )}>
      {/* System post accent stripe */}
      {isSystemPost && (
        <div className="h-1 bg-gradient-to-r from-[#1A6B4A] to-emerald-400" />
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={avatarSrc} />
              <AvatarFallback className="bg-[#1A6B4A]/10 text-[#1A6B4A] font-semibold text-sm">
                {authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900 truncate">{authorName}</span>
                {badge && (
                  <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold", badge.className)}>
                    {badge.icon}
                    {badge.label}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {timeAgo(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Owner controls — only on custom posts */}
          {!isSystemPost && (isOwner || isAdmin) && (
            <div className="flex items-center gap-1 shrink-0">
              {(isOwner || isAdmin) && (
                <CreatePostDialog
                  editPost={post}
                  onPostCreated={(updated) => onUpdated({ ...post, ...updated })}
                  onEditDone={() => {}}
                />
              )}
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Delete post"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* Post image */}
        {post.imageUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
            <img
              src={post.imageUrl.startsWith("http") ? post.imageUrl : `http://localhost:5000${encodeURI(post.imageUrl)}`}
              alt="Post image"
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* Linked Pitch chip */}
        {post.linkedPitchId && (
          <a
            href={`/investor/pitches/${post.linkedPitchId._id}`}
            className="mt-3 flex items-center gap-2.5 p-3 rounded-xl border border-emerald-100 bg-emerald-50/60 hover:bg-emerald-50 transition-colors group"
          >
            {post.linkedPitchId.coverImageUrl && (
              <img
                src={post.linkedPitchId.coverImageUrl}
                alt=""
                className="h-10 w-10 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1A6B4A] truncate">{post.linkedPitchId.title}</p>
              {post.linkedPitchId.industry && (
                <p className="text-[10px] text-gray-500 capitalize">{post.linkedPitchId.industry.replace("_", " ")}</p>
              )}
            </div>
            <ExternalLink size={14} className="text-[#1A6B4A] shrink-0 opacity-60 group-hover:opacity-100" />
          </a>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <ReactionBar
            postId={post._id}
            reactionCounts={reactionCounts}
            userReaction={userReaction}
            onReactionChange={(counts, reaction) => {
              setReactionCounts(counts);
              setUserReaction(reaction);
            }}
          />
          <button
            onClick={() => setShowComments((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
              showComments
                ? "text-[#1A6B4A] bg-green-50 border-green-200"
                : "text-gray-500 bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <MessageCircle size={13} />
            {commentCount > 0 ? `${commentCount} comment${commentCount !== 1 ? "s" : ""}` : "Comment"}
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <CommentSection
            postId={post._id}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
            initialCount={commentCount}
          />
        )}
      </div>
    </div>
  );
}
