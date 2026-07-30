"use client";

import { DollarSign, Plus, FileText, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import type { PayrollRecord } from "../types/hr.types";
import { generateSalarySlipPdf } from "../services/hr.service";

interface PayrollListTableProps {
  payrolls: PayrollRecord[];
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export function PayrollListTable({
  payrolls,
  onOpenCreate,
}: PayrollListTableProps) {
  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Monthly Payroll & Salary Disbursements
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review monthly salary breakdowns, allowances, tax deductions, and export PDF salary slips.
            </p>
          </div>

          <Button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Generate Payroll
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Month</th>
                <th className="px-6 py-4 font-semibold text-right">Base Salary</th>
                <th className="px-6 py-4 font-semibold text-right">Allowances</th>
                <th className="px-6 py-4 font-semibold text-right">Deductions</th>
                <th className="px-6 py-4 font-semibold text-right">Net Take-Home</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payrolls.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No payroll records generated yet.
                  </td>
                </tr>
              ) : (
                payrolls.map((pay) => (
                  <tr
                    key={pay.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                      {pay.employee_name}
                    </td>

                    <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">
                      {pay.month}
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-600 text-right">
                      ${pay.base_salary.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 font-mono text-emerald-600 text-right">
                      +${pay.allowances.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 font-mono text-red-500 text-right">
                      -${pay.deductions.toLocaleString()}
                    </td>

                    <td className="px-6 py-4 font-bold text-emerald-600 text-right text-base">
                      {formatCurrency(pay.net_salary)}
                    </td>

                    <td className="px-6 py-4 text-center">
                      {pay.payment_status === "paid" ? (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 flex items-center justify-center gap-1">
                          <Clock className="h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateSalarySlipPdf(pay)}
                          className="h-8 text-xs text-blue-600 hover:bg-blue-50 border-blue-200 rounded-xl"
                          title="Generate Salary Slip PDF"
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          Salary Slip PDF
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
