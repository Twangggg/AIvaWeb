"use client";

import { useI18n } from "@/lib/i18n/provider";
import Image from "next/image";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer
      className="border-t py-12 px-6 transition-colors"
      style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center">
          <Image
            src="/AIVALogo.png"
            alt="AIVA Logo"
            width={117}
            height={24}
            className="object-contain"
          />
        </div>

        <div className="flex items-center gap-6 text-xs tracking-wider uppercase" style={{ color: "var(--text-dim)" }}>
          <span>{t.footerSecurity}</span>
          <span>{t.footerTerms}</span>
          <span>{t.footerSupport}</span>
          <span>{t.footerContact}</span>
        </div>

        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          {t.footerCopyright}
        </p>
      </div>
    </footer>
  );
}
