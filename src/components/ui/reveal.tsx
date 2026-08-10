"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Soft blur while hidden — premium entrance feel */
  blur?: boolean;
  once?: boolean;
}

function sectionIsIn(section: HTMLElement) {
  const transit = section.dataset.fpTransit ?? "";
  return section.dataset.fpActive === "true" || transit.startsWith("enter");
}

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  blur = true,
  once = true
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const section = el.closest<HTMLElement>("[data-fp-section]");

    // Fullpage chapters: replay every time the section is entered.
    if (section) {
      const sync = () => setVisible(sectionIsIn(section));
      const mo = new MutationObserver(sync);
      mo.observe(section, {
        attributes: true,
        attributeFilter: ["data-fp-active", "data-fp-transit"]
      });
      // Defer initial sync so we don't setState synchronously in the effect body.
      const boot = window.setTimeout(sync, 0);
      return () => {
        window.clearTimeout(boot);
        mo.disconnect();
      };
    }

    if (visible && once) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, once]);

  const transforms: Record<string, string> = {
    up: "translate3d(0, 40px, 0)",
    down: "translate3d(0, -40px, 0)",
    left: "translate3d(36px, 0, 0)",
    right: "translate3d(-36px, 0, 0)",
    none: "none"
  };

  return (
    <div
      ref={ref}
      className={`reveal-motion ${visible ? "is-visible" : ""} ${className}`}
      style={
        {
          "--reveal-delay": `${delay}ms`,
          "--reveal-hidden": transforms[direction],
          "--reveal-blur": blur ? "8px" : "0px"
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
