"use client";

import { FolderKanban, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "../types/project.types";

interface ProjectKpiCardsProps {
  projects: Project[];
  totalCount: number;
}

export function ProjectKpiCards({ projects, totalCount }: ProjectKpiCardsProps) {
  const inProgressCount = projects.filter((p) => p.status === "in_progress").length;
  const completedCount = projects.filter((p) => p.status === "completed").length;
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);

  const kpis = [
    {
      title: "Total Projects",
      value: totalCount,
      subtitle: "Active workspace portfolios",
      icon: FolderKanban,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "In Progress",
      value: inProgressCount,
      subtitle: "Active development sprints",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
    },
    {
      title: "Completed",
      value: completedCount,
      subtitle: "Successfully delivered",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      title: "Total Budget",
      value: `$${totalBudget.toLocaleString()}`,
      subtitle: "Combined portfolio value",
      icon: DollarSign,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50",
    },
  ];

  return (
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
  );
}
