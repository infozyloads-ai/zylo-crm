"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
  Calendar,
  Building2,
  User,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/format-currency";
import type { Lead, LeadStatus, LeadPriority } from "../types/crm.types";
import { getLeads } from "../services/lead.service";
import { LeadFormDialog } from "./lead-form-dialog";
import { LeadDetailsDialog } from "./lead-details-dialog";
import { LeadDeleteDialog } from "./lead-delete-dialog";

export function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<Lead | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedLeadForDetails, setSelectedLeadForDetails] = useState<Lead | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedLeadForDelete, setSelectedLeadForDelete] = useState<Lead | null>(null);

  const fetchLeadsData = useCallback(async () => {
    setLoading(true);
    const res = await getLeads({
      search,
      status: statusFilter,
      priority: priorityFilter,
      source: sourceFilter,
      page,
      limit,
    });

    if (res.success) {
      setLeads(res.data);
      setTotalCount(res.count);
    }
    setLoading(false);
  }, [search, statusFilter, priorityFilter, sourceFilter, page, limit]);

  useEffect(() => {
    fetchLeadsData();
  }, [fetchLeadsData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriorityFilter(e.target.value);
    setPage(1);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceFilter(e.target.value);
    setPage(1);
  };

  // Optimistic deletion handler
  const handleOptimisticDelete = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    setTotalCount((prev) => Math.max(0, prev - 1));
    fetchLeadsData();
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700">New</Badge>;
      case "contacted":
        return <Badge variant="secondary" className="bg-cyan-50 text-cyan-700">Contacted</Badge>;
      case "qualified":
        return <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">Qualified</Badge>;
      case "proposal_sent":
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700">Proposal Sent</Badge>;
      case "negotiation":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700">Negotiation</Badge>;
      case "won":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-semibold">Won</Badge>;
      case "lost":
        return <Badge variant="destructive">Lost</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: LeadPriority) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive" className="font-bold">Urgent</Badge>;
      case "high":
        return <Badge variant="secondary" className="bg-rose-50 text-rose-700">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-slate-600">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="text-slate-400">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Leads & Pipeline Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track, manage, and nurture your business leads through your CRM sales pipeline.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedLeadForEdit(null);
            setFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Lead
        </Button>
      </div>

      {/* Search & Filter Toolbar */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search leads by company, contact..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 h-10 text-sm rounded-xl"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-initial">
              <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="negotiation">Negotiation</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="flex-1 md:flex-initial">
              <select
                value={priorityFilter}
                onChange={handlePriorityChange}
                className="h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex-1 md:flex-initial">
              <select
                value={sourceFilter}
                onChange={handleSourceChange}
                className="h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full"
              >
                <option value="all">All Sources</option>
                <option value="website">Website</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social Media</option>
                <option value="cold_call">Cold Call</option>
                <option value="event">Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchLeadsData}
              className="rounded-xl shrink-0"
              title="Refresh leads list"
            >
              <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Company / Lead</th>
                <th className="px-6 py-4 font-semibold">Contact Person</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Assigned To</th>
                <th className="px-6 py-4 font-semibold text-right">Value</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading leads data...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6">
                    <EmptyState
                      title="No CRM Leads Found"
                      description="No leads match your search query or pipeline filter. Create a new lead to populate your pipeline."
                      actionLabel="Create Lead"
                      onAction={() => setFormOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                        {lead.company_name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 capitalize">
                        Source: {lead.source.replace("_", " ")}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {lead.contact_name}
                      </div>
                      <div className="text-xs text-slate-400">{lead.email}</div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(lead.status)}</td>

                    <td className="px-6 py-4">{getPriorityBadge(lead.priority)}</td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                      {lead.assigned_employee_name || "Unassigned"}
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 text-right">
                      {formatCurrency(lead.estimated_value)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedLeadForDetails(lead);
                            setDetailsOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-blue-600"
                          title="View Lead Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedLeadForEdit(lead);
                            setFormOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-amber-600"
                          title="Edit Lead"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedLeadForDelete(lead);
                            setDeleteOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
          <p className="text-slate-500 text-xs sm:text-sm">
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{leads.length}</span> of{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalCount}</span> total leads
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || loading}
              className="rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            <span className="text-xs font-semibold px-2 text-slate-600">
              Page {page} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || loading}
              className="rounded-xl"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <LeadFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        leadToEdit={selectedLeadForEdit}
        onSuccess={fetchLeadsData}
      />

      <LeadDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        lead={selectedLeadForDetails}
      />

      <LeadDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        lead={selectedLeadForDelete}
        onSuccess={() => {
          if (selectedLeadForDelete) {
            handleOptimisticDelete(selectedLeadForDelete.id);
          } else {
            fetchLeadsData();
          }
        }}
      />
    </div>
  );
}
