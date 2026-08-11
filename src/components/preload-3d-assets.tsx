"use client";

import { useEffect } from "react";

const GLASSES_URL = "/models/glasses.glb";

/**
 * Warm the glasses GLB early (idle) so hero hover / canvas mount stay smooth.
 * Mascot stays on-demand — it's much larger.
 */
export function Preload3DAssets() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let idleId = 0;
    let timeoutId = 0;

    const warm = () => {
      if (cancelled) return;

      // HTTP cache — works even before drei/three chunk loads
      void fetch(GLASSES_URL, { credentials: "same-origin", mode: "same-origin" }).catch(
        () => undefined
      );

      // Parse into drei/three cache once the canvas module is available
      void import("@/components/hero-3d-canvas").catch(() => undefined);
    };

    const schedule =
      typeof window.requestIdleCallback === "function"
        ? () => {
            idleId = window.requestIdleCallback(warm, { timeout: 2200 });
          }
        : () => {
            timeoutId = window.setTimeout(warm, 600);
          };

    schedule();

    return () => {
      cancelled = true;
      if (idleId && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
