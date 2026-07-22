import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const getPublicUsers = async (token: string, params?: { page?: number; limit?: number; search?: string; role?: string }) => {
  const response = await axiosInstance.get(API.USER.ALL, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return response.data;
};

export const getPublicUserProfile = async (token: string, id: string) => {
  const response = await axiosInstance.get(API.USER.PROFILE(id), {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
