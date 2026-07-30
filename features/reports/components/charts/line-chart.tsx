"use client";

import type { MonthlyDataPoint } from "../../types/reports.types";

interface LineChartProps {
  data: MonthlyDataPoint[];
}

export function LineChart({ data }: LineChartProps) {
  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 240;
  const padding = 40;

  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.expenses))) * 1.15 || 10000;

  const pointsRev = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.revenue / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  });

  const pointsExp = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.expenses / maxVal) * (height - padding * 2);
    return `${x},${y}`;
  });

  const areaPathRev = `M ${padding},${height - padding} L ${pointsRev.join(
    " L "
  )} L ${width - padding},${height - padding} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-60 overflow-visible">
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = height - padding - ratio * (height - padding * 2);
          const val = Math.round(ratio * maxVal);
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                className="text-slate-100 dark:text-slate-800"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={y + 4}
                textAnchor="end"
                className="text-[10px] fill-slate-400 font-mono"
              >
                ${(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPathRev} fill="url(#revenueGrad)" />

        {/* Revenue line */}
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pointsRev.join(" ")}
        />

        {/* Expense line */}
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeDasharray="5 5"
          strokeLinecap="round"
          points={pointsExp.join(" ")}
        />

        {/* Data points & X labels */}
        {data.map((d, idx) => {
          const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
          const yRev = height - padding - (d.revenue / maxVal) * (height - padding * 2);

          return (
            <g key={idx}>
              <circle cx={x} cy={yRev} r="4" fill="#2563eb" className="hover:r-6 transition-all" />
              <text
                x={x}
                y={height - padding + 20}
                textAnchor="middle"
                className="text-[11px] fill-slate-500 font-semibold"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-600" />
          <span className="text-slate-700 dark:text-slate-300">Gross Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-slate-700 dark:text-slate-300">Expenses</span>
        </div>
      </div>
    </div>
  );
}
