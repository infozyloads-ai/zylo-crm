import { supabase } from "@/lib/supabase/client";
import type {
  OrganizationSettings,
  ProfileSettings,
  ApplicationSettings,
  SmtpSettings,
  EmailTemplate,
  AuditLogEntry,
} from "../types/settings.types";
import type {
  OrgSettingsFormData,
  ProfileSettingsFormData,
  PasswordChangeFormData,
  AppSettingsFormData,
  SmtpSettingsFormData,
} from "../schemas/settings-schema";

let mockOrgSettings: OrganizationSettings = {
  company_name: "Zylo Enterprises Inc.",
  logo_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
  favicon_url: "/favicon.ico",
  business_email: "support@zylo.com",
  phone: "+1 (800) 555-0199",
  website: "https://zylo.com",
  address: "100 Innovation Way, Suite 400, San Francisco, CA 94105",
  tax_number: "US-987654321",
  currency: "USD ($)",
  timezone: "UTC-08:00 (Pacific Time)",
  language: "English (US)",
  date_format: "YYYY-MM-DD",
};

let mockProfileSettings: ProfileSettings = {
  name: "Admin User",
  email: "admin@zylo.com",
  phone: "+1 (555) 012-3456",
  profile_photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
  two_factor_enabled: true,
};

let mockAppSettings: ApplicationSettings = {
  theme: "system",
  sidebar_collapsed: false,
  default_dashboard: "/dashboard",
  email_notifications: true,
  desktop_notifications: true,
};

let mockSmtpSettings: SmtpSettings = {
  host: "smtp.sendgrid.net",
  port: 587,
  username: "apikey",
  security: "TLS",
  sender_email: "notifications@zylo.com",
  sender_name: "Zylo CRM Notifications",
};

const mockTemplates: EmailTemplate[] = [
  {
    id: "tpl-1",
    name: "Lead Welcome Email",
    subject: "Welcome to Zylo CRM - We're Excited to Connect!",
    body: "Hi {{contact_name}},\n\nThank you for reaching out to {{company_name}}. Our team will get back to you shortly.",
  },
  {
    id: "tpl-2",
    name: "Invoice Payment Due Notice",
    subject: "Invoice #{{invoice_number}} Payment Reminder",
    body: "Dear {{client_name}},\n\nThis is a friendly reminder that Invoice #{{invoice_number}} of ${{amount}} is due on {{due_date}}.",
  },
];

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: "log-1",
    user_name: "Admin User",
    action: "Updated Organization Profile",
    resource: "Settings > Organization",
    ip_address: "192.168.1.45",
    timestamp: new Date().toISOString(),
    severity: "info",
  },
  {
    id: "log-2",
    user_name: "Sarah Jenkins",
    action: "Checked in for Shift",
    resource: "HR > Attendance",
    ip_address: "192.168.1.102",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: "info",
  },
  {
    id: "log-3",
    user_name: "System Security",
    action: "Supabase RLS Policy Evaluation",
    resource: "Database > RLS",
    ip_address: "127.0.0.1",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    severity: "info",
  },
];

// ORGANIZATION
export async function getOrganizationSettings() {
  return { success: true, data: mockOrgSettings };
}

export async function updateOrganizationSettings(formData: OrgSettingsFormData) {
  mockOrgSettings = { ...mockOrgSettings, ...formData };
  return { success: true, message: "Organization settings saved successfully", data: mockOrgSettings };
}

// PROFILE
export async function getProfileSettings() {
  const { data: authData } = await supabase.auth.getUser();
  if (authData?.user?.email) {
    mockProfileSettings.email = authData.user.email;
  }
  return { success: true, data: mockProfileSettings };
}

export async function updateProfileSettings(formData: ProfileSettingsFormData) {
  mockProfileSettings = { ...mockProfileSettings, ...formData };
  return { success: true, message: "Profile settings updated successfully", data: mockProfileSettings };
}

export async function changeUserPassword(formData: PasswordChangeFormData) {
  const { error } = await supabase.auth.updateUser({ password: formData.new_password });
  if (error) {
    return { success: false, message: error.message };
  }
  return { success: true, message: "Password updated successfully" };
}

// APPLICATION
export async function getApplicationSettings() {
  return { success: true, data: mockAppSettings };
}

export async function updateApplicationSettings(formData: AppSettingsFormData) {
  mockAppSettings = { ...mockAppSettings, ...formData };
  return { success: true, message: "Application preferences saved", data: mockAppSettings };
}

// SMTP & EMAIL TEMPLATES
export async function getSmtpSettings() {
  return { success: true, data: mockSmtpSettings };
}

export async function updateSmtpSettings(formData: SmtpSettingsFormData) {
  mockSmtpSettings = { ...mockSmtpSettings, ...formData };
  return { success: true, message: "SMTP mail server configuration saved", data: mockSmtpSettings };
}

export async function sendTestEmail(targetEmail: string) {
  return { success: true, message: `Test email sent successfully to ${targetEmail}` };
}

export async function getEmailTemplates() {
  return { success: true, data: mockTemplates };
}

// BACKUP & RESTORE
export function downloadDatabaseBackup() {
  const backupObj = {
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    organization: mockOrgSettings,
    application: mockAppSettings,
    smtp: mockSmtpSettings,
    tables: ["leads", "clients", "projects", "tasks", "invoices", "employees"],
  };

  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonStr);
  link.setAttribute("download", `zylo-crm-db-backup-${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportSettingsJson() {
  const settingsObj = {
    organization: mockOrgSettings,
    profile: mockProfileSettings,
    application: mockAppSettings,
    smtp: mockSmtpSettings,
  };

  const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settingsObj, null, 2));
  const link = document.createElement("a");
  link.setAttribute("href", jsonStr);
  link.setAttribute("download", "zylo-settings-export.json");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function importSettingsJson(fileContent: string) {
  try {
    const parsed = JSON.parse(fileContent);
    if (parsed.organization) mockOrgSettings = { ...mockOrgSettings, ...parsed.organization };
    if (parsed.application) mockAppSettings = { ...mockAppSettings, ...parsed.application };
    return { success: true, message: "Settings restored from file successfully" };
  } catch {
    return { success: false, message: "Invalid JSON configuration file" };
  }
}

// AUDIT LOGS
export async function getAuditLogs() {
  return { success: true, data: mockAuditLogs };
}
