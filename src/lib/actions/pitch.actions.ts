"use server";

import { revalidatePath } from "next/cache";
import { getTokenCookie } from "../cookie";
import {
  fetchPublicPitches,
  fetchPitchById,
  fetchPitchTiers,
  fetchPitchMilestones,
  createPitch,
  fetchMyPitches,
  updatePitch,
  deletePitch,
  submitPitch,
  requestEditAccess,
  addTiers,
  uploadPitchVideo,
  addMilestone,
  fetchAdminQueue,
  adminReviewPitch,
  adminHandleEditRequest,
  PitchQueryParams,
  generateAIScore,
  getAIScore,
  invest,
  getPortfolio,
  getPortfolioById,
  getPitchInvestors,
  getRecentInvestors,
} from "../api/pitch/pitch.api";

// ── PUBLIC ACTIONS ────────────────────────────────────────────────────────────

export const fetchPublicPitchesAction = async (params?: PitchQueryParams) => {
  try {
    const result = await fetchPublicPitches(params);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch pitches", data: null };
  }
};

export const fetchPitchByIdAction = async (id: string) => {
  try {
    const token = await getTokenCookie(); // optional for public
    const result = await fetchPitchById(id, token || undefined);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch pitch", data: null };
  }
};

export const fetchPitchTiersAction = async (id: string) => {
  try {
    const result = await fetchPitchTiers(id);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch tiers", data: null };
  }
};

export const fetchPitchMilestonesAction = async (id: string) => {
  try {
    const result = await fetchPitchMilestones(id);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch milestones", data: null };
  }
};

// ── ENTREPRENEUR ACTIONS ──────────────────────────────────────────────────────

export const createPitchAction = async (formData: FormData) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await createPitch(formData, token);
    revalidatePath("/entrepreneur/pitches");
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to create pitch" };
  }
};

export const fetchMyPitchesAction = async (params: { page?: number; limit?: number }) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized", data: null };
    const result = await fetchMyPitches(params, token);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch your pitches", data: null };
  }
};

export const updatePitchAction = async (id: string, formData: FormData) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await updatePitch(id, formData, token);
    revalidatePath("/entrepreneur/pitches");
    revalidatePath(`/entrepreneur/pitches/${id}`);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to update pitch" };
  }
};

export const deletePitchAction = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await deletePitch(id, token);
    revalidatePath("/entrepreneur/pitches");
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to delete pitch" };
  }
};



export const submitPitchAction = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await submitPitch(id, token);
    revalidatePath("/entrepreneur/pitches");
    revalidatePath(`/entrepreneur/pitches/${id}`);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to submit pitch" };
  }
};

export const addTiersAction = async (id: string, data: any) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await addTiers(id, data, token);
    revalidatePath(`/entrepreneur/pitches/${id}`);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to add tiers" };
  }
};

export const uploadPitchVideoAction = async (id: string, formData: FormData) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await uploadPitchVideo(id, formData, token);
    revalidatePath(`/entrepreneur/pitches/${id}`);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to upload video" };
  }
};

export const addMilestoneAction = async (id: string, formData: FormData) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await addMilestone(id, formData, token);
    revalidatePath(`/entrepreneur/pitches/${id}`);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to add milestone" };
  }
};

export const requestEditAccessAction = async (id: string, reason: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await requestEditAccess(id, reason, token);
    revalidatePath(`/entrepreneur/pitches/${id}`);
    revalidatePath("/entrepreneur/pitches");
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to request edit access" };
  }
};

// ── ADMIN ACTIONS ─────────────────────────────────────────────────────────────

export const fetchAdminQueueAction = async (params: PitchQueryParams) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized", data: null };
    const result = await fetchAdminQueue(params, token);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch admin queue", data: null };
  }
};

export const adminReviewPitchAction = async (id: string, data: { action: string; reviewNote?: string }) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await adminReviewPitch(id, data, token);
    revalidatePath("/admin/pitches");
    revalidatePath(`/admin/pitches/${id}`);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to review pitch" };
  }
};

export const adminHandleEditRequestAction = async (id: string, data: { approve: boolean }) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await adminHandleEditRequest(id, data, token);
    revalidatePath("/admin/pitches");
    revalidatePath(`/admin/pitches/${id}`);
    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to handle edit request" };
  }
};

// ── PHASE 4 & 5 (AI Score & Investment) ACTIONS ───────────────────────────────

export const generateAIScoreAction = async (pitchId: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await generateAIScore(pitchId, token);
    revalidatePath(`/entrepreneur/pitches/${pitchId}`);
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to generate AI score" };
  }
};

export const getAIScoreAction = async (pitchId: string) => {
  try {
    const result = await getAIScore(pitchId);
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch AI score" };
  }
};

export const investAction = async (pitchId: string, amount: number, tierType: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await invest(pitchId, amount, tierType, token);
    revalidatePath(`/investor/pitches/${pitchId}`);
    revalidatePath('/investor/portfolio');
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to process investment" };
  }
};

export const getPortfolioAction = async (page: number = 1, limit: number = 10) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized", data: null };
    const result = await getPortfolio(page, limit, token);
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch portfolio", data: null };
  }
};

export const getPortfolioByIdAction = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };
    const result = await getPortfolioById(id, token);
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch investment" };
  }
};

export const getPitchInvestorsAction = async (pitchId: string, page: number = 1) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized", data: null };
    const result = await getPitchInvestors(pitchId, page, token);
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch pitch investors", data: null };
  }
};

export const getRecentInvestorsAction = async (pitchId: string) => {
  try {
    const result = await getRecentInvestors(pitchId);
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch recent investors", data: null };
  }
};


