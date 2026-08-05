"use client";

import type { MouseEvent, ReactNode } from "react";

interface HeroMouseFxProps {
  children: ReactNode;
  className?: string;
  onMouseMove?: (e: MouseEvent<HTMLElement>) => void;
}

export function HeroMouseFx({ children, className = "", onMouseMove }: HeroMouseFxProps) {
  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const dx = (x - 50) / 50;
    const dy = (y - 50) / 50;

    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
    el.style.setProperty("--orb-x", `${dx * 28}px`);
    el.style.setProperty("--orb-y", `${dy * 20}px`);
    onMouseMove?.(e);
  };

  return (
    <section
      className={`hero-mouse-fx ${className}`}
      onMouseMove={handleMove}
    >
      <div className="hero-mouse-spotlight" aria-hidden />
      <div className="hero-mouse-grid-glow" aria-hidden />
      {children}
    </section>
  );
}
