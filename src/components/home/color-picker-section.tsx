"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

type FrameColor = {
  id: string;
  hex: string;
  accent: string;
  labelKey: "homeColorSky" | "homeColorSunny" | "homeColorCoral" | "homeColorMint" | "homeColorNavy" | "homeColorCloud";
};

const COLORS: FrameColor[] = [
  { id: "sky", hex: "#38bdf8", accent: "#7dd3fc", labelKey: "homeColorSky" },
  { id: "sunny", hex: "#f59e0b", accent: "#fbbf24", labelKey: "homeColorSunny" },
  { id: "coral", hex: "#fb7185", accent: "#fda4af", labelKey: "homeColorCoral" },
  { id: "mint", hex: "#34d399", accent: "#6ee7b7", labelKey: "homeColorMint" },
  { id: "navy", hex: "#1e3a8a", accent: "#3b82f6", labelKey: "homeColorNavy" },
  { id: "cloud", hex: "#e5e7eb", accent: "#f9fafb", labelKey: "homeColorCloud" }
];

function GlassesPreview({ hex, accent }: { hex: string; accent: string }) {
  const lens = "rgba(148, 163, 184, 0.28)";
  const dark = hex === "#e5e7eb" ? "#64748b" : "#0f172a";

  return (
    <svg viewBox="0 0 360 160" className="w-full max-w-md mx-auto drop-shadow-lg" aria-hidden>
      <defs>
        <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent} />
          <stop offset="55%" stopColor={hex} />
          <stop offset="100%" stopColor={hex} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="lensGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
          <stop offset="100%" stopColor={lens} />
        </linearGradient>
      </defs>

      {/* temples */}
      <path d="M42 72 C18 68 8 78 6 92" fill="none" stroke="url(#frameGrad)" strokeWidth="10" strokeLinecap="round" />
      <path d="M318 72 C342 68 352 78 354 92" fill="none" stroke="url(#frameGrad)" strokeWidth="10" strokeLinecap="round" />

      {/* bridge */}
      <path d="M155 78 C170 62 190 62 205 78" fill="none" stroke="url(#frameGrad)" strokeWidth="9" strokeLinecap="round" />

      {/* left rim */}
      <rect x="48" y="48" width="110" height="78" rx="28" fill="none" stroke="url(#frameGrad)" strokeWidth="12" />
      <rect x="58" y="58" width="90" height="58" rx="22" fill="url(#lensGrad)" stroke={dark} strokeOpacity="0.12" strokeWidth="1" />

      {/* right rim */}
      <rect x="202" y="48" width="110" height="78" rx="28" fill="none" stroke="url(#frameGrad)" strokeWidth="12" />
      <rect x="212" y="58" width="90" height="58" rx="22" fill="url(#lensGrad)" stroke={dark} strokeOpacity="0.12" strokeWidth="1" />

      {/* tiny camera dot */}
      <circle cx="70" cy="62" r="3.5" fill={dark} opacity="0.55" />
    </svg>
  );
}

export function ColorPickerSection() {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState(COLORS[0].id);
  const active = COLORS.find((c) => c.id === activeId) ?? COLORS[0];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[120px] transition-colors duration-500"
          style={{ backgroundColor: `${active.hex}22` }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Reveal>
          <SectionHeader
            tag={t.homeColorTag}
            title={
              <>
                {t.homeColorTitle}{" "}
                <span className="text-gradient-ocean">{t.homeColorTitleAccent}</span>
              </>
            }
            description={t.homeColorDesc}
          />
        </Reveal>

        <Reveal delay={100}>
          <div
            className="mt-12 rounded-3xl px-6 py-10 md:px-10 md:py-12 text-center"
            style={{
              backgroundColor: "var(--glass-bg)",
              border: "1px solid var(--glass-border)"
            }}
          >
            <p className="text-sm font-medium mb-6" style={{ color: "var(--text-dim)" }}>
              {t.homeColorSelected}:{" "}
              <span className="font-semibold" style={{ color: "var(--text-on-glass)" }}>
                {t[active.labelKey]}
              </span>
            </p>

            <div className="relative mx-auto max-w-lg transition-transform duration-300 hover:scale-[1.02]">
              <div
                className="absolute left-1/2 top-1/2 h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-colors duration-500"
                style={{ backgroundColor: `${active.hex}40` }}
                aria-hidden
              />
              <div className="relative motion-float">
                <GlassesPreview hex={active.hex} accent={active.accent} />
              </div>
            </div>

            <div
              className="mt-10 flex flex-wrap items-center justify-center gap-3"
              role="radiogroup"
              aria-label={t.homeColorPickerLabel}
            >
              {COLORS.map((color) => {
                const selected = color.id === activeId;
                return (
                  <button
                    key={color.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={t[color.labelKey]}
                    onClick={() => setActiveId(color.id)}
                    className="relative h-11 w-11 rounded-full transition-transform duration-300 ease-out hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ocean)]"
                    style={{
                      background: `linear-gradient(145deg, ${color.accent}, ${color.hex})`,
                      boxShadow: selected
                        ? `0 0 0 2px var(--glass-bg), 0 0 0 4px ${color.hex}, 0 6px 18px ${color.hex}55`
                        : "0 4px 14px rgba(0,0,0,0.12)",
                      border: color.id === "cloud" ? "1px solid rgba(0,0,0,0.12)" : "none"
                    }}
                  />
                );
              })}
            </div>

            <p className="mt-6 text-xs md:text-sm" style={{ color: "var(--text-dim)" }}>
              {t.homeColorHint}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
