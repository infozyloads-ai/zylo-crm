"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { userRoleAssignmentSchema, type UserRoleAssignmentFormData } from "../schemas/rbac-schema";
import { updateUserRole, toggleUserStatus } from "../services/rbac.service";
import type { RbacUser, RoleDefinition } from "../types/rbac.types";

interface UserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: RbacUser | null;
  roles: RoleDefinition[];
  onSuccess: () => void;
}

export function UserRoleDialog({
  open,
  onOpenChange,
  user,
  roles,
  onSuccess,
}: UserRoleDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserRoleAssignmentFormData>({
    resolver: zodResolver(userRoleAssignmentSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        user_id: user.id,
        role_id: user.role_id,
        status: user.status,
      });
    }
  }, [user, reset, open]);

  if (!user) return null;

  const onSubmit = async (data: UserRoleAssignmentFormData) => {
    await updateUserRole(user.id, data.role_id);
    await toggleUserStatus(user.id, data.status);

    toast.success(`Updated role and status for ${user.name}`);
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Assign Role & Account Status</DialogTitle>
          <DialogDescription>
            Change RBAC permissions role or account status for {user.name} ({user.email}).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role_id">Assigned System / Custom Role *</Label>
            <select
              id="role_id"
              className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isSubmitting}
              {...register("role_id")}
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Account Status</Label>
            <select
              id="status"
              className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isSubmitting}
              {...register("status")}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Assignment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
