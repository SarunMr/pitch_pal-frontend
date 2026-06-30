"use server";

import { login, register, updateUser } from "@/lib/api/auth/auth.api";
import {
  RegisterFormValues,
  LoginFormValues,
} from "@/app/(auth)/_components/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { setTokenCookie, storeUserData, clearAuthCookies, getTokenCookie } from "../cookie";

export const handleRegister = async (data: RegisterFormValues) => {
  try {
    const { confirmPassword, ...registerData } = data;
    const result = await register({ ...registerData, role: "investor" });
    if (result.data) {
      // Auto login after register to get the auth token
      const loginResult = await login({ email: data.email, password: data.password });
      if (loginResult.data) {
        const { token, user } = loginResult.data;
        await setTokenCookie(token);
        await storeUserData(user);
        return { success: true, message: "Registration successful!" };
      } else {
        return { success: false, message: loginResult.message || "Auto-login failed" };
      }
    } else {
      return { success: false, message: result.message || "Registration failed" };
    }
  } catch (error: any) {
    return { success: false, message: error?.message || "Registration failed" };
  }
};

export const handleLogin = async (data: LoginFormValues) => {
  try {
    const result = await login(data);
    if (result.data) {
      const { token, user } = result.data;
      await setTokenCookie(token);
      await storeUserData(user);
      return { success: true, message: "Login successful!", data: user };
    } else {
      return { success: false, message: result.message || "Login failed" };
    }
  } catch (error: any) {
    return { success: false, message: error?.message || "Login failed" };
  }
};

export const handleUpdateUser = async (data: FormData) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Unauthorized" };

    const result = await updateUser(data, token);
    if (result.success) {
      // Update the cookie with fresh user data
      await storeUserData(result.data);
      // Revalidate the profile page so server components get fresh data
      revalidatePath("/profile");
      return { success: true, message: result.message, data: result.data };
    } else {
      return { success: false, message: result.message || "Update user failed" };
    }
  } catch (error: any) {
    return { success: false, message: error?.message || "Update user failed" };
  }
};

export const handleLogout = async () => {
  await clearAuthCookies();
  redirect("/login");
};
