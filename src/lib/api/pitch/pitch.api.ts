import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export interface PitchQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  industry?: string;
  fundingStage?: string;
  status?: string;
  minFundingGoal?: string;
  maxFundingGoal?: string;
  entrepreneurId?: string;
}

// ── PUBLIC ────────────────────────────────────────────────────────────────────
export const fetchPublicPitches = async (params?: PitchQueryParams) => {
  try {
    const response = await axiosInstance.get(API.PITCH.PUBLIC, { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch pitches");
  }
};

export const fetchPitchById = async (id: string, token?: string) => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axiosInstance.get(API.PITCH.BY_ID(id), { headers });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch pitch");
  }
};

export const fetchPitchTiers = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.PITCH.TIERS(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch tiers");
  }
};

export const fetchPitchMilestones = async (id: string) => {
  try {
    const response = await axiosInstance.get(API.PITCH.MILESTONES(id));
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch milestones");
  }
};

// ── ENTREPRENEUR ──────────────────────────────────────────────────────────────
export const createPitch = async (data: FormData, token: string) => {
  try {
    const response = await axiosInstance.post(API.PITCH.CREATE, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create pitch");
  }
};

export const fetchMyPitches = async (params: { page?: number; limit?: number }, token: string) => {
  try {
    const response = await axiosInstance.get(API.PITCH.MY, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch your pitches");
  }
};

export const updatePitch = async (id: string, data: FormData, token: string) => {
  try {
    const response = await axiosInstance.patch(API.PITCH.UPDATE(id), data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update pitch");
  }
};

export const deletePitch = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(API.PITCH.DELETE(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete pitch");
  }
};

export const submitPitch = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.patch(API.PITCH.SUBMIT(id), {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to submit pitch");
  }
};

export const addTiers = async (id: string, data: any, token: string) => {
  try {
    const response = await axiosInstance.post(API.PITCH.TIERS(id), data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to add tiers");
  }
};

export const uploadPitchVideo = async (id: string, data: FormData, token: string) => {
  try {
    const response = await axiosInstance.post(API.PITCH.VIDEO(id), data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to upload video");
  }
};

export const addMilestone = async (id: string, data: FormData, token: string) => {
  try {
    const response = await axiosInstance.post(API.PITCH.MILESTONES(id), data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to add milestone");
  }
};

export const requestEditAccess = async (id: string, reason: string, token: string) => {
  try {
    const response = await axiosInstance.patch(API.PITCH.REQUEST_EDIT(id), { reason }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to request edit access");
  }
};

// ── ADMIN ──────────────────────────────────────────────────────────────────────
export const fetchAdminQueue = async (params: PitchQueryParams, token: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.PITCHES, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch admin queue");
  }
};

export const adminReviewPitch = async (id: string, data: { action: string; reviewNote?: string }, token: string) => {
  try {
    // Backend expects `reason` for reject and `notes` for request_changes
    const payload: Record<string, string> = { action: data.action };
    if (data.action === "reject" && data.reviewNote) {
      payload.reason = data.reviewNote;
    } else if (data.action === "request_changes" && data.reviewNote) {
      payload.notes = data.reviewNote;
    }
    const response = await axiosInstance.patch(API.ADMIN.PITCH_STATUS(id), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to review pitch");
  }
};

export const adminHandleEditRequest = async (id: string, data: { approve: boolean }, token: string) => {
  try {
    const payload = { decision: data.approve ? "approve" : "deny" };
    const response = await axiosInstance.patch(API.ADMIN.PITCH_EDIT_REQUEST(id), payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to handle edit request");
  }
};
