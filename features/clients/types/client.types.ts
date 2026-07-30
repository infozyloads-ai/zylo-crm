export type ClientStatus = "active" | "inactive" | "pending";

export type ClientType = "enterprise" | "smb" | "startup" | "individual";

export interface Client {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  industry?: string | null;
  client_type: ClientType;
  status: ClientStatus;
  lead_id?: string | null;
  total_projects?: number;
  total_spent?: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientActivity {
  id: string;
  client_id: string;
  user_id?: string | null;
  author_name: string;
  activity_type: string;
  description: string;
  created_at: string;
}

export interface ClientFilters {
  search?: string;
  status?: string;
  client_type?: string;
  page?: number;
  limit?: number;
}
