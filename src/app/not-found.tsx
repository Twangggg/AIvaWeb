"use client";

import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-[var(--ocean)]/15 blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-[80px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg flex flex-col items-center">
        {/* Cute Mascot Companion - Puzzled / Thinking */}
        <div className="relative w-40 h-40 mb-2 animate-bounce-short">
          <Image
            src="/mascots/frog-thinking.webp"
            alt="AIva thắc mắc"
            width={160}
            height={160}
            className="w-full h-full object-contain drop-shadow-lg"
            priority
          />
        </div>

        <h1 className="text-7xl md:text-8xl font-bold leading-[0.9] mb-4 select-none">
          <span className="text-gradient-sun">4</span>
          <span style={{ color: "var(--text-dim)", opacity: 0.15 }}>0</span>
          <span className="text-gradient-ocean">4</span>
        </h1>

        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          AIVA{" "}
          <span className="text-gradient-ocean">{t.notFoundTitle}</span>
        </h2>

        <p className="mb-10 leading-relaxed" style={{ color: "var(--text-dim)" }}>
          {t.notFoundDesc}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold hover:scale-105 transition-transform glow-sun"
          style={{ backgroundColor: "var(--accent)", color: "var(--text-on-accent)" }}
        >
          {t.notFoundBack}
        </Link>
      </div>
    </main>
  );
}
