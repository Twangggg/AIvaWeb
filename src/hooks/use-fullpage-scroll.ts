"use client";

import { useEffect, useRef } from "react";

const SELECTOR = "[data-fp-section]";
const COOLDOWN_MS = 850;
const WHEEL_THRESHOLD = 40;
const SCENE_COOLDOWN_MS = 650;
const TRANSIT_MS = 780;

type Dir = 1 | -1;

/**
 * Fullpage sections + scene steps with bidirectional motion.
 * Forward and reverse share the same choreography, mirrored by `dir`.
 */
export function useFullpageScroll(enabled = true) {
  const locked = useRef(false);
  const sceneLocked = useRef(false);
  const acc = useRef(0);
  const accTimer = useRef(0);
  const activeIdx = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.matchMedia("(max-width: 768px)").matches;
    if (reduced || narrow) return;

    const root = document.documentElement;
    const sections = () => Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));

    const sectionTop = (el: HTMLElement) =>
      Math.max(0, el.getBoundingClientRect().top + window.scrollY);

    const currentIndex = () => {
      const list = sections();
      if (!list.length) return 0;
      const y = window.scrollY;
      let best = 0;
      let bestDist = Infinity;
      list.forEach((el, i) => {
        const dist = Math.abs(sectionTop(el) - y);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      return best;
    };

    const sceneCount = (el: HTMLElement) => {
      const n = Number(el.dataset.fpScenes || 0);
      return Number.isFinite(n) && n > 1 ? Math.floor(n) : 0;
    };

    const sceneStep = (el: HTMLElement) => {
      const n = Number(el.dataset.fpScene || 0);
      return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;
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

    const clearTransit = (list: HTMLElement[]) => {
      list.forEach((el) => {
        delete el.dataset.fpTransit;
      });
    };

    const markActive = (list: HTMLElement[], index: number) => {
      list.forEach((el, i) => {
        if (i === index) el.dataset.fpActive = "true";
        else delete el.dataset.fpActive;
      });
      activeIdx.current = index;
    };

    // Initial active section (no transit flash)
    {
      const list = sections();
      const idx = currentIndex();
      markActive(list, idx);
      setDir(1);
    }

    const goTo = (index: number, dir: Dir) => {
      const list = sections();
      if (index < 0 || index >= list.length) return false;
      if (locked.current) return true;

      locked.current = true;
      acc.current = 0;
      sceneLocked.current = false;
      setDir(dir);

      const fromIdx = activeIdx.current;
      const from = list[fromIdx];
      const target = list[index];

      clearTransit(list);
      if (from && from !== target) {
        from.dataset.fpTransit = dir > 0 ? "leave-fwd" : "leave-back";
        delete from.dataset.fpActive;
      }
      target.dataset.fpTransit = dir > 0 ? "enter-fwd" : "enter-back";
      markActive(list, index);

      window.scrollTo({ top: sectionTop(target), behavior: "smooth" });

      if (sceneCount(target) > 1) {
        setScene(target, dir < 0 ? sceneCount(target) - 1 : 0, dir);
      }

      target.dispatchEvent(
        new CustomEvent("fp-enter", {
          bubbles: true,
          detail: { id: target.id, dir, index }
        })
      );

      window.setTimeout(() => {
        clearTransit(list);
        locked.current = false;
      }, Math.max(COOLDOWN_MS, TRANSIT_MS));

      window.dispatchEvent(
        new CustomEvent("fp-section", {
          detail: { from: fromIdx, to: index, dir, id: target.id }
        })
      );

      return true;
    };

    const snapSection = (el: HTMLElement) => {
      window.scrollTo({ top: sectionTop(el), behavior: "auto" });
    };

    const trySceneStep = (el: HTMLElement, dir: Dir) => {
      const count = sceneCount(el);
      if (count < 2) return false;
      if (sceneLocked.current) {
        snapSection(el);
        return true;
      }

      const step = sceneStep(el);
      if (dir > 0 && step < count - 1) {
        sceneLocked.current = true;
        setDir(dir);
        snapSection(el);
        setScene(el, step + 1, dir);
        window.setTimeout(() => {
          sceneLocked.current = false;
        }, SCENE_COOLDOWN_MS);
        return true;
      }
      if (dir < 0 && step > 0) {
        sceneLocked.current = true;
        setDir(dir);
        snapSection(el);
        setScene(el, step - 1, dir);
        window.setTimeout(() => {
          sceneLocked.current = false;
        }, SCENE_COOLDOWN_MS);
        return true;
      }
      return false;
    };

    const advance = (dir: Dir) => {
      const list = sections();
      if (!list.length) return;
      const idx = currentIndex();
      activeIdx.current = idx;
      const current = list[idx];
      if (current && trySceneStep(current, dir)) return;
      goTo(idx + dir, dir);
    };

    const onWheel = (e: WheelEvent) => {
      const list = sections();
      if (!list.length) return;

      if (locked.current) {
        e.preventDefault();
        return;
      }

      // Only opt-in nested scroll areas (e.g. FAQ). Panels must stay locked.
      const path = e.composedPath();
      for (const node of path) {
        if (!(node instanceof HTMLElement)) continue;
        if (node === document.body || node === document.documentElement) break;
        if (node.hasAttribute("data-fp-section")) continue;
        if (!node.hasAttribute("data-fp-scroll")) continue;
        const style = window.getComputedStyle(node);
        const oy = style.overflowY;
        if ((oy === "auto" || oy === "scroll") && node.scrollHeight > node.clientHeight + 1) {
          const atTop = node.scrollTop <= 0 && e.deltaY < 0;
          const atBottom =
            node.scrollTop + node.clientHeight >= node.scrollHeight - 1 && e.deltaY > 0;
          if (!atTop && !atBottom) return;
        }
      }

      e.preventDefault();
      acc.current += e.deltaY;
      window.clearTimeout(accTimer.current);
      accTimer.current = window.setTimeout(() => {
        acc.current = 0;
      }, 140);

      if (Math.abs(acc.current) < WHEEL_THRESHOLD) return;

      const dir: Dir = acc.current > 0 ? 1 : -1;
      acc.current = 0;
      advance(dir);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (locked.current) return;
      const y = e.changedTouches[0]?.clientY ?? touchY;
      const dy = touchY - y;
      if (Math.abs(dy) < 52) return;
      advance(dy > 0 ? 1 : -1);
    };

    const onKey = (e: KeyboardEvent) => {
      if (locked.current) return;
      const list = sections();
      const idx = currentIndex();
      const current = list[idx];

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        if (current && trySceneStep(current, 1)) return;
        goTo(idx + 1, 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        if (current && trySceneStep(current, -1)) return;
        goTo(idx - 1, -1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0, 1);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(list.length - 1, 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(accTimer.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      delete root.dataset.fpDir;
      clearTransit(sections());
    };
  }, [enabled]);
}
