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
import { payrollSchema, type PayrollFormData } from "../schemas/hr-schema";
import { createPayroll } from "../services/hr.service";
import type { Employee } from "../types/hr.types";

interface PayrollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  onSuccess: () => void;
}

export function PayrollDialog({
  open,
  onOpenChange,
  employees,
  onSuccess,
}: PayrollDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      employee_id: employees[0]?.id || "emp-1",
      employee_name: employees[0]?.name || "Sarah Jenkins",
      month: "July 2026",
      base_salary: 7916,
      allowances: 500,
      deductions: 800,
      net_salary: 7616,
      payment_status: "pending",
      payment_date: new Date().toISOString().split("T")[0],
    },
  });

  const base = watch("base_salary") || 0;
  const allow = watch("allowances") || 0;
  const ded = watch("deductions") || 0;

  useEffect(() => {
    setValue("net_salary", Math.max(0, base + allow - ded));
  }, [base, allow, ded, setValue]);

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = employees.find((emp) => emp.id === e.target.value);
    if (selected) {
      const monthlyBase = Math.round((selected.salary || 90000) / 12);
      setValue("employee_id", selected.id);
      setValue("employee_name", selected.name);
      setValue("base_salary", monthlyBase);
    }
  };

  const onSubmit = async (data: PayrollFormData) => {
    const res = await createPayroll(data);

    if (!res.success) {
      toast.error("Failed to generate payroll", { description: res.message });
      return;
    }

    toast.success("Payroll record generated successfully");
    reset();
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Generate Monthly Payroll</DialogTitle>
          <DialogDescription>
            Calculate employee base salary, allowances, deductions, and net salary.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Employee & Month */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emp_sel">Employee *</Label>
              <select
                id="emp_sel"
                onChange={handleEmployeeChange}
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="month">Payroll Month *</Label>
              <Input
                id="month"
                placeholder="July 2026"
                disabled={isSubmitting}
                {...register("month")}
              />
              {errors.month && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.month.message}
                </p>
              )}
            </div>
          </div>

          {/* Salary Breakdown */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <Label htmlFor="base_salary" className="text-xs">Base Salary ($)</Label>
              <Input
                id="base_salary"
                type="number"
                disabled={isSubmitting}
                {...register("base_salary", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="allowances" className="text-xs">Allowances ($)</Label>
              <Input
                id="allowances"
                type="number"
                disabled={isSubmitting}
                {...register("allowances", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="deductions" className="text-xs">Deductions ($)</Label>
              <Input
                id="deductions"
                type="number"
                disabled={isSubmitting}
                {...register("deductions", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Net Salary & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="net_salary" className="text-xs font-bold text-emerald-600">Net Take-Home Salary ($)</Label>
              <Input
                id="net_salary"
                type="number"
                readOnly
                className="bg-white dark:bg-slate-950 font-bold text-emerald-600"
                {...register("net_salary", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_status">Status</Label>
              <select
                id="payment_status"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("payment_status")}
              >
                <option value="pending">Pending Disbursement</option>
                <option value="paid">Paid</option>
              </select>
            </div>
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
                  Generating...
                </>
              ) : (
                "Generate Payroll"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
