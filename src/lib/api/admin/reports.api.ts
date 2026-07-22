import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const getReports = async (token: string, status?: string, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.REPORTS, {
      params: { status, page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch reports");
  }
};

export const resolveReport = async (token: string, id: string, status: "resolved" | "dismissed", note?: string) => {
  try {
    const response = await axiosInstance.patch(
      API.ADMIN.RESOLVE_REPORT(id),
      { status, note },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to resolve report");
  }
};
