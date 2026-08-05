"use client";

import { useEffect, useLayoutEffect, useRef, useSyncExternalStore } from "react";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "[role='button']:not([aria-disabled='true'])",
  "[role='link']",
  "input:not(:disabled)",
  "textarea:not(:disabled)",
  "select:not(:disabled)",
  "label[for]",
  "summary",
  ".cursor-pointer",
  "[data-cursor='pointer']"
].join(", ");

function isCursorSupported() {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function subscribe() {
  return () => {};
}

export function CustomCursor() {
  const active = useSyncExternalStore(subscribe, isCursorSupported, () => false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const hoveringRef = useRef(false);

  useLayoutEffect(() => {
    if (!active) return;

    document.documentElement.classList.add("custom-cursor-active");
    document.body.classList.add("custom-cursor-active");

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      document.body.classList.remove("custom-cursor-active");
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const hideNativeCursor = () => {
      document.documentElement.style.cursor = "none";
      document.body.style.cursor = "none";
    };

    const onMove = (e: MouseEvent) => {
      hideNativeCursor();

      const cursor = cursorRef.current;
      if (!cursor) return;

      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      const target = document.elementFromPoint(e.clientX, e.clientY);
      const interactive = !!target?.closest(INTERACTIVE_SELECTOR);

      if (interactive !== hoveringRef.current) {
        hoveringRef.current = interactive;
        cursor.classList.toggle("aiva-cursor-hover", interactive);
        cursor.setAttribute("data-clickable", interactive ? "true" : "false");
      }
    };

    const onDown = () => {
      cursorRef.current?.classList.add("aiva-cursor-press");
    };

    const onUp = () => {
      cursorRef.current?.classList.remove("aiva-cursor-press");
    };

    const onLeave = () => {
      cursorRef.current?.classList.remove("aiva-cursor-hover", "aiva-cursor-press");
      cursorRef.current?.setAttribute("data-clickable", "false");
      hoveringRef.current = false;
    };

    hideNativeCursor();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      ref={cursorRef}
      className="aiva-cursor pointer-events-none fixed top-0 left-0 z-[9999]"
      data-clickable="false"
      aria-hidden
    >
      <span className="aiva-cursor-glass">
        <span className="aiva-cursor-glare" />
      </span>
      <span className="aiva-cursor-handle" />
    </div>
  );
}
