"use client";

import { useState } from "react";
import { ShieldCheck, Lock, Save, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { RoleDefinition, CrmModule, CrmAction } from "../types/rbac.types";
import { togglePermission } from "../services/rbac.service";
import { toast } from "sonner";

interface PermissionMatrixTableProps {
  roles: RoleDefinition[];
  onRefresh: () => void;
}

const modulesList: { key: CrmModule; label: string; desc: string }[] = [
  { key: "dashboard", label: "Dashboard Overview", desc: "Main summary KPI cards & widgets" },
  { key: "crm", label: "Leads & Sales Pipeline", desc: "Leads pipeline, deal stages, lead activities" },
  { key: "clients", label: "Client Accounts", desc: "Client organization profiles & contacts" },
  { key: "projects", label: "Project Management", desc: "Project milestones, progress tracking, teams" },
  { key: "tasks", label: "Tasks & Kanban Board", desc: "Task assignments, checklists, calendar view" },
  { key: "finance", label: "Finance & Invoicing", desc: "Invoices, quotations, payment records, expenses" },
  { key: "hr", label: "HR & Team Directory", desc: "Employee onboarding, attendance check-ins, leaves, payroll" },
  { key: "reports", label: "Reports & Analytics", desc: "Executive charts, sales funnels, financial trends" },
  { key: "settings", label: "System Settings", desc: "Organization setup, SMTP config, database backup" },
];

const actionsList: { key: CrmAction; label: string }[] = [
  { key: "read", label: "Read" },
  { key: "create", label: "Create" },
  { key: "update", label: "Update" },
  { key: "delete", label: "Delete" },
  { key: "export", label: "Export" },
  { key: "approve", label: "Approve" },
];

export function PermissionMatrixTable({ roles, onRefresh }: PermissionMatrixTableProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || "role-super-admin");

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleToggle = async (module: CrmModule, action: CrmAction, currentVal: boolean) => {
    if (!activeRole) return;
    if (activeRole.name === "Super Admin") {
      toast.info("Super Admin permissions are permanently unlocked.");
      return;
    }

    await togglePermission(activeRole.id, module, action, !currentVal);
    toast.success(`Updated ${module.toUpperCase()} ${action.toUpperCase()} permission for ${activeRole.name}`);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Role Selection Bar */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              Role-Based Access Control (RBAC) Matrix Editor
            </h3>
            <p className="text-xs text-slate-500">
              Select a system role below to customize module-level Create, Read, Update, Delete, Export, and Approve permissions.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {roles.map((r) => (
              <Button
                key={r.id}
                variant={selectedRoleId === r.id ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedRoleId(r.id)}
                className={`text-xs font-semibold rounded-xl shrink-0 ${
                  selectedRoleId === r.id ? "bg-white dark:bg-slate-950 shadow-xs border" : ""
                }`}
              >
                {r.name}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Permission Grid Table */}
      {activeRole && (
        <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {activeRole.name} Permissions
                  </h3>
                  <Badge variant={activeRole.is_system ? "secondary" : "outline"} className={activeRole.is_system ? "bg-blue-50 text-blue-700 font-bold" : ""}>
                    {activeRole.is_system ? "System Role" : "Custom Role"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">{activeRole.description}</p>
              </div>

              {activeRole.name === "Super Admin" && (
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Full Unlocked Access
                </Badge>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4 font-semibold">CRM Application Module</th>
                    {actionsList.map((act) => (
                      <th key={act.key} className="px-4 py-4 font-semibold text-center uppercase">
                        {act.label}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {modulesList.map((mod) => (
                    <tr key={mod.key} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{mod.label}</div>
                        <div className="text-xs text-slate-400">{mod.desc}</div>
                      </td>

                      {actionsList.map((act) => {
                        const isGranted = activeRole.permissions?.[mod.key]?.[act.key] ?? false;

                        return (
                          <td key={act.key} className="px-4 py-4 text-center">
                            <input
                              type="checkbox"
                              checked={isGranted}
                              disabled={activeRole.name === "Super Admin"}
                              onChange={() => handleToggle(mod.key, act.key, isGranted)}
                              className="h-4 w-4 text-blue-600 rounded cursor-pointer disabled:cursor-not-allowed"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
