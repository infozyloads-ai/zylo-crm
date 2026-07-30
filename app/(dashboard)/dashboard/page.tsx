import Link from "next/link";
import Image from "next/image";
import { Plus, ArrowRight, UserPlus, FileText, CheckSquare, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardKpiCards } from "@/features/dashboard/components/dashboard-kpi-cards";
import { cn } from "@/lib/utils";

const recentLeads = [
  { id: 1, name: "Acme Enterprise Corp", contact: "Sarah Jenkins", email: "sarah@acme.com", status: "Qualified", val: "₹45,000" },
  { id: 2, name: "Nexus Media Group", contact: "David Miller", email: "david@nexus.io", status: "Proposal Sent", val: "₹18,500" },
  { id: 3, name: "Starlight Technologies", contact: "Elena Rostova", email: "elena@starlight.tech", status: "Negotiation", val: "₹1,24,000" },
  { id: 4, name: "Vanguard Systems Inc", contact: "Robert Thorne", email: "r.thorne@vanguard.com", status: "New Lead", val: "₹15,000" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Welcome Hero Banner with Mascot */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-blue-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" /> Zylo Executive Suite Active
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome back, Zylo Admin!
            </h1>
            <p className="text-sm text-blue-100/80 leading-relaxed">
              Your business revenue, active project milestones, client lead conversions, and team attendance are synchronized in real-time.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="relative h-20 w-20 hidden sm:block">
              <Image
                src="/images/mascot.png"
                alt="Zylo Mascot Assistant"
                fill
                priority
                className="object-contain drop-shadow-xl hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                href="/crm"
                className={cn(buttonVariants({ variant: "secondary" }), "rounded-xl font-bold text-xs bg-white text-blue-900 hover:bg-blue-50")}
              >
                <UserPlus className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                Add Lead
              </Link>

              <Link
                href="/projects"
                className={cn(buttonVariants({ variant: "default" }), "rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30")}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardKpiCards />

      {/* Grid: Recent Leads & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pipeline Leads */}
        <Card className="lg:col-span-2 shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Recent Lead Pipeline
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest leads added to your CRM pipeline
              </p>
            </div>

            <Link
              href="/crm"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "text-blue-600 hover:text-blue-700 font-semibold text-xs rounded-xl"
              )}
            >
              View All
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5 font-semibold">Company / Lead</th>
                    <th className="px-6 py-3.5 font-semibold">Contact Person</th>
                    <th className="px-6 py-3.5 font-semibold">Status</th>
                    <th className="px-6 py-3.5 font-semibold text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                        <div>{lead.contact}</div>
                        <div className="text-xs text-slate-400">{lead.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 text-right">
                        {lead.val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Shortcuts & System Status */}
        <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Quick Management Shortcuts
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct access to essential CRM actions
            </p>
          </CardHeader>

          <CardContent className="space-y-3 p-5 flex-1">
            <Link
              href="/finance"
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Create Invoice
                </p>
                <p className="text-xs text-slate-500">Generate client billing</p>
              </div>
            </Link>

            <Link
              href="/tasks"
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <CheckSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Assign Project Task
                </p>
                <p className="text-xs text-slate-500">Update active milestones</p>
              </div>
            </Link>

            <Link
              href="/reports"
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all group"
            >
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Generate Report
                </p>
                <p className="text-xs text-slate-500">Export analytics summary</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
