"use client";

import type { FunnelStage } from "../../types/reports.types";

interface AreaChartProps {
  data: FunnelStage[];
}

export function AreaChart({ data }: AreaChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-3 py-2">
      {data.map((stage, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-800 dark:text-slate-200">{stage.stage}</span>
            <span className="text-slate-600 dark:text-slate-400 font-mono">
              {stage.count} leads ({stage.percentage}%)
            </span>
          </div>

          <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-800">
            <div
              style={{ width: `${stage.percentage}%` }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
