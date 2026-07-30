# Zylo CRM — Comprehensive Feature Specification

This document details every feature module implemented in Zylo CRM.

---

## 1. Authentication & Security
- **Email/Password Sign-In**: Secure authentication with Supabase Auth.
- **Forgot Password**: Password reset request workflow.
- **Session Persistence**: HTTP cookie synchronization (`sb-access-token`) via middleware.
- **Route Protection**: Middleware enforcement protecting all `/dashboard/*` routes.

## 2. Executive Dashboard Overview
- **Mascot Welcome Hero**: Personal greeting banner with instant quick shortcuts.
- **KPI Metrics Cards**: Total Revenue (₹), Active Leads, Open Projects, Pending Invoices.
- **Lead Pipeline Summary**: Visual status breakdown of ongoing deal pipelines.

## 3. Leads & Sales CRM
- **Pipeline Tracking**: Lead stages (`new`, `contacted`, `qualified`, `proposal`, `won`, `lost`).
- **Priority Labels**: High, Medium, Low priority tags.
- **Value Estimation**: Deal value formatted in Indian Rupee (`₹`).
- **CRUD Operations**: Complete modal dialogs for creating, editing, and deleting leads.

## 4. Client Account Management
- **Client Directory**: Complete listing of organization clients with contact information.
- **Lifetime Value (LTV)**: Automated accumulation of client spend formatted in `₹`.
- **Search & Filters**: Instant client search and industry filtering.

## 5. Project Workflows
- **Project Tracking**: Milestone completion tracking with visual progress bars.
- **Budget Tracking**: Budget values formatted in Indian Rupee (`₹`).
- **Team Assignment**: Direct linking of assigned employees and client accounts.

## 6. Task Management
- **Multi-View Interface**: Kanban drag-and-drop board, data list table, and monthly calendar view.
- **Subtask Checklists**: Interactive subtask items with completion percentages.
- **Overdue Task Tracking**: Warning indicators for overdue tasks.

## 7. Finance & Invoicing
- **Invoices & Quotations**: Full creation, editing, and status management.
- **Convert Quotation to Invoice**: 1-click transformation of approved quotes into invoices.
- **PDF Generation**: Native browser print & PDF download engine for invoices and quotes.
- **Expense Tracking**: Expense categorization and vendor payment logs.

## 8. HR & Team Operations
- **Employee Directory**: Profile management, designation, joining date, and annual salary (`₹`).
- **Department CRUD**: Department structure and manager assignment.
- **Daily Attendance**: Check-In / Check-Out logger with working hours calculation.
- **Payroll Slips**: Monthly salary slip generator with PDF export.

## 9. Reports & Analytics
- **KPI Summaries**: Revenue, Net Profit, Operational Expenses, and Win Rates.
- **Timeframe Selector**: Toggle metrics across Weekly, Monthly, and Yearly intervals.
- **Multi-Format Exports**: Export reports to CSV, Excel (`.xlsx`), or printable PDF.

## 10. Role-Based Access Control (RBAC)
- **Permission Matrix**: Interactive grid for managing Create, Read, Update, Delete, Export, and Approve permissions across 11 modules.
- **System Roles**: Pre-configured Super Admin, Admin, Manager, Sales, HR, Finance, Employee roles.
- **Custom Roles**: Ability to create bespoke role permissions.

## 11. Realtime Notification Center
- **Header Counter Bell**: Live unread count badge.
- **Supabase Realtime Listener**: Instant channel push for lead assignments, invoice updates, and task alerts.
- **Category Filters**: Filter notifications by status or module source.
