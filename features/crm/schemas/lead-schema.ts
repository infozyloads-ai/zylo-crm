import { z } from "zod";

export const leadSchema = z.object({
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

  estimated_value: z
    .number()
    .min(0, "Estimated value cannot be negative"),

  status: z.enum([
    "new",
    "contacted",
    "qualified",
    "proposal_sent",
    "negotiation",
    "won",
    "lost",
  ]),

  priority: z.enum(["low", "medium", "high", "urgent"]),

  source: z.enum([
    "website",
    "referral",
    "social_media",
    "cold_call",
    "event",
    "other",
  ]),

  assigned_employee_name: z.string().trim().optional(),

  notes: z.string().trim().optional(),

  follow_up_date: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;
