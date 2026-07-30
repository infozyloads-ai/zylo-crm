import { supabase } from "@/lib/supabase/client";
import type { Client, ClientActivity, ClientFilters } from "../types/client.types";
import type { ClientFormData } from "../schemas/client-schema";

export async function getClients(filters: ClientFilters = {}) {
  try {
    const { search, status, client_type, page = 1, limit = 10 } = filters;

    let query = supabase.from("clients").select("*", { count: "exact" });

    if (search && search.trim() !== "") {
      const s = search.trim();
      query = query.or(
        `company_name.ilike.%${s}%,contact_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%`
      );
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (client_type && client_type !== "all") {
      query = query.eq("client_type", client_type);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching clients:", error.message);
      return { success: false, data: [] as Client[], count: 0, error: error.message };
    }

    return {
      success: true,
      data: (data as Client[]) || [],
      count: count || 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch clients";
    return { success: false, data: [] as Client[], count: 0, error: message };
  }
}

export async function getClientById(id: string) {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as Client };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch client";
    return { success: false, data: null, error: message };
  }
}

export async function createClient(formData: ClientFormData) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    const payload = {
      company_name: formData.company_name,
      contact_name: formData.contact_name,
      email: formData.email,
      phone: formData.phone || null,
      address: formData.address || null,
      industry: formData.industry || null,
      client_type: formData.client_type,
      status: formData.status,
      lead_id: formData.lead_id || null,
      total_spent: formData.total_spent || 0,
      notes: formData.notes || null,
    };

    const { data, error } = await supabase
      .from("clients")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    if (data?.id) {
      await addClientActivity(
        data.id,
        `Client profile onboarded for '${formData.company_name}' as ${formData.client_type.toUpperCase()}`,
        "Created"
      );
    }

    return { success: true, message: "Client created successfully", data: data as Client };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create client";
    return { success: false, message };
  }
}

export async function updateClient(
  id: string,
  formData: ClientFormData,
  existingClient?: Client | null
) {
  try {
    const payload = {
      company_name: formData.company_name,
      contact_name: formData.contact_name,
      email: formData.email,
      phone: formData.phone || null,
      address: formData.address || null,
      industry: formData.industry || null,
      client_type: formData.client_type,
      status: formData.status,
      lead_id: formData.lead_id || null,
      total_spent: formData.total_spent || 0,
      notes: formData.notes || null,
    };

    const { data, error } = await supabase
      .from("clients")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    if (existingClient && existingClient.status !== formData.status) {
      await addClientActivity(
        id,
        `Status updated from '${existingClient.status}' to '${formData.status}'`,
        "Status Changed"
      );
    }

    await addClientActivity(
      id,
      `Client profile details updated`,
      "Updated"
    );

    return { success: true, message: "Client updated successfully", data: data as Client };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update client";
    return { success: false, message };
  }
}

export async function deleteClient(id: string) {
  try {
    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Client deleted successfully" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete client";
    return { success: false, message };
  }
}

export async function getClientActivities(clientId: string) {
  try {
    const { data, error } = await supabase
      .from("client_activities")
      .select("*")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, data: [] as ClientActivity[], error: error.message };
    }

    return { success: true, data: (data as ClientActivity[]) || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch activities";
    return { success: false, data: [] as ClientActivity[], error: message };
  }
}

export async function addClientActivity(
  clientId: string,
  description: string,
  activityType: string = "Note Added"
) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    const payload = {
      client_id: clientId,
      user_id: currentUser?.id || null,
      author_name: currentUser?.email || "System Admin",
      activity_type: activityType,
      description,
    };

    const { data, error } = await supabase
      .from("client_activities")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, data: data as ClientActivity };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add activity";
    return { success: false, message };
  }
}
