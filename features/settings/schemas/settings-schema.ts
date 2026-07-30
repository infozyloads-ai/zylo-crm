import { z } from "zod";

export const orgSettingsSchema = z.object({
  company_name: z.string().trim().min(1, "Company name is required"),
  logo_url: z.string().trim().optional(),
  favicon_url: z.string().trim().optional(),
  business_email: z
    .string()
    .trim()
    .min(1, "Business email is required")
    .email("Please enter a valid email"),
  phone: z.string().trim().optional(),
  website: z.string().trim().optional(),
  address: z.string().trim().optional(),
  tax_number: z.string().trim().optional(),
  currency: z.string().min(1, "Currency selection is required"),
  timezone: z.string().min(1, "Timezone selection is required"),
  language: z.string().min(1, "Language is required"),
  date_format: z.string().min(1, "Date format is required"),
});

export type OrgSettingsFormData = z.infer<typeof orgSettingsSchema>;

export const profileSettingsSchema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
  phone: z.string().trim().optional(),
  profile_photo: z.string().trim().optional(),
  two_factor_enabled: z.boolean(),
});

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;

export const passwordChangeSchema = z
  .object({
    current_password: z.string().min(6, "Current password must be at least 6 characters"),
    new_password: z.string().min(6, "New password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Please confirm your new password"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "New passwords do not match",
    path: ["confirm_password"],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

export const appSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  sidebar_collapsed: z.boolean(),
  default_dashboard: z.string(),
  email_notifications: z.boolean(),
  desktop_notifications: z.boolean(),
});

export type AppSettingsFormData = z.infer<typeof appSettingsSchema>;

export const smtpSettingsSchema = z.object({
  host: z.string().trim().min(1, "SMTP host is required"),
  port: z.number().min(1, "Port is required"),
  username: z.string().trim().min(1, "SMTP username is required"),
  password: z.string().optional(),
  security: z.enum(["SSL", "TLS", "None"]),
  sender_email: z.string().trim().email("Valid sender email required"),
  sender_name: z.string().trim().min(1, "Sender name required"),
});

export type SmtpSettingsFormData = z.infer<typeof smtpSettingsSchema>;
