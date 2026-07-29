"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, X } from "lucide-react";
import { initSocketWithRetry } from "@/lib/socket";
import {
  getNotificationsAction,
  markNotificationAsReadAction,
  markAllNotificationsAsReadAction,
} from "@/lib/actions/admin.actions";
import { useRouter } from "next/navigation";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Initial fetch + socket
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const res = await getNotificationsAction(1, 10);
        if (res?.success) {
          setNotifications(res.data?.notifications || []);
          setUnreadCount(res.data?.unreadCount || 0);
        }
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchInitial();

    const cleanup = initSocketWithRetry((socket) => {
      socket.on("notification", (newNotification: any) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    });

    return () => {
      cleanup();
    };
  }, []);

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markAllNotificationsAsReadAction();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date() })));
    } catch (err) {
      console.error("Failed to mark all as read", err);
    }
  };

  const handleNotificationClick = async (notification: any) => {
    try {
      if (!notification.readAt) {
        await markNotificationAsReadAction(notification._id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n._id === notification._id ? { ...n, readAt: new Date() } : n))
        );
      }
      setOpen(false);
      if (notification.type?.startsWith("pitch_") || notification.type === "investment_made") {
        router.push(`/pitches/${notification.refId}`);
      } else if (notification.type?.startsWith("post_")) {
        router.push(`/feed`);
      }
    } catch (err) {
      console.error("Failed to handle notification click", err);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 text-gray-500 hover:text-[#1A6B4A] focus:outline-none transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white border-2 border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 flex flex-col max-h-[480px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
            <span className="font-semibold text-gray-900 text-sm">Notifications</span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1 text-xs text-[#1A6B4A] font-medium hover:underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 divide-y">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                    !n.readAt ? "bg-[#1A6B4A]/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      !n.readAt ? "bg-[#1A6B4A]" : "bg-transparent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <span
                        className={`text-sm leading-tight ${
                          !n.readAt ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                        }`}
                      >
                        {n.title}
                      </span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0 mt-0.5">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t shrink-0">
            <button
              className="w-full py-2.5 text-sm text-[#1A6B4A] font-medium hover:bg-gray-50 transition-colors"
              onClick={() => { setOpen(false); router.push("/notifications"); }}
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
