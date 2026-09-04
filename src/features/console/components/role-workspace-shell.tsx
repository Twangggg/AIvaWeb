"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AppearanceMenu } from "@/components/common/appearance-menu";
import {
  flattenNavLinks,
  isGroupActive,
  isNavLinkActive,
  type ConsoleNavEntry,
  type ConsoleNavLink,
} from "@/features/console/role-access";
import { useAuthStore } from "@/features/auth/auth.store";
import { useI18n } from "@/lib/i18n/provider";

type ShellVariant = "teacher" | "parent";

/**
 * Top-nav workspace for teacher & parent — not the admin left-rail layout.
 * Related features are grouped into dropdowns; items are spaced across the bar.
 */
export function RoleWorkspaceShell({
  variant,
  nav,
  children,
}: {
  variant: ShellVariant;
  nav: ConsoleNavEntry[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { locale } = useI18n();
  const en = locale === "en";
  const user = useAuthStore((s) => s.tokens?.user);
  const logout = useAuthStore((s) => s.logout);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const isTeacher = variant === "teacher";
  const brandAccent = isTeacher
    ? en
      ? "Classroom"
      : "Lớp học"
    : en
      ? "Family"
      : "Gia đình";
  const brandHint = isTeacher
    ? en
      ? "Run play & devices"
      : "Chạy chơi & thiết bị"
    : en
      ? "Care & safety"
      : "Chăm sóc & an toàn";

  const flatLinks = flattenNavLinks(nav);
  const activeClass = isTeacher
    ? "bg-[var(--console-inverse)] text-[var(--console-inverse-fg)]"
    : "bg-sky-600 text-white dark:bg-sky-500";
  const idleClass =
    "text-[var(--console-fg)]/75 hover:bg-black/[0.04] hover:text-[var(--console-fg)] dark:hover:bg-white/[0.06]";

  useEffect(() => {
    if (!accountOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (!accountRef.current?.contains(e.target as Node)) setAccountOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [accountOpen]);

  const close = () => setMobileOpen(false);
  const displayName = user?.displayName || (en ? "Account" : "Tài khoản");
  const initials = (displayName.trim().charAt(0) || "A").toUpperCase();
  const roleLabel =
    user?.role === "parent"
      ? en
        ? "Parent"
        : "Phụ huynh"
      : user?.role === "admin"
        ? "Admin"
        : en
          ? "Teacher"
          : "Giáo viên";

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--console-canvas)] text-[var(--console-fg)] transition-colors">
      <header className="sticky top-0 z-30 border-b border-[var(--console-border)] bg-[var(--console-rail)]/95 backdrop-blur">
        <div className="relative flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left corner — logo */}
          <div className="relative z-10 flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] text-[var(--console-muted)] md:hidden"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>

            <Link href="/" className="min-w-0" title={en ? "Back to website" : "Về trang chủ"}>
              <p className="truncate text-sm font-bold tracking-tight">
                AIva{" "}
                <span
                  className={
                    isTeacher
                      ? "font-semibold text-[var(--console-accent)]"
                      : "font-semibold text-sky-600 dark:text-sky-400"
                  }
                >
                  {brandAccent}
                </span>
              </p>
              <p className="hidden truncate text-[11px] text-[var(--console-muted)] sm:block">{brandHint}</p>
            </Link>
          </div>

          {/* Center — primary nav (viewport-centered) */}
          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:gap-3 md:flex"
            aria-label={isTeacher ? "Teacher" : "Parent"}
          >
            {nav.map((entry) =>
              entry.kind === "link" ? (
                <TopLink
                  key={entry.href}
                  item={entry}
                  pathname={pathname}
                  siblings={flatLinks}
                  en={en}
                  activeClass={activeClass}
                  idleClass={idleClass}
                />
              ) : (
                <NavDropdown
                  key={entry.id}
                  entry={entry}
                  pathname={pathname}
                  en={en}
                  activeClass={activeClass}
                  idleClass={idleClass}
                />
              ),
            )}
          </nav>

          {/* Right corner — theme + account */}
          <div className="relative z-10 flex items-center gap-2">
            <AppearanceMenu />
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="inline-flex min-h-9 max-w-[14rem] items-center gap-2 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] py-1 pl-1.5 pr-2 text-sm font-medium text-[var(--console-fg)]"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--console-inverse)] text-xs font-semibold text-[var(--console-inverse-fg)]">
                  {initials}
                </span>
                <span className="hidden min-w-0 truncate sm:inline">{displayName}</span>
                <span className="material-symbols-outlined shrink-0 text-[16px] text-[var(--console-muted)]">
                  expand_more
                </span>
              </button>
              {accountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+0.45rem)] z-50 w-[17.5rem] rounded-xl border border-[var(--console-border)] bg-[var(--console-rail)] p-2 shadow-lg"
                >
                  <div className="rounded-lg bg-black/[0.03] px-3 py-3 dark:bg-white/[0.04]">
                    <div className="flex items-start gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--console-inverse)] text-sm font-semibold text-[var(--console-inverse-fg)]">
                        {initials}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[var(--console-fg)]">{displayName}</p>
                        <p className="mt-0.5 truncate text-xs text-[var(--console-muted)]">
                          {user?.email || "—"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-[var(--console-accent)]/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--console-muted)]">
                            {roleLabel}
                          </span>
                          {user?.emailConfirmed === false ? (
                            <span className="rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 dark:text-amber-200">
                              {en ? "Unverified" : "Chưa xác nhận"}
                            </span>
                          ) : (
                            <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                              {en ? "Verified" : "Đã xác nhận"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-1.5 flex flex-col gap-0.5">
                    <Link
                      href="/console/account"
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[var(--console-muted)]">
                        lock_reset
                      </span>
                      {en ? "Change password" : "Đổi mật khẩu"}
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => void logout()}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-red-700 hover:bg-red-500/10 dark:text-red-300"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      {en ? "Log out" : "Đăng xuất"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label={en ? "Close menu" : "Đóng menu"}
            onClick={close}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col bg-[var(--console-rail)] shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-[var(--console-border)] px-4">
              <Link href="/" onClick={close} className="text-sm font-bold" title={en ? "Back to website" : "Về trang chủ"}>
                AIva <span className="text-[var(--console-muted)]">{brandAccent}</span>
              </Link>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-8 items-center justify-center rounded-lg text-[var(--console-muted)]"
                aria-label={en ? "Close" : "Đóng"}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
              {nav.map((entry) =>
                entry.kind === "link" ? (
                  <MobileLink
                    key={entry.href}
                    item={entry}
                    pathname={pathname}
                    siblings={flatLinks}
                    en={en}
                    activeClass={activeClass}
                    onNavigate={close}
                  />
                ) : (
                  <div key={entry.id}>
                    <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--console-muted)]">
                      {en ? entry.labelEn : entry.labelVi}
                    </p>
                    <div className="flex flex-col gap-0.5">
                      {entry.children.map((child) => (
                        <MobileLink
                          key={child.href}
                          item={child}
                          pathname={pathname}
                          siblings={entry.children}
                          en={en}
                          activeClass={activeClass}
                          onNavigate={close}
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </nav>
            <div className="border-t border-[var(--console-border)] p-3">
              <div className="mb-2 rounded-lg bg-black/[0.03] px-3 py-2.5 dark:bg-white/[0.04]">
                <p className="truncate text-sm font-semibold">{displayName}</p>
                <p className="truncate text-xs text-[var(--console-muted)]">{user?.email || "—"}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-[var(--console-muted)]">
                  {roleLabel}
                </p>
              </div>
              <Link
                href="/console/account"
                onClick={close}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
              >
                {en ? "Change password" : "Đổi mật khẩu"}
              </Link>
              <button
                type="button"
                onClick={() => void logout()}
                className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-500/10 dark:text-red-300"
              >
                {en ? "Log out" : "Đăng xuất"}
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-7 sm:px-8 sm:py-8 lg:px-10">{children}</main>
    </div>
  );
}

function TopLink({
  item,
  pathname,
  siblings,
  en,
  activeClass,
  idleClass,
}: {
  item: ConsoleNavLink;
  pathname: string;
  siblings: ConsoleNavLink[];
  en: boolean;
  activeClass: string;
  idleClass: string;
}) {
  const active = isNavLinkActive(item, pathname, siblings);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
        active ? activeClass : idleClass
      }`}
    >
      {item.icon && <span className="material-symbols-outlined text-[18px]">{item.icon}</span>}
      <span className="whitespace-nowrap">{en ? item.labelEn : item.labelVi}</span>
    </Link>
  );
}

function NavDropdown({
  entry,
  pathname,
  en,
  activeClass,
  idleClass,
}: {
  entry: Extract<ConsoleNavEntry, { kind: "group" }>;
  pathname: string;
  en: boolean;
  activeClass: string;
  idleClass: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const groupActive = isGroupActive(entry, pathname);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
          groupActive || open ? activeClass : idleClass
        }`}
      >
        {entry.icon && <span className="material-symbols-outlined text-[18px]">{entry.icon}</span>}
        <span className="whitespace-nowrap">{en ? entry.labelEn : entry.labelVi}</span>
        <span
          className={`material-symbols-outlined text-[16px] transition ${open ? "rotate-180" : ""}`}
        >
          expand_more
        </span>
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-[calc(100%+0.45rem)] z-50 w-52 -translate-x-1/2 rounded-xl border border-[var(--console-border)] bg-[var(--console-rail)] p-1.5 shadow-lg"
        >
          {entry.children.map((child) => {
            const active = isNavLinkActive(child, pathname, entry.children);
            return (
              <Link
                key={child.href}
                href={child.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition ${
                  active
                    ? "bg-black/[0.06] font-semibold dark:bg-white/[0.08]"
                    : "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                }`}
              >
                {child.icon && (
                  <span className="material-symbols-outlined text-[18px] text-[var(--console-muted)]">
                    {child.icon}
                  </span>
                )}
                {en ? child.labelEn : child.labelVi}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MobileLink({
  item,
  pathname,
  siblings,
  en,
  activeClass,
  onNavigate,
}: {
  item: ConsoleNavLink;
  pathname: string;
  siblings: ConsoleNavLink[];
  en: boolean;
  activeClass: string;
  onNavigate: () => void;
}) {
  const active = isNavLinkActive(item, pathname, siblings);
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
        active ? activeClass : "text-[var(--console-fg)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
      }`}
    >
      {item.icon && <span className="material-symbols-outlined text-[22px]">{item.icon}</span>}
      {en ? item.labelEn : item.labelVi}
    </Link>
  );
}
