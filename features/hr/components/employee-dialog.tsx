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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { employeeSchema, type EmployeeFormData } from "../schemas/hr-schema";
import { createEmployee, updateEmployee } from "../services/hr.service";
import type { Employee } from "../types/hr.types";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeToEdit?: Employee | null;
  onSuccess: () => void;
}

export function EmployeeDialog({
  open,
  onOpenChange,
  employeeToEdit,
  onSuccess,
}: EmployeeDialogProps) {
  const isEditing = !!employeeToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employee_id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      department: "Engineering",
      designation: "Software Engineer",
      email: "",
      phone: "",
      address: "",
      joining_date: new Date().toISOString().split("T")[0],
      salary: 75000,
      status: "active",
      profile_photo: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (employeeToEdit) {
      reset({
        employee_id: employeeToEdit.employee_id,
        name: employeeToEdit.name,
        department: employeeToEdit.department,
        designation: employeeToEdit.designation,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone || "",
        address: employeeToEdit.address || "",
        joining_date: employeeToEdit.joining_date,
        salary: employeeToEdit.salary || 0,
        status: employeeToEdit.status,
        profile_photo: employeeToEdit.profile_photo || "",
        notes: employeeToEdit.notes || "",
      });
    } else {
      reset({
        employee_id: `EMP-${Math.floor(100 + Math.random() * 900)}`,
        name: "",
        department: "Engineering",
        designation: "Software Engineer",
        email: "",
        phone: "",
        address: "",
        joining_date: new Date().toISOString().split("T")[0],
        salary: 75000,
        status: "active",
        profile_photo: "",
        notes: "",
      });
    }
  }, [employeeToEdit, reset, open]);

  const onSubmit = async (data: EmployeeFormData) => {
    let res;
    if (isEditing && employeeToEdit) {
      res = await updateEmployee(employeeToEdit.id, data);
    } else {
      res = await createEmployee(data);
    }

    if (!res.success) {
      toast.error(isEditing ? "Failed to update employee" : "Failed to onboard employee", {
        description: res.message,
      });
      return;
    }

    toast.success(isEditing ? "Employee profile updated" : "New employee onboarded successfully");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Employee Profile" : "Onboard New Employee"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update employee department, compensation, and contact details."
              : "Register a new team member to your company HR directory."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Employee ID & Full Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee ID *</Label>
              <Input
                id="employee_id"
                disabled={isSubmitting}
                {...register("employee_id")}
              />
              {errors.employee_id && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.employee_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Sarah Jenkins"
                disabled={isSubmitting}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Department & Designation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="Engineering, Cloud Operations, UI/UX..."
                disabled={isSubmitting}
                {...register("department")}
              />
              {errors.department && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.department.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Job Title / Designation *</Label>
              <Input
                id="designation"
                placeholder="Senior Frontend Engineer"
                disabled={isSubmitting}
                {...register("designation")}
              />
              {errors.designation && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.designation.message}
                </p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="sarah@zylo.com"
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 234-5678"
                disabled={isSubmitting}
                {...register("phone")}
              />
            </div>
          </div>

          {/* Joining Date, Annual Salary & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="joining_date">Joining Date *</Label>
              <Input
                id="joining_date"
                type="date"
                disabled={isSubmitting}
                {...register("joining_date")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary (₹) *</Label>
              <Input
                id="salary"
                type="number"
                disabled={isSubmitting}
                {...register("salary", { valueAsNumber: true })}
              />
              {errors.salary && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.salary.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Employment Status</Label>
              <select
                id="status"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("status")}
              >
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Profile Photo URL & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profile_photo">Profile Photo URL</Label>
              <Input
                id="profile_photo"
                placeholder="https://..."
                disabled={isSubmitting}
                {...register("profile_photo")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address / Location</Label>
              <Input
                id="address"
                placeholder="City, State, Country"
                disabled={isSubmitting}
                {...register("address")}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">HR Notes & Qualifications</Label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Background notes, skills, team leads context..."
              className="w-full p-3 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isSubmitting}
              {...register("notes")}
            />
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
              ) : isEditing ? (
                "Update Employee"
              ) : (
                "Onboard Employee"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
