"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/** Pointer-following wrap with smooth lerp — Apple/Linear CTA feel. */
export function Magnetic({ children, className = "", strength = 0.32 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const hovering = useRef(false);

  const tick = () => {
    const el = ref.current;
    if (!el) return;
    current.current.x += (target.current.x - current.current.x) * 0.18;
    current.current.y += (target.current.y - current.current.y) * 0.18;
    el.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;

    const dx = Math.abs(target.current.x - current.current.x);
    const dy = Math.abs(target.current.y - current.current.y);
    if (dx > 0.05 || dy > 0.05 || hovering.current) {
      raf.current = requestAnimationFrame(tick);
    } else {
      el.style.transform = "translate3d(0,0,0)";
      raf.current = 0;
    }
  };

  const start = () => {
    if (!raf.current) raf.current = requestAnimationFrame(tick);
  };

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    hovering.current = true;
    const rect = el.getBoundingClientRect();
    target.current.x = (e.clientX - rect.left - rect.width / 2) * strength;
    target.current.y = (e.clientY - rect.top - rect.height / 2) * strength;
    start();
  };

  const onLeave = () => {
    hovering.current = false;
    target.current = { x: 0, y: 0 };
    start();
  };

  return (
    <div
      ref={ref}
      className={`magnetic-wrap will-change-transform ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
