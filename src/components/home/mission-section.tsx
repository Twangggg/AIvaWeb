"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Sticky, scroll-scrubbed story panels — inspired by infracorp.global
 * sticky fullscreen chapters driven by --progress.
 */
export function MissionSection() {
  const { t } = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const reduced = usePrefersReducedMotion();

  const pillars = [
    { badge: "AI", label: t.homeMissionAILabel, desc: t.homeMissionAIDesc },
    { badge: "V", label: t.homeMissionVisionLabel, desc: t.homeMissionVisionDesc },
    { badge: "A", label: t.homeMissionAssistantLabel, desc: t.homeMissionAssistantDesc }
  ];

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total > 0 ? scrolled / total : 0);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrub = Math.min(0.999, progress) * pillars.length;
  const active = Math.min(pillars.length - 1, Math.floor(scrub));
  const local = scrub - active;

  if (reduced) {
    return (
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <span className="section-tag mb-5 inline-flex">{t.aboutMissionTitle}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold leading-snug mb-5">
            {t.homeMissionHeadline}{" "}
            <span className="text-gradient-sun">{t.homeMissionHeadlineAccent}</span>
          </h2>
          <p className="text-base leading-relaxed mb-10 max-w-2xl" style={{ color: "var(--text-dim)" }}>
            {t.aboutMissionDesc}
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {pillars.map((p) => (
              <div
                key={p.badge}
                className="p-5 rounded-2xl"
                style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
              >
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center font-bold mb-3"
                  style={{ background: "var(--gradient-ocean)", color: "var(--text-on-accent)" }}
                >
                  {p.badge}
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--text-on-glass)" }}>
                  {p.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={trackRef} className="sticky-story-track relative">
      <div className="sticky-story-pin">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background: `radial-gradient(ellipse at 50% ${30 + progress * 40}%, rgba(234,179,8,0.14), transparent 55%)`
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full text-center">
          <span className="section-tag mb-6 inline-flex">{t.aboutMissionTitle}</span>
          <h2
            className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4 sticky-story-title"
            style={
              {
                "--progress": progress,
                clipPath: `inset(0 0 ${Math.max(0, (1 - Math.min(progress * 2.2, 1)) * 50)}% 0)`
              } as CSSProperties
            }
          >
            {t.homeMissionHeadline}{" "}
            <span className="text-gradient-sun">{t.homeMissionHeadlineAccent}</span>
          </h2>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12 transition-opacity duration-300"
            style={{ color: "var(--text-dim)", opacity: 0.35 + Math.min(progress, 1) * 0.65 }}
          >
            {t.aboutMissionDesc}
          </p>

          <div className="relative mx-auto max-w-xl min-h-[220px]">
            {pillars.map((p, i) => {
              const isLast = active === pillars.length - 1;
              let visibility = 0;
              if (i === active) visibility = isLast ? 1 : 1 - local * 0.75;
              else if (i === active + 1) visibility = local;

              const y = (i - active - (isLast ? 0 : local)) * 22;
              const scale = 0.96 + visibility * 0.04;

              return (
                <div
                  key={p.badge}
                  className="absolute inset-x-0 top-0 rounded-2xl p-6 md:p-8 text-left sticky-story-card"
                  style={{
                    backgroundColor: "var(--glass-bg)",
                    border: "1px solid var(--glass-border)",
                    opacity: visibility,
                    transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
                    pointerEvents: i === active ? "auto" : "none",
                    boxShadow: i === active ? "0 24px 60px -36px rgba(234,179,8,0.45)" : "none",
                    zIndex: Math.round(visibility * 10)
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`shrink-0 h-12 rounded-xl flex items-center justify-center font-bold ${
                        p.badge === "AI" ? "min-w-[3rem] px-2 text-sm" : "w-12 text-lg"
                      }`}
                      style={{ background: "var(--gradient-ocean)", color: "var(--text-on-accent)" }}
                    >
                      {p.badge}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-on-glass)" }}>
                        {p.label}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed" style={{ color: "var(--text-dim)" }}>
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2" aria-hidden>
            {pillars.map((p, i) => (
              <span
                key={p.badge}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 28 : 8,
                  background: i === active ? "var(--ocean)" : "var(--glass-border)"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
