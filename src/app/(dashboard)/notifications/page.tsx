"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getNotificationsAction, markNotificationAsReadAction, markAllNotificationsAsReadAction } from "@/lib/actions/admin.actions";
import { Bell, CheckCheck } from "lucide-react";
import { useRouter } from "next/navigation";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US");
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotificationsAction(1, 50);
      if (res?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsReadAction();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date() })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleClick = async (notification: any) => {
    try {
      if (!notification.readAt) {
        await markNotificationAsReadAction(notification._id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, readAt: new Date() } : n))
        );
      }

      if (notification.type?.startsWith("pitch_") || notification.type === "investment_made") {
        router.push(`/pitches/${notification.refId}`);
      } else if (notification.type?.startsWith("post_")) {
        router.push(`/feed`);
      }
    } catch (err) {
      console.error("Failed to handle notification", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 text-sm text-[#1A6B4A] font-medium hover:underline"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg border shadow-sm divide-y">
        {loading ? (
          <div className="p-8 text-center text-gray-500 animate-pulse">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
            <p className="text-sm text-gray-500 mt-2">You have no notifications at the moment.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleClick(n)}
              className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                !n.readAt ? "bg-[#1A6B4A]/5 border-l-2 border-l-[#1A6B4A]" : ""
              }`}
            >
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${!n.readAt ? "bg-[#1A6B4A]" : "bg-transparent"}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm ${!n.readAt ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                    {n.title}
                  </p>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
