"use client";

import dynamic from "next/dynamic";
import { Suspense, useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

const Hero3DCanvas = dynamic(() => import("@/components/hero-3d-canvas"), {
  ssr: false,
  loading: () => null
});

/** Compact centered glasses stage — ghost drop while GLB loads, then real model. */
export function HeroGlassesStage({
  className = "",
  open = false,
  onReady
}: {
  className?: string;
  open?: boolean;
  onReady?: (ready: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0.05,
      rootMargin: "280px 0px"
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    onReady?.(ready);
  }, [ready, onReady]);

  const handleReady = useCallback(() => {
    setReady(true);
  }, []);

  const onPointerMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerRef.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  return (
    <div
      ref={containerRef}
      className={`cx-glasses-stage relative w-full h-full ${ready ? "is-ready" : "is-loading"} ${className}`}
      onMouseMove={onPointerMove}
      onMouseLeave={() => {
        pointerRef.current = { x: 0, y: 0 };
      }}
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--ocean)]/15 blur-[48px]" />
      </div>

      {/* Soft placeholder while GLB loads — minimal frame, no icon clutter */}
      <div className="cx-brand-ghost" aria-hidden>
        <svg className="cx-brand-ghost-svg" viewBox="0 0 280 100" fill="none">
          {/* left lens */}
          <rect x="24" y="28" width="88" height="52" rx="18" className="cx-brand-ghost-lens" />
          {/* right lens */}
          <rect x="168" y="28" width="88" height="52" rx="18" className="cx-brand-ghost-lens" />
          {/* bridge */}
          <path d="M112 52h56" className="cx-brand-ghost-bridge" />
          {/* temples */}
          <path d="M24 48H10M256 48h14" className="cx-brand-ghost-temple" />
        </svg>
        <span className="cx-brand-ghost-sheen" />
      </div>

      <div className="cx-brand-model">
        <Suspense fallback={null}>
          {active ? (
            <Hero3DCanvas
              active={active}
              pointerRef={pointerRef}
              mode="brand"
              brandOpen={open}
              onReady={handleReady}
            />
          ) : null}
        </Suspense>
      </div>
    </div>
  );
}
