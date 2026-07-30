import { Card, CardContent } from "@/components/ui/card";
import { Users, Building2, Briefcase, DollarSign, TrendingUp } from "lucide-react";

interface KpiItem {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: typeof Users;
  color: string;
}

const kpiData: KpiItem[] = [
  {
    title: "Total Leads",
    value: "1,248",
    change: "+12.5% from last month",
    isPositive: true,
    icon: Users,
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    title: "Active Clients",
    value: "86",
    change: "+4 new this week",
    isPositive: true,
    icon: Building2,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  {
    title: "Ongoing Projects",
    value: "24",
    change: "3 due this week",
    isPositive: true,
    icon: Briefcase,
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    title: "Monthly Revenue",
    value: "₹4,82,500",
    change: "+8.2% vs target",
    isPositive: true,
    icon: DollarSign,
    color: "bg-indigo-500/10 text-indigo-600",
  },
];

export function DashboardKpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {kpiData.map((kpi) => {
        const Icon = kpi.icon;

        return (
          <Card key={kpi.title} className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {kpi.title}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {kpi.value}
                  </h3>
                </div>

                <div className={`p-3 rounded-2xl ${kpi.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <div className="flex items-center gap-1 mt-4 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{kpi.change}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
