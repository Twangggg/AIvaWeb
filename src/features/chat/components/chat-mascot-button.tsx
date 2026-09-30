"use client";

import { useEffect, useState } from "react";
import { Mascot } from "page-mascot";

interface ChatMascotButtonProps {
  open: boolean;
  talking?: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function ChatMascotButton({
  open,
  talking = false,
  onClick,
  ariaLabel
}: ChatMascotButtonProps) {
  const [mascotSize, setMascotSize] = useState(56);

  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      setMascotSize(w < 640 ? 56 : w < 1024 ? 68 : 88);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      aria-live="polite"
      onClick={onClick}
      className="fixed z-[60] cursor-pointer"
      style={{
        bottom: "0.65rem",
        right: "0.65rem",
        opacity: open ? 0.88 : 1
      }}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 bottom-1.5 w-10 h-3 rounded-full blur-lg pointer-events-none transition-opacity"
        style={{
          background: "radial-gradient(ellipse, rgba(234,179,8,0.4) 0%, transparent 70%)",
          opacity: talking ? 1 : 0.55
        }}
      />
      <Mascot
        directions="/mascots/frog-cute-directions.webp"
        reactions="/mascots/frog-cute-reactions.webp"
        size={mascotSize}
        label={`AIVA chatbot — ${ariaLabel}`}
        className="relative block rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 active:scale-95 shadow-md"
      />
    </div>
  );
}
