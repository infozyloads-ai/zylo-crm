export type NotificationType =
  | "new_lead"
  | "lead_assigned"
  | "lead_status_updated"
  | "client_added"
  | "project_assigned"
  | "task_assigned"
  | "task_due_reminder"
  | "invoice_created"
  | "payment_received"
  | "expense_added"
  | "leave_request"
  | "leave_approved"
  | "attendance_alert"
  | "system_alert";

export type NotificationCategory =
  | "all"
  | "unread"
  | "leads"
  | "projects"
  | "tasks"
  | "finance"
  | "hr"
  | "system";

export interface NotificationItem {
  id: string;
  user_id?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  link_url?: string | null;
  read: boolean;
  created_at: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  email_notifications: boolean;
  browser_notifications: boolean;
  lead_alerts: boolean;
  project_alerts: boolean;
  finance_alerts: boolean;
  hr_alerts: boolean;
}
