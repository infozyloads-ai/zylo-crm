"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { leadSchema, type LeadFormData } from "../schemas/lead-schema";
import { createLead, updateLead } from "../services/lead.service";
import type { Lead } from "../types/crm.types";

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadToEdit?: Lead | null;
  onSuccess: () => void;
}

export function LeadFormDialog({
  open,
  onOpenChange,
  leadToEdit,
  onSuccess,
}: LeadFormDialogProps) {
  const isEditing = !!leadToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      estimated_value: 0,
      status: "new",
      priority: "medium",
      source: "website",
      assigned_employee_name: "Unassigned",
      notes: "",
      follow_up_date: "",
    },
  });

  useEffect(() => {
    if (leadToEdit) {
      reset({
        company_name: leadToEdit.company_name,
        contact_name: leadToEdit.contact_name,
        email: leadToEdit.email,
        phone: leadToEdit.phone || "",
        estimated_value: leadToEdit.estimated_value || 0,
        status: leadToEdit.status,
        priority: leadToEdit.priority,
        source: leadToEdit.source,
        assigned_employee_name: leadToEdit.assigned_employee_name || "Unassigned",
        notes: leadToEdit.notes || "",
        follow_up_date: leadToEdit.follow_up_date
          ? leadToEdit.follow_up_date.split("T")[0]
          : "",
      });
    } else {
      reset({
        company_name: "",
        contact_name: "",
        email: "",
        phone: "",
        estimated_value: 0,
        status: "new",
        priority: "medium",
        source: "website",
        assigned_employee_name: "Unassigned",
        notes: "",
        follow_up_date: "",
      });
    }
  }, [leadToEdit, reset, open]);

  const onSubmit = async (data: LeadFormData) => {
    let res;
    if (isEditing && leadToEdit) {
      res = await updateLead(leadToEdit.id, data, leadToEdit);
    } else {
      res = await createLead(data);
    }

    if (!res.success) {
      toast.error(isEditing ? "Failed to update lead" : "Failed to create lead", {
        description: res.message,
      });
      return;
    }

    toast.success(isEditing ? "Lead updated successfully" : "Lead created successfully");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Lead Information" : "Create New Lead"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the lead details and save changes."
              : "Fill in the lead information to add them to your pipeline."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Company & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company / Title *</Label>
              <Input
                id="company_name"
                placeholder="Acme Corp"
                disabled={isSubmitting}
                {...register("company_name")}
              />
              {errors.company_name && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.company_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_name">Contact Person *</Label>
              <Input
                id="contact_name"
                placeholder="John Doe"
                disabled={isSubmitting}
                {...register("contact_name")}
              />
              {errors.contact_name && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.contact_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@acme.com"
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="+1 (555) 000-0000"
                disabled={isSubmitting}
                {...register("phone")}
              />
            </div>
          </div>

          {/* Value, Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_value">Estimated Value (₹)</Label>
              <Input
                id="estimated_value"
                type="number"
                step="0.01"
                disabled={isSubmitting}
                {...register("estimated_value", { valueAsNumber: true })}
              />
              {errors.estimated_value && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.estimated_value.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Lead Status</Label>
              <select
                id="status"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("status")}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Source, Assigned & Follow-up */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Lead Source</Label>
              <select
                id="source"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("source")}
              >
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="cold_call">Cold Call</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigned_employee_name">Assigned Employee</Label>
              <Input
                id="assigned_employee_name"
                placeholder="e.g. Sarah Connor"
                disabled={isSubmitting}
                {...register("assigned_employee_name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="follow_up_date">Follow-up Date</Label>
              <Input
                id="follow_up_date"
                type="date"
                disabled={isSubmitting}
                {...register("follow_up_date")}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Requirements</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Add key notes or project requirements..."
              className="w-full p-3 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isSubmitting}
              {...register("notes")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Lead"
              ) : (
                "Create Lead"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
