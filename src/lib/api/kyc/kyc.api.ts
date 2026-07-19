import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const submitKYC = async (formData: FormData, token: string) => {
  try {
    const response = await axiosInstance.post(API.AUTH.KYC_SUBMIT, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to submit KYC documents");
  }
};

export const getKYCStatus = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.AUTH.KYC_STATUS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch KYC status");
  }
};

export const getAdminKYCList = async (
  status: string = "pending",
  page: number = 1,
  limit: number = 10,
  token: string
) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.KYC_LIST, {
      params: { status, page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch KYC list");
  }
};

export const adminVerifyKYC = async (userId: string, token: string) => {
  try {
    const response = await axiosInstance.put(API.ADMIN.KYC_VERIFY(userId), {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to verify KYC");
  }
};

export const adminRejectKYC = async (userId: string, reason: string, token: string) => {
  try {
    const response = await axiosInstance.put(API.ADMIN.KYC_REJECT(userId), { reason }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to reject KYC");
  }
};
