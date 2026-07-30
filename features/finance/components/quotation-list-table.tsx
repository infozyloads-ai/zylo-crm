"use client";

import { useState } from "react";
import {
  FileCode2,
  Plus,
  ArrowRightLeft,
  Download,
  Trash2,
  Calendar,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import type { Quotation, QuotationStatus } from "../types/finance.types";
import { convertQuotationToInvoice, generatePdf, deleteQuotation } from "../services/finance.service";
import { toast } from "sonner";

interface QuotationListTableProps {
  quotations: Quotation[];
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export function QuotationListTable({
  quotations,
  onRefresh,
  onOpenCreate,
}: QuotationListTableProps) {
  const [convertingId, setConvertingId] = useState<string | null>(null);

  const handleConvert = async (id: string, num: string) => {
    setConvertingId(id);
    const res = await convertQuotationToInvoice(id);
    setConvertingId(null);

    if (res.success) {
      toast.success(res.message);
      onRefresh();
    } else {
      toast.error("Failed to convert quotation", { description: res.message });
    }
  };

  const handleDelete = async (id: string, num: string) => {
    await deleteQuotation(id);
    toast.success(`Quotation ${num} deleted`);
    onRefresh();
  };

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case "accepted":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold">Accepted</Badge>;
      case "converted":
        return <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-bold">Converted to Invoice</Badge>;
      case "sent":
        return <Badge variant="outline" className="text-blue-600">Sent</Badge>;
      case "draft":
        return <Badge variant="outline" className="text-slate-500">Draft</Badge>;
      case "declined":
        return <Badge variant="destructive">Declined</Badge>;
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
              <FileCode2 className="h-5 w-5 text-indigo-600" />
              Quotations & Cost Proposals
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Draft client proposals, send estimates, and convert approved quotes to invoices with 1-click.
            </p>
          </div>

          <Button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Quotation
          </Button>
        </div>

        {/* Quotation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Quotation #</th>
                <th className="px-6 py-4 font-semibold">Client & Project Scope</th>
                <th className="px-6 py-4 font-semibold">Proposal Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Grand Total</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {quotations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <FileCode2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No quotations generated yet.
                  </td>
                </tr>
              ) : (
                quotations.map((quo) => (
                  <tr
                    key={quo.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-indigo-600">
                      {quo.quotation_number}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {quo.client_name}
                      </div>
                      <div className="text-xs text-slate-400">{quo.project_name}</div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {quo.issue_date}
                      </div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(quo.status)}</td>

                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 text-right">
                      {formatCurrency(quo.grand_total)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {quo.status !== "converted" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={convertingId === quo.id}
                            onClick={() => handleConvert(quo.id, quo.quotation_number)}
                            className="h-8 text-xs text-indigo-600 hover:bg-indigo-50 border-indigo-200 rounded-xl"
                            title="Convert to Invoice"
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
                            Convert to Invoice
                          </Button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" /> Converted
                          </span>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => generatePdf("quotation", quo)}
                          className="h-8 w-8 text-slate-500 hover:text-indigo-600"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(quo.id, quo.quotation_number)}
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          title="Delete Quotation"
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
