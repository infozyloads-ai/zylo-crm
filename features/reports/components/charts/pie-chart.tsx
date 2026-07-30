"use client";

import type { ProjectStatusDistribution } from "../../types/reports.types";

interface PieChartProps {
  data: ProjectStatusDistribution[];
}

export function PieChart({ data }: PieChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
      {/* SVG Donut */}
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {(() => {
            let accumulatedPercent = 0;
            return data.map((item, idx) => {
              const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
              const strokeDashoffset = -accumulatedPercent;
              accumulatedPercent += item.percentage;

              return (
                <circle
                  key={idx}
                  cx="50"
                  cy="50"
                  r="35"
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="18"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-90"
                />
              );
            });
          })()}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {data.reduce((acc, d) => acc + d.count, 0)}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400">Projects</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-3 flex-1">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-800 dark:text-slate-200">{item.status}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-900 dark:text-slate-100 font-bold">
                {item.count}
              </span>
              <span className="text-slate-400 font-mono">({item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
