"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  ListTodo,
  FolderKanban,
  Building2,
  User,
  Calendar,
  Clock,
  CheckSquare,
  Square,
  MessageSquare,
  Paperclip,
  Plus,
  Loader2,
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
import type { Task, TaskActivity, TaskChecklistItem } from "../types/task.types";
import { getTaskActivities, addTaskComment } from "../services/task.service";

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onRefresh?: () => void;
}

export function TaskDetailsDialog({
  open,
  onOpenChange,
  task,
  onRefresh,
}: TaskDetailsDialogProps) {
  const [activities, setActivities] = useState<TaskActivity[]>([]);
  const [checklist, setChecklist] = useState<TaskChecklistItem[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);

  useEffect(() => {
    if (open && task) {
      setChecklist(task.checklist || []);
      loadActivities(task.id);
    }
  }, [open, task]);

  const loadActivities = async (taskId: string) => {
    setLoadingActivities(true);
    const res = await getTaskActivities(taskId);
    if (res.success) setActivities(res.data);
    setLoadingActivities(false);
  };

  const handleToggleChecklist = (itemId: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === itemId ? { ...c, completed: !c.completed } : c))
    );
    toast.success("Checklist item updated");
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !commentText.trim()) return;

    setIsPostingComment(true);
    await addTaskComment(task.id, commentText.trim());
    setIsPostingComment(false);

    toast.success("Comment posted to task");
    setCommentText("");
    loadActivities(task.id);
    if (onRefresh) onRefresh();
  };

  if (!task) return null;

  const isOverdue =
    task.due_date &&
    task.due_date < new Date().toISOString().split("T")[0] &&
    task.status !== "completed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4 pr-6">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <ListTodo className="h-6 w-6 text-blue-600" />
                {task.title}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <FolderKanban className="h-3.5 w-3.5 text-slate-400" />
                  {task.project_name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  {task.client_name}
                </span>
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  task.status === "completed"
                    ? "secondary"
                    : task.status === "in_progress"
                    ? "outline"
                    : "destructive"
                }
                className={
                  task.status === "completed"
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : task.status === "in_progress"
                    ? "border-blue-500 text-blue-600 font-semibold"
                    : ""
                }
              >
                {task.status.replace("_", " ").toUpperCase()}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {task.priority}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Key Task Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Assignee</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-1">
                <User className="h-4 w-4 text-blue-600" />
                {task.assigned_employee_name}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Due Date</span>
              <span
                className={`text-sm font-semibold mt-1 flex items-center gap-1 ${
                  isOverdue ? "text-red-600 font-bold" : "text-slate-900 dark:text-slate-100"
                }`}
              >
                <Calendar className="h-4 w-4 text-slate-400" />
                {task.due_date || "No due date"}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Work Hours</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-1">
                <Clock className="h-4 w-4 text-indigo-600" />
                {task.actual_hours} / {task.estimated_hours} hrs
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Start Date</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                {task.start_date || "TBD"}
              </span>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Task Requirements & Scope
              </h4>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300">
                {task.description}
              </div>
            </div>
          )}

          {/* Subtasks & Checklist */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-emerald-600" />
              Subtasks & Checklist Items
            </h4>

            {checklist.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No checklist items added.</p>
            ) : (
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleChecklist(item.id)}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {item.completed ? (
                      <CheckSquare className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-400" />
                    )}
                    <span
                      className={`text-sm ${
                        item.completed
                          ? "line-through text-slate-400"
                          : "font-medium text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Paperclip className="h-4 w-4 text-indigo-600" />
                Attachments
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs flex items-center gap-2"
                  >
                    <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                    <span className="font-semibold">{att.name}</span>
                    <span className="text-slate-400">({att.size})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Comments & Activity Stream */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              Team Comments & Activity Log
            </h4>

            {/* Post Comment Form */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <Input
                placeholder="Post a comment or update to this task..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isPostingComment}
                className="flex-1 text-sm rounded-xl"
              />
              <Button
                type="submit"
                disabled={isPostingComment || !commentText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {isPostingComment ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-1 h-4 w-4" />
                    Post
                  </>
                )}
              </Button>
            </form>

            {/* Activity Stream List */}
            {loadingActivities ? (
              <div className="text-center py-4 text-slate-400 text-sm flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading activity log...
              </div>
            ) : activities.length === 0 ? (
              <p className="text-center py-4 text-xs text-slate-400 italic">
                No activity logged yet.
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
                      <span>{new Date(act.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800 dark:text-slate-200">{act.description}</p>
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
