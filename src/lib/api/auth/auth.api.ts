import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export const register = async (data: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.REGISTER, data);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Registration failed");
  }
};

export const login = async (data: any) => {
  try {
    const response = await axiosInstance.post(API.AUTH.LOGIN, data);
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Login failed");
  }
};

export const whoami = async (token: string) => {
  try {
    const response = await axiosInstance.get(API.AUTH.WHOAMI, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch user");
  }
};

export const updateUser = async (data: FormData, token: string) => {
  try {
    const response = await axiosInstance.put(API.AUTH.UPDATE_PROFILE, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: Error | any) {
    throw new Error(error?.response?.data?.message || "Update user failed");
  }
};
