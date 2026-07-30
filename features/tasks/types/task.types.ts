export type TaskStatus = "todo" | "in_progress" | "review" | "completed";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type TaskViewMode = "list" | "kanban" | "calendar";

export interface TaskChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskComment {
  id: string;
  author_name: string;
  text: string;
  created_at: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  url: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  project_id?: string | null;
  project_name: string;
  client_id?: string | null;
  client_name: string;
  assigned_to?: string | null;
  assigned_employee_name: string;
  status: TaskStatus;
  priority: TaskPriority;
  start_date?: string | null;
  due_date?: string | null;
  estimated_hours: number;
  actual_hours: number;
  checklist: TaskChecklistItem[];
  comments: TaskComment[];
  attachments: TaskAttachment[];
  created_at: string;
  updated_at: string;
}

export interface TaskActivity {
  id: string;
  task_id: string;
  user_id?: string | null;
  author_name: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  project?: string;
  assignee?: string;
  page?: number;
  limit?: number;
}
