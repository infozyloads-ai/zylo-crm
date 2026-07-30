"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getUnreadCount,
  subscribeToRealtimeNotifications,
} from "../services/notification.service";
import { NotificationDropdown } from "./notification-dropdown";

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);

  const fetchUnread = useCallback(async () => {
    const count = await getUnreadCount();
    setUnreadCount(count);
  }, []);

  useEffect(() => {
    fetchUnread();

    const unsubscribe = subscribeToRealtimeNotifications(() => {
      fetchUnread();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchUnread]);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpenDropdown(!openDropdown)}
        className="relative h-9 w-9 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        title="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 bg-red-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-background animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {openDropdown && (
        <NotificationDropdown
          onClose={() => setOpenDropdown(false)}
          onRefresh={fetchUnread}
        />
      )}
    </div>
  );
}
