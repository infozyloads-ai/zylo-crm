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
import { clientSchema, type ClientFormData } from "../schemas/client-schema";
import { createClient, updateClient } from "../services/client.service";
import type { Client } from "../types/client.types";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientToEdit?: Client | null;
  onSuccess: () => void;
}

export function ClientFormDialog({
  open,
  onOpenChange,
  clientToEdit,
  onSuccess,
}: ClientFormDialogProps) {
  const isEditing = !!clientToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      address: "",
      industry: "",
      client_type: "smb",
      status: "active",
      total_spent: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (clientToEdit) {
      reset({
        company_name: clientToEdit.company_name,
        contact_name: clientToEdit.contact_name,
        email: clientToEdit.email,
        phone: clientToEdit.phone || "",
        address: clientToEdit.address || "",
        industry: clientToEdit.industry || "",
        client_type: clientToEdit.client_type,
        status: clientToEdit.status,
        total_spent: clientToEdit.total_spent || 0,
        notes: clientToEdit.notes || "",
      });
    } else {
      reset({
        company_name: "",
        contact_name: "",
        email: "",
        phone: "",
        address: "",
        industry: "",
        client_type: "smb",
        status: "active",
        total_spent: 0,
        notes: "",
      });
    }
  }, [clientToEdit, reset, open]);

  const onSubmit = async (data: ClientFormData) => {
    let res;
    if (isEditing && clientToEdit) {
      res = await updateClient(clientToEdit.id, data, clientToEdit);
    } else {
      res = await createClient(data);
    }

    if (!res.success) {
      toast.error(isEditing ? "Failed to update client" : "Failed to create client", {
        description: res.message,
      });
      return;
    }

    toast.success(isEditing ? "Client updated successfully" : "Client created successfully");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Client Profile" : "Add New Client"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update client company and contact information."
              : "Register a new client company into your CRM."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Company & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                placeholder="Enterprise Corp"
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
              <Label htmlFor="contact_name">Primary Contact Name *</Label>
              <Input
                id="contact_name"
                placeholder="Jane Smith"
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
                placeholder="jane@enterprise.com"
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
                placeholder="+1 (555) 123-4567"
                disabled={isSubmitting}
                {...register("phone")}
              />
            </div>
          </div>

          {/* Industry & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="Software, Healthcare, Finance..."
                disabled={isSubmitting}
                {...register("industry")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Office Address / Location</Label>
              <Input
                id="address"
                placeholder="City, Country"
                disabled={isSubmitting}
                {...register("address")}
              />
            </div>
          </div>

          {/* Client Type, Status & Total Spent */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client_type">Client Tier / Type</Label>
              <select
                id="client_type"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("client_type")}
              >
                <option value="enterprise">Enterprise</option>
                <option value="smb">SMB</option>
                <option value="startup">Startup</option>
                <option value="individual">Individual</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Account Status</Label>
              <select
                id="status"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("status")}
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_spent">Total Lifetime Value (₹)</Label>
              <Input
                id="total_spent"
                type="number"
                step="0.01"
                disabled={isSubmitting}
                {...register("total_spent", { valueAsNumber: true })}
              />
              {errors.total_spent && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.total_spent.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes & Key Relationship Details</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Important client history, billing preferences, or background notes..."
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Client"
              ) : (
                "Create Client"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
