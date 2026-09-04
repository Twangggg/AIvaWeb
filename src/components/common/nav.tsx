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
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
          borderColor: scrolled ? "var(--nav-border)" : "transparent",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="relative z-50 flex items-center">
            <Image src="/AIVALogo.png" alt="AIVA Logo" width={156} height={32} className="object-contain" priority />
          </Link>

          <div className="hidden items-center gap-6 text-sm md:flex" style={{ color: "var(--text-muted)" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link hover:text-[var(--text-on-glass)]">
                {link.label}
              </Link>
            ))}
            <button type="button" onClick={onPreorder} className="nav-link hover:text-[var(--text-on-glass)]">
              {t.navReserve}
            </button>
          </div>

          <div className="relative z-50 flex items-center gap-3">
            <ThemeLanguageControls />
            <Link
              href={accountHref}
              className="hidden items-center rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-[var(--bg-subtle)] sm:inline-flex"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-on-glass)" }}
            >
              {accountLabel}
            </Link>
            <button type="button" onClick={onPreorder} className="btn-primary hidden px-5 py-2 text-sm sm:block">
              {t.ctaPrimary}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full md:hidden"
              style={{ backgroundColor: "var(--bg-subtle)" }}
              aria-label={menuOpen ? t.navMenuClose : t.navMenuOpen}
              aria-expanded={menuOpen}
            >
              <span className="material-symbols-outlined" style={{ color: "var(--text-on-glass)" }}>
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className="fixed inset-0 z-40 transition-opacity duration-300 md:hidden"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "var(--overlay-bg)" }} onClick={closeMenu} />
        <div
          className="absolute top-0 right-0 flex h-full w-[min(320px,85vw)] flex-col border-l backdrop-blur-xl transition-transform duration-300"
          style={{
            backgroundColor: "var(--nav-bg)",
            borderColor: "var(--nav-border)",
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div className="flex flex-1 flex-col gap-2 px-6 pt-24">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="border-b py-4 text-lg font-medium"
                style={{ color: "var(--text-on-glass)", borderColor: "var(--border-subtle)" }}
              >
                {link.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onPreorder();
              }}
              className="border-b py-4 text-left text-lg font-medium"
              style={{ color: "var(--text-on-glass)", borderColor: "var(--border-subtle)" }}
            >
              {t.navReserve}
            </button>
            <Link
              href={accountHref}
              onClick={closeMenu}
              className="border-b py-4 text-lg font-medium"
              style={{ color: "var(--text-on-glass)", borderColor: "var(--border-subtle)" }}
            >
              {accountLabel}
            </Link>
          </div>
          <div className="flex flex-col gap-3 p-6">
            <Link href={accountHref} onClick={closeMenu} className="btn-ghost w-full py-3.5 text-center">
              {accountLabel}
            </Link>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                onPreorder();
              }}
              className="btn-primary w-full py-3.5"
            >
              {t.ctaPrimary}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
