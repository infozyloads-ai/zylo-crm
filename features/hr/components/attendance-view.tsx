"use client";

import { useState } from "react";
import { Clock, UserCheck, LogOut, AlertTriangle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AttendanceRecord } from "../types/hr.types";
import { checkIn, checkOut } from "../services/hr.service";
import { toast } from "sonner";

interface AttendanceViewProps {
  attendance: AttendanceRecord[];
  onRefresh: () => void;
}

export function AttendanceView({ attendance, onRefresh }: AttendanceViewProps) {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleCheckIn = async () => {
    setLoadingAction(true);
    const res = await checkIn("Current User");
    setLoadingAction(false);

    if (res.success) {
      setIsCheckedIn(true);
      toast.success(res.message);
      onRefresh();
    }
  };

  const handleCheckOut = async () => {
    setLoadingAction(true);
    const firstRec = attendance[0]?.id || "att-1";
    const res = await checkOut(firstRec);
    setLoadingAction(false);

    if (res.success) {
      setIsCheckedIn(false);
      toast.success(res.message);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Daily Check-in / Check-out Widget Banner */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Daily Attendance & Working Hours Tracker
            </h3>
            <p className="text-xs text-blue-100">
              Log daily shift check-ins, check-outs, late entry flags, and working hours.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isCheckedIn ? (
              <Button
                onClick={handleCheckIn}
                disabled={loadingAction}
                className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-6 rounded-xl shadow-md"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Check In Now
              </Button>
            ) : (
              <Button
                onClick={handleCheckOut}
                disabled={loadingAction}
                className="bg-red-500 text-white hover:bg-red-600 font-bold px-6 rounded-xl shadow-md"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Check Out Shift
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Attendance History Table */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Employee Attendance History Log
            </h3>
            <span className="text-xs text-slate-400">Monthly Logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-semibold">Employee</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Check-In</th>
                  <th className="px-6 py-4 font-semibold">Check-Out</th>
                  <th className="px-6 py-4 font-semibold text-center">Working Hours</th>
                  <th className="px-6 py-4 font-semibold text-center">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attendance.map((rec) => (
                  <tr
                    key={rec.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                      {rec.employee_name}
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">{rec.date}</td>

                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {rec.check_in || "--:--"}
                    </td>

                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {rec.check_out || "--:--"}
                    </td>

                    <td className="px-6 py-4 text-center font-bold text-blue-600">
                      {rec.working_hours} hrs
                    </td>

                    <td className="px-6 py-4 text-center">
                      {rec.late_entry ? (
                        <Badge variant="destructive" className="flex items-center justify-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Late Entry
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 font-bold">
                          Present
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
