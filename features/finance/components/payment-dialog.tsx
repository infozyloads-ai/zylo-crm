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
import { paymentSchema, type PaymentFormData } from "../schemas/finance-schema";
import { recordPayment } from "../services/finance.service";
import type { Invoice } from "../types/finance.types";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoice?: Invoice | null;
  onSuccess: () => void;
}

export function PaymentDialog({
  open,
  onOpenChange,
  selectedInvoice,
  onSuccess,
}: PaymentDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoice_id: selectedInvoice?.id || "",
      invoice_number: selectedInvoice?.invoice_number || "",
      client_name: selectedInvoice?.client_name || "",
      amount: selectedInvoice?.outstanding_balance || 1000,
      payment_method: "bank_transfer",
      transaction_reference: `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`,
      payment_date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  useEffect(() => {
    if (selectedInvoice) {
      reset({
        invoice_id: selectedInvoice.id,
        invoice_number: selectedInvoice.invoice_number,
        client_name: selectedInvoice.client_name,
        amount: selectedInvoice.outstanding_balance,
        payment_method: "bank_transfer",
        transaction_reference: `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`,
        payment_date: new Date().toISOString().split("T")[0],
        notes: "",
      });
    }
  }, [selectedInvoice, reset, open]);

  const onSubmit = async (data: PaymentFormData) => {
    const res = await recordPayment(data);

    if (!res.success) {
      toast.error("Failed to record payment", { description: res.message });
      return;
    }

    toast.success("Payment settlement recorded successfully");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Record Invoice Payment
          </DialogTitle>
          <DialogDescription>
            Record a full or partial payment settlement for {selectedInvoice?.invoice_number || "invoice"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Invoice & Client Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Invoice #</Label>
              <Input readOnly className="bg-slate-50 font-bold" {...register("invoice_number")} />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Client Name</Label>
              <Input readOnly className="bg-slate-50 font-semibold" {...register("client_name")} />
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount ($) *</Label>
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
              <Label htmlFor="payment_date">Payment Date *</Label>
              <Input
                id="payment_date"
                type="date"
                disabled={isSubmitting}
                {...register("payment_date")}
              />
            </div>
          </div>

          {/* Payment Method & Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <select
                id="payment_method"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("payment_method")}
              >
                <option value="bank_transfer">Bank Wire Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_reference">Reference / TRX ID *</Label>
              <Input
                id="transaction_reference"
                placeholder="TRX-884920"
                disabled={isSubmitting}
                {...register("transaction_reference")}
              />
              {errors.transaction_reference && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.transaction_reference.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Payment Notes</Label>
            <textarea
              id="notes"
              rows={2}
              placeholder="Bank confirmation notes, reference details..."
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                "Record Settlement"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
