import axiosInstance from "../axios-instance";
import { API } from "../endpoints";

export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export const fetchUsers = async (params: UserQueryParams, token: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.USERS, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch users");
  }
};

export const fetchUserById = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.get(API.ADMIN.USER_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch user");
  }
};

export const createUser = async (data: any, token: string) => {
  try {
    const response = await axiosInstance.post(API.ADMIN.USERS, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to create user");
  }
};

export const updateUser = async (id: string, data: any, token: string) => {
  try {
    const response = await axiosInstance.put(API.ADMIN.USER_BY_ID(id), data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to update user");
  }
};

export const deleteUser = async (id: string, token: string) => {
  try {
    const response = await axiosInstance.delete(API.ADMIN.USER_BY_ID(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to delete user");
  }
};
