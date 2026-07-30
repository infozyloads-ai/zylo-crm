"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Sliders, Sun, Moon, Monitor, Layout, Bell, Save, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { appSettingsSchema, type AppSettingsFormData } from "../schemas/settings-schema";
import { getApplicationSettings, updateApplicationSettings } from "../services/settings.service";

export function AppSettingsForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<AppSettingsFormData>({
    resolver: zodResolver(appSettingsSchema),
  });

  const theme = watch("theme") || "system";
  const sidebarCollapsed = watch("sidebar_collapsed") || false;
  const emailNotifs = watch("email_notifications") ?? true;
  const desktopNotifs = watch("desktop_notifications") ?? true;

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const res = await getApplicationSettings();
    if (res.success) reset(res.data);
  };

  const onSubmit = async (data: AppSettingsFormData) => {
    const res = await updateApplicationSettings(data);
    if (res.success) toast.success(res.message);
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Sliders className="h-5 w-5 text-indigo-600" />
          Application & Interface Preferences
        </CardTitle>
        <CardDescription>
          Customize theme appearance, navigation layout, default routes, and notification channels.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Theme Selector */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Theme Mode</Label>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <button
                type="button"
                onClick={() => setValue("theme", "light")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === "light"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 font-bold"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                }`}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setValue("theme", "dark")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === "dark"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 font-bold"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                }`}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs">Dark Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setValue("theme", "system")}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  theme === "system"
                    ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-600 font-bold"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50"
                }`}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-xs">System Auto</span>
              </button>
            </div>
          </div>

          {/* Default Landing Route & Sidebar Behavior */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="default_dashboard">Default Landing Page</Label>
              <select
                id="default_dashboard"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("default_dashboard")}
              >
                <option value="/dashboard">Main Dashboard Overview</option>
                <option value="/crm">CRM & Leads Pipeline</option>
                <option value="/projects">Projects Management</option>
                <option value="/tasks">Tasks & Kanban Board</option>
                <option value="/finance">Finance & Billing</option>
                <option value="/hr">HR & Team Directory</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="block">Sidebar Default State</Label>
              <div className="flex items-center gap-3 h-9">
                <input
                  type="checkbox"
                  id="sidebar_collapsed"
                  checked={sidebarCollapsed}
                  onChange={(e) => setValue("sidebar_collapsed", e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <Label htmlFor="sidebar_collapsed" className="text-xs font-medium cursor-pointer">
                  Start with sidebar collapsed
                </Label>
              </div>
            </div>
          </div>

          {/* Notification Toggles */}
          <div className="space-y-3 pt-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-blue-600" />
              Notification Subscriptions
            </Label>

            <div className="space-y-2 max-w-xl bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Email Notifications</div>
                  <div className="text-[11px] text-slate-400">Receive lead updates & project milestone emails</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setValue("email_notifications", e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2">
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Desktop Push Alerts</div>
                  <div className="text-[11px] text-slate-400">Browser toast alerts for task assignments</div>
                </div>
                <input
                  type="checkbox"
                  checked={desktopNotifs}
                  onChange={(e) => setValue("desktop_notifications", e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save App Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
