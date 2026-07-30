import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve Supabase auth session token from cookies
  const authCookie =
    request.cookies.get("sb-access-token")?.value ||
    request.cookies.get("sb-auth-token")?.value ||
    Array.from(request.cookies.getAll()).find((c) =>
      c.name.includes("auth-token") || c.name.startsWith("sb-")
    )?.value;

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/crm") ||
    pathname.startsWith("/clients") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/tasks") ||
    pathname.startsWith("/finance") ||
    pathname.startsWith("/hr") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/roles") ||
    pathname.startsWith("/notifications");
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/forgot-password");

  // Protect dashboard, CRM, clients, projects, tasks, finance, HR, reports, settings, roles & notifications routes: redirect unauthenticated users to /login
  if (isProtectedRoute && !authCookie) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/forgot-password to /dashboard
  if (isAuthRoute && authCookie) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/crm/:path*",
    "/clients/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/finance/:path*",
    "/hr/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/roles/:path*",
    "/notifications/:path*",
    "/login",
    "/forgot-password",
  ],
};
