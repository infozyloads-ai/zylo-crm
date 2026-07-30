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
  Building2,
  User,
  Loader2,
  RefreshCw,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/format-currency";
import type { Client, ClientStatus, ClientType } from "../types/client.types";
import { getClients } from "../services/client.service";
import { ClientFormDialog } from "./client-form-dialog";
import { ClientDetailsDialog } from "./client-details-dialog";
import { ClientDeleteDialog } from "./client-delete-dialog";

export function ClientList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedClientForEdit, setSelectedClientForEdit] = useState<Client | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedClientForDetails, setSelectedClientForDetails] = useState<Client | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedClientForDelete, setSelectedClientForDelete] = useState<Client | null>(null);

  const fetchClientsData = useCallback(async () => {
    setLoading(true);
    const res = await getClients({
      search,
      status: statusFilter,
      client_type: typeFilter,
      page,
      limit,
    });

    if (res.success) {
      setClients(res.data);
      setTotalCount(res.count);
    }
    setLoading(false);
  }, [search, statusFilter, typeFilter, page, limit]);

  useEffect(() => {
    fetchClientsData();
  }, [fetchClientsData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
    setPage(1);
  };

  // Optimistic deletion
  const handleOptimisticDelete = (clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    setTotalCount((prev) => Math.max(0, prev - 1));
    fetchClientsData();
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const getStatusBadge = (status: ClientStatus) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-semibold">Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-600">Pending</Badge>;
      case "inactive":
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: ClientType) => {
    switch (type) {
      case "enterprise":
        return <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 font-bold">Enterprise</Badge>;
      case "smb":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700">SMB</Badge>;
      case "startup":
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700">Startup</Badge>;
      case "individual":
        return <Badge variant="outline" className="text-slate-500">Individual</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Clients Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your active client accounts, profiles, contact info, and lifetime value.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedClientForEdit(null);
            setFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Client
        </Button>
      </div>

      {/* Toolbar */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search clients by company, contact, phone..."
              value={search}
              onChange={handleSearchChange}
              className="pl-9 h-10 text-sm rounded-xl"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-initial">
              <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex-1 md:flex-initial">
              <select
                value={typeFilter}
                onChange={handleTypeChange}
                className="h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full"
              >
                <option value="all">All Client Tiers</option>
                <option value="enterprise">Enterprise</option>
                <option value="smb">SMB</option>
                <option value="startup">Startup</option>
                <option value="individual">Individual</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={fetchClientsData}
              className="rounded-xl shrink-0"
              title="Refresh clients list"
            >
              <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clients Data Table */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Company / Client</th>
                <th className="px-6 py-4 font-semibold">Contact Person</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tier</th>
                <th className="px-6 py-4 font-semibold">Industry</th>
                <th className="px-6 py-4 font-semibold text-right">Lifetime Value</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading client accounts...
                  </td>
                </tr>
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6">
                    <EmptyState
                      title="No Client Accounts Found"
                      description="No client accounts match your search filter. Onboard a new client to start tracking client accounts."
                      actionLabel="Onboard Client"
                      onAction={() => setFormOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-blue-600 shrink-0" />
                        {client.company_name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {client.address || "No location listed"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {client.contact_name}
                      </div>
                      <div className="text-xs text-slate-400">{client.email}</div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(client.status)}</td>

                    <td className="px-6 py-4">{getTypeBadge(client.client_type)}</td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                      {client.industry || "General"}
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 text-right">
                      {formatCurrency(client.total_spent)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedClientForDetails(client);
                            setDetailsOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-blue-600"
                          title="View Client Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedClientForEdit(client);
                            setFormOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-amber-600"
                          title="Edit Client"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedClientForDelete(client);
                            setDeleteOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          title="Delete Client"
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
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{clients.length}</span> of{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalCount}</span> total clients
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
      <ClientFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        clientToEdit={selectedClientForEdit}
        onSuccess={fetchClientsData}
      />

      <ClientDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        client={selectedClientForDetails}
      />

      <ClientDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        client={selectedClientForDelete}
        onSuccess={() => {
          if (selectedClientForDelete) {
            handleOptimisticDelete(selectedClientForDelete.id);
          } else {
            fetchClientsData();
          }
        }}
      />
    </div>
  );
}
