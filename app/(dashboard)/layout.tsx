"use client";

import { useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { supabase } from "@/lib/supabase/client";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuthSession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      if (!data.session) {
        // Clear cookie if session is invalid or expired
        document.cookie =
          "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        router.replace("/login");
      } else {
        // Ensure cookie is synced for server requests
        document.cookie = `sb-access-token=${data.session.access_token}; path=/; max-age=604800; SameSite=Lax`;
        setIsAuthChecking(false);
      }
    }

    checkAuthSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          document.cookie =
            "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          router.replace("/login");
        } else {
          document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=604800; SameSite=Lax`;
          setIsAuthChecking(false);
        }
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Verifying authenticated session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setMobileMenuOpen((prev) => !prev)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}