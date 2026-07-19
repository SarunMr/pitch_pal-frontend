"use server";

import { revalidatePath } from "next/cache";
import { getTokenCookie } from "../cookie";
import {
  getKYCStatus,
  getAdminKYCList,
  adminVerifyKYC,
  adminRejectKYC,
  submitKYC,
} from "../api/kyc/kyc.api";

// ── GET /api/auth/kyc/status ────────────────────────────────────────────────────
export const getKYCStatusAction = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized", data: null };
    const result = await getKYCStatus(token);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch KYC status", data: null };
  }
};

// ── POST /api/auth/kyc ──────────────────────────────────────────────────────────
export const submitKYCAction = async (formData: FormData) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await submitKYC(formData, token);
    revalidatePath("/kyc");
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to submit KYC documents" };
  }
};

// ── GET /api/admin/users/kyc ────────────────────────────────────────────────────
export const getAdminKYCListAction = async (
  status: string = "pending",
  page: number = 1,
  limit: number = 10
) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized", data: { users: [], total: 0, totalPages: 0 } };
    const result = await getAdminKYCList(status, page, limit, token);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch KYC list", data: { users: [], total: 0, totalPages: 0 } };
  }
};

// ── PUT /api/admin/users/kyc/:userId/verify ─────────────────────────────────────
export const adminVerifyKYCAction = async (userId: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await adminVerifyKYC(userId, token);
    revalidatePath("/admin/kyc");
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to verify KYC" };
  }
};

// ── PUT /api/admin/users/kyc/:userId/reject ─────────────────────────────────────
export const adminRejectKYCAction = async (userId: string, reason: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await adminRejectKYC(userId, reason, token);
    revalidatePath("/admin/kyc");
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to reject KYC" };
  }
};
