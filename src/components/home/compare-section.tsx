"use client";

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
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-0 w-80 h-80 rounded-full bg-sky-400/8 blur-[100px]" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-[var(--ocean)]/10 blur-[110px]" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <Reveal>
          <SectionHeader
            tag={t.homeCompareTag}
            title={
              <>
                {t.homeCompareTitle}{" "}
                <span className="text-gradient-sun">{t.homeCompareTitleAccent}</span>
              </>
            }
            description={t.homeCompareDesc}
          />
        </Reveal>

        <Reveal delay={80} blur={false}>
          <div
            className="mt-12 overflow-hidden rounded-2xl"
            style={{
              backgroundColor: "var(--glass-bg)",
              border: "1px solid var(--glass-border)"
            }}
          >
            <div
              className="grid grid-cols-[1.1fr_1fr_1fr] gap-2 px-4 py-4 md:px-6 md:py-5 text-xs md:text-sm font-semibold uppercase tracking-wider"
              style={{ borderBottom: "1px solid var(--glass-border)", color: "var(--text-dim)" }}
            >
              <span>{t.homeCompareColCriteria}</span>
              <span className="text-center flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-base opacity-70">smartphone</span>
                <span className="hidden sm:inline">{t.homeCompareColScreen}</span>
              </span>
              <span className="text-center flex items-center justify-center gap-1.5" style={{ color: "var(--ocean-glow)" }}>
                <span className="material-symbols-outlined text-base">eyeglasses</span>
                <span className="hidden sm:inline">{t.homeCompareColAiva}</span>
              </span>
            </div>

            {rows.map((row, i) => (
              <Reveal key={row.label} delay={120 + i * 70} blur={false}>
                <div
                  className="grid grid-cols-[1.1fr_1fr_1fr] gap-2 px-4 py-4 md:px-6 md:py-5 items-start md:items-center compare-row"
                  style={{
                    borderTop: i === 0 ? undefined : "1px solid var(--glass-border)"
                  }}
                >
                  <p className="text-sm font-medium leading-snug" style={{ color: "var(--text-on-glass)" }}>
                    {row.label}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center">
                    <span className="material-symbols-outlined text-base text-rose-400/90" aria-hidden>
                      close
                    </span>
                    <p className="text-xs md:text-sm leading-snug" style={{ color: "var(--text-dim)" }}>
                      {row.screen}
                    </p>
                  </div>
                  <div
                    className="flex flex-col sm:flex-row items-center justify-center gap-1.5 text-center rounded-xl px-2 py-1.5"
                    style={{ background: "var(--ocean-alpha)" }}
                  >
                    <span className="material-symbols-outlined text-base" style={{ color: "var(--ocean-glow)" }} aria-hidden>
                      check
                    </span>
                    <p className="text-xs md:text-sm font-medium leading-snug" style={{ color: "var(--text-on-glass)" }}>
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
