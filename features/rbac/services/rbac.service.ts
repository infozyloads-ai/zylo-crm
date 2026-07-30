import { supabase } from "@/lib/supabase/client";
import type {
  RoleDefinition,
  RbacUser,
  RbacAuditLog,
  PermissionMatrix,
  CrmModule,
  CrmAction,
} from "../types/rbac.types";
import type { RoleFormData } from "../schemas/rbac-schema";

const createFullPermissions = (allTrue: boolean = true): PermissionMatrix => {
  const modules: CrmModule[] = [
    "dashboard",
    "crm",
    "clients",
    "projects",
    "tasks",
    "finance",
    "hr",
    "reports",
    "settings",
  ];
  const actions: CrmAction[] = ["create", "read", "update", "delete", "export", "approve"];

  const matrix = {} as PermissionMatrix;
  for (const m of modules) {
    matrix[m] = {} as Record<CrmAction, boolean>;
    for (const a of actions) {
      matrix[m][a] = allTrue;
    }
  }
  return matrix;
};

const superAdminPerms = createFullPermissions(true);

const adminPerms = createFullPermissions(true);
adminPerms.settings.delete = false; // Only Super Admin can purge settings

const managerPerms = createFullPermissions(true);
managerPerms.settings.delete = false;
managerPerms.finance.delete = false;

const salesExecPerms = createFullPermissions(false);
salesExecPerms.dashboard.read = true;
salesExecPerms.crm.create = true;
salesExecPerms.crm.read = true;
salesExecPerms.crm.update = true;
salesExecPerms.clients.read = true;
salesExecPerms.tasks.read = true;

const hrPerms = createFullPermissions(false);
hrPerms.dashboard.read = true;
hrPerms.hr.create = true;
hrPerms.hr.read = true;
hrPerms.hr.update = true;
hrPerms.hr.approve = true;
hrPerms.hr.export = true;

const financePerms = createFullPermissions(false);
financePerms.dashboard.read = true;
financePerms.finance.create = true;
financePerms.finance.read = true;
financePerms.finance.update = true;
financePerms.finance.export = true;
financePerms.finance.approve = true;

const employeePerms = createFullPermissions(false);
employeePerms.dashboard.read = true;
employeePerms.tasks.read = true;
employeePerms.tasks.update = true;
employeePerms.projects.read = true;

const mockRoles: RoleDefinition[] = [
  {
    id: "role-super-admin",
    name: "Super Admin",
    is_system: true,
    description: "Full unconstrained administrative privileges across all CRM modules and database settings.",
    permissions: superAdminPerms,
    user_count: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "role-admin",
    name: "Admin",
    is_system: true,
    description: "Full management privileges for leads, projects, tasks, clients, finance, and team settings.",
    permissions: adminPerms,
    user_count: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "role-manager",
    name: "Manager",
    is_system: true,
    description: "Oversees team projects, tasks, approvals, and performance reports.",
    permissions: managerPerms,
    user_count: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: "role-sales",
    name: "Sales Executive",
    is_system: true,
    description: "Lead creation, sales pipeline management, and client account updates.",
    permissions: salesExecPerms,
    user_count: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: "role-hr",
    name: "HR Lead",
    is_system: true,
    description: "Employee onboarding, shift attendance tracker, leave approvals, and monthly payroll slips.",
    permissions: hrPerms,
    user_count: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "role-finance",
    name: "Finance Manager",
    is_system: true,
    description: "Invoice generation, payment recording, quotations, expense logging, and financial audits.",
    permissions: financePerms,
    user_count: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "role-employee",
    name: "Employee",
    is_system: true,
    description: "Task execution, project viewing, and shift attendance check-ins.",
    permissions: employeePerms,
    user_count: 12,
    created_at: new Date().toISOString(),
  },
];

const mockUsers: RbacUser[] = [
  {
    id: "usr-1",
    name: "Admin Account",
    email: "admin@zylo.com",
    role_id: "role-super-admin",
    role_name: "Super Admin",
    status: "active",
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "usr-2",
    name: "Sarah Jenkins",
    email: "sarah@zylo.com",
    role_id: "role-manager",
    role_name: "Manager",
    status: "active",
    last_login: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "usr-3",
    name: "Marcus Brody",
    email: "marcus@zylo.com",
    role_id: "role-admin",
    role_name: "Admin",
    status: "active",
    last_login: new Date(Date.now() - 7200000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: "usr-4",
    name: "Chloe Bennett",
    email: "chloe@zylo.com",
    role_id: "role-sales",
    role_name: "Sales Executive",
    status: "active",
    last_login: new Date(Date.now() - 14400000).toISOString(),
    created_at: new Date().toISOString(),
  },
];

const mockAuditLogs: RbacAuditLog[] = [
  {
    id: "rb-log-1",
    user_name: "Super Admin",
    event_type: "permission_change",
    description: "Updated Finance module export permissions for Manager role.",
    timestamp: new Date().toISOString(),
  },
  {
    id: "rb-log-2",
    user_name: "Super Admin",
    event_type: "role_change",
    description: "Assigned role 'Manager' to user Sarah Jenkins.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

// ROLES & PERMISSIONS
export async function getRoles() {
  return { success: true, data: mockRoles };
}

export async function createRole(formData: RoleFormData) {
  const newRole: RoleDefinition = {
    id: `role-${Date.now()}`,
    name: formData.name,
    is_system: false,
    description: formData.description,
    permissions: createFullPermissions(false),
    user_count: 0,
    created_at: new Date().toISOString(),
  };

  mockRoles.push(newRole);
  await addRbacAuditLog("permission_change", `Created custom role '${newRole.name}'`);
  return { success: true, message: "Custom role created successfully", data: newRole };
}

export async function togglePermission(roleId: string, module: CrmModule, action: CrmAction, val: boolean) {
  const role = mockRoles.find((r) => r.id === roleId);
  if (role) {
    if (!role.permissions[module]) {
      role.permissions[module] = {} as Record<CrmAction, boolean>;
    }
    role.permissions[module][action] = val;
    await addRbacAuditLog("permission_change", `Updated ${module}:${action} permission for ${role.name}`);
  }
  return { success: true };
}

export async function deleteRole(roleId: string) {
  const idx = mockRoles.findIndex((r) => r.id === roleId);
  if (idx !== -1 && !mockRoles[idx].is_system) {
    mockRoles.splice(idx, 1);
    return { success: true, message: "Role deleted successfully" };
  }
  return { success: false, message: "System roles cannot be deleted" };
}

// USERS
export async function getRbacUsers() {
  return { success: true, data: mockUsers };
}

export async function updateUserRole(userId: string, roleId: string) {
  const user = mockUsers.find((u) => u.id === userId);
  const role = mockRoles.find((r) => r.id === roleId);
  if (user && role) {
    user.role_id = role.id;
    user.role_name = role.name;
    await addRbacAuditLog("role_change", `Assigned role '${role.name}' to user ${user.name}`);
    return { success: true, message: `Role updated to ${role.name}` };
  }
  return { success: false, message: "User or role not found" };
}

export async function toggleUserStatus(userId: string, status: "active" | "inactive" | "suspended") {
  const user = mockUsers.find((u) => u.id === userId);
  if (user) {
    user.status = status;
    await addRbacAuditLog("user_status", `User ${user.name} status updated to ${status.toUpperCase()}`);
    return { success: true, message: `User status set to ${status}` };
  }
  return { success: false, message: "User not found" };
}

export async function resetUserPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) return { success: false, message: error.message };
  return { success: true, message: `Password reset email sent to ${email}` };
}

// AUDIT LOGS
export async function getRbacAuditLogs() {
  return { success: true, data: mockAuditLogs };
}

export async function addRbacAuditLog(event_type: RbacAuditLog["event_type"], description: string) {
  const { data: authData } = await supabase.auth.getUser();
  const name = authData?.user?.email || "Super Admin";

  mockAuditLogs.unshift({
    id: `rb-log-${Date.now()}`,
    user_name: name,
    event_type,
    description,
    timestamp: new Date().toISOString(),
  });
}
