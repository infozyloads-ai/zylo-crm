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
import { quotationSchema, type QuotationFormData } from "../schemas/finance-schema";
import { createQuotation } from "../services/finance.service";
import type { Quotation } from "../types/finance.types";

interface QuotationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quotationToEdit?: Quotation | null;
  onSuccess: () => void;
}

export function QuotationDialog({
  open,
  onOpenChange,
  quotationToEdit,
  onSuccess,
}: QuotationDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      quotation_number: `QUO-2026-${Math.floor(100 + Math.random() * 900)}`,
      client_name: "",
      project_name: "",
      issue_date: new Date().toISOString().split("T")[0],
      status: "sent",
      subtotal: 2000,
      tax: 100,
      discount: 0,
      grand_total: 2100,
      notes: "Quotation valid for 30 days.",
    },
  });

  const subtotal = watch("subtotal") || 0;
  const tax = watch("tax") || 0;
  const discount = watch("discount") || 0;

  useEffect(() => {
    setValue("grand_total", Math.max(0, subtotal + tax - discount));
  }, [subtotal, tax, discount, setValue]);

  useEffect(() => {
    if (quotationToEdit) {
      reset({
        quotation_number: quotationToEdit.quotation_number,
        client_name: quotationToEdit.client_name,
        project_name: quotationToEdit.project_name,
        issue_date: quotationToEdit.issue_date,
        status: quotationToEdit.status,
        subtotal: quotationToEdit.subtotal,
        tax: quotationToEdit.tax,
        discount: quotationToEdit.discount,
        grand_total: quotationToEdit.grand_total,
        notes: quotationToEdit.notes || "",
      });
    } else {
      reset({
        quotation_number: `QUO-2026-${Math.floor(100 + Math.random() * 900)}`,
        client_name: "",
        project_name: "",
        issue_date: new Date().toISOString().split("T")[0],
        status: "sent",
        subtotal: 2000,
        tax: 100,
        discount: 0,
        grand_total: 2100,
        notes: "Quotation valid for 30 days.",
      });
    }
  }, [quotationToEdit, reset, open]);

  const onSubmit = async (data: QuotationFormData) => {
    const res = await createQuotation(data);

    if (!res.success) {
      toast.error("Failed to save quotation", { description: res.message });
      return;
    }

    toast.success("Quotation saved successfully");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {quotationToEdit ? "Edit Quotation Proposal" : "Create New Quotation"}
          </DialogTitle>
          <DialogDescription>
            Prepare a project quote and scope estimate for your client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Quotation Number, Client & Project */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quotation_number">Quotation # *</Label>
              <Input
                id="quotation_number"
                disabled={isSubmitting}
                {...register("quotation_number")}
              />
              {errors.quotation_number && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.quotation_number.message}
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
              <Label htmlFor="project_name">Project Scope *</Label>
              <Input
                id="project_name"
                placeholder="API Connector Integration"
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

          {/* Date & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Proposal Date</Label>
              <Input
                id="issue_date"
                type="date"
                disabled={isSubmitting}
                {...register("issue_date")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Proposal Status</Label>
              <select
                id="status"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("status")}
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
                <option value="converted">Converted to Invoice</option>
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
            <Label htmlFor="notes">Terms & Conditions Notes</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Terms of delivery, validity period..."
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
              ) : (
                "Save Quotation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
