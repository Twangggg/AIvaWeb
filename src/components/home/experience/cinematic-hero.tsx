"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Magnetic } from "@/components/ui/magnetic";
import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/ui/text-reveal";
import { useI18n } from "@/lib/i18n/provider";
import { HeroGlassesStage } from "@/components/home/experience/hero-glasses-stage";

type BrandPhase = "closed" | "opening" | "open" | "closing" | "sealed";

/**
 * Hover AIva → cinematic open (letters burst + ghost drop while model loads).
 * Leave → closing choreography → seal pulse.
 */
export function CinematicHero({ onPreorder }: { onPreorder: () => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const timers = useRef<number[]>([]);
  const [exit, setExit] = useState(0);
  const [phase, setPhase] = useState<BrandPhase>(() => {
    if (typeof window === "undefined") return "closed";
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "open" : "closed";
  });
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [modelReady, setModelReady] = useState(false);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const openBrand = () => {
    if (reduced) return;
    clearTimers();
    setPhase("opening");
    const t1 = window.setTimeout(() => setPhase("open"), 820);
    timers.current = [t1];
  };

  const closeBrand = () => {
    if (reduced) return;
    clearTimers();
    setPhase("closing");
    const t1 = window.setTimeout(() => setPhase("sealed"), 620);
    const t2 = window.setTimeout(() => setPhase("closed"), 620 + 480);
    timers.current = [t1, t2];
  };

  const onModelReady = useCallback((ready: boolean) => {
    setModelReady(ready);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => {
      setReduced(mq.matches);
      if (mq.matches) setPhase("open");
    };
    mq.addEventListener("change", onMq);
    return () => {
      mq.removeEventListener("change", onMq);
      clearTimers();
    };
  }, []);

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
  const layoutOpen = phase === "opening" || phase === "open" || phase === "closing";
  const glassesLive = phase === "opening" || phase === "open";
  const awaiting = glassesLive && !modelReady;

  return (
    <section ref={ref} className="cx-hero relative h-full min-h-0 overflow-x-clip">
      <div className="cx-hero-grid" aria-hidden />
      <div className="cx-hero-glow cx-hero-glow-a" aria-hidden />
      <div className="cx-hero-glow cx-hero-glow-b" aria-hidden />

      <div
        className="relative z-10 h-full min-h-0 flex flex-col justify-center px-6 pt-24 pb-16"
        style={
          {
            opacity: stageOpacity,
            transform: `translate3d(0, ${stageY}px, 0) scale(${stageScale})`,
            transformOrigin: "center 35%"
          } as CSSProperties
        }
      >
        <div
          className={[
            "cx-brand-stage mx-auto w-full max-w-6xl text-center",
            phase === "opening" && "is-opening",
            phase === "open" && "is-open",
            phase === "closing" && "is-closing",
            phase === "sealed" && "is-sealed",
            layoutOpen && "is-layout-open",
            awaiting && "is-awaiting",
            modelReady && glassesLive && "is-arrived"
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <h1 className="sr-only">AIva — {t.heroSuffix}</h1>

          <div
            className={[
              "cx-brand-hit",
              phase === "opening" && "is-opening",
              phase === "open" && "is-open",
              phase === "closing" && "is-closing",
              phase === "sealed" && "is-sealed",
              layoutOpen && "is-layout-open",
              awaiting && "is-awaiting",
              modelReady && glassesLive && "is-arrived"
            ]
              .filter(Boolean)
              .join(" ")}
            onMouseEnter={openBrand}
            onMouseLeave={closeBrand}
            onClick={() => {
              if (!window.matchMedia("(hover: none)").matches) return;
              if (phase === "open" || phase === "opening") closeBrand();
              else openBrand();
            }}
          >
            <div className="cx-brand-split" aria-hidden="true">
              <span className="cx-brand-half cx-brand-left">AI</span>
              <div className="cx-brand-mid">
                <div className="cx-brand-glasses">
                  <HeroGlassesStage open={glassesLive} onReady={onModelReady} />
                </div>
                <span className="cx-brand-shock cx-brand-shock-open" aria-hidden />
                <span className="cx-brand-shock cx-brand-shock-close" aria-hidden />
              </div>
              <span className="cx-brand-half cx-brand-right">va</span>
            </div>
            <span className="cx-brand-seal-ring" aria-hidden />
            <span className="cx-brand-summon-ring" aria-hidden />
          </div>

          <div
            className={[
              "cx-brand-below",
              (phase === "open" || phase === "opening") && "is-open",
              phase === "closing" && "is-closing"
            ]
              .filter(Boolean)
              .join(" ")}
          >
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
                <Link href="/product">
                  <Button variant="ghost" className="px-10 py-4 text-base">
                    {t.ctaSecondary}
                  </Button>
                </Link>
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
    </section>
  );
}
