"use client";

import { Magnetic } from "@/components/ui/magnetic";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";

export function CinematicCta({ onPreorder }: { onPreorder: () => void }) {
  const { t } = useI18n();

  return (
    <section className="cx-cta cx-fp-panel relative">
      <div className="cx-cta-orb cx-cta-orb-a" aria-hidden />
      <div className="cx-cta-orb cx-cta-orb-b" aria-hidden />
      <div className="cx-cta-ring" aria-hidden />

      <div className="cx-cta-copy relative z-10 mx-auto w-full max-w-3xl text-center">
        <h2
          className="cx-cta-title font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          data-fp-rise
          style={{ ["--fp-delay" as string]: "40ms" }}
        >
          <span className="cx-cta-title-line">{t.preorderHeading}</span>{" "}
          <span className="text-gradient-sun cx-cta-title-accent">{t.preorderHeadingAccent}</span>
        </h2>
        <p
          className="cx-cta-desc text-sm md:text-base leading-relaxed"
          style={{ color: "var(--text-dim)", ["--fp-delay" as string]: "140ms" }}
          data-fp-rise
        >
          {t.preorderDesc}
        </p>
        <div data-fp-rise="scale" style={{ ["--fp-delay" as string]: "220ms" }}>
          <Magnetic strength={0.36}>
            <Button onClick={onPreorder} className="text-base md:text-lg px-10 md:px-14 py-3.5 md:py-4">
              {t.preorderCta}
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
