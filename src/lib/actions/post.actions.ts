"use server";

import { getTokenCookie } from "../cookie";
import {
  fetchFeed,
  fetchMyPosts,
  createPost,
  updatePost,
  deletePost,
  fetchComments,
  addComment,
  updateComment,
  deleteComment,
  addReaction,
  removeReaction,
  ReactionType,
} from "../api/posts/post.api";

// ── Feed ──────────────────────────────────────────────────────────────────────
export const fetchFeedAction = async (page = 1, limit = 10) => {
  try {
    const token = await getTokenCookie();
    const result = await fetchFeed(token || "", page, limit);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch feed", data: null };
  }
};

export const fetchMyPostsAction = async (page = 1, limit = 10) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    const result = await fetchMyPosts(token, page, limit);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch my posts", data: null };
  }
};

// ── Posts ─────────────────────────────────────────────────────────────────────
export const createPostAction = async (content: string, image?: File | null) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    const result = await createPost(token, content, image);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create post", data: null };
  }
};

export const updatePostAction = async (postId: string, content: string, image?: File | null, removeImage?: boolean) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    const result = await updatePost(token, postId, content, image, removeImage);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update post", data: null };
  }
};

export const deletePostAction = async (postId: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    const result = await deletePost(token, postId);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete post", data: null };
  }
};

// ── Comments ──────────────────────────────────────────────────────────────────
export const fetchCommentsAction = async (postId: string, page = 1, limit = 50) => {
  try {
    const result = await fetchComments(postId, page, limit);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch comments", data: null };
  }
};

export const addCommentAction = async (postId: string, content: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    const result = await addComment(token, postId, content);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to add comment", data: null };
  }
};

export const updateCommentAction = async (commentId: string, content: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    const result = await updateComment(token, commentId, content);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update comment", data: null };
  }
};

export const deleteCommentAction = async (commentId: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    const result = await deleteComment(token, commentId);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete comment", data: null };
  }
};

// ── Reactions ─────────────────────────────────────────────────────────────────
export const addReactionAction = async (postId: string, type: ReactionType) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    const result = await addReaction(token, postId, type);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to add reaction", data: null };
  }
};

export const removeReactionAction = async (postId: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    const result = await removeReaction(token, postId);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to remove reaction", data: null };
  }
};
