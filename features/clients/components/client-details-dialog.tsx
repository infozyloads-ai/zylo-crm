"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
  User,
  Clock,
  Plus,
  Loader2,
  ExternalLink,
  Layers,
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
import type { Client, ClientActivity } from "../types/client.types";
import { getClientActivities, addClientActivity } from "../services/client.service";

interface ClientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
}

export function ClientDetailsDialog({
  open,
  onOpenChange,
  client,
}: ClientDetailsDialogProps) {
  const [activities, setActivities] = useState<ClientActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    if (open && client) {
      loadActivities(client.id);
    }
  }, [open, client]);

  const loadActivities = async (clientId: string) => {
    setLoadingActivities(true);
    const res = await getClientActivities(clientId);
    if (res.success) {
      setActivities(res.data);
    }
    setLoadingActivities(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client || !newNote.trim()) return;

    setIsAddingNote(true);
    const res = await addClientActivity(client.id, newNote.trim(), "Note Added");
    setIsAddingNote(false);

    if (!res.success) {
      toast.error("Failed to add note", { description: res.message });
      return;
    }

    toast.success("Client note logged to timeline");
    setNewNote("");
    loadActivities(client.id);
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                {client.company_name}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Client Account Profile & Activity Logs
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  client.status === "active"
                    ? "secondary"
                    : client.status === "pending"
                    ? "outline"
                    : "destructive"
                }
                className={
                  client.status === "active" ? "bg-emerald-50 text-emerald-700" : ""
                }
              >
                {client.status.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {client.client_type}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Key Metrics Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Lifetime Value</span>
              <span className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center mt-0.5">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                {client.total_spent?.toLocaleString() || "0"}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Industry</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                {client.industry || "General"}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Account Type</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 capitalize mt-1 block">
                {client.client_type}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Client Since</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                {new Date(client.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Contact & Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Contact Person
              </h4>
              <div className="text-sm space-y-1.5 pt-1">
                <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                  <User className="h-4 w-4 text-blue-600" />
                  {client.contact_name}
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {client.phone || "N/A"}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Location & Office
              </h4>
              <div className="text-sm space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  {client.address || "No office address specified"}
                </div>
                {client.lead_id && (
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-medium pt-1">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Onboarded from Qualified CRM Lead
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Linked Projects Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Layers className="h-4 w-4 text-indigo-600" />
              Linked Projects Summary
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Active Projects Account
                </p>
                <p className="text-xs text-slate-500">
                  Client has ongoing project deliverables linked to your team.
                </p>
              </div>
              <Badge variant="outline" className="bg-white dark:bg-slate-950 font-bold">
                {client.total_projects || 1} Project(s)
              </Badge>
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Relationship Notes
              </h4>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {client.notes}
              </div>
            </div>
          )}

          <Separator />

          {/* Activity Timeline Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Account Activity Stream
              </h4>
              <span className="text-xs text-slate-500">
                {activities.length} activity entries
              </span>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <Input
                placeholder="Log a client interaction, meeting note, or account update..."
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
                Loading account timeline...
              </div>
            ) : activities.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-400 italic">
                No activity entries logged yet for this client.
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
