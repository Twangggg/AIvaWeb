"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_MODULES } from "@/features/admin/admin.modules";
import { useAuthStore } from "@/features/auth/auth.store";
import { AppearanceMenu } from "@/components/common/appearance-menu";
import { useI18n } from "@/lib/i18n/provider";

const COLLAPSE_KEY = "aiva_admin_sidebar_collapsed";

type NavItem = {
  id: string;
  href: string;
  labelVi: string;
  labelEn: string;
  icon: string;
  ready: boolean;
};

function buildNav(): NavItem[] {
  return [
    {
      id: "overview",
      href: "/console/admin",
      labelVi: "Tổng quan",
      labelEn: "Overview",
      icon: "space_dashboard",
      ready: true,
    },
    ...ADMIN_MODULES.map((mod) => ({
      id: mod.id,
      href: mod.href,
      labelVi: mod.title.replace(/\s*\(sắp có\)/i, ""),
      labelEn: mod.titleEn.replace(/\s*\(soon\)/i, ""),
      icon:
        mod.id === "preorders"
          ? "shopping_bag"
          : mod.id === "users"
            ? "group"
            : mod.id === "devices"
              ? "devices"
              : "monitoring",
      ready: mod.ready,
    })),
  ];
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { locale } = useI18n();
  const en = locale === "en";
  const user = useAuthStore((s) => s.tokens?.user);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate collapse preference
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  const closeMobile = () => setMobileOpen(false);
  const isCollapsed = ready && collapsed;
  const nav = buildNav();
  const displayName = user?.displayName || user?.email || "Admin";
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("") || "A";

  return (
    <div className="flex min-h-dvh bg-[var(--console-canvas)] text-[var(--console-fg)] transition-colors">
      {/* Desktop sidebar */}
      <aside
        className={`relative sticky top-0 z-20 hidden h-dvh shrink-0 flex-col border-r border-[var(--console-border)] bg-[var(--console-rail)] transition-[width] duration-200 ease-out lg:flex ${
          isCollapsed ? "w-16" : "w-[15.5rem]"
        }`}
      >
        <SidebarBody
          pathname={pathname}
          en={en}
          nav={nav}
          collapsed={isCollapsed}
          displayName={displayName}
          email={user?.email || ""}
          initials={initials}
          onToggleCollapse={toggleCollapsed}
          onLogout={() => void logout()}
          onNavigate={undefined}
        />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={en ? "Close menu" : "Đóng menu"}
            onClick={closeMobile}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(17.5rem,88vw)] flex-col border-r border-[var(--console-border)] bg-[var(--console-rail)] shadow-xl">
            <SidebarBody
              pathname={pathname}
              en={en}
              nav={nav}
              collapsed={false}
              displayName={displayName}
              email={user?.email || ""}
              initials={initials}
              onLogout={() => void logout()}
              onNavigate={closeMobile}
              onClose={closeMobile}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-[var(--console-border)] bg-[var(--console-rail)]/90 px-4 backdrop-blur sm:px-6 lg:px-8 xl:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] text-[var(--console-muted)] lg:hidden"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <p className="truncate text-sm text-[var(--console-muted)]">
              {en ? "Live ops · pre-orders & accounts" : "Vận hành · đặt trước & tài khoản"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AppearanceMenu />
          </div>
        </header>

        <main className="w-full flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 xl:px-10">{children}</main>
      </div>
    </div>
  );
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/console/admin") return pathname === "/console/admin" || pathname === "/console/admin/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarBody({
  pathname,
  en,
  nav,
  collapsed,
  displayName,
  email,
  initials,
  onToggleCollapse,
  onLogout,
  onNavigate,
  onClose,
}: {
  pathname: string;
  en: boolean;
  nav: NavItem[];
  collapsed: boolean;
  displayName: string;
  email: string;
  initials: string;
  onToggleCollapse?: () => void;
  onLogout: () => void;
  onNavigate?: () => void;
  onClose?: () => void;
}) {
  return (
    <>
      {/* Brand + collapse at top */}
      <div
        className={`relative flex h-14 items-center border-b border-[var(--console-border)] px-3 ${
          collapsed ? "justify-center" : "justify-between gap-2"
        }`}
      >
        <Link
          href="/"
          onClick={onNavigate}
          className={`flex min-w-0 items-center gap-2.5 overflow-hidden ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? (en ? "AIva — website" : "AIva — trang chủ") : en ? "Back to website" : "Về trang chủ"}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--console-inverse)] text-sm font-bold text-[var(--console-accent)]">
            A
          </span>
          {!collapsed && (
            <span className="truncate text-sm font-semibold tracking-tight">
              AIva <span className="font-medium text-[var(--console-muted)]">Admin</span>
            </span>
          )}
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--console-muted)] hover:opacity-90 dark:hover:bg-white/5"
            aria-label={en ? "Close" : "Đóng"}
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        )}
        {onToggleCollapse && !collapsed && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-expanded
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--console-muted)] hover:bg-black/[0.05] hover:text-[var(--console-fg)] dark:hover:bg-white/[0.06]"
            title={en ? "Collapse sidebar" : "Thu gọn"}
            aria-label={en ? "Collapse sidebar" : "Thu gọn"}
          >
            <span className="material-symbols-outlined text-[20px]">keyboard_double_arrow_left</span>
          </button>
        )}
      </div>

      {/* Primary nav — when collapsed, click empty rail space to expand */}
      <nav
        className={`flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-3 ${
          collapsed && onToggleCollapse ? "cursor-e-resize" : ""
        }`}
        aria-label="Admin"
        title={collapsed && onToggleCollapse ? (en ? "Click empty area to expand" : "Bấm khoảng trống để mở rộng") : undefined}
        onClick={
          collapsed && onToggleCollapse
            ? (e) => {
                if (e.target === e.currentTarget) onToggleCollapse();
              }
            : undefined
        }
      >
        {nav.map((item) => {
          const active = isActive(pathname, item.href);
          const label = en ? item.labelEn : item.labelVi;
          if (!item.ready) {
            return (
              <span
                key={item.id}
                title={`${label} · ${en ? "Coming soon" : "Sắp có"}`}
                className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-[#b0a690] ${
                  collapsed ? "justify-center px-0" : ""
                }`}
              >
                <span className="material-symbols-outlined text-[22px] opacity-70">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{label}</span>
                    <span className="text-[10px] font-medium uppercase tracking-wide text-[#c4b89a]">
                      {en ? "Soon" : "Soon"}
                    </span>
                  </>
                )}
              </span>
            );
          }
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                collapsed ? "justify-center px-0" : ""
              } ${
                active
                  ? "bg-[var(--console-inverse)] text-[var(--console-inverse-fg)]"
                  : "text-[var(--console-fg)]/80 hover:bg-black/[0.04] hover:text-[var(--console-fg)] dark:hover:bg-white/[0.06]"
              }`}
            >
              {active && !collapsed && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-[var(--console-accent)]" />
              )}
              <span
                className={`material-symbols-outlined text-[22px] ${
                  active ? "text-[var(--console-accent)]" : "text-[var(--console-muted)]"
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[var(--console-border)] p-2">
        <div
          className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${collapsed ? "justify-center" : ""}`}
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--console-inverse)] text-[11px] font-semibold text-[var(--console-inverse-fg)]">
            {initials}
          </span>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">{displayName}</p>
              <p className="truncate text-xs text-[var(--console-muted)]">{email || "admin"}</p>
            </div>
          )}
          {!collapsed && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[var(--console-muted)] hover:bg-black/[0.05] hover:text-[var(--console-fg)] dark:hover:bg-white/[0.06]"
              title={en ? "Log out" : "Đăng xuất"}
              aria-label={en ? "Log out" : "Đăng xuất"}
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          )}
        </div>
        {collapsed && (
          <button
            type="button"
            onClick={onLogout}
            className="mt-1 flex w-full items-center justify-center rounded-lg py-2 text-[var(--console-muted)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
            title={en ? "Log out" : "Đăng xuất"}
            aria-label={en ? "Log out" : "Đăng xuất"}
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
          </button>
        )}
      </div>
    </>
  );
}
