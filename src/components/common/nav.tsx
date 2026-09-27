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
      {/* ── Desktop nav ── */}
      <nav
        className="fixed top-0 left-1/2 z-50 hidden items-center transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] md:flex"
        style={{
          transform: "translateX(-50%)",
          width: scrolled ? "100%" : "min(1140px, calc(100% - 2.5rem))",
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
          {/* ZONE 1: BRAND LOGO */}
          <Link href="/" onClick={returnHome} className="relative z-10 flex shrink-0 items-center mr-2">
            <Image
              src="/AIVALogo.png"
              alt="AIVA Logo"
              width={140}
              height={28}
              className="object-contain transition-all duration-500"
              style={{ width: scrolled ? 120 : 135, height: "auto" }}
              priority
            />
          </Link>

          {/* ZONE 2: CENTER NAVIGATION & DISCOVERY LINKS */}
          <div
            className="relative z-10 flex items-center gap-1.5 text-sm font-medium transition-all duration-500"
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
                className="group relative rounded-full px-3.5 py-2 whitespace-nowrap transition-all duration-200 flex items-center gap-1 hover:text-[var(--ocean)]"
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

            {/* Link 3: Về AIVA */}
            <Link
              href="/about"
              className="group relative rounded-full px-3.5 py-2 whitespace-nowrap transition-all duration-200 hover:text-[var(--ocean)]"
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
              className="group relative rounded-full px-3.5 py-2 whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 hover:text-[var(--ocean)]"
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
              className="hidden items-center rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 hover:bg-white/10 lg:inline-flex"
              style={{ color: "var(--text-muted)" }}
            >
              {accountLabel}
            </Link>

            {/* Single Primary Conversion Button: ĐẶT TRƯỚC NGAY */}
            <button
              type="button"
              onClick={onPreorder}
              className="rounded-full px-5 py-2.5 text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-200 hover:brightness-110 active:scale-95 shadow-md"
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
          }}
        >
          <Link href="/" onClick={returnHome}>
            <Image src="/AIVALogo.png" alt="AIVA Logo" width={110} height={22} className="object-contain" style={{ width: "auto", height: "auto" }} priority />
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDownloadModalOpen(true)}
              className="p-2 rounded-full border text-xs font-bold flex items-center justify-center"
              style={{
                backgroundColor: "var(--ocean-alpha)",
                borderColor: "var(--ocean)",
                color: "var(--ocean)"
              }}
              aria-label="Tải App"
            >
              <span className="material-symbols-outlined text-base">download</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-white"
              aria-label="Toggle menu"
            >
              <span className="material-symbols-outlined text-2xl">{menuOpen ? "close" : "menu"}</span>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            className="mt-2 flex flex-col gap-1 rounded-3xl p-4 shadow-2xl backdrop-blur-2xl border"
            style={{
              backgroundColor: "var(--modal-bg)",
              borderColor: "var(--border-subtle)",
              boxShadow: "var(--shadow-modal)"
            }}
          >
            {/* Mobile Kids Links Sub-group */}
            <div className="px-4 py-2 border-b mb-1 border-slate-800/60">
              <div className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ocean)" }}>
                Cho Trẻ Em
              </div>
              <div className="flex flex-col gap-2 pl-2">
                <Link
                  href="/play"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: "var(--text-on-glass)" }}
                >
                  <span className="material-symbols-outlined text-base" style={{ color: "var(--ocean)" }}>sports_esports</span>
                  Chơi cùng AIVA
                </Link>
                <Link
                  href="/news"
                  onClick={closeMenu}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: "var(--text-on-glass)" }}
                >
                  <span className="material-symbols-outlined text-base" style={{ color: "var(--ocean)" }}>newspaper</span>
                  Góc Trẻ Em & Tin Tức
                </Link>
              </div>
            </div>

            <Link
              href="/about"
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: "var(--text-on-glass)" }}
            >
              {t.navAbout}
            </Link>

            <button
              type="button"
              onClick={() => { closeMenu(); setDownloadModalOpen(true); }}
              className="rounded-2xl px-4 py-3 text-left text-sm font-medium flex items-center gap-2 transition-colors hover:bg-white/10"
              style={{ color: "var(--text-on-glass)" }}
            >
              <span className="material-symbols-outlined text-base" style={{ color: "var(--ocean)" }}>download</span>
              Tải App AIVA Companion
            </button>

            <Link
              href={accountHref}
              onClick={closeMenu}
              className="rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: "var(--text-on-glass)" }}
            >
              {accountLabel}
            </Link>

            <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-slate-800">
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
