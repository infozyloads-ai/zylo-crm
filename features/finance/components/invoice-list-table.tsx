"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Printer,
  Download,
  Pencil,
  Trash2,
  Calendar,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import type { Invoice, InvoiceStatus } from "../types/finance.types";
import { printInvoice, generatePdf, deleteInvoice } from "../services/finance.service";
import { toast } from "sonner";

interface InvoiceListTableProps {
  invoices: Invoice[];
  onRefresh: () => void;
  onOpenCreate: () => void;
  onOpenEdit: (invoice: Invoice) => void;
  onRecordPaymentClick: (invoice: Invoice) => void;
}

export function InvoiceListTable({
  invoices,
  onRefresh,
  onOpenCreate,
  onOpenEdit,
  onRecordPaymentClick,
}: InvoiceListTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, num: string) => {
    setDeletingId(id);
    await deleteInvoice(id);
    setDeletingId(null);
    toast.success(`Invoice ${num} deleted`);
    onRefresh();
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold">Paid</Badge>;
      case "partially_paid":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 font-semibold">Partially Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-blue-600">Pending</Badge>;
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="text-slate-400">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Table Header Action */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Client Invoices
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate billing invoices, track payments, print & export PDF records.
            </p>
          </div>

          <Button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        {/* Invoices Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Invoice #</th>
                <th className="px-6 py-4 font-semibold">Client & Project</th>
                <th className="px-6 py-4 font-semibold">Dates</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Grand Total</th>
                <th className="px-6 py-4 font-semibold text-right">Outstanding</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No invoices generated yet.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr
                    key={inv.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-blue-600">
                      {inv.invoice_number}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {inv.client_name}
                      </div>
                      <div className="text-xs text-slate-400">{inv.project_name}</div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        Issued: {inv.issue_date}
                      </div>
                      <div className="text-slate-400">Due: {inv.due_date}</div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(inv.status)}</td>

                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 text-right">
                      {formatCurrency(inv.grand_total)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-bold ${
                          inv.outstanding_balance > 0 ? "text-amber-600" : "text-emerald-600"
                        }`}
                      >
                        ${inv.outstanding_balance.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        {inv.outstanding_balance > 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRecordPaymentClick(inv)}
                            className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                            title="Record Payment"
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => printInvoice(inv)}
                          className="h-8 w-8 text-slate-500 hover:text-blue-600"
                          title="Print Invoice"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => generatePdf("invoice", inv)}
                          className="h-8 w-8 text-slate-500 hover:text-indigo-600"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onOpenEdit(inv)}
                          className="h-8 w-8 text-slate-500 hover:text-amber-600"
                          title="Edit Invoice"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={deletingId === inv.id}
                          onClick={() => handleDelete(inv.id, inv.invoice_number)}
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          title="Delete Invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
