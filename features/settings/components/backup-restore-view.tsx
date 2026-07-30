"use client";

import { useState } from "react";
import { Database, Download, Upload, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  downloadDatabaseBackup,
  exportSettingsJson,
  importSettingsJson,
} from "../services/settings.service";
import { toast } from "sonner";

export function BackupRestoreView() {
  const [importing, setImporting] = useState(false);

  const handleDownloadBackup = () => {
    downloadDatabaseBackup();
    toast.success("Database JSON snapshot created and downloaded");
  };

  const handleExportSettings = () => {
    exportSettingsJson();
    toast.success("Settings exported to JSON file");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const res = await importSettingsJson(content);
      setImporting(false);

      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Database Backup Section */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Database Backup & Snapshots
          </CardTitle>
          <CardDescription>
            Download full Supabase database JSON snapshots containing all CRM records & configurations.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Live Database Connection Active
              </div>
              <p className="text-xs text-slate-500">
                Last automated snapshot: {new Date().toLocaleDateString()}
              </p>
            </div>

            <Button
              onClick={handleDownloadBackup}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shrink-0"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Database Backup JSON
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export & Import Settings Section */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-indigo-600" />
            System Configuration Export & Import
          </CardTitle>
          <CardDescription>
            Export current system configurations or restore settings from a JSON file.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Export Configuration JSON
              </h4>
              <p className="text-xs text-slate-500">
                Download organization details, SMTP settings, and application preferences as a JSON file.
              </p>
              <Button
                variant="outline"
                onClick={handleExportSettings}
                className="w-full rounded-xl"
              >
                <Download className="mr-2 h-4 w-4 text-slate-600" />
                Export Settings JSON
              </Button>
            </div>

            {/* Import */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Import & Restore Settings
              </h4>
              <p className="text-xs text-slate-500">
                Upload a valid configuration JSON file to restore system settings instantly.
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={importing}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button
                  variant="outline"
                  disabled={importing}
                  className="w-full rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {importing ? "Restoring..." : "Upload Settings JSON File"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
