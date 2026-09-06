"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";
import {
  INTRO_COMPLETE_EVENT,
  INTRO_SHOW_EVENT,
  clearIntroSeen,
  isIntroSeen,
  markIntroSeen,
} from "@/components/home/site-intro";

export function Footer() {
  const { t } = useI18n();
  const [introEnabled, setIntroEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setIntroEnabled(!isIntroSeen());
    sync();
    window.addEventListener(INTRO_COMPLETE_EVENT, sync);
    window.addEventListener(INTRO_SHOW_EVENT, sync);
    return () => {
      window.removeEventListener(INTRO_COMPLETE_EVENT, sync);
      window.removeEventListener(INTRO_SHOW_EVENT, sync);
    };
  }, []);

  const toggleIntro = () => {
    if (introEnabled) {
      markIntroSeen();
      setIntroEnabled(false);
    } else {
      clearIntroSeen();
      setIntroEnabled(true);
      window.dispatchEvent(new Event(INTRO_SHOW_EVENT));
    }
  };

  const links = [
    { label: t.footerSecurity, href: "/privacy" },
    { label: t.footerTerms, href: "/terms" },
    { label: t.footerSupport, href: "mailto:aivisionassistance@gmail.com" },
    { label: t.footerContact, href: "/about" }
  ];

  return (
    <footer
      className="site-footer w-full shrink-0 border-t py-8 md:py-10 px-6"
      style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
    >
      <div className="max-w-7xl mx-auto w-full">
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
        <div className="border-t pt-6 pb-2 flex flex-col items-center gap-4" style={{ borderColor: "var(--border-subtle)" }}>
          <button
            type="button"
            onClick={toggleIntro}
            className="intro-toggle"
            aria-pressed={introEnabled}
          >
            <span className="intro-toggle-label">{t.footerIntro}</span>
            <span className={`intro-toggle-switch ${introEnabled ? "is-on" : ""}`} aria-hidden="true">
              <span className="intro-toggle-knob" />
            </span>
          </button>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>{t.footerCopyright}</p>
        </div>
      </div>
    </footer>
  );
}
