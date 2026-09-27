"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/ui/text-reveal";
import { useI18n } from "@/lib/i18n/provider";


/** Hero brand + CTAs */
export function CinematicHero({ onPreorder }: { onPreorder: () => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [exit, setExit] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = Math.max(el.offsetHeight, 1);
      setExit(Math.min(1, Math.max(0, -rect.top / (h * 0.55))));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const stageOpacity = 1 - exit * 0.85;
  const stageY = exit * -64;
  const stageScale = 1 - exit * 0.12;

  return (
    <section ref={ref} className="cx-hero relative w-full min-h-[100dvh] flex flex-col justify-center items-center overflow-x-clip pt-28 pb-20 md:pt-32 md:pb-24">
      <div className="cx-hero-grid" aria-hidden />
      <div className="cx-hero-glow cx-hero-glow-a" aria-hidden />
      <div className="cx-hero-glow cx-hero-glow-b" aria-hidden />

      <div
        className="relative z-10 w-full flex flex-col justify-center items-center px-6 my-auto"
        style={
          {
            opacity: stageOpacity,
            transform: `translate3d(0, ${stageY}px, 0) scale(${stageScale})`,
            transformOrigin: "center center"
          } as CSSProperties
        }
      >
        <div className="cx-brand-stage mx-auto w-full max-w-5xl text-center is-open is-layout-open">
          <h1 className="sr-only">
            AIVA — {t.heroSuffix}
          </h1>

          <p
            className="cx-brand-static font-display font-bold tracking-tight text-[clamp(3.5rem,12vw,8rem)] leading-none"
            style={{
              color: "var(--accent)",
              textShadow: "0 0 28px rgba(255, 216, 77, 0.4)"
            }}
            aria-hidden="true"
          >
            AIVA
          </p>

          <div className="cx-brand-below is-open">
            <p className="text-2xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight">
              <TextReveal text={t.heroSuffix} as="span" className="hero-suffix" immediate delay={200} stagger={48} />
            </p>

            <p
              className="mx-auto mt-6 max-w-xl text-base md:text-lg leading-relaxed"
              style={{ color: "var(--text-dim)" }}
            >
              {t.heroSubtitle}
            </p>

            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Magnetic>
                <Button onClick={onPreorder} className="px-10 py-4 text-base">
                  {t.ctaPrimary}
                </Button>
              </Magnetic>
              <Magnetic strength={0.16}>
                <Button
                  variant="ghost"
                  className="px-10 py-4 text-base"
                  onClick={() => {
                    const el = document.getElementById("statement");
                    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement | number, opts?: Record<string, unknown>) => void } }).__lenis;
                    if (el) {
                      if (lenis && typeof lenis.scrollTo === "function") {
                        lenis.scrollTo(el, {
                          duration: 1.1,
                          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                        });
                      } else {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                >
                  {t.ctaSecondary}
                </Button>
              </Magnetic>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-14">
              {[[t.stat1Value, t.stat1Label], [t.stat2Value, t.stat2Label], [t.stat3Value, t.stat3Label]].map(
                ([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-xl md:text-2xl font-bold" style={{ color: "var(--text-on-glass)" }}>
                      {v}
                    </p>
                    <p
                      className="text-[0.65rem] uppercase tracking-[0.18em] mt-1"
                      style={{ color: "var(--text-dim)" }}
                    >
                      {l}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Cue Indicator with Lenis scroll */}
      <button
        type="button"
        onClick={() => {
          const nextSection = document.getElementById("statement");
          const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement | number, opts?: Record<string, unknown>) => void } }).__lenis;
          if (nextSection) {
            if (lenis && typeof lenis.scrollTo === "function") {
              lenis.scrollTo(nextSection, {
                duration: 0.9,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              });
            } else {
              nextSection.scrollIntoView({ behavior: "smooth" });
            }
          }
        }}
        className="scroll-cue cursor-pointer transition-opacity duration-300 hover:opacity-100"
        aria-label="Cuộn xuống để khám phá"
      >
        <div className="scroll-cue-mouse" aria-hidden="true">
          <div className="scroll-cue-wheel" />
        </div>
        <span className="scroll-cue-label">Cuộn xuống</span>
      </button>
    </section>
  );
}
