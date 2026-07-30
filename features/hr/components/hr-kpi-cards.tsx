"use client";

import { Users, UserCheck, UserX, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Employee, AttendanceRecord, LeaveRequest, PayrollRecord } from "../types/hr.types";

interface HrKpiCardsProps {
  employees: Employee[];
  attendance: AttendanceRecord[];
  leaves: LeaveRequest[];
  payrolls: PayrollRecord[];
}

export function HrKpiCards({
  employees,
  attendance,
  leaves,
  payrolls,
}: HrKpiCardsProps) {
  const totalEmployees = employees.length;
  const presentToday = attendance.filter((a) => a.status === "present" || a.status === "late").length;
  const absentToday = Math.max(0, totalEmployees - presentToday);
  const pendingLeavesCount = leaves.filter((l) => l.status === "pending").length;
  const totalPayroll = payrolls.reduce((acc, p) => acc + (p.net_salary || 0), 0);

  const kpis = [
    {
      title: "Total Employees",
      value: totalEmployees,
      subtitle: "Active workspace team",
      icon: Users,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "Present Today",
      value: presentToday,
      subtitle: "Checked-in staff",
      icon: UserCheck,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      title: "Absent Today",
      value: absentToday,
      subtitle: "Off duty or away",
      icon: UserX,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50",
    },
    {
      title: "Pending Leaves",
      value: pendingLeavesCount,
      subtitle: "Awaiting HR approval",
      icon: Calendar,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50",
    },
    {
      title: "Monthly Payroll Total",
      value: `$${totalPayroll.toLocaleString()}`,
      subtitle: "Combined net salaries",
      icon: DollarSign,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={kpi.title}
            className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl"
          >
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {kpi.title}
                </p>
                <div className={`p-2 rounded-xl ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {kpi.value}
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{kpi.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
