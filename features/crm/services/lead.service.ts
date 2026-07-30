import { supabase } from "@/lib/supabase/client";
import type { Lead, LeadActivity, LeadFilters } from "../types/crm.types";
import type { LeadFormData } from "../schemas/lead-schema";

export async function getLeads(filters: LeadFilters = {}) {
  try {
    const {
      search,
      status,
      priority,
      source,
      page = 1,
      limit = 10,
    } = filters;

    let query = supabase.from("leads").select("*", { count: "exact" });

    if (search && search.trim() !== "") {
      const s = search.trim();
      query = query.or(
        `company_name.ilike.%${s}%,contact_name.ilike.%${s}%,email.ilike.%${s}%,phone.ilike.%${s}%`
      );
    }

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (priority && priority !== "all") {
      query = query.eq("priority", priority);
    }

    if (source && source !== "all") {
      query = query.eq("source", source);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.order("created_at", { ascending: false }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching leads:", error.message);
      return { success: false, data: [] as Lead[], count: 0, error: error.message };
    }

    return {
      success: true,
      data: (data as Lead[]) || [],
      count: count || 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch leads";
    return { success: false, data: [] as Lead[], count: 0, error: message };
  }
}

export async function getLeadById(id: string) {
  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return { success: false, data: null, error: error.message };
    }

    return { success: true, data: data as Lead };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch lead";
    return { success: false, data: null, error: message };
  }
}

export async function createLead(formData: LeadFormData) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    const payload = {
      company_name: formData.company_name,
      contact_name: formData.contact_name,
      email: formData.email,
      phone: formData.phone || null,
      estimated_value: formData.estimated_value || 0,
      status: formData.status,
      priority: formData.priority,
      source: formData.source,
      assigned_to: currentUser?.id || null,
      assigned_employee_name:
        formData.assigned_employee_name || currentUser?.email || "Unassigned",
      notes: formData.notes || null,
      follow_up_date: formData.follow_up_date || null,
    };

    const { data, error } = await supabase
      .from("leads")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    // Log initial creation activity
    if (data?.id) {
      await addLeadActivity(
        data.id,
        `Lead created for '${formData.company_name}' with status '${formData.status}'`,
        "Created"
      );

      if (formData.follow_up_date) {
        await addLeadActivity(
          data.id,
          `Follow-up date scheduled for ${formData.follow_up_date}`,
          "Follow-up Added"
        );
      }

      if (formData.notes) {
        await addLeadActivity(
          data.id,
          `Initial note added: ${formData.notes}`,
          "Note Added"
        );
      }
    }

    return { success: true, message: "Lead created successfully", data: data as Lead };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create lead";
    return { success: false, message };
  }
}

export async function updateLead(
  id: string,
  formData: LeadFormData,
  existingLead?: Lead | null
) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    const payload = {
      company_name: formData.company_name,
      contact_name: formData.contact_name,
      email: formData.email,
      phone: formData.phone || null,
      estimated_value: formData.estimated_value || 0,
      status: formData.status,
      priority: formData.priority,
      source: formData.source,
      assigned_to: currentUser?.id || existingLead?.assigned_to || null,
      assigned_employee_name:
        formData.assigned_employee_name ||
        existingLead?.assigned_employee_name ||
        "Unassigned",
      notes: formData.notes || null,
      follow_up_date: formData.follow_up_date || null,
    };

    const { data, error } = await supabase
      .from("leads")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    // Automatic granular activity logs
    if (existingLead) {
      if (existingLead.status !== formData.status) {
        await addLeadActivity(
          id,
          `Status changed from '${existingLead.status}' to '${formData.status}'`,
          "Status Changed"
        );
      }

      if (
        existingLead.follow_up_date !== formData.follow_up_date &&
        formData.follow_up_date
      ) {
        await addLeadActivity(
          id,
          `Follow-up date scheduled for ${formData.follow_up_date}`,
          "Follow-up Added"
        );
      }

      if (existingLead.notes !== formData.notes && formData.notes) {
        await addLeadActivity(
          id,
          `Note updated: ${formData.notes}`,
          "Note Added"
        );
      }
    }

    await addLeadActivity(
      id,
      `Lead updated. Status: '${formData.status}', Priority: '${formData.priority}'`,
      "Updated"
    );

    return { success: true, message: "Lead updated successfully", data: data as Lead };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update lead";
    return { success: false, message };
  }
}

export async function deleteLead(id: string) {
  try {
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Lead deleted successfully" };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete lead";
    return { success: false, message };
  }
}

export async function getLeadActivities(leadId: string) {
  try {
    const { data, error } = await supabase
      .from("lead_activities")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, data: [] as LeadActivity[], error: error.message };
    }

    return { success: true, data: (data as LeadActivity[]) || [] };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch activities";
    return { success: false, data: [] as LeadActivity[], error: message };
  }
}

export async function addLeadActivity(
  leadId: string,
  description: string,
  activityType: string = "Note Added"
) {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const currentUser = authData?.user;

    const payload = {
      lead_id: leadId,
      user_id: currentUser?.id || null,
      author_name: currentUser?.email || "System Admin",
      activity_type: activityType,
      description,
    };

    const { data, error } = await supabase
      .from("lead_activities")
      .insert([payload])
      .select()
      .single();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, data: data as LeadActivity };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to add activity";
    return { success: false, message };
  }
}
