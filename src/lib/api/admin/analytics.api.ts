import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const getAnalyticsOverview = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.ANALYTICS_OVERVIEW, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch overview");
  }
};

export const getUserAnalytics = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.ANALYTICS_USERS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch user analytics");
  }
};

export const getPitchAnalytics = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.ANALYTICS_PITCHES, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch pitch analytics");
  }
};

export const getInvestmentAnalytics = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.ANALYTICS_INVESTMENTS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch investment analytics");
  }
};
