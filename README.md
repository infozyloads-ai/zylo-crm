# Zylo CRM — Enterprise Customer Relationship & Operations Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Zylo CRM** is a production-grade, full-stack enterprise CRM and business management suite built for modern teams. It unifies Lead & Sales Pipeline Management, Client Accounts, Project Workflows, Task Boards, Financial Invoicing & Expense Tracking, HR & Employee Payroll, Executive Reports, Role-Based Access Control (RBAC), and Realtime Notifications into a cohesive, responsive web platform.

---

## 🌟 Key Features

- 💼 **Sales & Pipeline CRM**: Visual lead tracking, conversion stages, priority labels, and deal value estimations.
- 🏢 **Client Management**: Client accounts, contact directory, associated projects, and total lifetime spend analytics.
- 📁 **Project Management**: Project milestones, health status, team assignment, budget tracking, and progress bars.
- 📋 **Task Management**: Kanban board, list table, calendar view, checklist subtasks, time estimation, and overdue widgets.
- 💰 **Finance & Invoicing**: Invoices, quotations, payment reconciliation, expense tracking, and downloadable PDF receipts.
- 👥 **HR & Team Operations**: Employee directory, department hierarchy, attendance check-in/out, leave approvals, and monthly payroll slips.
- 📊 **Reports & Analytics**: Executive KPI cards, sales funnel charts, revenue vs. operational costs breakdown, and multi-format exports (CSV, Excel, PDF).
- ⚙️ **Settings & Security**: Organization profile, dark/light theme toggle, custom email templates, database backup/restore, and audit logs.
- 🔐 **Role-Based Access Control (RBAC)**: Fine-grained permission matrix across 8 default system roles and custom role support.
- 🔔 **Notification Center**: Header unread counter bell, category filters, realtime Supabase broadcast events, and preferences dialog.
- 🇮🇳 **Indian Rupee (₹) Localization**: Native `en-IN` currency formatting (`₹1,25,000`) across all financial metrics.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router & Turbopack)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphic Tokens
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) (Auth, PostgreSQL, Realtime & RLS Policies)
- **State & Form Management**: React Hook Form + [Zod Validation](https://zod.dev/)
- **Typography**: [Inter](https://fonts.google.com/specimen/Inter) via `next/font/google`

---

## 🚀 Quick Start & Local Development

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/zylo-crm.git
   cd zylo-crm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Type Verification & Build**:
   ```bash
   npx tsc --noEmit
   npm run build
   ```

---

## 📁 Project Structure

```
zylo-crm/
├── app/                      # Next.js App Router (pages & layouts)
│   ├── (auth)/               # Auth routes (/login, /forgot-password)
│   ├── (dashboard)/          # Dashboard routes (/dashboard, /crm, /finance, etc.)
│   ├── globals.css           # Design tokens, Inter font & Tailwind base
│   └── layout.tsx            # Root HTML layout with Inter font loader
├── components/               # Shared UI components
│   ├── layout/               # Sidebar, Header, User Menu
│   └── ui/                   # Buttons, Cards, Dialogs, Badges, EmptyState
├── features/                 # Modular feature domains
│   ├── auth/                 # Auth forms & session hooks
│   ├── crm/                  # Leads pipeline & dialogs
│   ├── clients/              # Client accounts & directory
│   ├── projects/             # Project tracking & progress
│   ├── tasks/                # Kanban board, list & calendar
│   ├── finance/              # Invoices, quotations, expenses & PDF generator
│   ├── hr/                   # Employee management, attendance & payroll
│   ├── reports/              # Analytics charts & export helpers
│   ├── settings/             # System config & backup/restore
│   ├── rbac/                 # Permission matrix & role manager
│   └── notifications/        # Notification bell, popover & realtime listener
├── lib/                      # Helper utilities
│   ├── format-currency.ts    # Indian Rupee (₹) en-IN currency formatter
│   └── supabase/             # Supabase client & server instances
├── public/                   # Static branding assets (logo.png, mascot.png)
└── middleware.ts             # Auth session protection middleware
```

---

## 🌐 Deployment Guidelines

### Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into your [Vercel Dashboard](https://vercel.com/new).
3. Set the required Environment Variables in Vercel settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js App Router application.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
