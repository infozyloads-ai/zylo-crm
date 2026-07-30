import { supabase } from "@/lib/supabase/client";
import type {
  NotificationItem,
  NotificationPreferences,
} from "../types/notification.types";

let mockNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    type: "new_lead",
    title: "New High-Value Lead Acquired",
    message: "Acme Enterprise Corp requested an enterprise demo for ₹4,50,000 project.",
    link_url: "/crm",
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "notif-2",
    type: "task_assigned",
    title: "Task Assigned to You",
    message: "Marcus Brody assigned 'Implement Auth Session Middleware' to you.",
    link_url: "/tasks",
    read: false,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "notif-3",
    type: "payment_received",
    title: "Payment Received - Invoice #INV-2026-001",
    message: "Razorpay settlement of ₹76,000 received for E-Commerce App Sprint.",
    link_url: "/finance",
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "notif-4",
    type: "leave_request",
    title: "Pending Leave Request",
    message: "Chloe Bennett submitted a 5-day Annual Leave request for review.",
    link_url: "/hr",
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "notif-5",
    type: "project_assigned",
    title: "Project Kickoff",
    message: "You were assigned to 'Brand Identity & Web Portal' development team.",
    link_url: "/projects",
    read: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

let mockPreferences: NotificationPreferences = {
  enabled: true,
  email_notifications: true,
  browser_notifications: true,
  lead_alerts: true,
  project_alerts: true,
  finance_alerts: true,
  hr_alerts: true,
};

// GET NOTIFICATIONS
export async function getNotifications() {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { success: true, data: mockNotifications };
    }

    return { success: true, data: data as NotificationItem[] };
  } catch {
    return { success: true, data: mockNotifications };
  }
}

export async function getUnreadCount(): Promise<number> {
  const res = await getNotifications();
  return res.data.filter((n) => !n.read).length;
}

// MARK AS READ / UNREAD
export async function markAsRead(id: string) {
  const item = mockNotifications.find((n) => n.id === id);
  if (item) item.read = true;
  return { success: true };
}

export async function markAllAsRead() {
  mockNotifications.forEach((n) => (n.read = true));
  return { success: true, message: "All notifications marked as read" };
}

// DELETE / CLEAR
export async function deleteNotification(id: string) {
  const idx = mockNotifications.findIndex((n) => n.id === id);
  if (idx !== -1) mockNotifications.splice(idx, 1);
  return { success: true, message: "Notification deleted" };
}

export async function clearAllNotifications() {
  mockNotifications = [];
  return { success: true, message: "All notifications cleared" };
}

// PREFERENCES
export async function getNotificationPreferences() {
  return { success: true, data: mockPreferences };
}

export async function updateNotificationPreferences(prefs: NotificationPreferences) {
  mockPreferences = { ...prefs };
  return { success: true, message: "Notification preferences updated", data: mockPreferences };
}

// SUPABASE REALTIME LISTENER
export function subscribeToRealtimeNotifications(onNewNotif: (notif: NotificationItem) => void) {
  const channel = supabase
    .channel("realtime-notifications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      (payload) => {
        if (payload.new) {
          onNewNotif(payload.new as NotificationItem);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
