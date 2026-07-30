export type ProjectStatus =
  | "planning"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ProjectPriority = "low" | "medium" | "high" | "urgent";

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  client_id?: string | null;
  client_name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  budget: number;
  progress: number; // 0 - 100
  start_date?: string | null;
  end_date?: string | null;
  assigned_team: string[];
  manager_name: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  title: string;
  due_date?: string | null;
  completed: boolean;
  created_at: string;
}

export interface ProjectActivity {
  id: string;
  project_id: string;
  user_id?: string | null;
  author_name: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export interface ProjectFilters {
  search?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}
