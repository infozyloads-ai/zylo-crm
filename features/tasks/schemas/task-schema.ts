import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required"),

  description: z.string().trim().optional(),

  project_name: z.string().trim().optional(),

  client_name: z.string().trim().optional(),

  assigned_employee_name: z.string().trim().optional(),

  status: z.enum(["todo", "in_progress", "review", "completed"]),

  priority: z.enum(["low", "medium", "high", "urgent"]),

  start_date: z.string().optional(),

  due_date: z.string().optional(),

  estimated_hours: z.number().min(0, "Hours cannot be negative"),

  actual_hours: z.number().min(0, "Hours cannot be negative"),
});

export type TaskFormData = z.infer<typeof taskSchema>;
