"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  /** ms between words */
  stagger?: number;
  /** Trigger on mount instead of scroll (hero) */
  immediate?: boolean;
}

export function TextReveal({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  stagger = 45,
  immediate = false
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const words = useMemo(() => text.split(/(\s+)/).filter(Boolean), [text]);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    if (immediate) {
      const id = window.setTimeout(() => setVisible(true), 40);
      return () => window.clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, immediate]);

  return (
    <Tag
      ref={ref as never}
      className={`text-reveal ${visible ? "is-visible" : ""} ${className}`}
      aria-label={text}
      style={{ "--text-reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {words.map((word, i) =>
        /^\s+$/.test(word) ? (
          <span key={`s-${i}`} className="text-reveal-space">
            {"\u00A0"}
          </span>
        ) : (
          <span key={`${word}-${i}`} className="text-reveal-word">
            <span
              className="text-reveal-inner"
              style={{ "--i": i, "--stagger": `${stagger}ms` } as CSSProperties}
            >
              {word}
            </span>
          </span>
        )
      )}
    </Tag>
  );
}
