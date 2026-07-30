"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Filter,
  RefreshCw,
  Layers,
  Calendar,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type {
  AnalyticsKpis,
  MonthlyDataPoint,
  FunnelStage,
  ProjectStatusDistribution,
  AttendanceTrendPoint,
  ReportTimeframe,
} from "../types/reports.types";
import {
  getAnalyticsKpis,
  getRevenueTrendData,
  getLeadFunnelData,
  getProjectDistributionData,
  getAttendanceTrendData,
  exportReportCsv,
  exportReportExcel,
  exportReportPdf,
} from "../services/reports.service";

import { AnalyticsKpiCards } from "./analytics-kpi-cards";
import { ReportsFilterBar } from "./reports-filter-bar";
import { LineChart } from "./charts/line-chart";
import { BarChart } from "./charts/bar-chart";
import { PieChart } from "./charts/pie-chart";
import { AreaChart } from "./charts/area-chart";
import { toast } from "sonner";

export function ReportsManager() {
  const [timeframe, setTimeframe] = useState<ReportTimeframe>("monthly");
  const [kpis, setKpis] = useState<AnalyticsKpis | null>(null);
  const [revenueTrend, setRevenueTrend] = useState<MonthlyDataPoint[]>([]);
  const [funnel, setFunnel] = useState<FunnelStage[]>([]);
  const [projectDist, setProjectDist] = useState<ProjectStatusDistribution[]>([]);
  const [attendanceTrend, setAttendanceTrend] = useState<AttendanceTrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const kpiData = await getAnalyticsKpis();
    setKpis(kpiData);
    setRevenueTrend(getRevenueTrendData(timeframe));
    setFunnel(getLeadFunnelData());
    setProjectDist(getProjectDistributionData());
    setAttendanceTrend(getAttendanceTrendData());
    setLoading(false);
  }, [timeframe]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExportCsv = () => {
    const rows = revenueTrend.map((r) => ({
      Period: r.label,
      "Revenue ($)": r.revenue,
      "Expenses ($)": r.expenses,
      "Net Profit ($)": r.profit,
    }));
    exportReportCsv(rows, `zylo-financial-report-${timeframe}.csv`);
    toast.success("CSV report exported successfully");
  };

  const handleExportExcel = () => {
    const rows = revenueTrend.map((r) => ({
      Period: r.label,
      "Revenue ($)": r.revenue,
      "Expenses ($)": r.expenses,
      "Net Profit ($)": r.profit,
    }));
    exportReportExcel(rows, `zylo-analytics-${timeframe}.csv`);
    toast.success("Excel report exported successfully");
  };

  const handleExportPdf = () => {
    const rows = revenueTrend.map((r) => ({
      Period: r.label,
      Revenue: `$${r.revenue.toLocaleString()}`,
      Expenses: `$${r.expenses.toLocaleString()}`,
      Profit: `$${r.profit.toLocaleString()}`,
    }));
    exportReportPdf(`Zylo Executive Financial Report (${timeframe.toUpperCase()})`, rows);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Reports & Executive Analytics
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Comprehensive business performance insights, sales funnels, revenue trends, and staff attendance.
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={loadData}
          className="rounded-xl shrink-0"
          title="Refresh analytics data"
        >
          <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Filter & Export Bar */}
      <ReportsFilterBar
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
        onExportCsv={handleExportCsv}
        onExportExcel={handleExportExcel}
        onExportPdf={handleExportPdf}
        onPrint={handlePrint}
      />

      {/* Analytics KPI Cards */}
      {kpis && <AnalyticsKpiCards kpis={kpis} />}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Line & Area Chart */}
        <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Revenue vs Expense Trends
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gross income vs operational costs ({timeframe})
                </p>
              </div>
            </div>

            <LineChart data={revenueTrend} />
          </CardContent>
        </Card>

        {/* Project Status Donut / Pie Chart */}
        <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <PieIcon className="h-5 w-5 text-emerald-600" />
                  Project Status Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Active, completed, and on-hold workloads
                </p>
              </div>
            </div>

            <PieChart data={projectDist} />
          </CardContent>
        </Card>

        {/* Lead Conversion Sales Funnel Area Stack */}
        <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600" />
                  Sales Funnel & Lead Conversion
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pipeline progression from inquiry to won deals
                </p>
              </div>
            </div>

            <AreaChart data={funnel} />
          </CardContent>
        </Card>

        {/* Employee Attendance Grouped Bar Chart */}
        <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Staff Attendance & Shift Metrics
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Weekly staff check-in, late entry, and absenteeism trends
                </p>
              </div>
            </div>

            <BarChart data={attendanceTrend} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
