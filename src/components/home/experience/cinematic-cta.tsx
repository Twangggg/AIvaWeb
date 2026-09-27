"use client";

import { Magnetic } from "@/components/ui/magnetic";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/provider";
import { Reveal } from "@/components/ui/reveal";

export function CinematicCta({ onPreorder }: { onPreorder: () => void }) {
  const { t } = useI18n();

  return (
    <section className="cx-cta cx-fp-panel relative">
      <div className="cx-cta-orb cx-cta-orb-a" aria-hidden />
      <div className="cx-cta-orb cx-cta-orb-b" aria-hidden />
      <div className="cx-cta-ring" aria-hidden />

      <div className="cx-cta-copy relative z-10 mx-auto w-full max-w-3xl text-center">
        <Reveal direction="up" delay={0}>
          <h2 className="cx-cta-title font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="cx-cta-title-line">{t.preorderHeading}</span>{" "}
            <span className="text-gradient-sun cx-cta-title-accent">{t.preorderHeadingAccent}</span>
          </h2>
        </Reveal>

        <Reveal direction="up" delay={80}>
          <p
            className="cx-cta-desc text-sm md:text-base leading-relaxed mt-4"
            style={{ color: "var(--text-dim)" }}
          >
            {t.preorderDesc}
          </p>
        </Reveal>

        <Reveal direction="scale" delay={160}>
          <div className="mt-8">
            <Magnetic strength={0.36}>
              <Button onClick={onPreorder} className="text-base md:text-lg px-10 md:px-14 py-3.5 md:py-4">
                {t.preorderCta}
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
