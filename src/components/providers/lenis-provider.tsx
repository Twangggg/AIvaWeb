"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

const LenisContext = createContext<Lenis | null>(null);

export function useLenisInstance() {
  return useContext(LenisContext);
}

interface LenisProviderProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function LenisProvider({ children, enabled = true }: LenisProviderProps) {
  const [lenis, setLenis] = React.useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.0,
      syncTouch: false,
      autoRaf: true,
    });

    lenisRef.current = instance;
    queueMicrotask(() => {
      setLenis(instance);
    });

    // Global helper on window for debugging or external triggers
    (window as unknown as { __lenis?: Lenis }).__lenis = instance;

    return () => {
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, [enabled]);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
