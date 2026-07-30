# Zylo CRM — Project Architecture & Structure

Zylo CRM is built using a feature-driven modular structure that isolates business domain logic into self-contained feature directories.

---

## 📂 Root Directory Architecture

```
zylo-crm/
├── app/                              # Next.js 16 App Router Routes
│   ├── (auth)/                       # Authentication Flow Group
│   │   ├── login/                    # Login Page & Mascot Split Hero
│   │   └── forgot-password/          # Password Recovery Page
│   ├── (dashboard)/                  # Authenticated Dashboard Layout Group
│   │   ├── dashboard/                # Executive Overview & KPI Cards
│   │   ├── crm/                      # Leads & Pipeline Management
│   │   ├── clients/                  # Client Directory & Lifetime Value
│   │   ├── projects/                 # Project Milestones & Progress
│   │   ├── tasks/                    # Task Kanban, List & Calendar
│   │   ├── finance/                  # Invoices, Quotations & Expenses
│   │   ├── hr/                       # Employees, Attendance & Payroll
│   │   ├── reports/                  # Analytics Charts & Exports
│   │   ├── settings/                 # System Config & Backup/Restore
│   │   ├── roles/                    # RBAC Permission Matrix & Roles
│   │   └── notifications/            # Full Notification Center View
│   ├── globals.css                   # Global CSS, Inter font & Tokens
│   └── layout.tsx                    # Root HTML Shell
├── components/                       # Shared UI & Layout Components
│   ├── layout/                       # Sidebar, Header, Mobile Drawer
│   └── ui/                           # Button, Input, Card, Badge, Dialog, EmptyState
├── features/                         # Isolated Feature Modules
│   ├── auth/                         # Authentication Logic & Forms
│   ├── crm/                          # CRM Domain Services & Dialogs
│   ├── clients/                      # Client Account Services
│   ├── projects/                     # Project Workflow Services
│   ├── tasks/                        # Task Kanban & Board Components
│   ├── finance/                      # Financial Services & PDF Slip Generator
│   ├── hr/                           # Employee, Attendance & Payroll Services
│   ├── reports/                      # Analytics Calculation Engine & Export Helpers
│   ├── settings/                     # Settings Services & Backup Exporter
│   ├── rbac/                         # RBAC Matrix & Role Management
│   └── notifications/                # Realtime Listener & Bell Component
├── lib/                              # Core Utility Modules
│   ├── format-currency.ts            # Indian Rupee (₹) en-IN Formatter
│   └── supabase/                     # Supabase Browser & Server Clients
├── public/                           # Static Visual Assets
│   └── images/                       # logo.png & mascot.png
├── middleware.ts                     # Auth Session & Cookie Sync Middleware
├── README.md                         # Main Documentation
└── tsconfig.json                     # TypeScript Compiler Configuration
```
