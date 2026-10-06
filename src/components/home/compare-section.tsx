"use client";

import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";

type Row = {
  label: string;
  screen: string;
  aiva: string;
  aivaWin?: boolean;
};

export function CompareSection() {
  const { t } = useI18n();

  const rows: Row[] = [
    { label: t.homeCompareRow1Label, screen: t.homeCompareRow1Screen, aiva: t.homeCompareRow1Aiva, aivaWin: true },
    { label: t.homeCompareRow2Label, screen: t.homeCompareRow2Screen, aiva: t.homeCompareRow2Aiva, aivaWin: true },
    { label: t.homeCompareRow3Label, screen: t.homeCompareRow3Screen, aiva: t.homeCompareRow3Aiva, aivaWin: true },
    { label: t.homeCompareRow4Label, screen: t.homeCompareRow4Screen, aiva: t.homeCompareRow4Aiva, aivaWin: true },
    { label: t.homeCompareRow5Label, screen: t.homeCompareRow5Screen, aiva: t.homeCompareRow5Aiva, aivaWin: true }
  ];

  return (
    <section className="cx-fp-panel relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-sky-400/8 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-[var(--ocean)]/10 blur-[110px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10 w-full">
        <Reveal>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <SectionHeader
                title={
                  <>
                    {t.homeCompareTitle}{" "}
                    <span className="text-gradient-sun">{t.homeCompareTitleAccent}</span>
                  </>
                }
                description={t.homeCompareDesc}
              />
            </div>
            <div className="hidden sm:flex shrink-0 w-24 h-24 md:w-28 md:h-28 animate-float">
              <Image
                src="/mascots/frog-doctor.webp"
                alt="Bác sĩ ếch AIva kiểm tra thị lực"
                width={112}
                height={112}
                className="w-full h-full object-contain filter drop-shadow-md"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={80} blur={false}>
          <div
            data-fp-scroll
            className="mt-3 sm:mt-8 md:mt-12 overflow-y-auto max-h-[calc(100svh-9.5rem)] sm:max-h-none rounded-xl sm:rounded-2xl border"
            style={{
              backgroundColor: "var(--glass-bg)",
              borderColor: "var(--glass-border)"
            }}
          >
            <div
              className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,.75fr)_minmax(0,.88fr)] gap-1 px-2.5 py-2 text-[0.6rem] font-semibold uppercase tracking-wide sm:grid-cols-[1.1fr_1fr_1fr] sm:gap-2 sm:px-4 sm:py-3.5 sm:text-xs md:px-6 md:py-4 md:text-sm md:tracking-wider sticky top-0 backdrop-blur-md z-10"
              style={{ borderBottom: "1px solid var(--glass-border)", backgroundColor: "var(--glass-bg)", color: "var(--text-dim)" }}
            >
              <span>{t.homeCompareColCriteria}</span>
              <span className="text-center flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-sm sm:text-base opacity-70">smartphone</span>
                <span className="hidden sm:inline">{t.homeCompareColScreen}</span>
              </span>
              <span className="text-center flex items-center justify-center gap-1" style={{ color: "var(--ocean-glow)" }}>
                <span className="material-symbols-outlined text-sm sm:text-base">eyeglasses</span>
                <span className="hidden sm:inline">{t.homeCompareColAiva}</span>
              </span>
            </div>

            {rows.map((row, i) => (
              <Reveal key={row.label} delay={120 + i * 50} blur={false}>
                <div
                  className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,.75fr)_minmax(0,.88fr)] gap-1 px-2.5 py-1.5 items-center sm:grid-cols-[1.1fr_1fr_1fr] sm:gap-2 sm:px-4 sm:py-3 md:px-6 md:py-3.5 compare-row"
                  style={{
                    borderTop: i === 0 ? undefined : "1px solid var(--glass-border)"
                  }}
                >
                  <p className="text-[11px] font-medium leading-snug sm:text-sm" style={{ color: "var(--text-on-glass)" }}>
                    {row.label}
                  </p>
                  <div className="flex flex-col items-center justify-center gap-0.5 text-center sm:flex-row sm:gap-1.5">
                    <span className="material-symbols-outlined text-xs text-rose-400/90 sm:text-base" aria-hidden>
                      close
                    </span>
                    <p className="text-[0.6rem] leading-tight sm:text-xs sm:leading-snug md:text-sm" style={{ color: "var(--text-dim)" }}>
                      {row.screen}
                    </p>
                  </div>
                  <div
                    className="flex flex-col items-center justify-center gap-0.5 text-center rounded-lg px-1 py-0.5 sm:flex-row sm:gap-1.5 sm:rounded-xl sm:px-2 sm:py-1"
                    style={{ background: "var(--ocean-alpha)" }}
                  >
                    <span className="material-symbols-outlined text-xs sm:text-base" style={{ color: "var(--ocean-glow)" }} aria-hidden>
                      check
                    </span>
                    <p className="text-[0.6rem] font-medium leading-tight sm:text-xs sm:leading-snug md:text-sm" style={{ color: "var(--text-on-glass)" }}>
                      {row.aiva}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
