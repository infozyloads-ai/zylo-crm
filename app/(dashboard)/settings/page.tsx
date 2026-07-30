import { SettingsManager } from "@/features/settings/components/settings-manager";

export const metadata = {
  title: "Settings & Preferences | Zylo CRM",
  description: "Manage organization details, profile settings, app preferences, SMTP, database backups, and security audit logs",
};

export default function SettingsPage() {
  return <SettingsManager />;
}
