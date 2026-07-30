import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().trim().min(1, "Role name is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export type RoleFormData = z.infer<typeof roleSchema>;

export const userRoleAssignmentSchema = z.object({
  user_id: z.string().min(1, "User selection is required"),
  role_id: z.string().min(1, "Role selection is required"),
  status: z.enum(["active", "inactive", "suspended"]),
});

export type UserRoleAssignmentFormData = z.infer<typeof userRoleAssignmentSchema>;
