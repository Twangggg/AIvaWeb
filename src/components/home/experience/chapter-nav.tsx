"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";

const CHAPTERS = [
  { id: "hero", labelKey: "cxNavHero" as const },
  { id: "statement", labelKey: "cxNavStatement" as const },
  { id: "vision", labelKey: "cxNavVision" as const },
  { id: "features", labelKey: "cxNavFeatures" as const },
  { id: "compare", labelKey: "cxNavCompare" as const },
  { id: "companion", labelKey: "cxNavApp" as const },
  { id: "mission", labelKey: "cxNavMission" as const },
  { id: "cta", labelKey: "cxNavCta" as const }
];

/** Left-side chapter dots — jump between narrative beats. */
export function ChapterNav() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const ids = useMemo(() => CHAPTERS.map((c) => c.id), []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener("change", onMq);

    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible?.target?.id) return;
        const idx = ids.indexOf(visible.target.id);
        if (idx >= 0) setActive(idx);
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -35% 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => {
      mq.removeEventListener("change", onMq);
      observer.disconnect();
    };
  }, [ids]);

  if (reduced) return null;

  return (
    <nav className="cx-chapter-nav" aria-label={t.cxNavLabel}>
      {CHAPTERS.map((c, i) => (
        <button
          key={c.id}
          type="button"
          className={`cx-chapter-dot ${i === active ? "is-active" : ""}`}
          aria-label={t[c.labelKey]}
          aria-current={i === active ? "true" : undefined}
          onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="cx-chapter-tooltip">{t[c.labelKey]}</span>
        </button>
      ))}
    </nav>
  );
}
