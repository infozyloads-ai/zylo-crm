export type ReportTimeframe = "weekly" | "monthly" | "yearly";

export type ReportCategory =
  | "overview"
  | "sales"
  | "revenue"
  | "projects"
  | "tasks"
  | "attendance";

export interface AnalyticsKpis {
  totalRevenue: number;
  netProfit: number;
  totalExpenses: number;
  completedProjects: number;
  pendingProjects: number;
  wonLeads: number;
  lostLeads: number;
  activeClients: number;
}

export interface MonthlyDataPoint {
  label: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

export interface ProjectStatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface AttendanceTrendPoint {
  label: string;
  present: number;
  absent: number;
  late: number;
}

export interface ReportFilterOptions {
  timeframe: ReportTimeframe;
  category: ReportCategory;
  startDate?: string;
  endDate?: string;
  department?: string;
  project?: string;
  client?: string;
  status?: string;
}
