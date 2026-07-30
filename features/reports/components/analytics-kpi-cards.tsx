"use client";

import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  Clock,
  Trophy,
  XCircle,
  Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format-currency";
import type { AnalyticsKpis } from "../types/reports.types";

interface AnalyticsKpiCardsProps {
  kpis: AnalyticsKpis;
}

export function AnalyticsKpiCards({ kpis }: AnalyticsKpiCardsProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(kpis.totalRevenue),
      subtitle: "+18.4% vs last period",
      icon: DollarSign,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "Net Profit",
      value: formatCurrency(kpis.netProfit),
      subtitle: "69.6% profit margin",
      icon: TrendingUp,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(kpis.totalExpenses),
      subtitle: "Operational costs",
      icon: CreditCard,
      color: "text-red-500 bg-red-50 dark:bg-red-950/50",
    },
    {
      title: "Completed Projects",
      value: kpis.completedProjects,
      subtitle: "Delivered to clients",
      icon: CheckCircle2,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      title: "Pending Projects",
      value: kpis.pendingProjects,
      subtitle: "In active development",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
    },
    {
      title: "Won Leads",
      value: kpis.wonLeads,
      subtitle: "Closed conversions",
      icon: Trophy,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50",
    },
    {
      title: "Lost Leads",
      value: kpis.lostLeads,
      subtitle: "Unconverted pipeline",
      icon: XCircle,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50",
    },
    {
      title: "Active Clients",
      value: kpis.activeClients,
      subtitle: "Retained accounts",
      icon: Building2,
      color: "text-teal-600 bg-teal-50 dark:bg-teal-950/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.title}
            className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl"
          >
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </p>
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {card.value}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{card.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
