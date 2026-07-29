"use server";

import { getTokenCookie } from "../cookie";
import { revalidatePath } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function getPaymentCardAction() {
  const token = await getTokenCookie();
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/auth/payment-card`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function addPaymentCardAction(cardData: {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}) {
  const token = await getTokenCookie();
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/auth/payment-card`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardData),
    });
    const data = await res.json();
    revalidatePath("/payment");
    return data;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deletePaymentCardAction() {
  const token = await getTokenCookie();
  if (!token) return { success: false, message: "Unauthorized" };

  try {
    const res = await fetch(`${BASE_URL}/api/auth/payment-card`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    revalidatePath("/payment");
    return data;
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
