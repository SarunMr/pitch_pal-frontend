import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const createReport = async (token: string, targetType: "pitch" | "comment", targetId: string, reason: string) => {
  try {
    const response = await axiosInstance.post(
      API.REPORTS.CREATE,
      { targetType, targetId, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to submit report");
  }
};
