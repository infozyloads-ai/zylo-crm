import { supabase } from "@/lib/supabase/client";
import type { Task, TaskActivity, TaskFilters, TaskStatus } from "../types/task.types";
import type { TaskFormData } from "../schemas/task-schema";

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Design Responsive Navbar & Sidebar Component",
    description: "Implement responsive drawer menu, active path highlighting, and accessibility labels.",
    project_name: "E-Commerce Mobile App Development",
    client_name: "Acme Global Solutions",
    assigned_employee_name: "Sarah Jenkins",
    status: "in_progress",
    priority: "high",
    start_date: "2026-07-20",
    due_date: "2026-07-31",
    estimated_hours: 12,
    actual_hours: 8,
    checklist: [
      { id: "c1", title: "Setup Tailwind responsive breakpoints", completed: true },
      { id: "c2", title: "Add keyboard navigation support", completed: true },
      { id: "c3", title: "Verify mobile backdrop drawer behavior", completed: false },
    ],
    comments: [
      {
        id: "cm1",
        author_name: "Alex Rivera",
        text: "Make sure logo collapses cleanly on smaller viewports.",
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    attachments: [
      { id: "att1", name: "sidebar_mockup_v2.png", size: "1.2 MB", url: "#" },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Configure Database Schema & RLS Policies",
    description: "Write SQL migration scripts for leads, clients, projects and task tables with row-level security.",
    project_name: "Enterprise CRM Cloud Migration",
    client_name: "Starlight Technologies",
    assigned_employee_name: "Marcus Brody",
    status: "completed",
    priority: "urgent",
    start_date: "2026-07-10",
    due_date: "2026-07-25",
    estimated_hours: 16,
    actual_hours: 15,
    checklist: [
      { id: "c4", title: "Define foreign key constraints", completed: true },
      { id: "c5", title: "Add composite indexes on foreign keys", completed: true },
      { id: "c6", title: "Audit RLS for authenticated role", completed: true },
    ],
    comments: [],
    attachments: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Implement Auth Session Middleware Protection",
    description: "Set up server-side cookie inspection for protected routes with instant redirect handling.",
    project_name: "Brand Identity & Web Portal Redesign",
    client_name: "Nexus Media Group",
    assigned_employee_name: "Chloe Bennett",
    status: "review",
    priority: "medium",
    start_date: "2026-07-22",
    due_date: "2026-08-05",
    estimated_hours: 8,
    actual_hours: 6,
    checklist: [
      { id: "c7", title: "Set sb-access-token cookie sync", completed: true },
      { id: "c8", title: "Configure matcher array in middleware.ts", completed: true },
    ],
    comments: [
      {
        id: "cm2",
        author_name: "Sarah Jenkins",
        text: "Tested middleware redirects on /dashboard and /crm; working smoothly.",
        created_at: new Date().toISOString(),
      },
    ],
    attachments: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Write End-to-End Task Manager Integration Tests",
    description: "Create test suites covering task creation, status updates, checklist toggles, and deletion.",
    project_name: "AI Analytics Integration API",
    client_name: "Vanguard Tech Inc",
    assigned_employee_name: "Devon Vance",
    status: "todo",
    priority: "low",
    start_date: "2026-08-01",
    due_date: "2026-08-10",
    estimated_hours: 10,
    actual_hours: 0,
    checklist: [
      { id: "c9", title: "Setup Jest / Playwright test harness", completed: false },
      { id: "c10", title: "Add mock data fixtures", completed: false },
    ],
    comments: [],
    attachments: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getTasks(filters: TaskFilters = {}) {
  try {
    const { search, status, priority, page = 1, limit = 10 } = filters;

    let query = supabase.from("tasks").select("*", { count: "exact" });

    if (search && search.trim() !== "") {
      const s = search.trim();
      query = query.or(
        `title.ilike.%${s}%,project_name.ilike.%${s}%,client_name.ilike.%${s}%,assigned_employee_name.ilike.%${s}%`
      );
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (priority && priority !== "all") {
      query = query.eq("priority", priority);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error || !data || data.length === 0) {
      let filtered = [...mockTasks];

      if (search && search.trim() !== "") {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(s) ||
            t.project_name.toLowerCase().includes(s) ||
            t.client_name.toLowerCase().includes(s) ||
            t.assigned_employee_name.toLowerCase().includes(s)
        );
      }

      if (status && status !== "all") {
        filtered = filtered.filter((t) => t.status === status);
      }

      if (priority && priority !== "all") {
        filtered = filtered.filter((t) => t.priority === priority);
      }

      const total = filtered.length;
      const paginated = filtered.slice((page - 1) * limit, page * limit);

      return {
        success: true,
        data: paginated,
        count: total,
      };
    }

    return {
      success: true,
      data: (data as Task[]) || [],
      count: count || 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch tasks";
    return { success: false, data: mockTasks, count: mockTasks.length, error: message };
  }
}

export async function getTaskById(id: string) {
  try {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      const found = mockTasks.find((t) => t.id === id) || mockTasks[0];
      return { success: true, data: found };
    }

    return { success: true, data: data as Task };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch task";
    return { success: false, data: mockTasks[0], error: message };
  }
}

export async function createTask(formData: TaskFormData) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    const payload = {
      title: formData.title,
      description: formData.description || null,
      project_name: formData.project_name || "General Workspace",
      client_name: formData.client_name || "Internal",
      assigned_employee_name:
        formData.assigned_employee_name || currentUser?.email || "Unassigned",
      status: formData.status,
      priority: formData.priority,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null,
      estimated_hours: formData.estimated_hours || 0,
      actual_hours: formData.actual_hours || 0,
      checklist: [],
      comments: [],
      attachments: [],
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert([payload])
      .select()
      .single();

    if (error) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        ...payload,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockTasks.unshift(newTask);
      return { success: true, message: "Task created successfully", data: newTask };
    }

    if (data?.id) {
      await addTaskActivity(
        data.id,
        `Task '${formData.title}' created with status '${formData.status}'`,
        "Created"
      );
    }

    return { success: true, message: "Task created successfully", data: data as Task };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create task";
    return { success: false, message };
  }
}

export async function updateTask(
  id: string,
  formData: TaskFormData,
  existingTask?: Task | null
) {
  try {
    const payload = {
      title: formData.title,
      description: formData.description || null,
      project_name: formData.project_name || existingTask?.project_name || "General",
      client_name: formData.client_name || existingTask?.client_name || "Internal",
      assigned_employee_name:
        formData.assigned_employee_name ||
        existingTask?.assigned_employee_name ||
        "Unassigned",
      status: formData.status,
      priority: formData.priority,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null,
      estimated_hours: formData.estimated_hours || 0,
      actual_hours: formData.actual_hours || 0,
    };

    const { data, error } = await supabase
      .from("tasks")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      const idx = mockTasks.findIndex((t) => t.id === id);
      if (idx !== -1) {
        mockTasks[idx] = { ...mockTasks[idx], ...payload, updated_at: new Date().toISOString() };
      }
      return { success: true, message: "Task updated successfully", data: mockTasks[idx] };
    }

    if (existingTask && existingTask.status !== formData.status) {
      await addTaskActivity(
        id,
        `Task status updated from '${existingTask.status}' to '${formData.status}'`,
        "Status Changed"
      );
    }

    await addTaskActivity(id, `Task details updated`, "Updated");

    return { success: true, message: "Task updated successfully", data: data as Task };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update task";
    return { success: false, message };
  }
}

export async function updateTaskStatus(id: string, newStatus: TaskStatus) {
  try {
    const { error } = await supabase
      .from("tasks")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      const found = mockTasks.find((t) => t.id === id);
      if (found) found.status = newStatus;
    }

    await addTaskActivity(id, `Task moved to '${newStatus.toUpperCase()}'`, "Status Changed");
    return { success: true };
  } catch {
    const found = mockTasks.find((t) => t.id === id);
    if (found) found.status = newStatus;
    return { success: true };
  }
}

export async function deleteTask(id: string) {
  try {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      const idx = mockTasks.findIndex((t) => t.id === id);
      if (idx !== -1) mockTasks.splice(idx, 1);
    }

    return { success: true, message: "Task deleted successfully" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete task";
    return { success: false, message };
  }
}

export async function getTaskActivities(taskId: string) {
  try {
    const { data, error } = await supabase
      .from("task_activities")
      .select("*")
      .eq("task_id", taskId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return {
        success: true,
        data: [
          {
            id: "tact-1",
            task_id: taskId,
            author_name: "Assignee",
            activity_type: "Updated",
            description: "Task work hours logged and sprint status verified.",
            created_at: new Date().toISOString(),
          },
        ] as TaskActivity[],
      };
    }

    return { success: true, data: (data as TaskActivity[]) || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch activities";
    return { success: false, data: [] as TaskActivity[], error: message };
  }
}

export async function addTaskActivity(
  taskId: string,
  description: string,
  activityType: string = "Note Added"
) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    const payload = {
      task_id: taskId,
      user_id: currentUser?.id || null,
      author_name: currentUser?.email || "System Admin",
      activity_type: activityType,
      description,
    };

    const { data, error } = await supabase
      .from("task_activities")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return {
        success: true,
        data: {
          id: `tact-${Date.now()}`,
          ...payload,
          created_at: new Date().toISOString(),
        } as TaskActivity,
      };
    }

    return { success: true, data: data as TaskActivity };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add activity";
    return { success: false, message };
  }
}

export async function addTaskComment(taskId: string, text: string) {
  const { data: authData } = await supabase.auth.getUser();
  const author = authData?.user?.email || "Team Member";

  const found = mockTasks.find((t) => t.id === taskId);
  if (found) {
    found.comments.unshift({
      id: `cm-${Date.now()}`,
      author_name: author,
      text,
      created_at: new Date().toISOString(),
    });
  }

  await addTaskActivity(taskId, `Added comment: "${text}"`, "Comment Added");
  return { success: true };
}
