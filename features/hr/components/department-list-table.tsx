"use client";

import { Building2, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Department } from "../types/hr.types";
import { deleteDepartment } from "../services/hr.service";
import { toast } from "sonner";

interface DepartmentListTableProps {
  departments: Department[];
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export function DepartmentListTable({
  departments,
  onRefresh,
  onOpenCreate,
}: DepartmentListTableProps) {
  const handleDelete = async (id: string, name: string) => {
    await deleteDepartment(id);
    toast.success(`Department "${name}" deleted`);
    onRefresh();
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Company Departments
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Organize company teams, department leads, and staff distribution.
            </p>
          </div>

          <Button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Department Name</th>
                <th className="px-6 py-4 font-semibold">Department Lead / Manager</th>
                <th className="px-6 py-4 font-semibold">Scope & Description</th>
                <th className="px-6 py-4 font-semibold text-center">Team Members</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400">
                    <Building2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No departments created yet.
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                      {dept.name}
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {dept.manager_name}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 max-w-xs">
                      {dept.description || "No description listed."}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs">
                        <Users className="h-3.5 w-3.5" />
                        {dept.employee_count} Members
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(dept.id, dept.name)}
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          title="Delete Department"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
