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
  FolderKanban,
  Building2,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency } from "@/lib/format-currency";
import type { Project, ProjectStatus, ProjectPriority } from "../types/project.types";
import { getProjects } from "../services/project.service";
import { ProjectKpiCards } from "./project-kpi-cards";
import { ProjectFormDialog } from "./project-form-dialog";
import { ProjectDetailsDialog } from "./project-details-dialog";
import { ProjectDeleteDialog } from "./project-delete-dialog";

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProjectForDelete, setSelectedProjectForDelete] = useState<Project | null>(null);

  const fetchProjectsData = useCallback(async () => {
    setLoading(true);
    const res = await getProjects({
      search,
      status: statusFilter,
      priority: priorityFilter,
      page,
      limit,
    });

    if (res.success) {
      setProjects(res.data);
      setTotalCount(res.count);
    }
    setLoading(false);
  }, [search, statusFilter, priorityFilter, page, limit]);

  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

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

  const handleOptimisticDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    setTotalCount((prev) => Math.max(0, prev - 1));
    fetchProjectsData();
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "in_progress":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-semibold">In Progress</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold">Completed</Badge>;
      case "planning":
        return <Badge variant="outline" className="text-amber-600">Planning</Badge>;
      case "on_hold":
        return <Badge variant="outline" className="text-slate-500">On Hold</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: ProjectPriority) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive" className="font-bold">Urgent</Badge>;
      case "high":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 font-semibold">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-blue-600">Medium</Badge>;
      case "low":
        return <Badge variant="outline" className="text-slate-500">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Projects Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track active client projects, deliverables, milestones, budgets, and team assignments.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedProjectForEdit(null);
            setFormOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Project
        </Button>
      </div>

      {/* KPI Cards */}
      <ProjectKpiCards projects={projects} totalCount={totalCount} />

      {/* Toolbar */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search projects by title, client, lead..."
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
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
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

            <Button
              variant="outline"
              size="icon"
              onClick={fetchProjectsData}
              className="rounded-xl shrink-0"
              title="Refresh project list"
            >
              <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Project Title</th>
                <th className="px-6 py-4 font-semibold">Client Name</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold w-44">Completion Progress</th>
                <th className="px-6 py-4 font-semibold text-right">Budget</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading workspace projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6">
                    <EmptyState
                      title="No Active Projects Found"
                      description="No projects match your current filter. Create a new project to start tracking project milestones."
                      actionLabel="Create Project"
                      onAction={() => setFormOpen(true)}
                    />
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <FolderKanban className="h-4 w-4 text-blue-600 shrink-0" />
                        {project.title}
                      </div>
                      {project.description && (
                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-xs">
                          {project.description}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        {project.client_name}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Users className="h-3 w-3" />
                        Lead: {project.manager_name || "Unassigned"}
                      </div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(project.status)}</td>

                    <td className="px-6 py-4">{getPriorityBadge(project.priority)}</td>

                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Progress</span>
                          <span className="font-bold text-blue-600">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2 bg-slate-100 dark:bg-slate-800" />
                      </div>
                    </td>

                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 text-right">
                      {formatCurrency(project.budget)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProjectForDetails(project);
                            setDetailsOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-blue-600"
                          title="View Project Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProjectForEdit(project);
                            setFormOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-amber-600"
                          title="Edit Project"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProjectForDelete(project);
                            setDeleteOpen(true);
                          }}
                          className="h-8 w-8 text-slate-500 hover:text-red-600"
                          title="Delete Project"
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
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{projects.length}</span> of{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalCount}</span> total projects
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
      <ProjectFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        projectToEdit={selectedProjectForEdit}
        onSuccess={fetchProjectsData}
      />

      <ProjectDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        project={selectedProjectForDetails}
      />

      <ProjectDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        project={selectedProjectForDelete}
        onSuccess={() => {
          if (selectedProjectForDelete) {
            handleOptimisticDelete(selectedProjectForDelete.id);
          } else {
            fetchProjectsData();
          }
        }}
      />
    </div>
  );
}
