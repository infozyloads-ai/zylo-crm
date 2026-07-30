"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  ExternalLink,
  UserPlus,
  Briefcase,
  ListTodo,
  DollarSign,
  Calendar,
  AlertTriangle,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { NotificationItem, NotificationType } from "../types/notification.types";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notification.service";
import { toast } from "sonner";

interface NotificationDropdownProps {
  onClose: () => void;
  onRefresh: () => void;
}

export function NotificationDropdown({ onClose, onRefresh }: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getNotifications();
    if (res.success) setNotifications(res.data.slice(0, 5));
    setLoading(false);
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    loadData();
    onRefresh();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.success("All notifications marked as read");
    loadData();
    onRefresh();
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "new_lead":
      case "lead_assigned":
      case "lead_status_updated":
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case "project_assigned":
        return <Briefcase className="h-4 w-4 text-indigo-600" />;
      case "task_assigned":
      case "task_due_reminder":
        return <ListTodo className="h-4 w-4 text-amber-600" />;
      case "invoice_created":
      case "payment_received":
      case "expense_added":
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case "leave_request":
      case "leave_approved":
      case "attendance_alert":
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case "system_alert":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden">
      {/* Popover Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-blue-600" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Recent Notifications
          </h4>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleMarkAllRead}
          className="text-xs text-blue-600 hover:bg-blue-50 h-7 rounded-lg"
        >
          <CheckCheck className="mr-1 h-3.5 w-3.5" />
          Mark all read
        </Button>
      </div>

      {/* Popover List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No recent notifications.</div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleMarkRead(notif.id)}
              className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 cursor-pointer ${
                !notif.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {notif.title}
                  </span>
                  {!notif.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {notif.message}
                </p>

                <span className="text-[10px] text-slate-400 block mt-1">
                  {new Date(notif.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Popover Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
        <Link
          href="/notifications"
          onClick={onClose}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1"
        >
          View All Notification Center <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
