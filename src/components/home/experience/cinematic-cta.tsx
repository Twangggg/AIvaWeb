"use client";

import { Magnetic } from "@/components/ui/magnetic";
import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/ui/text-reveal";
import { useI18n } from "@/lib/i18n/provider";

export function CinematicCta({ onPreorder }: { onPreorder: () => void }) {
  const { t } = useI18n();

  return (
    <section className="cx-cta cx-fp-panel relative overflow-x-hidden">
      <div className="cx-cta-orb cx-cta-orb-a" aria-hidden />
      <div className="cx-cta-orb cx-cta-orb-b" aria-hidden />
      <div className="cx-cta-ring" aria-hidden />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-2 text-center">
        <h2
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-4 md:mb-5"
          data-fp-rise
          style={{ ["--fp-delay" as string]: "40ms" }}
        >
          <TextReveal text={t.preorderHeading} as="span" stagger={36} />{" "}
          <span className="text-gradient-sun inline-block">
            <TextReveal text={t.preorderHeadingAccent} as="span" delay={100} stagger={36} />
          </span>
        </h2>
        <p
          className="text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed"
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
