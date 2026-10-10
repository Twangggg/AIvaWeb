"use client";

import { useEffect, useRef, useState, type Ref } from "react";
const DIRECTION_IMAGES = [
  "phải ngang-Photoroom.png",
  "phải dưới-Photoroom.png",
  "dưới-Photoroom.png",
  "trái dưới-Photoroom.png",
  "trái ngang-Photoroom.png",
  "trái trên-Photoroom.png",
  "trên-Photoroom.png",
  "phải trên-Photoroom.png",
  "trực diện-Photoroom.png",
] as const;

const CENTER = 8;
const SECTOR = Math.PI / 4;

interface ChatMascotButtonProps {
  open: boolean;
  talking?: boolean;
  onClick: () => void;
  ariaLabel: string;
  anchorRef?: Ref<HTMLDivElement>;
}

export function ChatMascotButton({
  open,
  talking = false,
  onClick,
  ariaLabel,
  anchorRef,
}: ChatMascotButtonProps) {
  const [mascotSize, setMascotSize] = useState(56);
  const [direction, setDirection] = useState(CENTER);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let sector = CENTER;
    const reset = () => {
      sector = CENTER;
      setDirection(CENTER);
    };
    const aim = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const box = buttonRef.current?.getBoundingClientRect();
      if (!box) return;
      const dx = event.clientX - (box.left + box.width / 2);
      const dy = event.clientY - (box.top + box.height / 2);
      if (Math.hypot(dx, dy) < 70) {
        reset();
        return;
      }
      const angle = Math.atan2(dy, dx);
      const delta = angle - sector * SECTOR;
      if (
        sector !== CENTER &&
        Math.abs(Math.atan2(Math.sin(delta), Math.cos(delta))) < SECTOR / 2 + 0.12
      ) return;
      sector = (Math.round(angle / SECTOR) + 8) % 8;
      setDirection(sector);
    };
    window.addEventListener("pointermove", aim, { passive: true });
    window.addEventListener("blur", reset);
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", aim);
      window.removeEventListener("blur", reset);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, []);

  useEffect(() => {
    const desktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateSize = () => {
      const width = window.innerWidth;
      setMascotSize(width < 640 ? 56 : width >= 1024 || desktopPointer.matches ? 120 : 68);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    desktopPointer.addEventListener("change", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      desktopPointer.removeEventListener("change", updateSize);
    };
  }, []);

  return (
    <div
      ref={anchorRef}
      data-talking={talking || undefined}
      className="fixed bottom-[0.65rem] right-[0.65rem] z-[60]"
      style={{
        opacity: open ? 0.88 : 1,
        bottom: "max(0.65rem, env(safe-area-inset-bottom))",
        right: "max(0.65rem, env(safe-area-inset-right))",
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        aria-label={`AIVA chatbot — ${ariaLabel}`}
        aria-expanded={open}
        className="relative block overflow-hidden rounded-xl border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        style={{ width: mascotSize, height: mascotSize }}
      >
        {DIRECTION_IMAGES.map((filename, index) => (
          <span
            key={filename}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("/mascots/${encodeURIComponent(filename)}")`,
              opacity: direction === index ? 1 : 0,
            }}
          />
        ))}
      </button>
    </div>
  );
}
