"use client";

import type { AttendanceTrendPoint } from "../../types/reports.types";

interface BarChartProps {
  data: AttendanceTrendPoint[];
}

export function BarChart({ data }: BarChartProps) {
  if (!data || data.length === 0) return null;

  const maxCount = 55;

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-4 gap-4 items-end h-52 pt-6 pb-2 border-b border-slate-200 dark:border-slate-800">
        {data.map((d, idx) => {
          const presentH = (d.present / maxCount) * 100;
          const lateH = (d.late / maxCount) * 100;
          const absentH = (d.absent / maxCount) * 100;

          return (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
              <div className="flex items-end gap-1.5 h-full w-full justify-center">
                {/* Present bar */}
                <div
                  style={{ height: `${presentH}%` }}
                  className="w-4 bg-emerald-500 rounded-t-md hover:brightness-110 transition-all"
                  title={`Present: ${d.present}`}
                />
                {/* Late bar */}
                <div
                  style={{ height: `${lateH}%` }}
                  className="w-4 bg-amber-500 rounded-t-md hover:brightness-110 transition-all"
                  title={`Late: ${d.late}`}
                />
                {/* Absent bar */}
                <div
                  style={{ height: `${absentH}%` }}
                  className="w-4 bg-red-400 rounded-t-md hover:brightness-110 transition-all"
                  title={`Absent: ${d.absent}`}
                />
              </div>
              <span className="text-xs font-semibold text-slate-500">{d.label}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-emerald-500" />
          <span className="text-slate-700 dark:text-slate-300">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-amber-500" />
          <span className="text-slate-700 dark:text-slate-300">Late Entry</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-md bg-red-400" />
          <span className="text-slate-700 dark:text-slate-300">Absent</span>
        </div>
      </div>
    </div>
  );
}
