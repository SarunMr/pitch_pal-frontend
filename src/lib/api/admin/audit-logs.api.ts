import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const getAuditLogs = async (token: string, page = 1, limit = 20) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.AUDIT_LOGS, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch audit logs");
  }
};
