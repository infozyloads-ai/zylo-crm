"use client";

import { Calendar, User, Clock, ChevronRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "../types/task.types";
import { updateTaskStatus } from "../services/task.service";

interface TaskKanbanBoardProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onRefresh: () => void;
}

const columns: { key: TaskStatus; label: string; color: string }[] = [
  { key: "todo", label: "To Do", color: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300" },
  { key: "review", label: "Under Review", color: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300" },
  { key: "completed", label: "Completed", color: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300" },
];

export function TaskKanbanBoard({
  tasks,
  onSelectTask,
  onRefresh,
}: TaskKanbanBoardProps) {
  const handleStatusMove = async (
    e: React.MouseEvent,
    taskId: string,
    nextStatus: TaskStatus
  ) => {
    e.stopPropagation();
    await updateTaskStatus(taskId, nextStatus);
    onRefresh();
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive" className="text-[10px] px-1.5 py-0">Urgent</Badge>;
      case "high":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700 text-[10px] px-1.5 py-0">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-blue-600 text-[10px] px-1.5 py-0">Medium</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-400 text-[10px] px-1.5 py-0">Low</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.key);

        return (
          <div
            key={col.key}
            className="bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold ${col.color}`}>
                  {col.label}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {colTasks.length}
                </span>
              </div>
            </div>

            {/* Task Cards */}
            <div className="space-y-3">
              {colTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl italic">
                  No tasks in {col.label.toLowerCase()}
                </div>
              ) : (
                colTasks.map((task) => {
                  const isOverdue =
                    task.due_date &&
                    task.due_date < new Date().toISOString().split("T")[0] &&
                    task.status !== "completed";

                  return (
                    <div
                      key={task.id}
                      onClick={() => onSelectTask(task)}
                      className="bg-background p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                          {task.title}
                        </h4>
                        {getPriorityBadge(task.priority)}
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-1">
                        <div className="font-semibold text-slate-600 dark:text-slate-400">
                          {task.project_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-slate-400" />
                          {task.assigned_employee_name}
                        </div>
                      </div>

                      {/* Due Date & Progress */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                        <div
                          className={`flex items-center gap-1 font-medium ${
                            isOverdue ? "text-red-600 font-bold" : "text-slate-500"
                          }`}
                        >
                          <Calendar className="h-3 w-3" />
                          {task.due_date || "No due date"}
                        </div>

                        <div className="flex items-center gap-1 text-slate-400">
                          <Clock className="h-3 w-3" />
                          {task.actual_hours}/{task.estimated_hours}h
                        </div>
                      </div>

                      {/* Move Quick Actions */}
                      <div className="flex items-center justify-end gap-1 pt-1">
                        {col.key !== "completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) =>
                              handleStatusMove(
                                e,
                                task.id,
                                col.key === "todo"
                                  ? "in_progress"
                                  : col.key === "in_progress"
                                  ? "review"
                                  : "completed"
                              )
                            }
                            className="h-6 px-2 text-[10px] text-blue-600 hover:bg-blue-50"
                          >
                            Advance <ChevronRight className="h-3 w-3 ml-0.5" />
                          </Button>
                        )}

                        {col.key === "completed" && (
                          <Badge variant="outline" className="text-emerald-600 text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Done
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
