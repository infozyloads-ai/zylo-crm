"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { projectSchema, type ProjectFormData } from "../schemas/project-schema";
import { createProject, updateProject } from "../services/project.service";
import type { Project } from "../types/project.types";

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectToEdit?: Project | null;
  onSuccess: () => void;
}

export function ProjectFormDialog({
  open,
  onOpenChange,
  projectToEdit,
  onSuccess,
}: ProjectFormDialogProps) {
  const isEditing = !!projectToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      client_name: "",
      status: "planning",
      priority: "medium",
      budget: 0,
      progress: 0,
      start_date: "",
      end_date: "",
      assigned_team_str: "",
      manager_name: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (projectToEdit) {
      reset({
        title: projectToEdit.title,
        description: projectToEdit.description || "",
        client_name: projectToEdit.client_name,
        client_id: projectToEdit.client_id || "",
        status: projectToEdit.status,
        priority: projectToEdit.priority,
        budget: projectToEdit.budget || 0,
        progress: projectToEdit.progress || 0,
        start_date: projectToEdit.start_date || "",
        end_date: projectToEdit.end_date || "",
        assigned_team_str: (projectToEdit.assigned_team || []).join(", "),
        manager_name: projectToEdit.manager_name || "",
        notes: projectToEdit.notes || "",
      });
    } else {
      reset({
        title: "",
        description: "",
        client_name: "",
        status: "planning",
        priority: "medium",
        budget: 0,
        progress: 0,
        start_date: "",
        end_date: "",
        assigned_team_str: "",
        manager_name: "",
        notes: "",
      });
    }
  }, [projectToEdit, reset, open]);

  const onSubmit = async (data: ProjectFormData) => {
    let res;
    if (isEditing && projectToEdit) {
      res = await updateProject(projectToEdit.id, data, projectToEdit);
    } else {
      res = await createProject(data);
    }

    if (!res.success) {
      toast.error(isEditing ? "Failed to update project" : "Failed to create project", {
        description: res.message,
      });
      return;
    }

    toast.success(isEditing ? "Project updated successfully" : "Project created successfully");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Project Details" : "Create New Project"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update project timeline, budget, team assignments, and status."
              : "Register a new client project into your active workspace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title & Client Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                placeholder="Mobile App Redesign"
                disabled={isSubmitting}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_name">Client / Customer Name *</Label>
              <Input
                id="client_name"
                placeholder="Acme Global Corp"
                disabled={isSubmitting}
                {...register("client_name")}
              />
              {errors.client_name && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.client_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Project Summary & Scope</Label>
            <Input
              id="description"
              placeholder="Brief description of deliverables and goals..."
              disabled={isSubmitting}
              {...register("description")}
            />
          </div>

          {/* Status, Priority & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Project Status</Label>
              <select
                id="status"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("status")}
              >
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("priority")}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="progress">Progress (% 0-100)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                disabled={isSubmitting}
                {...register("progress", { valueAsNumber: true })}
              />
              {errors.progress && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.progress.message}
                </p>
              )}
            </div>
          </div>

          {/* Budget & Project Manager */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Total Budget (₹)</Label>
              <Input
                id="budget"
                type="number"
                step="100"
                disabled={isSubmitting}
                {...register("budget", { valueAsNumber: true })}
              />
              {errors.budget && (
                <p className="text-xs text-red-500 font-medium">
                  {errors.budget.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager_name">Project Lead / Manager</Label>
              <Input
                id="manager_name"
                placeholder="Alex Rivera"
                disabled={isSubmitting}
                {...register("manager_name")}
              />
            </div>
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                disabled={isSubmitting}
                {...register("start_date")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Target End Date</Label>
              <Input
                id="end_date"
                type="date"
                disabled={isSubmitting}
                {...register("end_date")}
              />
            </div>
          </div>

          {/* Assigned Team Members */}
          <div className="space-y-2">
            <Label htmlFor="assigned_team_str">Assigned Team Members</Label>
            <Input
              id="assigned_team_str"
              placeholder="Sarah J, Devon V, Chloe B (comma separated)"
              disabled={isSubmitting}
              {...register("assigned_team_str")}
            />
            <p className="text-xs text-slate-400">
              Enter member names separated by commas.
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Project Notes & Milestones Context</Label>
            <textarea
              id="notes"
              rows={3}
              placeholder="Important milestone details, technical requirements, or client instructions..."
              className="w-full p-3 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isSubmitting}
              {...register("notes")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEditing ? (
                "Update Project"
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
