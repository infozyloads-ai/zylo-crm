"use client";

import { useState } from "react";
import { Users, Search, ShieldCheck, KeyRound, UserX, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { RbacUser, RoleDefinition } from "../types/rbac.types";
import { toggleUserStatus, resetUserPassword } from "../services/rbac.service";
import { toast } from "sonner";

interface UserListTableProps {
  users: RbacUser[];
  roles: RoleDefinition[];
  onRefresh: () => void;
  onOpenAssignRole: (u: RbacUser) => void;
}

export function UserListTable({
  users,
  roles,
  onRefresh,
  onOpenAssignRole,
}: UserListTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    const matchesRole = roleFilter === "all" || u.role_id === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = async (user: RbacUser) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    await toggleUserStatus(user.id, newStatus);
    toast.success(`User ${user.name} is now ${newStatus}`);
    onRefresh();
  };

  const handleResetPass = async (email: string) => {
    const res = await resetUserPassword(email);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              User Role & Account Management
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Assign roles, manage account status, and trigger security password resets.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search user name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm rounded-xl"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-9 px-3 py-1 bg-background border border-input rounded-xl text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring shrink-0"
            >
              <option value="all">All Roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Assigned Role</th>
                <th className="px-6 py-4 font-semibold">Account Status</th>
                <th className="px-6 py-4 font-semibold">Last Login</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                    <div>{u.name}</div>
                    <div className="text-xs text-slate-400 font-normal">{u.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-bold">
                      {u.role_name}
                    </Badge>
                  </td>

                  <td className="px-6 py-4">
                    <Badge
                      variant={u.status === "active" ? "secondary" : "destructive"}
                      className={u.status === "active" ? "bg-emerald-50 text-emerald-700 font-bold" : ""}
                    >
                      {u.status.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="px-6 py-4 text-xs text-slate-400">
                    {u.last_login ? new Date(u.last_login).toLocaleString() : "Never"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenAssignRole(u)}
                        className="h-8 text-xs rounded-xl"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1 text-blue-600" />
                        Assign Role
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleResetPass(u.email)}
                        className="h-8 w-8 text-slate-500 hover:text-amber-600"
                        title="Send Password Reset Email"
                      >
                        <KeyRound className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(u)}
                        className={`h-8 w-8 ${u.status === "active" ? "text-slate-500 hover:text-red-600" : "text-emerald-600"}`}
                        title={u.status === "active" ? "Deactivate User" : "Activate User"}
                      >
                        {u.status === "active" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                      </Button>
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
