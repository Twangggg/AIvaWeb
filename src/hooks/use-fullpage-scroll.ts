"use client";

import { useEffect, useRef } from "react";

const SELECTOR = "[data-fp-section]";

type Dir = 1 | -1;

/**
 * Modern smooth scroll coordinator powered by Lenis.
 * Coordinates fast section activation, scene progression, and keyboard navigation
 * with zero lag and zero wheel conflicts.
 */
export function useFullpageScroll(enabled = true) {
  const lastScrollY = useRef(0);
  const activeIdx = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const root = document.documentElement;
    const getSections = () => Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

    const sectionTop = (el: HTMLElement) =>
      Math.max(0, el.getBoundingClientRect().top + window.scrollY);

    const getLenis = () =>
      (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement | number, opts?: Record<string, unknown>) => void } }).__lenis;

    const sceneCount = (el: HTMLElement) => {
      const n = Number(el.dataset.fpScenes || 0);
      return Number.isFinite(n) && n > 1 ? Math.floor(n) : 0;
    };

    const setDir = (dir: Dir) => {
      root.dataset.fpDir = String(dir);
    };

    const setScene = (el: HTMLElement, step: number, dir: Dir) => {
      const count = sceneCount(el);
      const next = Math.max(0, Math.min(count - 1, step));
      el.dataset.fpScene = String(next);
      el.dataset.fpSceneDir = String(dir);
      el.dispatchEvent(
        new CustomEvent("fp-scene", {
          bubbles: true,
          detail: { step: next, count, id: el.id, dir }
        })
      );
    };

    // Scroll sync handler for active section & scene progression
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const list = getSections();
        if (!list.length) return;

        const currentY = window.scrollY;
        const dir: Dir = currentY >= lastScrollY.current ? 1 : -1;
        lastScrollY.current = currentY;
        setDir(dir);

        const viewportHeight = window.innerHeight;
        const viewTop = currentY;
        const viewBottom = currentY + viewportHeight;
        const viewMid = currentY + viewportHeight * 0.45;

        let best = 0;
        let bestDist = Infinity;

        list.forEach((el, i) => {
          const top = sectionTop(el);
          const height = el.offsetHeight;
          const bottom = top + height;
          const center = top + height / 2;

          // Responsive activation threshold: activates as soon as section enters viewport
          const isInView = bottom >= viewTop + viewportHeight * 0.15 && top <= viewBottom - viewportHeight * 0.15;
          if (isInView) {
            el.dataset.fpActive = "true";
            el.dataset.fpEntered = "true";
          }

          const dist = Math.abs(center - viewMid);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }

          // Handle scene progression within sticky multi-scene sections
          const scenes = sceneCount(el);
          if (scenes > 1) {
            const scrollableDistance = height - viewportHeight;
            if (scrollableDistance > 0) {
              const relY = currentY - top;
              const progress = Math.max(0, Math.min(1, relY / scrollableDistance));
              const step = Math.min(scenes - 1, Math.floor(progress * scenes));
              setScene(el, step, dir);
            } else {
              const relY = currentY - top + viewportHeight * 0.4;
              const progress = Math.max(0, Math.min(1, relY / Math.max(height, 1)));
              const step = Math.min(scenes - 1, Math.floor(progress * scenes));
              setScene(el, step, dir);
            }
          }
        });

        if (best !== activeIdx.current) {
          activeIdx.current = best;
          const target = list[best];
          if (target) {
            target.dataset.fpActive = "true";
            target.dispatchEvent(
              new CustomEvent("fp-enter", {
                bubbles: true,
                detail: { id: target.id, dir, index: best }
              })
            );
          }
        }
      });
    };

    // Initial setup - activate sections in view immediately
    const initialList = getSections();
    initialList.forEach((el, i) => {
      if (i === 0) {
        el.dataset.fpActive = "true";
        el.dataset.fpEntered = "true";
      }
    });
    setDir(1);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    // Keyboard navigation (glide smoothly with Lenis)
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const list = getSections();
      const idx = activeIdx.current;
      const lenis = getLenis();

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        if (idx < list.length - 1) {
          e.preventDefault();
          const next = list[idx + 1];
          if (next) {
            if (lenis) {
              lenis.scrollTo(next, {
                duration: 0.85,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
              });
            } else {
              next.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (idx > 0) {
          e.preventDefault();
          const prev = list[idx - 1];
          if (prev) {
            if (lenis) {
              lenis.scrollTo(prev, {
                duration: 0.85,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
              });
            } else {
              prev.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        if (lenis) {
          lenis.scrollTo(0, { duration: 0.9 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } else if (e.key === "End") {
        e.preventDefault();
        const last = list[list.length - 1];
        if (last) {
          if (lenis) {
            lenis.scrollTo(last, { duration: 0.9 });
          } else {
            last.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [enabled]);
}
