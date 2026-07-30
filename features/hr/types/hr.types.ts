export type EmployeeStatus = "active" | "inactive" | "on_leave";

export type LeaveType = "casual" | "sick" | "annual" | "unpaid";

export type LeaveStatus = "pending" | "approved" | "rejected";

export type AttendanceStatus = "present" | "absent" | "late" | "half_day";

export type HrTab =
  | "dashboard"
  | "employees"
  | "departments"
  | "attendance"
  | "leaves"
  | "payroll";

export interface Employee {
  id: string;
  employee_id: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  joining_date: string;
  salary: number;
  status: EmployeeStatus;
  profile_photo?: string | null;
  notes?: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  manager_name: string;
  description?: string | null;
  employee_count: number;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  working_hours: number;
  status: AttendanceStatus;
  late_entry: boolean;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  status: LeaveStatus;
  created_at: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  month: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_salary: number;
  payment_status: "paid" | "pending";
  payment_date?: string | null;
  created_at: string;
}

export interface HrActivity {
  id: string;
  user_id?: string | null;
  author_name: string;
  activity_type: string;
  description: string;
  created_at: string;
}
