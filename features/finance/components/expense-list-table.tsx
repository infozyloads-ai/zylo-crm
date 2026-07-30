"use client";

import { CreditCard, Plus, Trash2, Calendar, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import type { Expense, ExpenseCategory } from "../types/finance.types";
import { deleteExpense } from "../services/finance.service";
import { toast } from "sonner";

interface ExpenseListTableProps {
  expenses: Expense[];
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export function ExpenseListTable({
  expenses,
  onRefresh,
  onOpenCreate,
}: ExpenseListTableProps) {
  const handleDelete = async (id: string, title: string) => {
    await deleteExpense(id);
    toast.success(`Expense "${title}" deleted`);
    onRefresh();
  };

  const getCategoryBadge = (cat: ExpenseCategory) => {
    switch (cat) {
      case "software":
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700 font-bold">Software</Badge>;
      case "salaries":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700">Salaries</Badge>;
      case "marketing":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700">Marketing</Badge>;
      case "travel":
        return <Badge variant="outline" className="text-indigo-600">Travel</Badge>;
      case "office_supplies":
        return <Badge variant="outline" className="text-emerald-600">Office</Badge>;
      default:
        return <Badge variant="outline">{cat}</Badge>;
    }
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-red-600" />
              Company Operational Expenses
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Log software licenses, cloud servers, salaries, marketing, and office costs.
            </p>
          </div>

          <Button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Log Expense
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Expense Description</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Vendor / Payee</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Amount (₹)</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No expenses logged yet.
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr
                    key={exp.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {exp.title}
                      </div>
                      {exp.receipt_url && (
                        <div className="text-xs text-blue-600 flex items-center gap-1 mt-0.5 font-medium">
                          <Paperclip className="h-3 w-3" />
                          {exp.receipt_url}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">{getCategoryBadge(exp.category)}</td>

                    <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {exp.vendor}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {exp.expense_date}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-red-600 text-right">
                      {formatCurrency(exp.amount)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(exp.id, exp.title)}
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          title="Delete Expense"
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
