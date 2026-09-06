"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/features/auth/auth.store";
import { RoleRouteGuard } from "@/features/console/components/role-route-guard";
import { RoleWorkspaceShell } from "@/features/console/components/role-workspace-shell";
import { navForRole, resolveConsoleRole } from "@/features/console/role-access";
import { useI18n } from "@/lib/i18n/provider";

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useI18n();
  const en = locale === "en";
  const isAuthPage =
    pathname === "/console/login" ||
    pathname === "/console/register" ||
    pathname === "/console/forgot-password" ||
    pathname === "/console/reset-password" ||
    pathname === "/console/verify" ||
    pathname === "/console/verify-pending" ||
    pathname === "/console/role" ||
    pathname.startsWith("/console/auth/");
  const user = useAuthStore((s) => s.tokens?.user);
  const logout = useAuthStore((s) => s.logout);
  const role = resolveConsoleRole(user?.role);

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Admin ops area keeps its own left sidebar.
  if (pathname.startsWith("/console/admin")) {
    return <RoleRouteGuard>{children}</RoleRouteGuard>;
  }

  // Admin peeking teacher tools — thin top bar + back to admin.
  if (role === "admin") {
    return (
      <RoleRouteGuard>
        <div className="min-h-dvh bg-[var(--console-canvas)] text-[var(--console-fg)] transition-colors">
          <header className="sticky top-0 z-20 border-b border-[var(--console-border)] bg-[var(--console-rail)]/92 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-sm font-bold tracking-wide" title={en ? "Back to website" : "Về trang chủ"}>
                  AIva <span className="font-medium text-[var(--console-muted)]">Admin</span>
                </Link>
                <span className="text-sm text-[var(--console-muted)]">
                  {en ? "Tool preview" : "Xem công cụ"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/console/admin"
                  className="rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 py-2 text-sm font-semibold hover:opacity-90"
                >
                  {en ? "Back to Admin" : "Về Admin"}
                </Link>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="min-h-10 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm font-semibold hover:opacity-90"
                >
                  {en ? "Log out" : "Đăng xuất"}
                </button>
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </RoleRouteGuard>
    );
  }

  const variant = role === "parent" ? "parent" : "teacher";
  const nav = navForRole(role);

  return (
    <RoleRouteGuard>
      <RoleWorkspaceShell variant={variant} nav={nav}>
        {children}
      </RoleWorkspaceShell>
    </RoleRouteGuard>
  );
}
