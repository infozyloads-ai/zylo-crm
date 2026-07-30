"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
  ListTodo,
  FolderKanban,
  User,
  Calendar,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import type { Task, TaskStatus, TaskPriority } from "../types/task.types";

interface TaskListTableProps {
  tasks: Task[];
  loading: boolean;
  totalCount: number;
  search: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  priorityFilter: string;
  onPriorityChange: (val: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onSelectTaskForDetails: (task: Task) => void;
  onSelectTaskForEdit: (task: Task) => void;
  onSelectTaskForDelete: (task: Task) => void;
  onOpenCreateDialog: () => void;
}

export function TaskListTable({
  tasks,
  loading,
  totalCount,
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  page,
  totalPages,
  onPageChange,
  onRefresh,
  onSelectTaskForDetails,
  onSelectTaskForEdit,
  onSelectTaskForDelete,
  onOpenCreateDialog,
}: TaskListTableProps) {
  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "in_progress":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700 font-semibold">In Progress</Badge>;
      case "completed":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold">Completed</Badge>;
      case "review":
        return <Badge variant="outline" className="text-amber-600">Review</Badge>;
      case "todo":
        return <Badge variant="outline" className="text-slate-500">To Do</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
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
    <div className="space-y-4">
      {/* Toolbar */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search tasks by title, project, assignee..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 text-sm rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 md:flex-initial">
            <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-full"
            >
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Under Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex-1 md:flex-initial">
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityChange(e.target.value)}
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
            onClick={onRefresh}
            className="rounded-xl shrink-0"
            title="Refresh task list"
          >
            <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Task Title</th>
                <th className="px-6 py-4 font-semibold">Project & Client</th>
                <th className="px-6 py-4 font-semibold">Assignee</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Due Date</th>
                <th className="px-6 py-4 font-semibold text-right">Hours</th>
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-600" />
                    Loading workspace tasks...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6">
                    <EmptyState
                      title="No Workspace Tasks Found"
                      description="No tasks match your current filter criteria."
                    />
                  </td>
                </tr>
              ) : (
                tasks.map((task) => {
                  const isOverdue =
                    task.due_date &&
                    task.due_date < new Date().toISOString().split("T")[0] &&
                    task.status !== "completed";

                  return (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <ListTodo className="h-4 w-4 text-blue-600 shrink-0" />
                          {task.title}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
                          {task.project_name}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {task.client_name}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                          <User className="h-3.5 w-3.5 text-blue-600" />
                          {task.assigned_employee_name}
                        </div>
                      </td>

                      <td className="px-6 py-4">{getStatusBadge(task.status)}</td>

                      <td className="px-6 py-4">{getPriorityBadge(task.priority)}</td>

                      <td className="px-6 py-4">
                        <div
                          className={`flex items-center gap-1 text-xs font-semibold ${
                            isOverdue ? "text-red-600 font-bold" : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          {task.due_date || "No due date"}
                        </div>
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 text-right">
                        <span className="flex items-center justify-end gap-1 text-xs">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {task.actual_hours}/{task.estimated_hours}h
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onSelectTaskForDetails(task)}
                            className="h-8 w-8 text-slate-500 hover:text-blue-600"
                            title="View Task Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onSelectTaskForEdit(task)}
                            className="h-8 w-8 text-slate-500 hover:text-amber-600"
                            title="Edit Task"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onSelectTaskForDelete(task)}
                            className="h-8 w-8 text-slate-500 hover:text-red-600"
                            title="Delete Task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
          <p className="text-slate-500 text-xs sm:text-sm">
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{tasks.length}</span> of{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{totalCount}</span> total tasks
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(page - 1, 1))}
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
              onClick={() => onPageChange(Math.min(page + 1, totalPages))}
              disabled={page >= totalPages || loading}
              className="rounded-xl"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
