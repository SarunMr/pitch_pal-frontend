import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const getNotifications = async (token: string, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(API.NOTIFICATIONS.ALL, {
      params: { page, limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch notifications");
  }
};

export const markNotificationAsRead = async (token: string, id: string) => {
  try {
    const response = await axiosInstance.patch(API.NOTIFICATIONS.READ(id), {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to mark as read");
  }
};

export const markAllNotificationsAsRead = async (token: string) => {
  try {
    const response = await axiosInstance.patch(API.NOTIFICATIONS.READ_ALL, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to mark all as read");
  }
};

export const clearAllNotifications = async (token: string) => {
  try {
    const response = await axiosInstance.delete(API.NOTIFICATIONS.CLEAR_ALL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to clear notifications");
  }
};
