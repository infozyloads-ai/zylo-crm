import { supabase } from "@/lib/supabase/client";
import type {
  Employee,
  Department,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  HrActivity,
  LeaveStatus,
} from "../types/hr.types";
import type {
  EmployeeFormData,
  DepartmentFormData,
  LeaveFormData,
  PayrollFormData,
} from "../schemas/hr-schema";

const mockEmployees: Employee[] = [
  {
    id: "emp-1",
    employee_id: "EMP-101",
    name: "Sarah Jenkins",
    department: "Engineering",
    designation: "Senior Frontend Engineer",
    email: "sarah@zylo.com",
    phone: "+1 (555) 234-5678",
    address: "San Francisco, CA",
    joining_date: "2024-03-15",
    salary: 95000,
    status: "active",
    profile_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    notes: "Lead engineer for E-Commerce App project.",
    created_at: new Date().toISOString(),
  },
  {
    id: "emp-2",
    employee_id: "EMP-102",
    name: "Marcus Brody",
    department: "Cloud Operations",
    designation: "DevOps & Cloud Architect",
    email: "marcus@zylo.com",
    phone: "+1 (555) 345-6789",
    address: "Austin, TX",
    joining_date: "2023-11-01",
    salary: 110000,
    status: "active",
    profile_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    notes: "Maintains database security and cloud infrastructure.",
    created_at: new Date().toISOString(),
  },
  {
    id: "emp-3",
    employee_id: "EMP-103",
    name: "Chloe Bennett",
    department: "UI/UX Design",
    designation: "Lead Product Designer",
    email: "chloe@zylo.com",
    phone: "+1 (555) 456-7890",
    address: "New York, NY",
    joining_date: "2025-01-10",
    salary: 88000,
    status: "on_leave",
    profile_photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    notes: "Currently on annual leave.",
    created_at: new Date().toISOString(),
  },
];

const mockDepartments: Department[] = [
  {
    id: "dept-1",
    name: "Engineering",
    manager_name: "Sarah Jenkins",
    description: "Frontend & Mobile Application Development Sprints",
    employee_count: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "dept-2",
    name: "Cloud Operations",
    manager_name: "Marcus Brody",
    description: "Database Infrastructure, DevOps, and RLS Security",
    employee_count: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "dept-3",
    name: "UI/UX Design",
    manager_name: "Chloe Bennett",
    description: "Product Design Systems, Wireframes, and Branding",
    employee_count: 4,
    created_at: new Date().toISOString(),
  },
];

const mockAttendance: AttendanceRecord[] = [
  {
    id: "att-1",
    employee_id: "emp-1",
    employee_name: "Sarah Jenkins",
    date: new Date().toISOString().split("T")[0],
    check_in: "09:00 AM",
    check_out: "05:30 PM",
    working_hours: 8.5,
    status: "present",
    late_entry: false,
  },
  {
    id: "att-2",
    employee_id: "emp-2",
    employee_name: "Marcus Brody",
    date: new Date().toISOString().split("T")[0],
    check_in: "09:45 AM",
    check_out: "06:15 PM",
    working_hours: 8.5,
    status: "late",
    late_entry: true,
  },
];

const mockLeaves: LeaveRequest[] = [
  {
    id: "lve-1",
    employee_id: "emp-3",
    employee_name: "Chloe Bennett",
    leave_type: "annual",
    start_date: "2026-07-28",
    end_date: "2026-08-02",
    days_count: 5,
    reason: "Summer vacation and family trip.",
    status: "pending",
    created_at: new Date().toISOString(),
  },
];

const mockPayrolls: PayrollRecord[] = [
  {
    id: "pay-1",
    employee_id: "emp-1",
    employee_name: "Sarah Jenkins",
    month: "July 2026",
    base_salary: 7916,
    allowances: 500,
    deductions: 800,
    net_salary: 7616,
    payment_status: "paid",
    payment_date: "2026-07-28",
    created_at: new Date().toISOString(),
  },
  {
    id: "pay-2",
    employee_id: "emp-2",
    employee_name: "Marcus Brody",
    month: "July 2026",
    base_salary: 9166,
    allowances: 600,
    deductions: 950,
    net_salary: 8816,
    payment_status: "pending",
    payment_date: null,
    created_at: new Date().toISOString(),
  },
];

// EMPLOYEES
export async function getEmployees() {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { success: true, data: mockEmployees };
    }

    return { success: true, data: data as Employee[] };
  } catch {
    return { success: true, data: mockEmployees };
  }
}

export async function createEmployee(formData: EmployeeFormData) {
  const newEmp: Employee = {
    id: `emp-${Date.now()}`,
    ...formData,
    created_at: new Date().toISOString(),
  };

  mockEmployees.unshift(newEmp);
  await addHrActivity(`Onboarded new employee '${newEmp.name}' (${newEmp.employee_id}) to ${newEmp.department}`);
  return { success: true, message: "Employee onboarded successfully", data: newEmp };
}

export async function updateEmployee(id: string, formData: EmployeeFormData) {
  const idx = mockEmployees.findIndex((e) => e.id === id);
  if (idx !== -1) {
    mockEmployees[idx] = { ...mockEmployees[idx], ...formData };
    await addHrActivity(`Updated employee profile for '${formData.name}'`);
    return { success: true, message: "Employee profile updated successfully", data: mockEmployees[idx] };
  }
  return { success: false, message: "Employee not found" };
}

export async function deleteEmployee(id: string) {
  const idx = mockEmployees.findIndex((e) => e.id === id);
  if (idx !== -1) mockEmployees.splice(idx, 1);
  return { success: true, message: "Employee record deleted" };
}

// DEPARTMENTS
export async function getDepartments() {
  return { success: true, data: mockDepartments };
}

export async function createDepartment(formData: DepartmentFormData) {
  const newDept: Department = {
    id: `dept-${Date.now()}`,
    ...formData,
    employee_count: 1,
    created_at: new Date().toISOString(),
  };

  mockDepartments.unshift(newDept);
  await addHrActivity(`Created new department '${newDept.name}' with manager ${newDept.manager_name}`);
  return { success: true, message: "Department created successfully", data: newDept };
}

export async function deleteDepartment(id: string) {
  const idx = mockDepartments.findIndex((d) => d.id === id);
  if (idx !== -1) mockDepartments.splice(idx, 1);
  return { success: true, message: "Department deleted successfully" };
}

// ATTENDANCE
export async function getAttendance() {
  return { success: true, data: mockAttendance };
}

export async function checkIn(employeeName: string = "Logged User") {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const isLate = now.getHours() >= 9 && now.getMinutes() > 30;

  const newRec: AttendanceRecord = {
    id: `att-${Date.now()}`,
    employee_id: "emp-1",
    employee_name: employeeName,
    date: now.toISOString().split("T")[0],
    check_in: timeStr,
    check_out: null,
    working_hours: 0,
    status: isLate ? "late" : "present",
    late_entry: isLate,
  };

  mockAttendance.unshift(newRec);
  await addHrActivity(`Employee ${employeeName} checked in at ${timeStr}`);
  return { success: true, message: `Checked in successfully at ${timeStr}` };
}

export async function checkOut(recordId: string) {
  const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const rec = mockAttendance.find((a) => a.id === recordId) || mockAttendance[0];
  if (rec) {
    rec.check_out = timeStr;
    rec.working_hours = 8.5;
  }
  await addHrActivity(`Employee checked out at ${timeStr}`);
  return { success: true, message: `Checked out successfully at ${timeStr}` };
}

// LEAVES
export async function getLeaves() {
  return { success: true, data: mockLeaves };
}

export async function createLeaveRequest(formData: LeaveFormData) {
  const newLeave: LeaveRequest = {
    id: `lve-${Date.now()}`,
    ...formData,
    status: "pending",
    created_at: new Date().toISOString(),
  };

  mockLeaves.unshift(newLeave);
  await addHrActivity(`Leave request submitted for ${formData.employee_name} (${formData.days_count} days)`);
  return { success: true, message: "Leave request submitted for approval", data: newLeave };
}

export async function updateLeaveStatus(id: string, status: LeaveStatus) {
  const leave = mockLeaves.find((l) => l.id === id);
  if (leave) {
    leave.status = status;
    await addHrActivity(`Leave request for ${leave.employee_name} was '${status.toUpperCase()}'`);
  }
  return { success: true, message: `Leave request ${status}` };
}

// PAYROLL
export async function getPayrolls() {
  return { success: true, data: mockPayrolls };
}

export async function createPayroll(formData: PayrollFormData) {
  const newPay: PayrollRecord = {
    id: `pay-${Date.now()}`,
    ...formData,
    created_at: new Date().toISOString(),
  };

  mockPayrolls.unshift(newPay);
  await addHrActivity(`Generated payroll for ${formData.employee_name} (${formData.month})`);
  return { success: true, message: "Payroll record generated", data: newPay };
}

export function generateSalarySlipPdf(pay: PayrollRecord) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Salary Slip - ${pay.employee_name} (${pay.month})</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; border-b: 2px solid #e2e8f0; pb: 20px; }
          .title { font-size: 26px; font-weight: bold; color: #2563eb; }
          table { width: 100%; border-collapse: collapse; margin-top: 25px; }
          th, td { border: 1px solid #cbd5e1; padding: 12px; text-align: left; }
          th { background: #f8fafc; }
          .total { text-align: right; margin-top: 25px; font-size: 20px; font-weight: bold; color: #059669; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">Zylo CRM Confidential Payslip</div>
            <p>Employee: <strong>${pay.employee_name}</strong></p>
            <p>Payroll Month: <strong>${pay.month}</strong></p>
          </div>
          <div style="text-align: right;">
            <p>Payment Status: <strong>${pay.payment_status.toUpperCase()}</strong></p>
            <p>Date: ${pay.payment_date || "Pending"}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Payroll Component</th>
              <th style="text-align: right;">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Base Salary</td>
              <td style="text-align: right;">$${pay.base_salary.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Allowances & Bonuses</td>
              <td style="text-align: right;">+$${pay.allowances.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Deductions & Tax</td>
              <td style="text-align: right;">-$${pay.deductions.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <div class="total">
          <p>Net Take-Home Salary: $${pay.net_salary.toLocaleString()}</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// ACTIVITIES
export async function getHrActivities() {
  return {
    success: true,
    data: [
      {
        id: "hract-1",
        author_name: "HR Manager",
        activity_type: "Onboarding",
        description: "Sarah Jenkins onboarded as Senior Frontend Engineer.",
        created_at: new Date().toISOString(),
      },
    ] as HrActivity[],
  };
}

export async function addHrActivity(description: string) {
  return { success: true };
}
