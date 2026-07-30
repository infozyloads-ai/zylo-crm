import { z } from "zod";

export const clientSchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "Company name is required"),

  contact_name: z
    .string()
    .trim()
    .min(1, "Contact person name is required"),

  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),

  phone: z.string().trim().optional(),

  address: z.string().trim().optional(),

  industry: z.string().trim().optional(),

  client_type: z.enum(["enterprise", "smb", "startup", "individual"]),

  status: z.enum(["active", "inactive", "pending"]),

  lead_id: z.string().optional(),

  total_spent: z.number().min(0, "Total spent cannot be negative"),

  notes: z.string().trim().optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;
