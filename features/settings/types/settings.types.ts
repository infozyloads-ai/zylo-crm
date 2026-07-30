export type SettingsTab =
  | "organization"
  | "profile"
  | "application"
  | "email"
  | "backup"
  | "audit";

export interface OrganizationSettings {
  company_name: string;
  logo_url?: string;
  favicon_url?: string;
  business_email: string;
  phone?: string;
  website?: string;
  address?: string;
  tax_number?: string;
  currency: string;
  timezone: string;
  language: string;
  date_format: string;
}

export interface ProfileSettings {
  name: string;
  email: string;
  phone?: string;
  profile_photo?: string;
  two_factor_enabled: boolean;
}

export interface ApplicationSettings {
  theme: "light" | "dark" | "system";
  sidebar_collapsed: boolean;
  default_dashboard: string;
  email_notifications: boolean;
  desktop_notifications: boolean;
}

export interface SmtpSettings {
  host: string;
  port: number;
  username: string;
  password?: string;
  security: "SSL" | "TLS" | "None";
  sender_email: string;
  sender_name: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

export interface AuditLogEntry {
  id: string;
  user_name: string;
  action: string;
  resource: string;
  ip_address: string;
  timestamp: string;
  severity: "info" | "warning" | "error";
}
