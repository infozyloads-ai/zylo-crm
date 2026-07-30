"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Building2,
  Clock,
  Calendar,
  DollarSign,
  RefreshCw,
  Plus,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  Employee,
  Department,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  HrTab,
} from "../types/hr.types";
import {
  getEmployees,
  getDepartments,
  getAttendance,
  getLeaves,
  getPayrolls,
} from "../services/hr.service";
import { HrKpiCards } from "./hr-kpi-cards";
import { EmployeeListTable } from "./employee-list-table";
import { EmployeeDialog } from "./employee-dialog";
import { EmployeeDetailsDialog } from "./employee-details-dialog";
import { DepartmentListTable } from "./department-list-table";
import { DepartmentDialog } from "./department-dialog";
import { AttendanceView } from "./attendance-view";
import { LeaveListTable } from "./leave-list-table";
import { LeaveDialog } from "./leave-dialog";
import { PayrollListTable } from "./payroll-list-table";
import { PayrollDialog } from "./payroll-dialog";

export function HrManager() {
  const [activeTab, setActiveTab] = useState<HrTab>("dashboard");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [employeeDialogOpen, setEmployeeDialogOpen] = useState(false);
  const [selectedEmployeeToEdit, setSelectedEmployeeToEdit] = useState<Employee | null>(null);

  const [employeeDetailsOpen, setEmployeeDetailsOpen] = useState(false);
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState<Employee | null>(null);

  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [payrollDialogOpen, setPayrollDialogOpen] = useState(false);

  const loadAllHrData = useCallback(async () => {
    setLoading(true);
    const [empRes, deptRes, attRes, lveRes, payRes] = await Promise.all([
      getEmployees(),
      getDepartments(),
      getAttendance(),
      getLeaves(),
      getPayrolls(),
    ]);

    if (empRes.success) setEmployees(empRes.data);
    if (deptRes.success) setDepartments(deptRes.data);
    if (attRes.success) setAttendance(attRes.data);
    if (lveRes.success) setLeaves(lveRes.data);
    if (payRes.success) setPayrolls(payRes.data);

    setLoading(false);
  }, []);

  useEffect(() => {
    loadAllHrData();
  }, [loadAllHrData]);

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            HR & Team Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage company employees, departments, daily shift attendance, leave requests, and payrolls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={loadAllHrData}
            className="rounded-xl"
            title="Refresh HR directory"
          >
            <RefreshCw className={`h-4 w-4 text-slate-600 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            onClick={() => {
              setSelectedEmployeeToEdit(null);
              setEmployeeDialogOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Onboard Employee
          </Button>
        </div>
      </div>

      {/* HR Navigation Tabs */}
      <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex flex-wrap items-center gap-1.5 border border-slate-200 dark:border-slate-800">
        <Button
          variant={activeTab === "dashboard" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("dashboard")}
          className="text-xs font-semibold rounded-xl"
        >
          <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
          HR Dashboard
        </Button>

        <Button
          variant={activeTab === "employees" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("employees")}
          className="text-xs font-semibold rounded-xl"
        >
          <Users className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
          Employees ({employees.length})
        </Button>

        <Button
          variant={activeTab === "departments" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("departments")}
          className="text-xs font-semibold rounded-xl"
        >
          <Building2 className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
          Departments ({departments.length})
        </Button>

        <Button
          variant={activeTab === "attendance" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("attendance")}
          className="text-xs font-semibold rounded-xl"
        >
          <Clock className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
          Attendance Tracker
        </Button>

        <Button
          variant={activeTab === "leaves" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("leaves")}
          className="text-xs font-semibold rounded-xl"
        >
          <Calendar className="h-3.5 w-3.5 mr-1.5 text-purple-600" />
          Leaves ({leaves.length})
        </Button>

        <Button
          variant={activeTab === "payroll" ? "secondary" : "ghost"}
          onClick={() => setActiveTab("payroll")}
          className="text-xs font-semibold rounded-xl"
        >
          <DollarSign className="h-3.5 w-3.5 mr-1.5 text-emerald-600" />
          Payroll & Slips
        </Button>
      </div>

      {/* KPI Cards */}
      <HrKpiCards
        employees={employees}
        attendance={attendance}
        leaves={leaves}
        payrolls={payrolls}
      />

      {/* Tab Content Views */}
      {activeTab === "dashboard" && (
        <EmployeeListTable
          employees={employees}
          onRefresh={loadAllHrData}
          onOpenCreate={() => {
            setSelectedEmployeeToEdit(null);
            setEmployeeDialogOpen(true);
          }}
          onOpenEdit={(emp) => {
            setSelectedEmployeeToEdit(emp);
            setEmployeeDialogOpen(true);
          }}
          onOpenDetails={(emp) => {
            setSelectedEmployeeForDetails(emp);
            setEmployeeDetailsOpen(true);
          }}
        />
      )}

      {activeTab === "employees" && (
        <EmployeeListTable
          employees={employees}
          onRefresh={loadAllHrData}
          onOpenCreate={() => {
            setSelectedEmployeeToEdit(null);
            setEmployeeDialogOpen(true);
          }}
          onOpenEdit={(emp) => {
            setSelectedEmployeeToEdit(emp);
            setEmployeeDialogOpen(true);
          }}
          onOpenDetails={(emp) => {
            setSelectedEmployeeForDetails(emp);
            setEmployeeDetailsOpen(true);
          }}
        />
      )}

      {activeTab === "departments" && (
        <DepartmentListTable
          departments={departments}
          onRefresh={loadAllHrData}
          onOpenCreate={() => setDepartmentDialogOpen(true)}
        />
      )}

      {activeTab === "attendance" && (
        <AttendanceView attendance={attendance} onRefresh={loadAllHrData} />
      )}

      {activeTab === "leaves" && (
        <LeaveListTable
          leaves={leaves}
          onRefresh={loadAllHrData}
          onOpenCreate={() => setLeaveDialogOpen(true)}
        />
      )}

      {activeTab === "payroll" && (
        <PayrollListTable
          payrolls={payrolls}
          onRefresh={loadAllHrData}
          onOpenCreate={() => setPayrollDialogOpen(true)}
        />
      )}

      {/* Dialog Modals */}
      <EmployeeDialog
        open={employeeDialogOpen}
        onOpenChange={setEmployeeDialogOpen}
        employeeToEdit={selectedEmployeeToEdit}
        onSuccess={loadAllHrData}
      />

      <EmployeeDetailsDialog
        open={employeeDetailsOpen}
        onOpenChange={setEmployeeDetailsOpen}
        employee={selectedEmployeeForDetails}
      />

      <DepartmentDialog
        open={departmentDialogOpen}
        onOpenChange={setDepartmentDialogOpen}
        onSuccess={loadAllHrData}
      />

      <LeaveDialog
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        employees={employees}
        onSuccess={loadAllHrData}
      />

      <PayrollDialog
        open={payrollDialogOpen}
        onOpenChange={setPayrollDialogOpen}
        employees={employees}
        onSuccess={loadAllHrData}
      />
    </div>
  );
}
