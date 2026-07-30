"use client";

import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { RbacAuditLog } from "../types/rbac.types";
import { getRbacAuditLogs } from "../services/rbac.service";

export function RbacAuditLogsTable() {
  const [logs, setLogs] = useState<RbacAuditLog[]>([]);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    const res = await getRbacAuditLogs();
    if (res.success) setLogs(res.data);
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-blue-600" />
            RBAC Audit Trail
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit history of role assignments, permission matrix updates, and user status events.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">User / Author</th>
                <th className="px-6 py-4 font-semibold">Event Type</th>
                <th className="px-6 py-4 font-semibold">Event Description</th>
                <th className="px-6 py-4 font-semibold">Timestamp</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                    {log.user_name}
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-purple-50 text-purple-700 font-bold">
                      {log.event_type.replace("_", " ").toUpperCase()}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                    {log.description}
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
