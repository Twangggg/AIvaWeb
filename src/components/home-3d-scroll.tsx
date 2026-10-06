"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { useFpSceneSync } from "@/hooks/use-fp-scene-sync";

const AivaGlasses3D = dynamic(() => import("@/components/AivaGlasses3D"), {
  ssr: false,
});

const SECTIONS = [
  {
    tag: "feature1Tag",
    title: "feature1Title",
    desc: "feature1Desc",
    mobilePos: "top-12 sm:left-4 sm:right-auto",
    desktopPos: "lg:top-24 lg:right-[15%]",
  },
  {
    tag: "feature2Tag",
    title: "feature2Title",
    desc: "feature2Desc",
    mobilePos: "top-12 sm:right-4 sm:left-auto",
    desktopPos: "lg:top-24 lg:left-16",
  },
  {
    tag: "feature3Tag",
    title: "feature3Title",
    desc: "feature3Desc",
    mobilePos: "bottom-16 sm:bottom-28 sm:right-4 sm:left-auto",
    desktopPos: "lg:bottom-36 lg:right-16",
  },
  {
    tag: "feature4Tag",
    title: "feature4Title",
    desc: "feature4Desc",
    mobilePos: "bottom-16 sm:bottom-28 sm:left-4 sm:right-auto",
    desktopPos: "lg:bottom-36 lg:left-[15%]",
  },
] as const;

function InteractiveGlasses() {
  const { locale } = useI18n();
  const fixedRotation = useRef(0);
  return (
    <section id="glasses-3d-showcase" className="relative w-full h-[100svh] scroll-mt-0">
      <div
        className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
        aria-label={locale === "en" ? "Interactive AIVA glasses model" : "Mô hình kính AIVA tương tác"}
      >
        <AivaGlasses3D active scrollY={fixedRotation} interactive />
      </div>
      <p className="absolute bottom-8 inset-x-4 text-center text-sm pointer-events-none" style={{ color: "var(--text-muted)" }}>
        {locale === "en" ? "Drag to rotate the glasses and explore every angle." : "Kéo để xoay kính và khám phá từng góc nhìn."}
      </p>
    </section>
  );
}

export function Home3DScroll({ interactive = false }: { interactive?: boolean }) {
  return interactive ? <InteractiveGlasses /> : <ScrollGlasses />;
}

function ScrollGlasses() {
  const { t } = useI18n();
  const INVALIDATE_INTERVAL_MS = 33;
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);
  const lastScrollYRef = useRef(0);
  const lastInvalidateAtRef = useRef(0);
  const metricsRef = useRef({ top: 0, total: 1 });
  const invalidateRef = useRef<(() => void) | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isPagedRef = useRef(false);
  const { step: active, setScene } = useFpSceneSync("experience", SECTIONS.length);

  const getSectionText = (key: string) =>
    (t as unknown as Record<string, string>)[key] ?? key;

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
      // Keep the first tab intact on entry, then advance the demo almost
      // immediately with the desktop scroll track.
      const leadIn = Math.min(window.innerHeight * 0.12, total * 0.24);
      const passed = Math.min(
        Math.max(window.scrollY - top + leadIn, 0),
        total + leadIn
      );
      const p = passed / (total + leadIn);
      if (!isPagedRef.current) setScene(Math.round(p * (SECTIONS.length - 1)));
      if (Math.abs(p - lastScrollYRef.current) > 0.004) {
        scrollY.current = p;
        lastScrollYRef.current = p;
        const now = performance.now();
        if (now - lastInvalidateAtRef.current >= INVALIDATE_INTERVAL_MS) {
          lastInvalidateAtRef.current = now;
          invalidateRef.current?.();
        }
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

    isPagedRef.current = Boolean(stageRef.current?.closest("#experience"));
    recalcMetrics();
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, [setScene]);


  useEffect(() => {
    const syncFullscreen = () => {
      const active = document.fullscreenElement === stageRef.current;
      setIsFullscreen(active);
      if (!active) {
        const orientation = screen.orientation as ScreenOrientation & {
          unlock?: () => void;
        };
        orientation.unlock?.();
      }
    };
    document.addEventListener("fullscreenchange", syncFullscreen);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreen);
  }, []);

  const toggleFullscreen = async () => {
    if (!stageRef.current) return;
    if (document.fullscreenElement === stageRef.current) {
      await document.exitFullscreen();
      return;
    }

    await stageRef.current.requestFullscreen();
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (orientation: "landscape") => Promise<void>;
    };
    if (orientation.lock)
      await orientation.lock("landscape").catch(() => undefined);
  };

  // Full-page paging provides discrete scenes. Update the same target that
  // native scrolling used, letting the 3D model lerp into each new rotation.
  useEffect(() => {
    scrollY.current = active / (SECTIONS.length - 1);
    invalidateRef.current?.();
  }, [active]);

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
    <section
      ref={stageRef}
      id="glasses-3d-showcase"
      className="relative min-h-[220vh] lg:min-h-[135vh] w-full"
    >
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
              className="rounded-full transition-all duration-1000 will-change-transform"
              style={{
                width: 5,
                height: i === active ? 32 : 12,
                backgroundColor: "var(--accent)",
                opacity: i === active ? 1 : 0.3,
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="mobile-fullscreen-control absolute right-4 bottom-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden"
          style={{
            backgroundColor: "var(--modal-bg)",
            borderColor: "var(--glass-border)",
            color: "var(--text-on-glass)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
          }}
          aria-label={
            isFullscreen ? "Exit full screen" : "View glasses in full screen"
          }
        >
          <span className="material-symbols-outlined" aria-hidden>
            {isFullscreen ? "fullscreen_exit" : "fullscreen"}
          </span>
        </button>

        {SECTIONS.map((s, i) => (
          <div
            key={s.tag}
            data-scene={i}
            className={`glasses-info-card absolute z-10 transition-all duration-1000 will-change-transform will-change-opacity lg:bottom-auto lg:left-auto lg:right-auto left-3 right-3 max-w-[min(calc(100%-1.5rem),18rem)] sm:max-w-[16rem] lg:max-w-md mx-auto sm:mx-0 ${
              i === active
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-3 pointer-events-none"
            } ${s.mobilePos} ${s.desktopPos}`}
          >
            <div
              className="rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 backdrop-blur-xl shadow-2xl"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid",
                borderColor: "var(--glass-border)",
              }}
            >
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium tracking-wider uppercase mb-1.5 sm:mb-3"
                style={{
                  backgroundColor: "var(--ocean-alpha)",
                  color: "var(--ocean-glow)",
                }}
              >
                {getSectionText(s.tag)}
              </span>
              <h2
                className="text-base sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 leading-snug"
                style={{ color: "var(--text-on-glass)" }}
              >
                {getSectionText(s.title)}
              </h2>
              <p
                className="text-[11px] sm:text-sm md:text-base leading-relaxed max-w-xs"
                style={{ color: "var(--text-dim)" }}
              >
                {getSectionText(s.desc)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
