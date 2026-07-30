"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  ListTodo,
  CreditCard,
  UserCheck,
  BarChart3,
  Settings,
  ShieldCheck,
  Bell,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads & CRM", href: "/crm", icon: Users },
  { label: "Clients", href: "/clients", icon: Building2 },
  { label: "Projects", href: "/projects", icon: Briefcase },
  { label: "Tasks", href: "/tasks", icon: ListTodo },
  { label: "Finance", href: "/finance", icon: CreditCard },
  { label: "HR & Team", href: "/hr", icon: UserCheck },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Roles & RBAC", href: "/roles", icon: ShieldCheck },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto border-r border-slate-800 shadow-xl",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 rounded-xl bg-blue-600/20 p-1 border border-blue-500/30 flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
              <Image
                src="/images/logo.png"
                alt="Zylo CRM Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Zylo CRM
            </span>
          </Link>

          {/* Close button for mobile */}
          {onMobileClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileClose}
              className="lg:hidden text-slate-400 hover:text-white rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1 scrollbar-none">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
            Main Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                  )}
                />
                <span className="truncate">{item.label}</span>

                {isActive && (
                  <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mascot Bottom Card */}
        <div className="p-3.5 border-t border-slate-800/80 bg-slate-900/60">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-900/40 via-slate-800/60 to-slate-900 border border-blue-500/20 flex items-center gap-3 relative overflow-hidden group">
            <div className="relative h-12 w-12 shrink-0">
              <Image
                src="/images/mascot.png"
                alt="Zylo Mascot"
                fill
                className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-100 truncate">Zylo Assistant</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">Enterprise v2.5 Active</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
