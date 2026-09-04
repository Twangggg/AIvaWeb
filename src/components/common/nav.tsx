"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";
import { ThemeLanguageControls } from "@/components/common/theme-language-controls";

interface NavProps {
  onPreorder: () => void;
}

export function Nav({ onPreorder }: NavProps) {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { href: "/product", label: t.navExperience },
    { href: "/news", label: t.navKids },
    { href: "/about", label: t.navAbout }
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
          borderColor: scrolled ? "var(--nav-border)" : "transparent"
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center relative z-50">
            <Image src="/AIVALogo.png" alt="AIVA Logo" width={156} height={32} className="object-contain" priority />
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm" style={{ color: "var(--text-muted)" }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link hover:text-[var(--text-on-glass)]">
                {link.label}
              </Link>
            ))}
            <button onClick={onPreorder} className="nav-link hover:text-[var(--text-on-glass)]">
              {t.navReserve}
            </button>
          </div>

          <div className="flex items-center gap-3 relative z-50">
            <ThemeLanguageControls />
            <Link
              href="/console/login"
              className="hidden sm:inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold transition hover:bg-[var(--bg-subtle)]"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-on-glass)" }}
            >
              {t.navLogin}
            </Link>
            <button onClick={onPreorder} className="hidden sm:block btn-primary px-5 py-2 text-sm">
              {t.ctaPrimary}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full"
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
        className="fixed inset-0 z-40 md:hidden transition-opacity duration-300"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? "auto" : "none" }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "var(--overlay-bg)" }} onClick={closeMenu} />
        <div
          className="absolute top-0 right-0 h-full w-[min(320px,85vw)] backdrop-blur-xl border-l flex flex-col transition-transform duration-300"
          style={{
            backgroundColor: "var(--nav-bg)",
            borderColor: "var(--nav-border)",
            transform: menuOpen ? "translateX(0)" : "translateX(100%)"
          }}
        >
          <div className="pt-24 px-6 flex flex-col gap-2 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="py-4 text-lg font-medium border-b"
                style={{ color: "var(--text-on-glass)", borderColor: "var(--border-subtle)" }}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { closeMenu(); onPreorder(); }}
              className="py-4 text-lg font-medium text-left border-b"
              style={{ color: "var(--text-on-glass)", borderColor: "var(--border-subtle)" }}
            >
              {t.navReserve}
            </button>
            <Link
              href="/console/login"
              onClick={closeMenu}
              className="py-4 text-lg font-medium border-b"
              style={{ color: "var(--text-on-glass)", borderColor: "var(--border-subtle)" }}
            >
              {t.navLogin}
            </Link>
          </div>
          <div className="p-6 flex flex-col gap-3">
            <Link href="/console/login" onClick={closeMenu} className="w-full btn-ghost py-3.5 text-center">
              {t.navLogin}
            </Link>
            <button onClick={() => { closeMenu(); onPreorder(); }} className="w-full btn-primary py-3.5">
              {t.ctaPrimary}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
