"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Dual progress UI inspired by infracorp.global:
 * - thin top bar
 * - spring-eased vertical rail on the right
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    let zoomTimer = 0;

    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const next = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      const delta = y - lastY;
      lastY = y;

      setProgress(next);
      if (Math.abs(delta) > 0.5) {
        setDirection(Math.max(-1, Math.min(1, delta / 24)));
        setZoomed(true);
        window.clearTimeout(zoomTimer);
        zoomTimer = window.setTimeout(() => {
          setZoomed(false);
          setDirection(0);
        }, 480);
      }
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
      window.clearTimeout(zoomTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (reduced) return null;

  const absDirection = Math.abs(direction);

  return (
    <>
      <div className="scroll-progress" aria-hidden>
        <div className="scroll-progress-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <div
        className={`ic-side-scroller ${zoomed ? "is-zoomed" : ""}`}
        style={
          {
            "--time": progress,
            "--direction": direction,
            "--absdirection": absDirection
          } as CSSProperties
        }
        aria-hidden
      >
        <div className="ic-side-scroller-thumb" />
      </div>
    </>
  );
}
