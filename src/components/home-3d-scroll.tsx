"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

const AivaGlasses3D = dynamic(() => import("@/components/AivaGlasses3D"), {
  ssr: false
});

const SECTIONS = [
  { tag: "feature1Tag", title: "feature1Title", desc: "feature1Desc", mobilePos: "top-14 sm:top-20", desktopPos: "lg:top-24 lg:right-[15%]" },
  { tag: "feature2Tag", title: "feature2Title", desc: "feature2Desc", mobilePos: "top-14 sm:top-20", desktopPos: "lg:top-[30%] lg:left-16" },
  { tag: "feature3Tag", title: "feature3Title", desc: "feature3Desc", mobilePos: "bottom-10 sm:bottom-16", desktopPos: "lg:top-[22%] lg:right-16" },
  { tag: "feature4Tag", title: "feature4Title", desc: "feature4Desc", mobilePos: "bottom-10 sm:bottom-16", desktopPos: "lg:bottom-24 lg:left-[15%]" }
] as const;

export function Home3DScroll() {
  const { t } = useI18n();
  const INVALIDATE_INTERVAL_MS = 33;
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);
  const lastScrollYRef = useRef(0);
  const lastInvalidateAtRef = useRef(0);
  const metricsRef = useRef({ top: 0, total: 1 });
  const invalidateRef = useRef<(() => void) | null>(null);
  const activeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const [isNearViewport, setIsNearViewport] = useState(false);

  const getSectionText = (key: string) => (t as unknown as Record<string, string>)[key] ?? key;

  useEffect(() => {
    const recalcMetrics = () => {
      if (!stageRef.current) return;
      const stage = stageRef.current;
      const rect = stage.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const total = Math.max(1, stage.offsetHeight - window.innerHeight);
      metricsRef.current = { top, total };
    };

    const measure = () => {
      rafRef.current = null;
      const { top, total } = metricsRef.current;
      const leadIn = window.innerHeight * 0.12;
      const passed = Math.min(Math.max(window.scrollY - top + leadIn, 0), total + leadIn);
      const p = passed / (total + leadIn);
      if (Math.abs(p - lastScrollYRef.current) > 0.004) {
        scrollY.current = p;
        lastScrollYRef.current = p;
        const now = performance.now();
        if (now - lastInvalidateAtRef.current >= INVALIDATE_INTERVAL_MS) {
          lastInvalidateAtRef.current = now;
          invalidateRef.current?.();
        }
      }
      const effectiveP = Math.max(0, Math.min(1, p / 0.8));
      const idx = Math.min(SECTIONS.length - 1, Math.floor(effectiveP * SECTIONS.length));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(measure);
    };
    const onResize = () => {
      recalcMetrics();
      onScroll();
    };

    recalcMetrics();
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!stageRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { root: null, rootMargin: "300px 0px 300px 0px", threshold: 0 }
    );
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={stageRef} id="glasses-3d-showcase" className="relative min-h-[135vh] lg:min-h-[180vh] w-full">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden transform-gpu flex items-center justify-center">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 -left-24 w-[22rem] h-[22rem] rounded-full bg-[var(--ocean)]/18 blur-2xl" />
          <div className="absolute bottom-1/4 -right-24 w-[22rem] h-[22rem] rounded-full bg-[var(--accent)]/10 blur-2xl" />
        </div>

        <div className="absolute inset-0 pointer-events-none select-none touch-pan-y">
          {isNearViewport ? (
            <AivaGlasses3D
              active={isNearViewport}
              scrollY={scrollY}
              onInvalidateReady={(invalidate) => {
                invalidateRef.current = invalidate;
              }}
            />
          ) : null}
        </div>

        <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3 z-10 pointer-events-none">
          {SECTIONS.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500 will-change-transform"
              style={{
                width: 5,
                height: i === active ? 32 : 12,
                backgroundColor: "var(--accent)",
                opacity: i === active ? 1 : 0.3
              }}
            />
          ))}
        </div>

        {SECTIONS.map((s, i) => (
          <div
            key={s.tag}
            className={`absolute z-10 transition-all duration-500 will-change-transform will-change-opacity lg:bottom-auto lg:left-auto lg:right-auto left-4 right-4 max-w-[min(calc(100%-2rem),24rem)] sm:max-w-md mx-auto lg:mx-0 ${
              i === active ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-3 pointer-events-none"
            } ${s.mobilePos} ${s.desktopPos}`}
          >
            <div
              className="rounded-2xl p-4 md:p-6 backdrop-blur-xl shadow-2xl"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid",
                borderColor: "var(--glass-border)"
              }}
            >
              <span
                className="inline-block px-3 py-0.5 rounded-full text-xs font-medium tracking-wider uppercase mb-2 md:mb-4"
                style={{
                  backgroundColor: "var(--ocean-alpha)",
                  color: "var(--ocean-glow)"
                }}
              >
                {getSectionText(s.tag)}
              </span>
              <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 leading-snug" style={{ color: "var(--text-on-glass)" }}>
                {getSectionText(s.title)}
              </h2>
              <p className="text-xs md:text-base leading-relaxed max-w-xs" style={{ color: "var(--text-dim)" }}>
                {getSectionText(s.desc)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
