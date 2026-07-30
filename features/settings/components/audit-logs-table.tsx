"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AuditLogEntry } from "../types/settings.types";
import { getAuditLogs } from "../services/settings.service";

export function AuditLogsTable() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const res = await getAuditLogs();
    if (res.success) setLogs(res.data);
  };

  const filtered = logs.filter((l) => {
    const s = search.toLowerCase();
    const matchesSearch =
      l.user_name.toLowerCase().includes(s) ||
      l.action.toLowerCase().includes(s) ||
      l.resource.toLowerCase().includes(s) ||
      l.ip_address.includes(s);
    const matchesSev = severityFilter === "all" || l.severity === severityFilter;
    return matchesSearch && matchesSev;
  });

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Table Header Filter & Search */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-blue-600" />
              Security Audit & Activity Logs
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive trace of user logins, database operations, and system events.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search action, user, IP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm rounded-xl"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-9 px-3 py-1 bg-background border border-input rounded-xl text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
            >
              <option value="all">All Severity</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Action Performed</th>
                <th className="px-6 py-4 font-semibold">Target Resource</th>
                <th className="px-6 py-4 font-semibold">IP Address</th>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
                <th className="px-6 py-4 font-semibold text-center">Severity</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No matching security audit log entries found.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                      {log.user_name}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 font-mono">
                      {log.resource}
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      {log.ip_address}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <Badge
                        variant={
                          log.severity === "info"
                            ? "secondary"
                            : log.severity === "warning"
                            ? "outline"
                            : "destructive"
                        }
                        className={
                          log.severity === "info"
                            ? "bg-blue-50 text-blue-700"
                            : log.severity === "warning"
                            ? "text-amber-600 border-amber-300"
                            : ""
                        }
                      >
                        {log.severity.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
