"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { ThemeLanguageControls } from "@/components/common/theme-language-controls";
import { AppDownloadModal } from "@/components/common/app-download-modal";
import { useAuthStore } from "@/features/auth/auth.store";
import { resolveConsoleRole, roleHomePath } from "@/features/console/role-access";
import { useI18n } from "@/lib/i18n/provider";
import { markIntroSeen } from "@/components/home/site-intro";

interface NavProps {
  onPreorder: () => void;
}

export function Nav({ onPreorder }: NavProps) {
  const { t, locale } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [kidsDropdownOpen, setKidsDropdownOpen] = useState(false);

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

  const closeMenu = () => {
    setMenuOpen(false);
    setKidsDropdownOpen(false);
  };

  const returnHome = () => {
    markIntroSeen();
    closeMenu();
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  };

  const accountHref = loggedIn ? consoleHref : "/console/login";
  const accountLabel = loggedIn ? consoleLabel : t.navLogin;

  return (
    <>
      {/* ── Desktop nav (Floating Pill for >= 1024px) ── */}
      <nav
        className="fixed left-1/2 -translate-x-1/2 z-50 hidden lg:block border transition-all duration-500 ease-out"
        style={{
          top: scrolled ? 0 : "1rem",
          width: scrolled ? "100%" : "min(1140px, calc(100% - 2.5rem))",
          borderRadius: scrolled ? 0 : "9999px",
          backgroundColor: scrolled ? "var(--modal-bg)" : "var(--nav-bg)",
          borderColor: "var(--nav-border)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          boxShadow: scrolled
            ? "0 14px 40px -8px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 8px 30px -8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.12)"
        }}
      >
        <div className="w-full px-5 py-2.5 flex items-center justify-between">
          {/* ZONE 1: BRAND LOGO */}
          <Link href="/" onClick={returnHome} className="relative z-10 flex shrink-0 items-center mr-6">
            <Image
              src="/AIVALogo.png"
              alt="AIVA Logo"
              width={130}
              height={26}
              className="object-contain"
              style={{ width: 130, height: "auto" }}
              priority
            />
          </Link>

          {/* ZONE 2: CENTER NAVIGATION & DISCOVERY LINKS */}
          <div
            className="relative z-10 flex items-center gap-1.5 text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            {/* Link 1: Cho trẻ em (Dropdown Menu) */}
            <div
              className="relative"
              onMouseEnter={() => setKidsDropdownOpen(true)}
              onMouseLeave={() => setKidsDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setKidsDropdownOpen(!kidsDropdownOpen)}
                className="group relative rounded-full px-3.5 py-1.5 whitespace-nowrap transition-all duration-200 flex items-center gap-1 hover:text-[var(--ocean)]"
              >
                <span>Cho trẻ em</span>
                <span
                  className={`material-symbols-outlined text-base transition-transform duration-200 ${kidsDropdownOpen ? "rotate-180" : ""}`}
                  style={{ color: "var(--ocean)" }}
                >
                  expand_more
                </span>
                <span
                  className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100"
                  style={{
                    background: "var(--ocean)",
                    boxShadow: "0 0 10px var(--ocean-glow)",
                  }}
                />
              </button>

              {kidsDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-60 z-50">
                  <div
                    className="rounded-2xl p-2 shadow-2xl backdrop-blur-2xl border animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      backgroundColor: "var(--modal-bg)",
                      borderColor: "var(--border-subtle)",
                      boxShadow: "var(--shadow-modal)"
                    }}
                  >
                    <Link
                      href="/play"
                      onClick={() => setKidsDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-subtle)]"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: "var(--ocean-alpha)",
                          borderColor: "var(--ocean)",
                          color: "var(--ocean)"
                        }}
                      >
                        <span className="material-symbols-outlined text-lg">sports_esports</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: "var(--text-on-glass)" }}>
                          {locale === "en" ? "Play with AIVA" : "Chơi cùng AIVA"}
                        </div>
                        <div className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                          Trải nghiệm Minigames & Thử thách
                        </div>
                      </div>
                    </Link>

                    <Link
                      href="/news"
                      onClick={() => setKidsDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-subtle)]"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: "var(--ocean-alpha)",
                          borderColor: "var(--ocean)",
                          color: "var(--ocean)"
                        }}
                      >
                        <span className="material-symbols-outlined text-lg">newspaper</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold" style={{ color: "var(--text-on-glass)" }}>
                          Tin Tức, Khảo Sát & Sự Kiện
                        </div>
                        <div className="text-[10px]" style={{ color: "var(--text-dim)" }}>
                          Bài viết, Khảo sát & Workshop
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/product#glasses-3d-showcase"
              className="rounded-full px-3 py-1.5 whitespace-nowrap transition-colors hover:text-[var(--ocean)]"
              title={t.navSpecs}
            >
              {locale === "en" ? "Specs" : "Thông số"}
            </Link>

            {/* Link 3: Về AIVA */}
            <Link
              href="/about"
              className="group relative rounded-full px-3.5 py-1.5 whitespace-nowrap transition-all duration-200 hover:text-[var(--ocean)]"
            >
              <span>{t.navAbout}</span>
              <span
                className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100"
                style={{
                  background: "var(--ocean)",
                  boxShadow: "0 0 10px var(--ocean-glow)",
                }}
              />
            </Link>

            {/* Link 4: Tải App AIVA (Nav Link format) */}
            <button
              type="button"
              onClick={() => setDownloadModalOpen(true)}
              className="group relative rounded-full px-3.5 py-1.5 whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 hover:text-[var(--ocean)]"
            >
              <span className="material-symbols-outlined text-base" style={{ color: "var(--ocean)" }}>download</span>
              <span>Tải App AIVA</span>
              <span
                className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100"
                style={{
                  background: "var(--ocean)",
                  boxShadow: "0 0 10px var(--ocean-glow)",
                }}
              />
            </button>
          </div>

          {/* ZONE 3: RIGHT UTILITY CONTROLS, ACCOUNT & PRIMARY CONVERSION CTA */}
          <div className="relative z-10 flex items-center gap-3 shrink-0">
            {/* Theme & Language Switcher */}
            <ThemeLanguageControls />

            {/* Account / Login */}
            <Link
              href={accountHref}
              className="hidden items-center rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:bg-white/10 lg:inline-flex"
              style={{ color: "var(--text-muted)" }}
            >
              {accountLabel}
            </Link>

            {/* Single Primary Conversion Button: ĐẶT TRƯỚC NGAY */}
            <button
              type="button"
              onClick={onPreorder}
              className="rounded-full px-5 py-2 text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 hover:brightness-110 active:scale-95 shadow-md"
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

      {/* ── Mobile / Tablet nav (Floating Pill for < 1024px) ── */}
      <nav
        className="fixed left-1/2 -translate-x-1/2 z-50 lg:hidden max-w-full transition-all duration-500 ease-out"
        style={{
          top: scrolled ? 0 : "0.625rem",
          width: scrolled ? "100%" : "min(calc(100% - 1rem), 56rem)"
        }}
      >
        <div
          className="w-full flex items-center justify-between px-2.5 py-1.5 sm:px-5 sm:py-2 border transition-all duration-500 ease-out"
          style={{
            borderRadius: scrolled ? 0 : "9999px",
            backgroundColor: scrolled ? "var(--modal-bg)" : "var(--nav-bg)",
            borderColor: "var(--nav-border)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            boxShadow: scrolled
              ? "0 12px 32px -6px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.15)"
              : "0 8px 24px -6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.12)"
          }}
        >
          <Link href="/" onClick={returnHome} className="flex items-center shrink-0 pl-0.5 sm:pl-1">
            <Image
              src="/AIVALogo.png"
              alt="AIVA Logo"
              width={88}
              height={18}
              className="object-contain h-[17px] sm:h-[22px] w-auto"
              priority
            />
          </Link>
          <div className="flex items-center gap-0.5 sm:gap-1.5">
            {/* Login / Account Tab */}
            <Link
              href={accountHref}
              onClick={closeMenu}
              className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all hover:bg-[var(--bg-subtle)] active:scale-95"
              style={{ color: "var(--text-on-glass)" }}
              aria-label={accountLabel}
            >
              <span className="material-symbols-outlined text-[17px] sm:text-lg" style={{ color: "var(--ocean)" }}>account_circle</span>
              <span className="hidden min-[420px]:inline whitespace-nowrap">{accountLabel}</span>
            </Link>

            <div className="h-3.5 w-px bg-[var(--border-subtle)] opacity-40 mx-0.5" />

            {/* Cài đặt (Theme & Ngôn ngữ) */}
            <ThemeLanguageControls />

            <div className="h-3.5 w-px bg-[var(--border-subtle)] opacity-40 mx-0.5" />

            {/* Dropdown Menu Toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 sm:p-1.5 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--bg-subtle)]"
              style={{ color: "var(--text-on-glass)" }}
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">{menuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="mt-2 w-full rounded-3xl p-4 backdrop-blur-2xl shadow-2xl border space-y-2 animate-in fade-in zoom-in-95 duration-150"
            style={{
              backgroundColor: "var(--modal-bg)",
              borderColor: "var(--border-subtle)",
              boxShadow: "var(--shadow-modal)"
            }}
          >
            {/* Mobile Kids Links Sub-group */}
            <div className="px-2 py-2 border-b mb-2" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ocean)" }}>
                Cho Trẻ Em
              </div>
              <div className="flex flex-col gap-2 pl-2">
                <Link
                  href="/play"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-sm font-medium py-1"
                  style={{ color: "var(--text-on-glass)" }}
                >
                  <span className="material-symbols-outlined text-base" style={{ color: "var(--ocean)" }}>sports_esports</span>
                  Chơi cùng AIVA
                </Link>
                <Link
                  href="/news"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-sm font-medium py-1"
                  style={{ color: "var(--text-on-glass)" }}
                >
                  <span className="material-symbols-outlined text-base" style={{ color: "var(--ocean)" }}>newspaper</span>
                  Góc Trẻ Em & Tin Tức
                </Link>
              </div>
            </div>

            <Link
              href="/product#glasses-3d-showcase"
              onClick={closeMenu}
              className="block rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-subtle)]"
              style={{ color: "var(--text-on-glass)" }}
            >
              {t.navSpecs}
            </Link>

            <Link
              href="/about"
              onClick={closeMenu}
              className="block rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-subtle)]"
              style={{ color: "var(--text-on-glass)" }}
            >
              {t.navAbout}
            </Link>

            <button
              type="button"
              onClick={() => { closeMenu(); setDownloadModalOpen(true); }}
              className="w-full rounded-2xl px-4 py-2.5 text-left text-sm font-medium flex items-center gap-2 transition-colors hover:bg-[var(--bg-subtle)]"
              style={{ color: "var(--text-on-glass)" }}
            >
              <span className="material-symbols-outlined text-base" style={{ color: "var(--ocean)" }}>download</span>
              Tải App AIVA Companion
            </button>

            <Link
              href={accountHref}
              onClick={closeMenu}
              className="block rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--bg-subtle)]"
              style={{ color: "var(--text-on-glass)" }}
            >
              {accountLabel}
            </Link>

            <div className="pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <button
                type="button"
                onClick={() => { closeMenu(); onPreorder(); }}
                className="w-full rounded-full py-3 text-sm font-bold transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
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
        )}
      </nav>

      <AppDownloadModal
        open={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </>
  );
}
