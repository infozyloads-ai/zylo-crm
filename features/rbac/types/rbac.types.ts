export type CrmModule =
  | "dashboard"
  | "crm"
  | "clients"
  | "projects"
  | "tasks"
  | "finance"
  | "hr"
  | "reports"
  | "settings";

export type CrmAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "export"
  | "approve";

export type PermissionMatrix = Record<CrmModule, Record<CrmAction, boolean>>;

export type RbacTab = "matrix" | "roles" | "users" | "audit";

export interface RoleDefinition {
  id: string;
  name: string;
  is_system: boolean;
  description: string;
  permissions: PermissionMatrix;
  user_count: number;
  created_at: string;
}

export interface RbacUser {
  id: string;
  name: string;
  email: string;
  role_id: string;
  role_name: string;
  status: "active" | "inactive" | "suspended";
  last_login?: string | null;
  created_at: string;
}

export interface RbacAuditLog {
  id: string;
  user_name: string;
  event_type: "role_change" | "permission_change" | "user_login" | "user_status";
  description: string;
  timestamp: string;
}
