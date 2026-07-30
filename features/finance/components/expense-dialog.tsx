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
import { expenseSchema, type ExpenseFormData } from "../schemas/finance-schema";
import { createExpense } from "../services/finance.service";

interface ExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ExpenseDialog({ open, onOpenChange, onSuccess }: ExpenseDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      title: "",
      category: "software",
      vendor: "",
      amount: 100,
      expense_date: new Date().toISOString().split("T")[0],
      receipt_url: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    const res = await createExpense(data);

    if (!res.success) {
      toast.error("Failed to log expense", { description: res.message });
      return;
    }

    toast.success("Expense logged successfully");
    reset();
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Log Operational Expense
          </DialogTitle>
          <DialogDescription>
            Record vendor expenses, software subscriptions, team salaries, or office costs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Expense Description / Title *</Label>
            <Input
              id="title"
              placeholder="e.g. AWS Production Servers Infrastructure"
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category & Vendor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("category")}
              >
                <option value="software">Software & Cloud</option>
                <option value="salaries">Salaries & Payroll</option>
                <option value="marketing">Marketing & Ads</option>
                <option value="office_supplies">Office Supplies</option>
                <option value="travel">Travel & Transport</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor / Payee *</Label>
              <Input
                id="vendor"
                placeholder="Amazon Web Services"
                disabled={isSubmitting}
                {...register("vendor")}
              />
              {errors.vendor && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.vendor.message}
                </p>
              )}
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                disabled={isSubmitting}
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expense_date">Date *</Label>
              <Input
                id="expense_date"
                type="date"
                disabled={isSubmitting}
                {...register("expense_date")}
              />
            </div>
          </div>

          {/* Receipt URL / Notes */}
          <div className="space-y-2">
            <Label htmlFor="receipt_url">Receipt File Reference / Attachment</Label>
            <Input
              id="receipt_url"
              placeholder="receipt_july_aws.pdf or URL"
              disabled={isSubmitting}
              {...register("receipt_url")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Additional expense notes..."
              className="w-full p-2.5 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
              ) : (
                "Log Expense"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
