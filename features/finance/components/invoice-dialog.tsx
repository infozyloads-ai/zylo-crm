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
import { invoiceSchema, type InvoiceFormData } from "../schemas/finance-schema";
import { createInvoice, updateInvoice } from "../services/finance.service";
import type { Invoice } from "../types/finance.types";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceToEdit?: Invoice | null;
  onSuccess: () => void;
}

export function InvoiceDialog({
  open,
  onOpenChange,
  invoiceToEdit,
  onSuccess,
}: InvoiceDialogProps) {
  const isEditing = !!invoiceToEdit;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoice_number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      client_name: "",
      project_name: "",
      issue_date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      status: "pending",
      subtotal: 1000,
      tax: 50,
      discount: 0,
      grand_total: 1050,
      notes: "",
    },
  });

  const subtotal = watch("subtotal") || 0;
  const tax = watch("tax") || 0;
  const discount = watch("discount") || 0;

  useEffect(() => {
    setValue("grand_total", Math.max(0, subtotal + tax - discount));
  }, [subtotal, tax, discount, setValue]);

  useEffect(() => {
    if (invoiceToEdit) {
      reset({
        invoice_number: invoiceToEdit.invoice_number,
        client_name: invoiceToEdit.client_name,
        project_name: invoiceToEdit.project_name,
        issue_date: invoiceToEdit.issue_date,
        due_date: invoiceToEdit.due_date,
        status: invoiceToEdit.status,
        subtotal: invoiceToEdit.subtotal,
        tax: invoiceToEdit.tax,
        discount: invoiceToEdit.discount,
        grand_total: invoiceToEdit.grand_total,
        notes: invoiceToEdit.notes || "",
      });
    } else {
      reset({
        invoice_number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
        client_name: "",
        project_name: "",
        issue_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
        status: "pending",
        subtotal: 1000,
        tax: 50,
        discount: 0,
        grand_total: 1050,
        notes: "",
      });
    }
  }, [invoiceToEdit, reset, open]);

  const onSubmit = async (data: InvoiceFormData) => {
    let res;
    if (isEditing && invoiceToEdit) {
      res = await updateInvoice(invoiceToEdit.id, data);
    } else {
      res = await createInvoice(data);
    }

    if (!res.success) {
      toast.error(isEditing ? "Failed to update invoice" : "Failed to create invoice", {
        description: res.message,
      });
      return;
    }

    toast.success(isEditing ? "Invoice updated successfully" : "Invoice created successfully");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Invoice" : "Create New Invoice"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update billing details, payment status, and grand total."
              : "Generate an official billing invoice for your client."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Invoice Number, Client & Project */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice_number">Invoice # *</Label>
              <Input
                id="invoice_number"
                disabled={isSubmitting}
                {...register("invoice_number")}
              />
              {errors.invoice_number && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.invoice_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                placeholder="Acme Global Solutions"
                disabled={isSubmitting}
                {...register("client_name")}
              />
              {errors.client_name && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.client_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project_name">Project Name *</Label>
              <Input
                id="project_name"
                placeholder="Mobile App Sprints"
                disabled={isSubmitting}
                {...register("project_name")}
              />
              {errors.project_name && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.project_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Dates & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                type="date"
                disabled={isSubmitting}
                {...register("issue_date")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                disabled={isSubmitting}
                {...register("due_date")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <select
                id="status"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("status")}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Amounts Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <Label htmlFor="subtotal" className="text-xs">Subtotal ($)</Label>
              <Input
                id="subtotal"
                type="number"
                disabled={isSubmitting}
                {...register("subtotal", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="tax" className="text-xs">Tax ($)</Label>
              <Input
                id="tax"
                type="number"
                disabled={isSubmitting}
                {...register("tax", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="discount" className="text-xs">Discount ($)</Label>
              <Input
                id="discount"
                type="number"
                disabled={isSubmitting}
                {...register("discount", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="grand_total" className="text-xs font-bold text-blue-600">Grand Total ($)</Label>
              <Input
                id="grand_total"
                type="number"
                readOnly
                className="bg-white dark:bg-slate-950 font-bold text-blue-600"
                {...register("grand_total", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Invoice Notes & Wire Transfer Details</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Payment instructions, bank wire details..."
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
                "Update Invoice"
              ) : (
                "Create Invoice"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
