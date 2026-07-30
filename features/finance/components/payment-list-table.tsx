"use client";

import { CreditCard, Calendar, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import type { PaymentRecord, PaymentMethod } from "../types/finance.types";

interface PaymentListTableProps {
  payments: PaymentRecord[];
}

export function PaymentListTable({ payments }: PaymentListTableProps) {
  const getMethodBadge = (method: PaymentMethod) => {
    switch (method) {
      case "bank_transfer":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700">Bank Transfer</Badge>;
      case "stripe":
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700 font-bold">Stripe</Badge>;
      case "credit_card":
        return <Badge variant="outline" className="text-emerald-600">Credit Card</Badge>;
      case "paypal":
        return <Badge variant="secondary" className="bg-sky-50 text-sky-700">PayPal</Badge>;
      default:
        return <Badge variant="outline">{method}</Badge>;
    }
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-600" />
              Payment Settlements History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified transaction records, payment methods, and transaction references.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Transaction Reference</th>
                <th className="px-6 py-4 font-semibold">Invoice #</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Payment Method</th>
                <th className="px-6 py-4 font-semibold">Payment Date</th>
                <th className="px-6 py-4 font-semibold text-right">Amount Settled</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No payments recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((pay) => (
                  <tr
                    key={pay.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {pay.transaction_reference}
                    </td>

                    <td className="px-6 py-4 font-bold text-blue-600">
                      {pay.invoice_number}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {pay.client_name}
                    </td>

                    <td className="px-6 py-4">{getMethodBadge(pay.payment_method)}</td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {pay.payment_date}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-600 text-right flex items-center justify-end gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      {formatCurrency(pay.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
