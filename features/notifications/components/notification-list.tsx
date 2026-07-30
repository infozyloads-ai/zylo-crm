"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Search,
  CheckCheck,
  Trash2,
  ExternalLink,
  UserPlus,
  Briefcase,
  ListTodo,
  DollarSign,
  Calendar,
  AlertTriangle,
  Info,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type {
  NotificationItem,
  NotificationCategory,
  NotificationType,
} from "../types/notification.types";
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../services/notification.service";
import { toast } from "sonner";

interface NotificationListProps {
  notifications: NotificationItem[];
  onRefresh: () => void;
  onOpenPreferences: () => void;
}

export function NotificationList({
  notifications,
  onRefresh,
  onOpenPreferences,
}: NotificationListProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<NotificationCategory>("all");

  const filtered = notifications.filter((n) => {
    const s = search.toLowerCase();
    const matchesSearch =
      n.title.toLowerCase().includes(s) || n.message.toLowerCase().includes(s);

    if (category === "unread") return matchesSearch && !n.read;
    if (category === "leads")
      return matchesSearch && (n.type.includes("lead") || n.type.includes("client"));
    if (category === "projects") return matchesSearch && n.type.includes("project");
    if (category === "tasks") return matchesSearch && n.type.includes("task");
    if (category === "finance")
      return (
        matchesSearch &&
        (n.type.includes("invoice") ||
          n.type.includes("payment") ||
          n.type.includes("expense"))
      );
    if (category === "hr")
      return (
        matchesSearch &&
        (n.type.includes("leave") || n.type.includes("attendance"))
      );
    if (category === "system") return matchesSearch && n.type.includes("system");

    return matchesSearch;
  });

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
    onRefresh();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.success("All notifications marked as read");
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    toast.success("Notification deleted");
    onRefresh();
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    toast.success("Notification center cleared");
    onRefresh();
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "new_lead":
      case "lead_assigned":
      case "lead_status_updated":
      case "client_added":
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
    <div className="space-y-6">
      {/* Category Tabs & Search Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto">
            <Button
              variant={category === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCategory("all")}
              className="text-xs font-semibold h-7 rounded-lg shrink-0"
            >
              All ({notifications.length})
            </Button>

            <Button
              variant={category === "unread" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCategory("unread")}
              className="text-xs font-semibold h-7 rounded-lg shrink-0"
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </Button>

            <Button
              variant={category === "leads" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCategory("leads")}
              className="text-xs font-semibold h-7 rounded-lg shrink-0"
            >
              Leads
            </Button>

            <Button
              variant={category === "projects" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCategory("projects")}
              className="text-xs font-semibold h-7 rounded-lg shrink-0"
            >
              Projects
            </Button>

            <Button
              variant={category === "finance" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setCategory("finance")}
              className="text-xs font-semibold h-7 rounded-lg shrink-0"
            >
              Finance
            </Button>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="h-8 text-xs rounded-xl"
          >
            <CheckCheck className="mr-1 h-3.5 w-3.5 text-blue-600" />
            Mark All Read
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="h-8 text-xs text-red-600 hover:bg-red-50 rounded-xl"
          >
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            Clear All
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenPreferences}
            className="h-8 text-xs rounded-xl"
            title="Notification preferences"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <Bell className="h-10 w-10 mx-auto mb-2 opacity-40" />
              No notifications match your current filter.
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                className={`p-4 sm:p-5 hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors flex items-start justify-between gap-4 ${
                  !notif.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <Badge variant="secondary" className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0">
                          NEW
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {notif.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>{new Date(notif.created_at).toLocaleString()}</span>
                      {notif.link_url && (
                        <Link
                          href={notif.link_url}
                          className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                        >
                          Open Resource <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!notif.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMarkRead(notif.id)}
                      className="h-8 w-8 text-slate-400 hover:text-blue-600"
                      title="Mark as read"
                    >
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(notif.id)}
                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
