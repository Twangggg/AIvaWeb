"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useRef, useState, type MouseEvent } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { VoicePulse } from "@/components/ui/voice-pulse";

const Hero3DCanvas = dynamic(() => import("@/components/hero-3d-canvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
    </div>
  )
});

export function Hero3DPreview() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "100px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const onPointerMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    pointerRef.current.y = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-xl mx-auto lg:max-w-none lg:mx-0 h-[300px] sm:h-[380px] md:h-[440px] lg:h-[500px]"
      onMouseMove={onPointerMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        pointerRef.current = { x: 0, y: 0 };
      }}
    >
      <div className="absolute -inset-8 sm:-inset-10 md:-inset-12 lg:-inset-14">
        <VoicePulse className={`transition-opacity duration-500 ${hovering ? "opacity-100" : "opacity-60"}`} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72 rounded-full bg-[var(--ocean)]/15 blur-[70px]" />
        </div>
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm" style={{ color: "var(--text-dim)" }}>{t.loading3d}</p>
            </div>
          }
        >
          {active ? <Hero3DCanvas active={active} pointerRef={pointerRef} /> : null}
        </Suspense>
      </div>
    </div>
  );
}
