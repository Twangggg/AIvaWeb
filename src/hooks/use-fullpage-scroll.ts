"use client";

import { useEffect, useRef } from "react";

const SELECTOR = "[data-fp-section]";
const INPUT_LOCK_MS = 1400;
const STATEMENT_INPUT_LOCK_MS = 750;

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
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const root = document.documentElement;
    const getSections = () =>
      Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
        (section) => section.getClientRects().length > 0
      );

    const viewport = () => ({
      top: window.visualViewport?.offsetTop ?? 0,
      height: window.visualViewport?.height ?? window.innerHeight,
    });

    const getLenis = () =>
      (
        window as unknown as {
          __lenis?: {
            scrollTo: (
              t: HTMLElement | number,
              opts?: Record<string, unknown>
            ) => void;
          };
        }
      ).__lenis;

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
          detail: { step: next, count, id: el.id, dir },
        })
      );
    };

    const isHardPagedSection = (el: HTMLElement) => el.matches(SELECTOR);

    interface SectionCacheItem {
      el: HTMLElement;
      top: number;
      height: number;
      scenes: number;
    }

    let cachedSections: SectionCacheItem[] = [];
    let mobileAnchor: HTMLElement | null = null;

    const measureSections = () => {
      const list = getSections();
      const scrollY = window.scrollY;
      cachedSections = list.map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          el,
          top: Math.max(0, rect.top + scrollY),
          height: Math.max(el.offsetHeight, rect.height, 1),
          scenes: sceneCount(el),
        };
      });
    };

    // Scroll sync handler for active section & scene progression
    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!cachedSections.length) {
          measureSections();
          if (!cachedSections.length) return;
        }

        const currentY = window.scrollY;
        const dir: Dir = currentY >= lastScrollY.current ? 1 : -1;
        lastScrollY.current = currentY;
        setDir(dir);

        const { top: viewportOffset, height: viewportHeight } = viewport();
        const viewTop = currentY + viewportOffset;
        const viewBottom = viewTop + viewportHeight;
        const viewMid = currentY + viewportHeight * 0.45;

        let best = 0;
        let bestDist = Infinity;

        cachedSections.forEach((item, i) => {
          const { el, top, height, scenes } = item;
          const bottom = top + height;

          // Responsive activation threshold: activates as soon as section enters viewport
          const isInView =
            bottom >= viewTop + viewportHeight * 0.1 &&
            top <= viewBottom - viewportHeight * 0.1;
          if (isInView) {
            el.dataset.fpActive = "true";
            el.dataset.fpEntered = "true";
          }

          // Immediate pin detection: if current scroll is within this section's active track
          const isPinnedOrActive =
            currentY >= top - viewportHeight * 0.15 &&
            currentY < bottom - viewportHeight * 0.35;
          if (isPinnedOrActive && bestDist > 0) {
            best = i;
            bestDist = 0;
          } else if (bestDist !== 0) {
            const center = top + height / 2;
            const dist = Math.abs(center - viewMid);
            if (dist < bestDist) {
              bestDist = dist;
              best = i;
            }
          }

          // Hard paging owns scene changes. Native scroll only synchronizes
          // visibility/entry state, never skips a scene through momentum.
          if (scenes > 1 && !isHardPagedSection(el)) {
            const scrollableDistance = height - viewportHeight;
            if (scrollableDistance > 0) {
              const relY = currentY - top;
              const normalized = Math.max(
                0,
                Math.min(1, relY / scrollableDistance)
              );
              const step = Math.min(
                scenes - 1,
                Math.floor(normalized * scenes)
              );
              setScene(el, step, dir);
            } else {
              const relY = currentY - top + viewportHeight * 0.5;
              const normalized = Math.max(
                0,
                Math.min(1, relY / Math.max(height, 1))
              );
              const step = Math.min(
                scenes - 1,
                Math.floor(normalized * scenes)
              );
              setScene(el, step, dir);
            }
          }
        });

        const currentSection = cachedSections[best]?.el;
        mobileAnchor =
          window.innerWidth < 640 &&
          currentSection?.hasAttribute("data-fp-mobile-lock") &&
          Math.abs(currentSection.getBoundingClientRect().top) <= 2
            ? currentSection
            : null;

        if (best !== activeIdx.current) {
          activeIdx.current = best;
          const target = cachedSections[best]?.el;
          if (target) {
            target.dataset.fpActive = "true";
            target.dispatchEvent(
              new CustomEvent("fp-enter", {
                bubbles: true,
                detail: { id: target.id, dir, index: best },
              })
            );
          }
        }
      });
    };

    // Initial setup - measure and activate sections in view immediately
    measureSections();
    if (cachedSections.length > 0) {
      cachedSections[0].el.dataset.fpActive = "true";
      cachedSections[0].el.dataset.fpEntered = "true";
    }
    setDir(1);
    onScroll();

    let resizeTimer = 0;
    const onResize = () => {
      const anchor = mobileAnchor;
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measureSections();
        // Browser chrome and orientation changes resize earlier chapters too.
        // Keep the chapter being read anchored without resetting its scene.
        if (anchor && window.innerWidth < 640 && !touchSection)
          anchor.scrollIntoView({ behavior: "instant", block: "start" });
        onScroll();
      }, 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    window.visualViewport?.addEventListener("resize", onResize);
    const sectionObserver = new ResizeObserver(onResize);
    getSections().forEach((section) => sectionObserver.observe(section));

    // Full-page paging ------------------------------------------------------
    // Wheel and touch share the same state machine: complete all scenes in a
    // chapter, then move exactly one section. This keeps momentum from
    // skipping content on either desktop or mobile.
    let touchStartX = 0;
    let touchStartY = 0;
    let lastTouchY = 0;
    let touchSection: HTMLElement | null = null;
    let touchLocked = false;
    let touchTarget: EventTarget | null = null;
    let inputLockUntil = 0;

    const sectionAtViewport = (): HTMLElement | null => {
      const { top, height: viewportHeight } = viewport();
      const viewportTop = top + Math.min(100, viewportHeight * 0.15);
      let candidate: HTMLElement | null = null;
      let largestVisibleArea = 0;
      let closestStart = Infinity;

      // A chapter owns input while it occupies most of the visible screen.
      // Comparing its top to the screen centre selects the following chapter
      // too early on tall screens, skipping the chapter actually being read.
      getSections().forEach((el) => {
        const rect = el.getBoundingClientRect();
        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, top + viewportHeight) -
            Math.max(rect.top, viewportTop)
        );
        const startDistance = Math.abs(rect.top - viewportTop);
        if (
          visibleHeight > largestVisibleArea ||
          (visibleHeight > 0 &&
            visibleHeight === largestVisibleArea &&
            startDistance < closestStart)
        ) {
          candidate = el;
          largestVisibleArea = visibleHeight;
          closestStart = startDistance;
        }
      });
      return candidate;
    };

    const isScrollableTarget = (target: EventTarget | null, dir: Dir) => {
      if (!(target instanceof Element)) return false;
      if (target.closest("input, textarea, select, [contenteditable='true']"))
        return true;
      // Only an actual scroll container with room in this direction owns input.
      // Content overflow alone (including a rounded pixel) must not disable paging.
      for (
        let el: Element | null = target;
        el && !el.matches(SELECTOR);
        el = el.parentElement
      ) {
        if (!el.hasAttribute("data-fp-scroll")) continue;
        const overflow = getComputedStyle(el).overflowY;
        if (overflow !== "auto" && overflow !== "scroll") continue;
        const remaining = el.scrollHeight - el.clientHeight - el.scrollTop;
        if (dir > 0 ? remaining > 2 : el.scrollTop > 2) return true;
      }
      return false;
    };

    // On phones, only deliberately scene-based chapters opt into paging.
    // Tablet and desktop layouts preserve the existing full-page behavior.
    const usesMobilePaging = (section: HTMLElement) =>
      !section.hasAttribute("data-fp-native") &&
      (window.innerWidth >= 640 || section.hasAttribute("data-fp-mobile-lock"));

    const scrollToSection = (el: HTMLElement, dir: Dir) => {
      const sections = getSections();
      const index = sections.indexOf(el);
      const target = sections[index + dir];
      if (!target) return;
      const lenis = getLenis();
      if (lenis) {
        lenis.scrollTo(target, { duration: 0.45, immediate: false });
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const alignMobileChapter = (section: HTMLElement, dir: Dir) => {
      if (
        window.innerWidth >= 640 ||
        !section.hasAttribute("data-fp-mobile-lock")
      )
        return false;
      const rect = section.getBoundingClientRect();
      if (Math.abs(rect.top) <= 2) return false;
      // Fluid sections can leave a story chapter only partly on screen.
      // Finish entering it before any swipe is allowed to change its scene.
      if (sceneCount(section) > 1 && dir > 0 && rect.top > 0)
        setScene(section, 0, dir);
      if (sceneCount(section) > 1 && dir < 0 && rect.top < 0)
        setScene(section, sceneCount(section) - 1, dir);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      inputLockUntil = Date.now() + 650;
      return true;
    };

    const onScrollEnd = () => {
      if (window.innerWidth >= 640) return;
      if (touchSection) return;
      const section = sectionAtViewport();
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const { top, height } = viewport();
      const visible =
        Math.min(rect.bottom, top + height) - Math.max(rect.top, top);
      if (visible < height * 0.6) return;
      alignMobileChapter(section, rect.top >= 0 ? 1 : -1);
    };
    window.addEventListener("scrollend", onScrollEnd);

    const advance = (section: HTMLElement, dir: Dir) => {
      if (Date.now() < inputLockUntil) return;
      if (alignMobileChapter(section, dir)) return;
      const count = sceneCount(section);
      const current = Number(section.dataset.fpScene || 0);
      const next =
        count > 1 ? Math.max(0, Math.min(count - 1, current + dir)) : current;

      if (count > 1 && next !== current) {
        setScene(section, next, dir);
      } else {
        scrollToSection(section, dir);
      }
      // Fluid input lock: responsive on mobile (650ms), statement chapter (750ms), or standard desktop
      const isMobile = window.innerWidth < 640;
      const inputLockMs =
        section.id === "statement"
          ? STATEMENT_INPUT_LOCK_MS
          : isMobile
            ? 650
            : INPUT_LOCK_MS;
      inputLockUntil = Date.now() + inputLockMs;
    };

    let lastWheelAt = -Infinity;
    const WHEEL_GESTURE_GAP_MS = 220;

    const onWheel = (event: WheelEvent) => {
      if (isScrollableTarget(event.target, event.deltaY > 0 ? 1 : -1)) return;
      const section = sectionAtViewport();
      if (!section || !usesMobilePaging(section)) return;
      const now = performance.now();
      const continuingGesture = now - lastWheelAt < WHEEL_GESTURE_GAP_MS;
      lastWheelAt = now;
      event.preventDefault();
      // Track even tiny momentum events so a long trackpad gesture cannot
      // start another page transition when the fixed animation lock expires.
      if (Math.abs(event.deltaY) < 8 || continuingGesture) return;
      advance(section, event.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (event: TouchEvent) => {
      touchTarget = event.target;
      if (event.touches.length !== 1) {
        touchSection = null;
        touchLocked = false;
        return;
      }
      touchSection = sectionAtViewport();
      if (touchSection && !usesMobilePaging(touchSection)) {
        touchSection = null;
        return;
      }
      touchLocked = false;
      touchStartX = event.touches[0]?.clientX ?? 0;
      touchStartY = event.touches[0]?.clientY ?? 0;
      lastTouchY = touchStartY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!touchSection || event.touches.length !== 1) return;
      lastTouchY = event.touches[0]?.clientY ?? lastTouchY;
      const deltaY = lastTouchY - touchStartY;
      const deltaX = (event.touches[0]?.clientX ?? 0) - touchStartX;

      // Only lock and prevent default when the gesture is primarily vertical story paging
      if (Math.abs(deltaY) > 8 && Math.abs(deltaY) > Math.abs(deltaX)) {
        if (
          !touchLocked &&
          isScrollableTarget(touchTarget, deltaY < 0 ? 1 : -1)
        ) {
          touchSection = null;
          return;
        }
        touchLocked = true;
        event.preventDefault();
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      const section = touchSection;
      const endY = event.changedTouches[0]?.clientY ?? lastTouchY;
      const delta = endY - touchStartY;
      touchSection = null;

      if (!section || !touchLocked || Math.abs(delta) < 36) return;
      advance(section, delta < 0 ? 1 : -1);
      touchLocked = false;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    const onTouchCancel = () => {
      touchSection = null;
      touchTarget = null;
      touchLocked = false;
    };
    window.addEventListener("touchcancel", onTouchCancel, { passive: true });

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

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        const section = sectionAtViewport();
        if (!section || !usesMobilePaging(section)) return;
        e.preventDefault();
        advance(section, 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        const section = sectionAtViewport();
        if (!section || !usesMobilePaging(section)) return;
        e.preventDefault();
        advance(section, -1);
      } else if (e.key === "Home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (e.key === "End") {
        e.preventDefault();
        const last = getSections().at(-1);
        if (last) {
          last.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(resizeTimer);
      sectionObserver.disconnect();
      window.visualViewport?.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchCancel);
    };
  }, [enabled]);
}
