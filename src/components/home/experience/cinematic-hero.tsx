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
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = ref.current;
      const stage = stageRef.current;
      if (!el || !stage) return;
      const rect = el.getBoundingClientRect();
      const h = Math.max(el.offsetHeight, 1);
      const exit = Math.min(1, Math.max(0, -rect.top / (h * 0.55)));
      const stageOpacity = 1 - exit * 0.85;
      const stageY = exit * -64;
      const stageScale = 1 - exit * 0.12;

      stage.style.opacity = String(stageOpacity);
      stage.style.transform = `translate3d(0, ${stageY}px, 0) scale(${stageScale})`;
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

  return (
    <section ref={ref} className="cx-hero relative w-full min-h-[100svh] lg:min-h-[100dvh] flex flex-col justify-center items-center overflow-x-clip pt-14 pb-12 sm:pt-20 sm:pb-14">
      <div className="cx-hero-grid" aria-hidden />
      <div className="cx-hero-glow cx-hero-glow-a" aria-hidden />
      <div className="cx-hero-glow cx-hero-glow-b" aria-hidden />

      <div
        ref={stageRef}
        className="relative z-10 w-full max-w-5xl mx-auto flex flex-col justify-center items-center px-4 sm:px-6 will-change-transform will-change-opacity"
        style={{ transformOrigin: "center center" }}
      >
        <div className="cx-brand-stage mx-auto w-full text-center is-open is-layout-open">
          <h1 className="sr-only">
            AIVA — {t.heroSuffix}
          </h1>

          <p
            className="cx-brand-static font-display font-bold tracking-tight leading-none"
            style={{
              fontSize: "clamp(3rem, 11vw, 8rem)",
              color: "var(--accent)",
              textShadow: "0 0 32px rgba(255, 216, 77, 0.45)"
            }}
            aria-hidden="true"
          >
            AIVA
          </p>

          <div className="cx-brand-below is-open mt-2 sm:mt-4">
            <p className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              <TextReveal text={t.heroSuffix} as="span" className="hero-suffix" immediate delay={200} stagger={48} />
            </p>

            <p
              className="mx-auto mt-2.5 sm:mt-4 max-w-xl text-xs sm:text-base md:text-lg leading-relaxed px-2"
              style={{ color: "var(--text-dim)" }}
            >
              {t.heroSubtitle}
            </p>

            <div className="mt-4 sm:mt-8 flex flex-wrap gap-2.5 sm:gap-4 justify-center">
              <Magnetic>
                <Button onClick={onPreorder} className="px-5 py-2.5 text-xs sm:px-10 sm:py-4 sm:text-base">
                  {t.ctaPrimary}
                </Button>
              </Magnetic>
              <Magnetic strength={0.16}>
                <Button
                  variant="ghost"
                  className="px-5 py-2.5 text-xs sm:px-10 sm:py-4 sm:text-base"
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

            <div className="mt-4 sm:mt-8 flex flex-wrap justify-center gap-4 sm:gap-10 md:gap-14">
              {[[t.stat1Value, t.stat1Label], [t.stat2Value, t.stat2Label], [t.stat3Value, t.stat3Label]].map(
                ([v, l]) => (
                  <div key={l} className="text-center">
                    <p className="text-base sm:text-xl md:text-2xl font-bold" style={{ color: "var(--text-on-glass)" }}>
                      {v}
                    </p>
                    <p
                      className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.18em] mt-0.5"
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
        className="scroll-cue cursor-pointer transition-opacity duration-300 hover:opacity-100 bottom-2 sm:bottom-4"
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
