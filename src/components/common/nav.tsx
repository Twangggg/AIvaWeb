"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { ThemeLanguageControls } from "@/components/common/theme-language-controls";
import { useAuthStore } from "@/features/auth/auth.store";
import { resolveConsoleRole, roleHomePath } from "@/features/console/role-access";
import { useI18n } from "@/lib/i18n/provider";

interface NavProps {
  onPreorder: () => void;
}

export function Nav({ onPreorder }: NavProps) {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const bootstrap = useAuthStore((s) => s.bootstrap);
  const hydrated = useAuthStore((s) => s.hydrated);
  const status = useAuthStore((s) => s.status);
  const role = resolveConsoleRole(useAuthStore((s) => s.tokens?.user?.role));
  const loggedIn = hydrated && status === "authenticated";
  const consoleHref = roleHomePath(role);
  const consoleLabel =
    role === "parent" ? t.navConsoleParent : role === "admin" ? t.navConsoleAdmin : t.navConsoleTeacher;

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "/product", label: t.navExperience },
    { href: "/news", label: t.navKids },
    { href: "/about", label: t.navAbout },
  ];

  const closeMenu = () => setMenuOpen(false);

  const accountHref = loggedIn ? consoleHref : "/console/login";
  const accountLabel = loggedIn ? consoleLabel : t.navLogin;

  return (
    <>
      {/* ── Desktop nav ── */}
      <nav
        className="fixed top-0 left-1/2 z-50 hidden items-center transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:flex"
        style={{
          transform: "translateX(-50%)",
          width: scrolled ? "100%" : "min(960px, calc(100% - 3rem))",
          top: scrolled ? 0 : "1rem",
          borderRadius: scrolled ? 0 : "9999px",
          padding: scrolled ? "0" : "0 0.375rem",
        }}
      >
        <div
          className="absolute inset-0 -z-10 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{
            borderRadius: "inherit",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            background: scrolled ? "var(--nav-bg)" : "rgba(255,255,255,0.08)",
            border: `1px solid ${scrolled ? "var(--nav-border)" : "rgba(255,255,255,0.12)"}`,
            boxShadow: scrolled
              ? "0 1px 0 rgba(255,255,255,0.06)"
              : "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        />

        <div
          className="flex w-full items-center justify-between transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]"
          style={{ padding: scrolled ? "0.625rem 2rem" : "0.5rem 1.25rem" }}
        >
          <Link href="/" className="relative z-10 flex shrink-0 items-center">
            <Image
              src="/AIVALogo.png"
              alt="AIVA Logo"
              width={140}
              height={28}
              className="object-contain transition-all duration-500"
              style={{ width: scrolled ? 120 : 140 }}
              priority
            />
          </Link>

          <div
            className="relative z-10 flex items-center gap-0.5 text-sm transition-all duration-500"
            style={{ color: "var(--text-muted)" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative rounded-full px-4 py-2 font-medium transition-all duration-200"
                style={{
                  color: "var(--text-muted)",
                  background: "transparent",
                }}
              >
                <span
                  className="transition-all duration-200 group-hover:text-[var(--ocean)]"
                  style={{ textShadow: "0 0 0 transparent" }}
                >
                  {link.label}
                </span>
                <span
                  className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full opacity-0 transition-all duration-300 group-hover:w-5 group-hover:opacity-100"
                  style={{
                    background: "var(--ocean)",
                    boxShadow: "0 0 10px var(--ocean-glow)",
                  }}
                />
              </Link>
            ))}
            <button
              type="button"
              onClick={onPreorder}
              className="group relative rounded-full px-4 py-2 font-medium transition-all duration-200"
              style={{
                color: "var(--text-muted)",
                background: "transparent",
              }}
            >
              <span
                className="transition-all duration-200 group-hover:text-[var(--ocean)]"
                style={{ textShadow: "0 0 0 transparent" }}
              >
                {t.navReserve}
              </span>
              <span
                className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full opacity-0 transition-all duration-300 group-hover:w-5 group-hover:opacity-100"
                style={{
                  background: "var(--ocean)",
                  boxShadow: "0 0 10px var(--ocean-glow)",
                }}
              />
            </button>
          </div>

          <div className="relative z-10 flex items-center gap-2.5">
            <ThemeLanguageControls />
            <Link
              href={accountHref}
              className="hidden items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-white/10 lg:inline-flex"
              style={{ color: "var(--text-muted)" }}
            >
              {accountLabel}
            </Link>
            <button
              type="button"
              onClick={onPreorder}
              className="rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{
                background: "var(--gradient-ocean)",
                color: "var(--text-on-accent)",
                boxShadow: "0 2px 12px rgba(234,179,8,0.3)",
              }}
            >
              {t.ctaPrimary}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile nav ── */}
      <nav className="fixed z-50 md:hidden" style={{ top: "0.75rem", left: "0.75rem", right: "0.75rem" }}>
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            borderRadius: "9999px",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            background: scrolled ? "var(--nav-bg)" : "rgba(255,255,255,0.08)",
            border: `1px solid ${scrolled ? "var(--nav-border)" : "rgba(255,255,255,0.12)"}`,
            boxShadow: scrolled
              ? "0 1px 0 rgba(255,255,255,0.06)"
              : "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <Link href="/" className="flex items-center">
            <Image src="/AIVALogo.png" alt="AIVA Logo" width={120} height={24} className="object-contain" priority />
          </Link>

          <div className="flex items-center gap-2">
            <ThemeLanguageControls />
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200"
              style={{ background: "rgba(255,255,255,0.1)" }}
              aria-label={menuOpen ? t.navMenuClose : t.navMenuOpen}
              aria-expanded={menuOpen}
            >
              <span className="material-symbols-outlined text-lg" style={{ color: "var(--text-on-glass)" }}>
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        <div
          className="mt-2 flex flex-col gap-1 overflow-hidden transition-all duration-300"
          style={{
            borderRadius: "1.5rem",
            padding: menuOpen ? "0.5rem" : "0",
            maxHeight: menuOpen ? "400px" : "0",
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? "auto" : "none",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            background: "var(--nav-bg)",
            border: menuOpen ? "1px solid var(--nav-border)" : "1px solid transparent",
            boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-2xl px-5 py-3.5 text-sm font-medium transition-colors duration-200 hover:bg-white/10"
              style={{ color: "var(--text-muted)" }}
            >
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => { closeMenu(); onPreorder(); }}
            className="rounded-2xl px-5 py-3.5 text-left text-sm font-medium transition-colors duration-200 hover:bg-white/10"
            style={{ color: "var(--text-muted)" }}
          >
            {t.navReserve}
          </button>
          <Link
            href={accountHref}
            onClick={closeMenu}
            className="rounded-2xl px-5 py-3.5 text-sm font-medium transition-colors duration-200 hover:bg-white/10"
            style={{ color: "var(--text-muted)" }}
          >
            {accountLabel}
          </Link>
          <div className="mt-1 flex flex-col gap-2 px-2 pb-2">
            <button
              type="button"
              onClick={() => { closeMenu(); onPreorder(); }}
              className="w-full rounded-full py-3 text-sm font-semibold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "var(--gradient-ocean)",
                color: "var(--text-on-accent)",
                boxShadow: "0 2px 12px rgba(234,179,8,0.3)",
              }}
            >
              {t.ctaPrimary}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
