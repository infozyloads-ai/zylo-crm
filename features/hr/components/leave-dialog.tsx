"use client";

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
import { leaveSchema, type LeaveFormData } from "../schemas/hr-schema";
import { createLeaveRequest } from "../services/hr.service";
import type { Employee } from "../types/hr.types";

interface LeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onSuccess: () => void;
}

export function LeaveDialog({
  open,
  onOpenChange,
  employees,
  onSuccess,
}: LeaveDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      employee_id: employees[0]?.id || "emp-1",
      employee_name: employees[0]?.name || "Sarah Jenkins",
      leave_type: "annual",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 3 * 86400000).toISOString().split("T")[0],
      days_count: 3,
      reason: "",
    },
  });

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = employees.find((emp) => emp.id === e.target.value);
    if (selected) {
      setValue("employee_id", selected.id);
      setValue("employee_name", selected.name);
    }
  };

  const onSubmit = async (data: LeaveFormData) => {
    const res = await createLeaveRequest(data);

    if (!res.success) {
      toast.error("Failed to submit leave request", { description: res.message });
      return;
    }

    toast.success("Leave request submitted for approval");
    reset();
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Request Leave Application</DialogTitle>
          <DialogDescription>
            Submit an official leave request for manager and HR approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee_select">Employee *</Label>
            <select
              id="employee_select"
              onChange={handleEmployeeChange}
              className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isSubmitting}
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.department})
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type & Days Count */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leave_type">Leave Type</Label>
              <select
                id="leave_type"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("leave_type")}
              >
                <option value="annual">Annual Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="days_count">Days Count *</Label>
              <Input
                id="days_count"
                type="number"
                disabled={isSubmitting}
                {...register("days_count", { valueAsNumber: true })}
              />
              {errors.days_count && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.days_count.message}
                </p>
              )}
            </div>
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                disabled={isSubmitting}
                {...register("start_date")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                disabled={isSubmitting}
                {...register("end_date")}
              />
            </div>
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave *</Label>
            <textarea
              id="reason"
              rows={3}
              placeholder="Detailed reason for leave request..."
              className="w-full p-2.5 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isSubmitting}
              {...register("reason")}
            />
            {errors.reason && (
              <p className="text-xs text-red-500 font-medium">
                {errors.reason.message}
              </p>
            )}
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
                  Submitting...
                </>
              ) : (
                "Submit Leave Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
