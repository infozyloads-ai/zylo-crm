"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  User,
  Tag,
  MessageSquare,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Lead, LeadActivity } from "../types/crm.types";
import { getLeadActivities, addLeadActivity } from "../services/lead.service";

interface LeadDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

export function LeadDetailsDialog({
  open,
  onOpenChange,
  lead,
}: LeadDetailsDialogProps) {
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    if (open && lead) {
      loadActivities(lead.id);
    }
  }, [open, lead]);

  const loadActivities = async (leadId: string) => {
    setLoadingActivities(true);
    const res = await getLeadActivities(leadId);
    if (res.success) {
      setActivities(res.data);
    }
    setLoadingActivities(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !newNote.trim()) return;

    setIsAddingNote(true);
    const res = await addLeadActivity(lead.id, newNote.trim(), "note");
    setIsAddingNote(false);

    if (!res.success) {
      toast.error("Failed to add note", { description: res.message });
      return;
    }

    toast.success("Note added to timeline");
    setNewNote("");
    loadActivities(lead.id);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                {lead.company_name}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Lead Details & Activity History
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {lead.status.replace("_", " ")}
              </Badge>
              <Badge
                variant={
                  lead.priority === "urgent" || lead.priority === "high"
                    ? "destructive"
                    : "secondary"
                }
                className="capitalize"
              >
                {lead.priority} priority
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Key Metric Info Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Estimated Value</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center mt-0.5">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                {lead.estimated_value?.toLocaleString() || "0"}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Lead Source</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 capitalize mt-1 block">
                {lead.source.replace("_", " ")}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Assigned Staff</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                {lead.assigned_employee_name || "Unassigned"}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Follow-up Date</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                {lead.follow_up_date
                  ? new Date(lead.follow_up_date).toLocaleDateString()
                  : "Not set"}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <User className="h-4 w-4 text-slate-400" />
                <span>{lead.contact_name}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Mail className="h-4 w-4 text-slate-400" />
                <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                  {lead.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{lead.phone || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {lead.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Notes & Description
              </h4>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {lead.notes}
              </div>
            </div>
          )}

          <Separator />

          {/* Activity Timeline Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Activity Timeline
              </h4>
              <span className="text-xs text-slate-500">
                {activities.length} activity entries
              </span>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <Input
                placeholder="Log a new activity note or call update..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                disabled={isAddingNote}
                className="flex-1 text-sm rounded-xl"
              />
              <Button
                type="submit"
                disabled={isAddingNote || !newNote.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {isAddingNote ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-1 h-4 w-4" />
                    Log Note
                  </>
                )}
              </Button>
            </form>

            {/* Timeline Stream List */}
            {loadingActivities ? (
              <div className="text-center py-6 text-slate-400 text-sm flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading activity history...
              </div>
            ) : activities.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-400 italic">
                No activity entries logged yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-sm space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {act.author_name}
                      </span>
                      <span>
                        {new Date(act.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
