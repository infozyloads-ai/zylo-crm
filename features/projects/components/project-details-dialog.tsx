"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FolderKanban,
  Building2,
  Calendar,
  DollarSign,
  Users,
  CheckSquare,
  Square,
  Clock,
  Plus,
  Loader2,
  TrendingUp,
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Project, ProjectActivity, ProjectMilestone } from "../types/project.types";
import {
  getProjectActivities,
  addProjectActivity,
  getProjectMilestones,
} from "../services/project.service";

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export function ProjectDetailsDialog({
  open,
  onOpenChange,
  project,
}: ProjectDetailsDialogProps) {
  const [activities, setActivities] = useState<ProjectActivity[]>([]);
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    if (open && project) {
      loadDetails(project.id);
    }
  }, [open, project]);

  const loadDetails = async (projectId: string) => {
    setLoadingActivities(true);
    const [actRes, msRes] = await Promise.all([
      getProjectActivities(projectId),
      getProjectMilestones(projectId),
    ]);

    if (actRes.success) setActivities(actRes.data);
    if (msRes.success) setMilestones(msRes.data);
    setLoadingActivities(false);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === milestoneId ? { ...m, completed: !m.completed } : m))
    );
    toast.success("Milestone status toggled");
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !newNote.trim()) return;

    setIsAddingNote(true);
    const res = await addProjectActivity(project.id, newNote.trim(), "Note Added");
    setIsAddingNote(false);

    if (!res.success) {
      toast.error("Failed to add note", { description: res.message });
      return;
    }

    toast.success("Project note logged to timeline");
    setNewNote("");
    loadDetails(project.id);
  };

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FolderKanban className="h-6 w-6 text-blue-600" />
                {project.title}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                Client: <span className="font-semibold text-slate-700 dark:text-slate-300">{project.client_name}</span>
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  project.status === "completed"
                    ? "secondary"
                    : project.status === "in_progress"
                    ? "outline"
                    : "destructive"
                }
                className={
                  project.status === "completed"
                    ? "bg-emerald-50 text-emerald-700"
                    : project.status === "in_progress"
                    ? "border-blue-500 text-blue-600"
                    : ""
                }
              >
                {project.status.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {project.priority} priority
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Progress Banner */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Overall Project Completion Progress
              </span>
              <span className="font-bold text-blue-600 text-base">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2.5 bg-slate-200 dark:bg-slate-800" />
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium block">Total Budget</span>
              <span className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center mt-1">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                {project.budget?.toLocaleString() || "0"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium block">Project Lead</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                {project.manager_name || "Unassigned"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium block">Start Date</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                {project.start_date ? new Date(project.start_date).toLocaleDateString() : "TBD"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 font-medium block">Target End Date</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-amber-500" />
                {project.end_date ? new Date(project.end_date).toLocaleDateString() : "TBD"}
              </span>
            </div>
          </div>

          {/* Assigned Team */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              Assigned Team Members
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {(project.assigned_team || []).map((member, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-1 text-xs"
                >
                  {member}
                </Badge>
              ))}
            </div>
          </div>

          {/* Project Milestones */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-emerald-600" />
              Project Milestones Checklist
            </h4>

            <div className="space-y-2">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  onClick={() => handleToggleMilestone(m.id)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {m.completed ? (
                      <CheckSquare className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-400" />
                    )}
                    <span
                      className={`text-sm ${
                        m.completed ? "line-through text-slate-400" : "font-medium text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {m.title}
                    </span>
                  </div>

                  {m.due_date && (
                    <span className="text-xs text-slate-400">Due {m.due_date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {project.notes && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Technical Notes & Deliverables Context
              </h4>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {project.notes}
              </div>
            </div>
          )}

          <Separator />

          {/* Activity Timeline Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Project Activity & Audit Log
              </h4>
              <span className="text-xs text-slate-500">
                {activities.length} activity log(s)
              </span>
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <Input
                placeholder="Log a project sprint update or milestone note..."
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
                Loading project activity log...
              </div>
            ) : activities.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-400 italic">
                No activity entries logged yet for this project.
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
