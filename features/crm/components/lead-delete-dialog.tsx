"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Lead } from "../types/crm.types";
import { deleteLead } from "../services/lead.service";

interface LeadDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onSuccess: () => void;
}

export function LeadDeleteDialog({
  open,
  onOpenChange,
  lead,
  onSuccess,
}: LeadDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!lead) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteLead(lead.id);
    setIsDeleting(false);

    if (!res.success) {
      toast.error("Failed to delete lead", { description: res.message });
      return;
    }

    toast.success(`Lead for "${lead.company_name}" has been deleted.`);
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Confirm Delete Lead
          </DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to permanently delete the lead record for{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {lead.company_name}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Lead"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
