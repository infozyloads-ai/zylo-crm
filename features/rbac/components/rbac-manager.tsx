"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Shield,
  Users,
  ShieldAlert,
  RefreshCw,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { RoleDefinition, RbacUser, RbacTab } from "../types/rbac.types";
import { getRoles, getRbacUsers } from "../services/rbac.service";

import { PermissionMatrixTable } from "./permission-matrix-table";
import { RoleListTable } from "./role-list-table";
import { RoleDialog } from "./role-dialog";
import { UserListTable } from "./user-list-table";
import { UserRoleDialog } from "./user-role-dialog";
import { RbacAuditLogsTable } from "./rbac-audit-logs-table";

export function RbacManager() {
  const [activeTab, setActiveTab] = useState<RbacTab>("matrix");
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [users, setUsers] = useState<RbacUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userRoleDialogOpen, setUserRoleDialogOpen] = useState(false);
  const [selectedUserForRole, setSelectedUserForRole] = useState<RbacUser | null>(null);

  const loadAllRbacData = useCallback(async () => {
    setLoading(true);
    const [rolesRes, usersRes] = await Promise.all([getRoles(), getRbacUsers()]);
    if (rolesRes.success) setRoles(rolesRes.data);
    if (usersRes.success) setUsers(usersRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAllRbacData();
  }, [loadAllRbacData]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            User Roles & Permissions (RBAC)
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure role permission matrices, assign system & custom roles, manage account access, and audit changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={loadAllRbacData}
            className="rounded-xl"
            title="Refresh RBAC policies"
          >
            <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            onClick={() => setRoleDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Custom Role
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex flex-wrap items-center gap-1.5 border border-slate-200 dark:border-slate-800">
        <Button
          variant={activeTab === "matrix" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("matrix")}
          className="text-xs font-semibold rounded-xl"
        >
          <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
          Permission Matrix
        </Button>

        <Button
          variant={activeTab === "roles" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("roles")}
          className="text-xs font-semibold rounded-xl"
        >
          <Shield className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
          System Roles ({roles.length})
        </Button>

        <Button
          variant={activeTab === "users" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("users")}
          className="text-xs font-semibold rounded-xl"
        >
          <Users className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
          User Assignments ({users.length})
        </Button>

        <Button
          variant={activeTab === "audit" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("audit")}
          className="text-xs font-semibold rounded-xl"
        >
          <ShieldAlert className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
          RBAC Audit Trail
        </Button>
      </div>

      {/* Tab Views */}
      {activeTab === "matrix" && (
        <PermissionMatrixTable roles={roles} onRefresh={loadAllRbacData} />
      )}

      {activeTab === "roles" && (
        <RoleListTable
          roles={roles}
          onRefresh={loadAllRbacData}
          onOpenCreate={() => setRoleDialogOpen(true)}
        />
      )}

      {activeTab === "users" && (
        <UserListTable
          users={users}
          roles={roles}
          onRefresh={loadAllRbacData}
          onOpenAssignRole={(u) => {
            setSelectedUserForRole(u);
            setUserRoleDialogOpen(true);
          }}
        />
      )}

      {activeTab === "audit" && <RbacAuditLogsTable />}

      {/* Modals */}
      <RoleDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        onSuccess={loadAllRbacData}
      />

      <UserRoleDialog
        open={userRoleDialogOpen}
        onOpenChange={setUserRoleDialogOpen}
        user={selectedUserForRole}
        roles={roles}
        onSuccess={loadAllRbacData}
      />
    </div>
  );
}
