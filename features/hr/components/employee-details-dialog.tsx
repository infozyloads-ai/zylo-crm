"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  FileText,
  FolderKanban,
  ListTodo,
  Clock,
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
import type { Employee, HrActivity } from "../types/hr.types";
import { getHrActivities, addHrActivity } from "../services/hr.service";
import { toast } from "sonner";

interface EmployeeDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function EmployeeDetailsDialog({
  open,
  onOpenChange,
  employee,
}: EmployeeDetailsDialogProps) {
  const [activities, setActivities] = useState<HrActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isPostingNote, setIsPostingNote] = useState(false);

  useEffect(() => {
    if (open && employee) {
      loadActivities();
    }
  }, [open, employee]);

  const loadActivities = async () => {
    setLoadingActivities(true);
    const res = await getHrActivities();
    if (res.success) setActivities(res.data);
    setLoadingActivities(false);
  };

  const handlePostNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee || !noteText.trim()) return;

    setIsPostingNote(true);
    await addHrActivity(`HR Note added for ${employee.name}: "${noteText.trim()}"`);
    setIsPostingNote(false);

    toast.success("HR Note logged to timeline");
    setNoteText("");
    loadActivities();
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4 pr-6">
            {employee.profile_photo ? (
              <img
                src={employee.profile_photo}
                alt={employee.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-blue-500 shrink-0"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-xl shrink-0">
                {employee.name.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold">
                  {employee.name}
                </DialogTitle>
                <Badge
                  variant={
                    employee.status === "active"
                      ? "secondary"
                      : employee.status === "on_leave"
                      ? "outline"
                      : "destructive"
                  }
                  className={
                    employee.status === "active" ? "bg-emerald-50 text-emerald-700" : ""
                  }
                >
                  {employee.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>

              <DialogDescription className="mt-1 text-sm flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {employee.designation}
                </span>
                <span>•</span>
                <span className="text-slate-500 font-mono">{employee.employee_id}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-500 font-medium block">Department</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-1">
                <Building2 className="h-4 w-4 text-blue-600" />
                {employee.department}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Annual Salary</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-1">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                ${employee.salary?.toLocaleString() || "0"}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Joining Date</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-1">
                <Calendar className="h-4 w-4 text-slate-400" />
                {employee.joining_date}
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium block">Phone</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1 mt-1">
                <Phone className="h-4 w-4 text-slate-400" />
                {employee.phone || "N/A"}
              </span>
            </div>
          </div>

          {/* Assigned Workloads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FolderKanban className="h-4 w-4 text-indigo-600" />
                Assigned Projects
              </h4>
              <div className="space-y-1 pt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900">E-Commerce Mobile App Development</div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900">Brand Identity & Web Portal</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <ListTodo className="h-4 w-4 text-blue-600" />
                Active Assigned Tasks
              </h4>
              <div className="space-y-1 pt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900">Design Responsive Navbar & Sidebar</div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-900">Implement Auth Session Middleware</div>
              </div>
            </div>
          </div>

          {/* Notes & Documents */}
          {employee.notes && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                Qualifications & Notes
              </h4>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300">
                {employee.notes}
              </div>
            </div>
          )}

          <Separator />

          {/* Activity Stream */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Employee Activity Timeline
            </h4>

            <form onSubmit={handlePostNote} className="flex gap-2">
              <Input
                placeholder="Log an HR record or performance note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                disabled={isPostingNote}
                className="flex-1 text-sm rounded-xl"
              />
              <Button
                type="submit"
                disabled={isPostingNote || !noteText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                {isPostingNote ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-1 h-4 w-4" />
                    Log Note
                  </>
                )}
              </Button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold">{act.author_name}</span>
                    <span>{new Date(act.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200">{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
