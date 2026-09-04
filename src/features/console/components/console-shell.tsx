"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useI18n();
  const en = locale === "en";
  const isAuthPage =
    pathname === "/console/login" ||
    pathname === "/console/register" ||
    pathname === "/console/verify" ||
    pathname === "/console/verify-pending";
  const user = useAuthStore((s) => s.tokens?.user);
  const logout = useAuthStore((s) => s.logout);
  const isAdmin = user?.role === "admin";

  const nav = [
    { href: "/console", label: en ? "Overview" : "Tổng quan", exact: true },
    { href: "/console/play", label: en ? "Play" : "Chơi", exact: false },
    { href: "/console/safety", label: en ? "Safety" : "An toàn", exact: false },
    { href: "/console/history", label: en ? "History" : "Lịch sử", exact: false },
    ...(isAdmin ? [{ href: "/console/admin", label: "Admin", exact: false }] : []),
    { href: "/console/device", label: en ? "Device" : "Thiết bị", exact: false },
  ];

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh bg-[#f4f1ea] text-[#1a1a1a]">
      <header className="sticky top-0 z-20 border-b border-black/8 bg-[#f4f1ea]/92 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/console" className="text-sm font-bold tracking-wide">
              AIva <span className="font-medium text-[#8a7a4a]">Console</span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {nav.map((item) => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active ? "bg-black/8 text-[#1a1a1a]" : "text-[#6b7280] hover:bg-black/5 hover:text-[#1a1a1a]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[14rem] truncate text-sm text-[#6b7280] sm:inline">
              {user?.displayName || user?.email || "—"}
              {user?.role ? ` · ${user.role}` : ""}
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="min-h-10 rounded-lg border border-black/10 bg-white px-3 text-sm font-semibold hover:bg-black/5"
            >
              {en ? "Log out" : "Đăng xuất"}
            </button>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-black/5 px-4 py-2 sm:hidden">
          {nav.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium ${
                  active ? "bg-black/8" : "text-[#6b7280]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
