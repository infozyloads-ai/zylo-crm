import { z } from "zod";

export const projectSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Project title is required"),

  description: z.string().trim().optional(),

  client_name: z
    .string()
    .trim()
    .min(1, "Client name is required"),

  client_id: z.string().optional(),

  status: z.enum([
    "planning",
    "in_progress",
    "on_hold",
    "completed",
    "cancelled",
  ]),

  priority: z.enum(["low", "medium", "high", "urgent"]),

  budget: z.number().min(0, "Budget cannot be negative"),

  progress: z
    .number()
    .min(0, "Progress cannot be less than 0%")
    .max(100, "Progress cannot exceed 100%"),

  start_date: z.string().optional(),

  end_date: z.string().optional(),

  assigned_team_str: z.string().trim().optional(),

  manager_name: z.string().trim().optional(),

  notes: z.string().trim().optional(),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
