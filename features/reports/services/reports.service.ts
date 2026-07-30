import type {
  AnalyticsKpis,
  MonthlyDataPoint,
  FunnelStage,
  ProjectStatusDistribution,
  AttendanceTrendPoint,
  ReportTimeframe,
} from "../types/reports.types";

export async function getAnalyticsKpis(): Promise<AnalyticsKpis> {
  return {
    totalRevenue: 284500,
    netProfit: 198200,
    totalExpenses: 86300,
    completedProjects: 14,
    pendingProjects: 6,
    wonLeads: 28,
    lostLeads: 5,
    activeClients: 19,
  };
}

export function getRevenueTrendData(timeframe: ReportTimeframe): MonthlyDataPoint[] {
  if (timeframe === "weekly") {
    return [
      { label: "Mon", revenue: 4200, expenses: 1200, profit: 3000 },
      { label: "Tue", revenue: 6800, expenses: 1900, profit: 4900 },
      { label: "Wed", revenue: 5400, expenses: 1100, profit: 4300 },
      { label: "Thu", revenue: 8900, expenses: 2400, profit: 6500 },
      { label: "Fri", revenue: 9500, expenses: 2800, profit: 6700 },
      { label: "Sat", revenue: 3100, expenses: 800, profit: 2300 },
      { label: "Sun", revenue: 2000, expenses: 500, profit: 1500 },
    ];
  }

  if (timeframe === "yearly") {
    return [
      { label: "2022", revenue: 180000, expenses: 65000, profit: 115000 },
      { label: "2023", revenue: 290000, expenses: 92000, profit: 198000 },
      { label: "2024", revenue: 420000, expenses: 130000, profit: 290000 },
      { label: "2025", revenue: 580000, expenses: 175000, profit: 405000 },
      { label: "2026", revenue: 690000, expenses: 205000, profit: 485000 },
    ];
  }

  // Monthly (Default)
  return [
    { label: "Jan", revenue: 22000, expenses: 7500, profit: 14500 },
    { label: "Feb", revenue: 28000, expenses: 8200, profit: 19800 },
    { label: "Mar", revenue: 35000, expenses: 10500, profit: 24500 },
    { label: "Apr", revenue: 31000, expenses: 9800, profit: 21200 },
    { label: "May", revenue: 42000, expenses: 12400, profit: 29600 },
    { label: "Jun", revenue: 48000, expenses: 14100, profit: 33900 },
    { label: "Jul", revenue: 54000, expenses: 15500, profit: 38500 },
  ];
}

export function getLeadFunnelData(): FunnelStage[] {
  return [
    { stage: "New Lead Inquiries", count: 120, percentage: 100 },
    { stage: "Contacted & Qualified", count: 88, percentage: 73.3 },
    { stage: "Proposal & Quotation", count: 52, percentage: 43.3 },
    { stage: "Negotiation", count: 34, percentage: 28.3 },
    { stage: "Won Deals", count: 28, percentage: 23.3 },
  ];
}

export function getProjectDistributionData(): ProjectStatusDistribution[] {
  return [
    { status: "Completed", count: 14, percentage: 70, color: "#10b981" },
    { status: "In Progress", count: 4, percentage: 20, color: "#2563eb" },
    { status: "On Hold", count: 2, percentage: 10, color: "#f59e0b" },
  ];
}

export function getAttendanceTrendData(): AttendanceTrendPoint[] {
  return [
    { label: "Week 1", present: 48, absent: 2, late: 3 },
    { label: "Week 2", present: 50, absent: 1, late: 1 },
    { label: "Week 3", present: 47, absent: 3, late: 4 },
    { label: "Week 4", present: 49, absent: 1, late: 2 },
  ];
}

// EXPORT FUNCTIONS
export function exportReportCsv(rows: Record<string, string | number>[], filename: string = "zylo-report.csv") {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(",")).join("\n");
  const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(`${headers}\n${body}`);

  const link = document.createElement("a");
  link.setAttribute("href", csvContent);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportReportExcel(rows: Record<string, string | number>[], filename: string = "zylo-analytics.csv") {
  exportReportCsv(rows, filename);
}

export function exportReportPdf(title: string, rows: Record<string, string | number>[]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

  printWindow.document.write(`
    <html>
      <head>
        <title>${title} - Zylo CRM</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #0f172a; }
          .header { border-b: 2px solid #e2e8f0; padding-bottom: 15px; margin-bottom: 25px; }
          .title { font-size: 24px; font-weight: bold; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; font-size: 13px; }
          th { background: #f8fafc; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${title}</div>
          <p style="color: #64748b; font-size: 13px;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              ${headers.map((h) => `<th>${h.toUpperCase()}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                ${Object.values(r)
                  .map((v) => `<td>${v}</td>`)
                  .join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}
