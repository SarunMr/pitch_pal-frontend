import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface IPostAuthor {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email: string;
  profilePicture?: string;
}

export interface ILinkedPitch {
  _id: string;
  title: string;
  coverImageUrl?: string;
  industry?: string;
}

export interface IPost {
  _id: string;
  authorId: IPostAuthor;
  type: "pitch_created" | "investment_made" | "custom";
  content: string;
  imageUrl?: string;
  linkedPitchId?: ILinkedPitch;
  commentCount: number;
  reactionCounts: Record<string, number>;
  userReaction?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  postId: string;
  authorId: IPostAuthor;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type ReactionType = "fire" | "lightbulb" | "rocket" | "question";

// ── Feed ──────────────────────────────────────────────────────────────────────
export const fetchFeed = async (token: string, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(API.POST.FEED, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch feed");
  }
};

export const fetchMyPosts = async (token: string, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(API.POST.MY, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch my posts");
  }
};

// ── Posts ─────────────────────────────────────────────────────────────────────
export const createPost = async (token: string, content: string, image?: File | null) => {
  try {
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);
    const response = await axiosInstance.post(API.POST.CREATE, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create post");
  }
};

export const updatePost = async (token: string, postId: string, content: string, image?: File | null, removeImage?: boolean) => {
  try {
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);
    if (removeImage) formData.append("removeImage", "true");
    const response = await axiosInstance.put(API.POST.UPDATE(postId), formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update post");
  }
};

export const deletePost = async (token: string, postId: string) => {
  try {
    const response = await axiosInstance.delete(API.POST.DELETE(postId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete post");
  }
};

// ── Comments ──────────────────────────────────────────────────────────────────
export const fetchComments = async (postId: string, page = 1, limit = 50) => {
  try {
    const response = await axiosInstance.get(API.POST.COMMENTS(postId), {
      params: { page, limit },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch comments");
  }
};

export const addComment = async (token: string, postId: string, content: string) => {
  try {
    const response = await axiosInstance.post(
      API.POST.COMMENTS(postId),
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to add comment");
  }
};

export const updateComment = async (token: string, commentId: string, content: string) => {
  try {
    const response = await axiosInstance.put(
      API.POST.COMMENT_UPDATE(commentId),
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update comment");
  }
};

export const deleteComment = async (token: string, commentId: string) => {
  try {
    const response = await axiosInstance.delete(API.POST.COMMENT_DELETE(commentId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete comment");
  }
};

// ── Reactions ─────────────────────────────────────────────────────────────────
export const addReaction = async (token: string, postId: string, type: ReactionType) => {
  try {
    const response = await axiosInstance.post(
      API.POST.REACTIONS(postId),
      { type },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to add reaction");
  }
};

export const removeReaction = async (token: string, postId: string) => {
  try {
    const response = await axiosInstance.delete(API.POST.REACTIONS(postId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to remove reaction");
  }
};
