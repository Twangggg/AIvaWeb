"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";

export function Footer() {
  const { t } = useI18n();

  const links = [
    { label: t.footerSecurity, href: "/about" },
    { label: t.footerTerms, href: "/about" },
    { label: t.footerSupport, href: "mailto:aivisionassistance@gmail.com" },
    { label: t.footerContact, href: "/about" }
  ];

  return (
    <footer className="border-t py-12 px-6" style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <Image src="/AIVALogo.png" alt="AIVA Logo" width={117} height={24} className="object-contain" />
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs tracking-wider uppercase" style={{ color: "var(--text-dim)" }}>
            {links.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-[var(--ocean-glow)] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          <a
            href="https://www.facebook.com/AIVAGlass/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm hover:text-[var(--ocean-glow)] transition-colors"
            style={{ color: "var(--text-dim)" }}
          >
            <span className="material-symbols-outlined text-lg">facebook</span>
            Facebook
          </a>
        </div>
        <div className="border-t pt-8 text-center" style={{ borderColor: "var(--border-subtle)" }}>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>{t.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
}
