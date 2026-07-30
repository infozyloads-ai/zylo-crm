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
import { taskSchema, type TaskFormData } from "../schemas/task-schema";
import { createTask, updateTask } from "../services/task.service";
import type { Task } from "../types/task.types";

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task | null;
  onSuccess: () => void;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  taskToEdit,
  onSuccess,
}: TaskFormDialogProps) {
  const isEditing = !!taskToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      project_name: "",
      client_name: "",
      assigned_employee_name: "",
      status: "todo",
      priority: "medium",
      start_date: "",
      due_date: "",
      estimated_hours: 0,
      actual_hours: 0,
    },
  });

  useEffect(() => {
    if (taskToEdit) {
      reset({
        title: taskToEdit.title,
        description: taskToEdit.description || "",
        project_name: taskToEdit.project_name || "",
        client_name: taskToEdit.client_name || "",
        assigned_employee_name: taskToEdit.assigned_employee_name || "",
        status: taskToEdit.status,
        priority: taskToEdit.priority,
        start_date: taskToEdit.start_date || "",
        due_date: taskToEdit.due_date || "",
        estimated_hours: taskToEdit.estimated_hours || 0,
        actual_hours: taskToEdit.actual_hours || 0,
      });
    } else {
      reset({
        title: "",
        description: "",
        project_name: "",
        client_name: "",
        assigned_employee_name: "",
        status: "todo",
        priority: "medium",
        start_date: "",
        due_date: "",
        estimated_hours: 0,
        actual_hours: 0,
      });
    }
  }, [taskToEdit, reset, open]);

  const onSubmit = async (data: TaskFormData) => {
    let res;
    if (isEditing && taskToEdit) {
      res = await updateTask(taskToEdit.id, data, taskToEdit);
    } else {
      res = await createTask(data);
    }

    if (!res.success) {
      toast.error(isEditing ? "Failed to update task" : "Failed to create task", {
        description: res.message,
      });
      return;
    }

    toast.success(isEditing ? "Task updated successfully" : "Task created successfully");
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Task" : "Create New Task"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update task status, due date, assignee, and estimated work hours."
              : "Assign a new task to your project team."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g. Implement Responsive Sidebar Drawer"
              disabled={isSubmitting}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-xs text-red-500 font-medium">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Task Description & Deliverables</Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Detailed instructions, requirements, and acceptance criteria..."
              className="w-full p-3 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              disabled={isSubmitting}
              {...register("description")}
            />
          </div>

          {/* Project & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="project_name">Associated Project</Label>
              <Input
                id="project_name"
                placeholder="E-Commerce Mobile App"
                disabled={isSubmitting}
                {...register("project_name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_name">Client Name</Label>
              <Input
                id="client_name"
                placeholder="Acme Global Solutions"
                disabled={isSubmitting}
                {...register("client_name")}
              />
            </div>
          </div>

          {/* Assignee, Status & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assigned_employee_name">Assigned Employee</Label>
              <Input
                id="assigned_employee_name"
                placeholder="Sarah Jenkins"
                disabled={isSubmitting}
                {...register("assigned_employee_name")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full h-9 px-3 py-1 bg-background border border-input rounded-md text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                disabled={isSubmitting}
                {...register("status")}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Under Review</option>
                <option value="completed">Completed</option>
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
          </div>

          {/* Dates & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                disabled={isSubmitting}
                {...register("due_date")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimated_hours">Est. Hours</Label>
              <Input
                id="estimated_hours"
                type="number"
                disabled={isSubmitting}
                {...register("estimated_hours", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actual_hours">Actual Hours</Label>
              <Input
                id="actual_hours"
                type="number"
                disabled={isSubmitting}
                {...register("actual_hours", { valueAsNumber: true })}
              />
            </div>
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
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
