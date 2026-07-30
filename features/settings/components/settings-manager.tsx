"use client";

import { useState } from "react";
import {
  Building2,
  User,
  Sliders,
  Mail,
  Database,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SettingsTab } from "../types/settings.types";

import { OrgSettingsForm } from "./org-settings-form";
import { ProfileSettingsForm } from "./profile-settings-form";
import { AppSettingsForm } from "./app-settings-form";
import { EmailSettingsForm } from "./email-settings-form";
import { BackupRestoreView } from "./backup-restore-view";
import { AuditLogsTable } from "./audit-logs-table";

export function SettingsManager() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("organization");

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          System Settings & Preferences
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage company organization details, user profiles, theme preferences, SMTP, database backups, and security audit logs.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex flex-wrap items-center gap-1.5 border border-slate-200 dark:border-slate-800">
        <Button
          variant={activeTab === "organization" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("organization")}
          className="text-xs font-semibold rounded-xl"
        >
          <Building2 className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
          Organization
        </Button>

        <Button
          variant={activeTab === "profile" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("profile")}
          className="text-xs font-semibold rounded-xl"
        >
          <User className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
          Profile & Security
        </Button>

        <Button
          variant={activeTab === "application" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("application")}
          className="text-xs font-semibold rounded-xl"
        >
          <Sliders className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
          App Preferences
        </Button>

        <Button
          variant={activeTab === "email" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("email")}
          className="text-xs font-semibold rounded-xl"
        >
          <Mail className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
          SMTP & Templates
        </Button>

        <Button
          variant={activeTab === "backup" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("backup")}
          className="text-xs font-semibold rounded-xl"
        >
          <Database className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
          Backup & Restore
        </Button>

        <Button
          variant={activeTab === "audit" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("audit")}
          className="text-xs font-semibold rounded-xl"
        >
          <ShieldAlert className="h-3.5 w-3.5 mr-1.5 text-rose-600" />
          Audit Logs
        </Button>
      </div>

      {/* Tab Views */}
      {activeTab === "organization" && <OrgSettingsForm />}
      {activeTab === "profile" && <ProfileSettingsForm />}
      {activeTab === "application" && <AppSettingsForm />}
      {activeTab === "email" && <EmailSettingsForm />}
      {activeTab === "backup" && <BackupRestoreView />}
      {activeTab === "audit" && <AuditLogsTable />}
    </div>
  );
}
