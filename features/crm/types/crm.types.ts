export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export type LeadSource =
  | "website"
  | "referral"
  | "social_media"
  | "cold_call"
  | "event"
  | "other";

export interface Lead {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  estimated_value: number;
  status: LeadStatus;
  priority: LeadPriority;
  source: LeadSource;
  assigned_to?: string | null;
  assigned_employee_name?: string | null;
  notes?: string | null;
  follow_up_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  user_id?: string | null;
  author_name: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export interface LeadFilters {
  search?: string;
  status?: string;
  priority?: string;
  source?: string;
  page?: number;
  limit?: number;
}
