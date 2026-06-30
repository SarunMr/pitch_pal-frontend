"use server";

import { revalidatePath } from "next/cache";
import { getTokenCookie } from "../cookie";
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  UserQueryParams,
} from "../api/admin/users.api";

// ── GET /api/admin/users (paginated) ──────────────────────────────────────────
export const fetchUsersAction = async (params: UserQueryParams) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized", data: null };
    const result = await fetchUsers(params, token);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch users", data: null };
  }
};

// ── GET /api/admin/users/:id ───────────────────────────────────────────────────
export const fetchUserByIdAction = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized", data: null };
    const result = await fetchUserById(id, token);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch user", data: null };
  }
};

// ── POST /api/admin/users ──────────────────────────────────────────────────────
export const createUserAction = async (data: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await createUser(data, token);
    revalidatePath("/admin/users");
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create user" };
  }
};

// ── PUT /api/admin/users/:id ───────────────────────────────────────────────────
export const updateUserAction = async (id: string, data: Record<string, any>) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await updateUser(id, data, token);
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}/edit`);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update user" };
  }
};

// ── DELETE /api/admin/users/:id ────────────────────────────────────────────────
export const deleteUserAction = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await deleteUser(id, token);
    revalidatePath("/admin/users");
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete user" };
  }
};
