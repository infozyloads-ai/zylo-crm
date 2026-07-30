"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Mail, Monitor, Save, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { NotificationPreferences } from "../types/notification.types";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "../services/notification.service";

interface NotificationPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationPreferencesDialog({
  open,
  onOpenChange,
}: NotificationPreferencesDialogProps) {
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    enabled: true,
    email_notifications: true,
    browser_notifications: true,
    lead_alerts: true,
    project_alerts: true,
    finance_alerts: true,
    hr_alerts: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      loadPrefs();
    }
  }, [open]);

  const loadPrefs = async () => {
    const res = await getNotificationPreferences();
    if (res.success) setPrefs(res.data);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateNotificationPreferences(prefs);
    setSaving(false);
    toast.success("Notification preferences saved");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Notification Preferences
          </DialogTitle>
          <DialogDescription>
            Control email subscriptions, push alerts, and category alerts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100">Enable Notification System</div>
              <div className="text-xs text-slate-400">Receive alerts across all modules</div>
            </div>
            <input
              type="checkbox"
              checked={prefs.enabled}
              onChange={(e) => setPrefs({ ...prefs, enabled: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded"
            />
          </div>

          {/* Delivery Channels */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Channels</Label>
            <div className="space-y-2 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-600" /> Email Notifications
                </span>
                <input
                  type="checkbox"
                  checked={prefs.email_notifications}
                  onChange={(e) => setPrefs({ ...prefs, email_notifications: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer pt-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-emerald-600" /> Browser Push Notifications
                </span>
                <input
                  type="checkbox"
                  checked={prefs.browser_notifications}
                  onChange={(e) => setPrefs({ ...prefs, browser_notifications: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Category Alerts */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Module Category Alerts</Label>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.lead_alerts}
                  onChange={(e) => setPrefs({ ...prefs, lead_alerts: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                Leads & Sales
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.project_alerts}
                  onChange={(e) => setPrefs({ ...prefs, project_alerts: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                Projects & Tasks
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.finance_alerts}
                  onChange={(e) => setPrefs({ ...prefs, finance_alerts: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                Finance & Invoices
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.hr_alerts}
                  onChange={(e) => setPrefs({ ...prefs, hr_alerts: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                HR & Attendance
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Preferences
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
