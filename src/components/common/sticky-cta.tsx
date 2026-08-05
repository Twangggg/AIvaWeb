"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

interface StickyCtaProps {
  onPreorder: () => void;
}

export function StickyCta({ onPreorder }: StickyCtaProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 md:hidden"
      style={{ transform: visible ? "translateY(0)" : "translateY(100%)" }}
    >
      <div
        className="flex items-center justify-between gap-4 px-5 py-3 backdrop-blur-xl border-t"
        style={{ backgroundColor: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
      >
        <p className="text-sm font-medium flex-1" style={{ color: "var(--text-on-glass)" }}>
          {t.stickyCtaText}
        </p>
        <button onClick={onPreorder} className="shrink-0 btn-primary px-4 py-2 text-sm">
          {t.stickyCtaButton}
        </button>
      </div>
    </div>
  );
}
