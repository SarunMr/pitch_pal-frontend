"use server";

import { login, register } from "@/lib/api/auth/auth.api";
import {
  RegisterFormValues,
  LoginFormValues,
} from "@/app/(auth)/_components/schema";
import { setTokenCookie, storeUserData } from "../cookie";

export const handleRegister = async (data: RegisterFormValues) => {
  try {
    const result = await register({ ...data, role: "investor" });
    // Backend returns { message, data } on success (no `success` field)
    if (result.data) {
      return { success: true, message: result.message, data: result.data };
    } else {
      return {
        success: false,
        message: result.message || "Registration failed",
      };
    }
  } catch (error: any) {
    return { success: false, message: error?.message || "Registration failed" };
  }
};

export const handleLogin = async (data: LoginFormValues) => {
  try {
    const result = await login(data);
    if (result.data) {
      const { token, ...user } = result.data;
      await setTokenCookie(token);
      await storeUserData(user);
      return { success: true, message: result.message, data: result.data };
    } else {
      return { success: false, message: result.message || "Login failed" };
    }
  } catch (error: any) {
    return { success: false, message: error?.message || "Login failed" };
  }
};
