import { z } from "zod";

export const employeeSchema = z.object({
  employee_id: z.string().trim().min(1, "Employee ID is required"),
  name: z.string().trim().min(1, "Employee full name is required"),
  department: z.string().trim().min(1, "Department is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required")
    .email("Please enter a valid email"),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  joining_date: z.string().min(1, "Joining date is required"),
  salary: z.number().min(0, "Salary cannot be negative"),
  status: z.enum(["active", "inactive", "on_leave"]),
  profile_photo: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;

export const departmentSchema = z.object({
  name: z.string().trim().min(1, "Department name is required"),
  manager_name: z.string().trim().min(1, "Manager name is required"),
  description: z.string().trim().optional(),
});

export type DepartmentFormData = z.infer<typeof departmentSchema>;

export const leaveSchema = z.object({
  employee_id: z.string().min(1, "Employee selection required"),
  employee_name: z.string().min(1),
  leave_type: z.enum(["casual", "sick", "annual", "unpaid"]),
  start_date: z.string().min(1, "Start date required"),
  end_date: z.string().min(1, "End date required"),
  days_count: z.number().min(1, "Days count must be at least 1"),
  reason: z.string().trim().min(1, "Reason for leave is required"),
});

export type LeaveFormData = z.infer<typeof leaveSchema>;

export const payrollSchema = z.object({
  employee_id: z.string().min(1, "Employee selection required"),
  employee_name: z.string().min(1),
  month: z.string().min(1, "Month selection required"),
  base_salary: z.number().min(0),
  allowances: z.number().min(0),
  deductions: z.number().min(0),
  net_salary: z.number().min(0),
  payment_status: z.enum(["paid", "pending"]),
  payment_date: z.string().optional(),
});

export type PayrollFormData = z.infer<typeof payrollSchema>;
