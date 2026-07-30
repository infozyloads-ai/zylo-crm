"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Bell,
  LogOut,
  Menu,
  User,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { logout } from "@/features/auth/services/auth.service";
import { NotificationBell } from "@/features/notifications/components/notification-bell";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await logout();

    if (!res.success) {
      toast.error("Logout failed", { description: res.message });
      setIsLoggingOut(false);
      return;
    }

    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden text-slate-600 hover:text-slate-900"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative max-w-xs w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search leads, clients, projects..."
            className="pl-9 h-9 text-sm bg-slate-50 border-slate-200 focus-visible:bg-white rounded-xl"
          />
        </div>
      </div>

      {/* Right: Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Realtime Notification Center Bell */}
        <NotificationBell />

        {/* User Profile Menu Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu((prev) => !prev)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
              ZA
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">
                Zylo Admin
              </span>
              <span className="text-xs text-slate-500 leading-none mt-1">
                admin@zyload.com
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 hidden md:block" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 md:hidden">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Zylo Admin
                </p>
                <p className="text-xs text-slate-500">admin@zyload.com</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  router.push("/settings");
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <User className="h-4 w-4 text-slate-400" />
                Profile Settings
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
              >
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                ) : (
                  <LogOut className="h-4 w-4 text-red-600" />
                )}
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
