"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, RefreshCw, Rss } from "lucide-react";
import { toast } from "sonner";
import { getUserData } from "@/lib/cookie";
import { fetchFeedAction } from "@/lib/actions/post.actions";
import { IPost } from "@/lib/api/posts/post.api";
import PostCard from "./_components/PostCard";
import CreatePostDialog from "./_components/CreatePostDialog";

export default function FeedPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    getUserData().then(setUser);
  }, []);

  const loadFeed = useCallback(async (pageNum = 1, append = false) => {
    if (append) setIsLoadingMore(true);
    else setIsLoading(true);

    const res = await fetchFeedAction(pageNum, 10);
    if (res?.success) {
      const incoming = res.data || [];
      setPosts((prev) => (append ? [...prev, ...incoming] : incoming));
      setTotalPages(res.meta?.totalPages || 1);
      setPage(pageNum);
    } else {
      toast.error(res?.message || "Failed to load feed");
    }

    if (append) setIsLoadingMore(false);
    else setIsLoading(false);
  }, []);

  useEffect(() => {
    loadFeed(1);
  }, [loadFeed]);

  const handleLoadMore = () => loadFeed(page + 1, true);

  const handlePostCreated = (post: IPost) => {
    setPosts((prev) => [post, ...prev]);
  };

  const handlePostDeleted = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handlePostUpdated = (updated: IPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#1A6B4A]/10 flex items-center justify-center">
            <Rss className="h-5 w-5 text-[#1A6B4A]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Feed</h1>
            <p className="text-xs text-gray-500">Community updates and pitches</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadFeed(1)}
            className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          {user && <CreatePostDialog onPostCreated={handlePostCreated} />}
        </div>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
                <div className="space-y-1.5">
                  <div className="h-3 w-28 bg-gray-200 rounded" />
                  <div className="h-2.5 w-16 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
            <Rss className="h-8 w-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Nothing in the feed yet</p>
          <p className="text-sm text-gray-400">Be the first to post something!</p>
          {user && <CreatePostDialog onPostCreated={handlePostCreated} />}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={user?._id || ""}
                currentUserRole={user?.role || ""}
                onDeleted={handlePostDeleted}
                onUpdated={handlePostUpdated}
              />
            ))}
          </div>

          {page < totalPages && (
            <div className="text-center pt-2">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                {isLoadingMore ? <Loader2 size={14} className="animate-spin" /> : null}
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
