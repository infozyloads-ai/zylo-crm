import { RbacManager } from "@/features/rbac/components/rbac-manager";

export const metadata = {
  title: "Roles & Permissions (RBAC) | Zylo CRM",
  description: "Role-Based Access Control matrix, system roles, user assignments, and security audit logs",
};

export default function RolesPage() {
  return <RbacManager />;
}
