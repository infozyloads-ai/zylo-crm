"use client";

import { CheckSquare, Clock, AlertCircle, ListTodo, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "../types/task.types";

interface TaskSummaryWidgetsProps {
  tasks: Task[];
  totalCount: number;
  onSelectTask: (task: Task) => void;
}

export function TaskSummaryWidgets({
  tasks,
  totalCount,
  onSelectTask,
}: TaskSummaryWidgetsProps) {
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const overdueTasks = tasks.filter(
    (t) => t.due_date && t.due_date < todayStr && t.status !== "completed"
  );

  const kpis = [
    {
      title: "Total Tasks",
      value: totalCount,
      subtitle: "Active workspace tasks",
      icon: ListTodo,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "In Progress",
      value: inProgress,
      subtitle: "Active execution",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
    },
    {
      title: "Completed",
      value: completed,
      subtitle: "Finished tasks",
      icon: CheckSquare,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      title: "Overdue Tasks",
      value: overdueTasks.length,
      subtitle: "Action required",
      icon: AlertCircle,
      color: "text-red-600 bg-red-50 dark:bg-red-950/50",
    },
  ];

  const recentTasks = tasks.slice(0, 4);

  return (
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.title}
              className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl"
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {kpi.title}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {kpi.value}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{kpi.subtitle}</p>
                </div>

                <div className={`p-3 rounded-2xl ${kpi.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Tasks Widget */}
        <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Recent Workspace Tasks
              </h4>
              <span className="text-xs text-slate-400">Latest updates</span>
            </div>

            <div className="space-y-2">
              {recentTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No tasks available.</p>
              ) : (
                recentTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {task.title}
                      </h5>
                      <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>{task.project_name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {task.assigned_employee_name}
                        </span>
                      </div>
                    </div>

                    <Badge variant="outline" className="capitalize text-[10px]">
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Tasks Widget */}
        <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                Overdue Tasks Widget
              </h4>
              <span className="text-xs text-slate-400">{overdueTasks.length} pending</span>
            </div>

            <div className="space-y-2">
              {overdueTasks.length === 0 ? (
                <div className="p-4 text-center rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  🎉 All tasks are on schedule! No overdue deadlines.
                </div>
              ) : (
                overdueTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    className="p-3 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 hover:bg-red-50/60 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <h5 className="text-xs font-semibold text-red-900 dark:text-red-200 line-clamp-1">
                        {task.title}
                      </h5>
                      <div className="text-[11px] text-red-600/80 mt-0.5">
                        Due Date: {task.due_date} ({task.assigned_employee_name})
                      </div>
                    </div>

                    <Badge variant="destructive" className="text-[10px]">
                      OVERDUE
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
