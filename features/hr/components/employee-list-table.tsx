"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Calendar,
  Building2,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import type { Employee, EmployeeStatus } from "../types/hr.types";
import { deleteEmployee } from "../services/hr.service";
import { toast } from "sonner";

interface EmployeeListTableProps {
  employees: Employee[];
  onRefresh: () => void;
  onOpenCreate: () => void;
  onOpenEdit: (emp: Employee) => void;
  onOpenDetails: (emp: Employee) => void;
}

export function EmployeeListTable({
  employees,
  onRefresh,
  onOpenCreate,
  onOpenEdit,
  onOpenDetails,
}: EmployeeListTableProps) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");

  const filtered = employees.filter((e) => {
    const s = search.toLowerCase();
    const matchesSearch =
      e.name.toLowerCase().includes(s) ||
      e.department.toLowerCase().includes(s) ||
      e.designation.toLowerCase().includes(s) ||
      e.employee_id.toLowerCase().includes(s);
    const matchesDept = deptFilter === "all" || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const handleDelete = async (id: string, name: string) => {
    await deleteEmployee(id);
    toast.success(`Employee ${name} deleted`);
    onRefresh();
  };

  const getStatusBadge = (status: EmployeeStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold">Active</Badge>;
      case "on_leave":
        return <Badge variant="outline" className="text-amber-600">On Leave</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Table Header Actions */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, ID, title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 text-sm rounded-xl"
              />
            </div>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Cloud Operations">Cloud Operations</option>
              <option value="UI/UX Design">UI/UX Design</option>
            </select>
          </div>

          <Button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Onboard Employee
          </Button>
        </div>

        {/* Employees Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee ID & Name</th>
                <th className="px-6 py-4 font-semibold">Department & Title</th>
                <th className="px-6 py-4 font-semibold">Email & Phone</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Annual Salary</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No employee profiles found.
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {emp.profile_photo ? (
                          <img
                            src={emp.profile_photo}
                            alt={emp.name}
                            className="h-9 w-9 rounded-xl object-cover border border-slate-200"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 font-bold text-xs flex items-center justify-center">
                            {emp.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {emp.name}
                          </div>
                          <div className="text-xs text-slate-400 font-mono">
                            {emp.employee_id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {emp.department}
                      </div>
                      <div className="text-xs text-slate-400">{emp.designation}</div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="font-medium text-slate-700 dark:text-slate-300">
                        {emp.email}
                      </div>
                      <div className="text-slate-400">{emp.phone || "N/A"}</div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(emp.status)}</td>

                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 text-right">
                      {formatCurrency(emp.salary)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenDetails(emp)}
                          className="h-8 w-8 text-slate-500 hover:text-blue-600"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenEdit(emp)}
                          className="h-8 w-8 text-slate-500 hover:text-amber-600"
                          title="Edit Profile"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(emp.id, emp.name)}
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          title="Delete Employee"
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
