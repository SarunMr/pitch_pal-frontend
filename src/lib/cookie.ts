"use server";

import { cookies } from "next/headers";

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({ name: "auth_token", value: token, path: "/", maxAge: 7 * 24 * 60 * 60, httpOnly: false });
}

export async function getTokenCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("auth_token")?.value || null;
}

export async function storeUserData(userData: any) {
  const cookieStore = await cookies();
  cookieStore.set({ name: "user_data", value: JSON.stringify(userData), path: "/", maxAge: 7 * 24 * 60 * 60 });
}

export async function getUserData() {
  const cookieStore = await cookies();
  const data = cookieStore.get("user_data")?.value;
  return data ? JSON.parse(data) : null;
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  cookieStore.delete("user_data");
}
