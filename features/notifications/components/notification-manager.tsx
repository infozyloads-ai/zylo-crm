"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, RefreshCw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NotificationItem } from "../types/notification.types";
import {
  getNotifications,
  subscribeToRealtimeNotifications,
} from "../services/notification.service";
import { NotificationList } from "./notification-list";
import { NotificationPreferencesDialog } from "./notification-preferences-dialog";

export function NotificationManager() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [prefsOpen, setPrefsOpen] = useState(false);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    const res = await getNotifications();
    if (res.success) setNotifications(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadNotifications();

    const unsubscribe = subscribeToRealtimeNotifications((newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, [loadNotifications]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Notification Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time activity alerts across leads, projects, tasks, invoices, attendance, and system events.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={loadNotifications}
            className="rounded-xl"
            title="Refresh notifications"
          >
            <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            variant="outline"
            onClick={() => setPrefsOpen(true)}
            className="rounded-xl font-semibold text-xs"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4 text-blue-600" />
            Notification Preferences
          </Button>
        </div>
      </div>

      {/* Main List */}
      <NotificationList
        notifications={notifications}
        onRefresh={loadNotifications}
        onOpenPreferences={() => setPrefsOpen(true)}
      />

      {/* Preferences Modal */}
      <NotificationPreferencesDialog open={prefsOpen} onOpenChange={setPrefsOpen} />
    </div>
  );
}
