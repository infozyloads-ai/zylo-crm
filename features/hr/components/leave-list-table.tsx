"use client";

import { Calendar, Plus, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { LeaveRequest, LeaveStatus, LeaveType } from "../types/hr.types";
import { updateLeaveStatus } from "../services/hr.service";
import { toast } from "sonner";

interface LeaveListTableProps {
  leaves: LeaveRequest[];
  onRefresh: () => void;
  onOpenCreate: () => void;
}

export function LeaveListTable({
  leaves,
  onRefresh,
  onOpenCreate,
}: LeaveListTableProps) {
  const handleStatusChange = async (id: string, status: LeaveStatus) => {
    await updateLeaveStatus(id, status);
    toast.success(`Leave request ${status}`);
    onRefresh();
  };

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case "approved":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold">Approved</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-amber-600 font-semibold">Pending Approval</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: LeaveType) => {
    switch (type) {
      case "annual":
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700">Annual Leave</Badge>;
      case "casual":
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700">Casual Leave</Badge>;
      case "sick":
        return <Badge variant="secondary" className="bg-amber-50 text-amber-700">Sick Leave</Badge>;
      case "unpaid":
        return <Badge variant="outline" className="text-slate-500">Unpaid</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Employee Leave Management & Approvals
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review leave applications, manage leave balances, and approve or reject requests.
            </p>
          </div>

          <Button
            onClick={onOpenCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Request Leave
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Leave Type</th>
                <th className="px-6 py-4 font-semibold">Duration</th>
                <th className="px-6 py-4 font-semibold">Reason</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-center">Approval Workflow</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No leave requests submitted yet.
                  </td>
                </tr>
              ) : (
                leaves.map((lve) => (
                  <tr
                    key={lve.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                      {lve.employee_name}
                    </td>

                    <td className="px-6 py-4">{getTypeBadge(lve.leave_type)}</td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {lve.days_count} Day(s)
                      </div>
                      <div>
                        {lve.start_date} to {lve.end_date}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 max-w-xs line-clamp-2">
                      {lve.reason}
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(lve.status)}</td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {lve.status === "pending" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(lve.id, "approved")}
                              className="h-8 text-xs text-emerald-600 hover:bg-emerald-50 border-emerald-200 rounded-xl"
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Approve
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(lve.id, "rejected")}
                              className="h-8 text-xs text-red-600 hover:bg-red-50 border-red-200 rounded-xl"
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                              Reject
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Workflow Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
