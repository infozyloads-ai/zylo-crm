"use client";

import { DollarSign, Clock, CheckCircle2, AlertCircle, TrendingUp, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import type { Invoice, Expense } from "../types/finance.types";

interface FinanceKpiCardsProps {
  invoices: Invoice[];
  expenses: Expense[];
}

export function FinanceKpiCards({ invoices, expenses }: FinanceKpiCardsProps) {
  const totalRevenue = invoices.reduce((acc, i) => acc + (i.paid_amount || 0), 0);
  const outstandingPayments = invoices.reduce((acc, i) => acc + (i.outstanding_balance || 0), 0);
  const paidInvoicesCount = invoices.filter((i) => i.status === "paid").length;
  const pendingInvoicesCount = invoices.filter((i) => i.status === "pending" || i.status === "partially_paid").length;
  const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const kpis = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      subtitle: "Lifetime collected payments",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      title: "Outstanding Payments",
      value: formatCurrency(outstandingPayments),
      subtitle: "Pending & partial balances",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
    },
    {
      title: "Paid Invoices",
      value: paidInvoicesCount,
      subtitle: "Fully settled accounts",
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "Pending Invoices",
      value: pendingInvoicesCount,
      subtitle: "Awaiting client settlement",
      icon: AlertCircle,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(totalExpenses),
      subtitle: "Operational & team costs",
      icon: CreditCard,
      color: "text-red-600 bg-red-50 dark:bg-red-950/50",
    },
    {
      title: "Net Profit Overview",
      value: formatCurrency(netProfit),
      subtitle: "Revenue minus expenses",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.title}
            className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl"
          >
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {kpi.title}
                </p>
                <div className={`p-2 rounded-xl ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {kpi.value}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{kpi.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
