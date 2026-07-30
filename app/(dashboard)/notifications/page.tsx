import { NotificationManager } from "@/features/notifications/components/notification-manager";

export const metadata = {
  title: "Notification Center | Zylo CRM",
  description: "Real-time activity alerts across leads, projects, tasks, invoices, attendance, and system events",
};

export default function NotificationsPage() {
  return <NotificationManager />;
}
