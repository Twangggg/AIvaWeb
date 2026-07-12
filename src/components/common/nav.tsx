"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";
import { ThemeLanguageControls } from "@/components/common/theme-language-controls";

interface NavProps {
  onPreorder: () => void;
}

export function Nav({ onPreorder }: NavProps) {
  const { t } = useI18n();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors"
      style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/AIVALogo.png"
            alt="AIVA Logo"
            width={156}
            height={32}
            className="object-contain"
            priority
          />
        </Link>

        <div
          className="hidden md:flex items-center gap-6 text-sm transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <Link href="/product" className="transition-colors hover:text-[var(--text-on-glass)]">{t.navExperience}</Link>
          <Link href="/news" className="transition-colors hover:text-[var(--text-on-glass)]">{t.navKids}</Link>
          <Link href="/about" className="transition-colors hover:text-[var(--text-on-glass)]">{t.navAbout}</Link>
          <button onClick={onPreorder} className="transition-colors hover:text-[var(--text-on-glass)]">{t.navReserve}</button>
        </div>

        <div className="flex items-center gap-3">
          <ThemeLanguageControls />
          <button
            onClick={onPreorder}
            className="px-5 py-2 rounded-full bg-[var(--accent)] font-medium text-sm hover:scale-105 transition-transform glow-sun"
            style={{ color: "var(--text-on-accent)" }}
          >
            {t.ctaPrimary}
          </button>
        </div>
      </div>
    </nav>
  );
}
