"use client";

import { Shield, Plus, Trash2, Users, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { RoleDefinition } from "../types/rbac.types";
import { deleteRole } from "../services/rbac.service";
import { toast } from "sonner";

interface RoleListTableProps {
  roles: RoleDefinition[];
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export function RoleListTable({ roles, onRefresh, onOpenCreate }: RoleListTableProps) {
  const handleDelete = async (role: RoleDefinition) => {
    const res = await deleteRole(role.id);
    if (res.success) {
      toast.success(res.message);
      onRefresh();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              System & Custom User Roles
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Super Admin, Admin, Manager, Sales Executive, HR, Finance, Employee, and Custom roles.
            </p>
          </div>

          <Button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Role
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Role Name</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Scope & Description</th>
                <th className="px-6 py-4 font-semibold text-center">Assigned Users</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {roles.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    {r.name}
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant={r.is_system ? "secondary" : "outline"} className={r.is_system ? "bg-blue-50 text-blue-700 font-bold" : ""}>
                      {r.is_system ? "System Built-in" : "Custom Role"}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-500 max-w-sm">
                    {r.description}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 font-semibold text-xs text-slate-700 dark:text-slate-300">
                      <Users className="h-3.5 w-3.5" />
                      {r.user_count} Users
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      {r.is_system ? (
                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Locked
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(r)}
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          title="Delete Custom Role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
