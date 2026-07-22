"use server";

import { getTokenCookie } from "../cookie";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
} from "../api/notifications/notification.api";
import {
  getAnalyticsOverview,
  getUserAnalytics,
  getPitchAnalytics,
  getInvestmentAnalytics,
} from "../api/admin/analytics.api";
import { getReports, resolveReport } from "../api/admin/reports.api";
import { getAuditLogs } from "../api/admin/audit-logs.api";
import { createReport } from "../api/reports/reports.api";

// ── Notifications ─────────────────────────────────────────────────────────────
export const getNotificationsAction = async (page = 1, limit = 10) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await getNotifications(token, page, limit);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch notifications", data: null };
  }
};

export const markNotificationAsReadAction = async (id: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await markNotificationAsRead(token, id);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to mark as read", data: null };
  }
};

export const markAllNotificationsAsReadAction = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await markAllNotificationsAsRead(token);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to mark all as read", data: null };
  }
};

export const clearAllNotificationsAction = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await clearAllNotifications(token);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to clear notifications", data: null };
  }
};

// ── Admin Analytics ───────────────────────────────────────────────────────────
export const getAnalyticsOverviewAction = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await getAnalyticsOverview(token);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed", data: null };
  }
};

export const getUserAnalyticsAction = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await getUserAnalytics(token);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed", data: null };
  }
};

export const getPitchAnalyticsAction = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await getPitchAnalytics(token);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed", data: null };
  }
};

export const getInvestmentAnalyticsAction = async () => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await getInvestmentAnalytics(token);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed", data: null };
  }
};

// ── Admin Reports ─────────────────────────────────────────────────────────────
export const getReportsAction = async (status?: string, page = 1, limit = 50) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await getReports(token, status, page, limit);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch reports", data: null };
  }
};

export const resolveReportAction = async (id: string, status: "resolved" | "dismissed", note?: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await resolveReport(token, id, status, note);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to resolve report", data: null };
  }
};

// ── Admin Audit Logs ──────────────────────────────────────────────────────────
export const getAuditLogsAction = async (page = 1, limit = 50) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await getAuditLogs(token, page, limit);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to fetch audit logs", data: null };
  }
};

// ── User Reports ──────────────────────────────────────────────────────────────
export const createReportAction = async (targetType: "pitch" | "comment", targetId: string, reason: string) => {
  try {
    const token = await getTokenCookie();
    if (!token) return { success: false, message: "Not authenticated", data: null };
    return await createReport(token, targetType, targetId, reason);
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to submit report", data: null };
  }
};
