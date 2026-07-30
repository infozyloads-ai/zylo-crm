"use client";

import { Filter, Calendar, FileText, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ReportTimeframe } from "../types/reports.types";

interface ReportsFilterBarProps {
  timeframe: ReportTimeframe;
  onTimeframeChange: (tf: ReportTimeframe) => void;
  onExportCsv: () => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
  onPrint: () => void;
}

export function ReportsFilterBar({
  timeframe,
  onTimeframeChange,
  onExportCsv,
  onExportExcel,
  onExportPdf,
  onPrint,
}: ReportsFilterBarProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Timeframe & Filter Selectors */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
          <Filter className="h-4 w-4 text-blue-600" />
          Filter:
        </div>

        <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
          <Button
            variant={timeframe === "weekly" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onTimeframeChange("weekly")}
            className="text-xs font-semibold h-7 rounded-lg"
          >
            Weekly
          </Button>

          <Button
            variant={timeframe === "monthly" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onTimeframeChange("monthly")}
            className="text-xs font-semibold h-7 rounded-lg"
          >
            Monthly
          </Button>

          <Button
            variant={timeframe === "yearly" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onTimeframeChange("yearly")}
            className="text-xs font-semibold h-7 rounded-lg"
          >
            Yearly
          </Button>
        </div>

        <select className="h-8 px-2.5 py-0.5 bg-background border border-input rounded-xl text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <option value="all_depts">All Departments</option>
          <option value="engineering">Engineering</option>
          <option value="cloud">Cloud Operations</option>
          <option value="design">UI/UX Design</option>
        </select>

        <select className="h-8 px-2.5 py-0.5 bg-background border border-input rounded-xl text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          <option value="all_status">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="in_progress">In Progress</option>
        </select>
      </div>

      {/* Export & Print Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          className="h-8 text-xs font-semibold rounded-xl"
          title="Download CSV report"
        >
          <Download className="h-3.5 w-3.5 mr-1 text-slate-600" />
          CSV
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportExcel}
          className="h-8 text-xs font-semibold rounded-xl"
          title="Download Excel report"
        >
          <Download className="h-3.5 w-3.5 mr-1 text-emerald-600" />
          Excel
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onExportPdf}
          className="h-8 text-xs font-semibold rounded-xl"
          title="Export PDF document"
        >
          <FileText className="h-3.5 w-3.5 mr-1 text-blue-600" />
          PDF
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="h-8 text-xs font-semibold rounded-xl"
          title="Print page report"
        >
          <Printer className="h-3.5 w-3.5 mr-1 text-slate-600" />
          Print
        </Button>
      </div>
    </div>
  );
}
