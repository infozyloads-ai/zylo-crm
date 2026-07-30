"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, List, LayoutGrid, Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Task, TaskViewMode } from "../types/task.types";
import { getTasks } from "../services/task.service";
import { TaskSummaryWidgets } from "./task-summary-widgets";
import { TaskListTable } from "./task-list-table";
import { TaskKanbanBoard } from "./task-kanban-board";
import { TaskCalendarView } from "./task-calendar-view";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskDetailsDialog } from "./task-details-dialog";
import { TaskDeleteDialog } from "./task-delete-dialog";

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<TaskViewMode>("list");

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modals state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedTaskForDetails, setSelectedTaskForDetails] = useState<Task | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTaskForDelete, setSelectedTaskForDelete] = useState<Task | null>(null);

  const fetchTasksData = useCallback(async () => {
    setLoading(true);
    const res = await getTasks({
      search,
      status: statusFilter,
      priority: priorityFilter,
      page,
      limit,
    });

    if (res.success) {
      setTasks(res.data);
      setTotalCount(res.count);
    }
    setLoading(false);
  }, [search, statusFilter, priorityFilter, page, limit]);

  useEffect(() => {
    fetchTasksData();
  }, [fetchTasksData]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handleOptimisticDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setTotalCount((prev) => Math.max(0, prev - 1));
    fetchTasksData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Tasks Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Organize workspace tasks, sprint deliverables, checklists, and team deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Switcher */}
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 px-3 text-xs rounded-lg font-semibold"
            >
              <List className="h-3.5 w-3.5 mr-1.5" />
              List
            </Button>
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="h-8 px-3 text-xs rounded-lg font-semibold"
            >
              <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
              Kanban
            </Button>
            <Button
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="h-8 px-3 text-xs rounded-lg font-semibold"
            >
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
              Calendar
            </Button>
          </div>

          <Button
            onClick={() => {
              setSelectedTaskForEdit(null);
              setFormOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Task
          </Button>
        </div>
      </div>

      {/* Summary Metrics & Overdue Task Widgets */}
      <TaskSummaryWidgets
        tasks={tasks}
        totalCount={totalCount}
        onSelectTask={(task) => {
          setSelectedTaskForDetails(task);
          setDetailsOpen(true);
        }}
      />

      {/* Main Active View */}
      {viewMode === "list" && (
        <TaskListTable
          tasks={tasks}
          loading={loading}
          totalCount={totalCount}
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityChange={setPriorityFilter}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onRefresh={fetchTasksData}
          onSelectTaskForDetails={(task) => {
            setSelectedTaskForDetails(task);
            setDetailsOpen(true);
          }}
          onSelectTaskForEdit={(task) => {
            setSelectedTaskForEdit(task);
            setFormOpen(true);
          }}
          onSelectTaskForDelete={(task) => {
            setSelectedTaskForDelete(task);
            setDeleteOpen(true);
          }}
          onOpenCreateDialog={() => {
            setSelectedTaskForEdit(null);
            setFormOpen(true);
          }}
        />
      )}

      {viewMode === "kanban" && (
        <TaskKanbanBoard
          tasks={tasks}
          onSelectTask={(task) => {
            setSelectedTaskForDetails(task);
            setDetailsOpen(true);
          }}
          onRefresh={fetchTasksData}
        />
      )}

      {viewMode === "calendar" && (
        <TaskCalendarView
          tasks={tasks}
          onSelectTask={(task) => {
            setSelectedTaskForDetails(task);
            setDetailsOpen(true);
          }}
        />
      )}

      {/* Modals */}
      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        taskToEdit={selectedTaskForEdit}
        onSuccess={fetchTasksData}
      />

      <TaskDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        task={selectedTaskForDetails}
        onRefresh={fetchTasksData}
      />

      <TaskDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        task={selectedTaskForDelete}
        onSuccess={() => {
          if (selectedTaskForDelete) {
            handleOptimisticDelete(selectedTaskForDelete.id);
          } else {
            fetchTasksData();
          }
        }}
      />
    </div>
  );
}
