"use server";

import { getTokenCookie } from "../cookie";
import { getPublicUsers, getPublicUserProfile } from "../api/user/user.api";

export const getPublicUsersAction = async (params?: { page?: number; limit?: number; search?: string; role?: string }) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await getPublicUsers(token, params);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch users", data: null };
  }
};

export const getPublicUserProfileAction = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await getPublicUserProfile(token, id);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch user profile", data: null };
  }
};
