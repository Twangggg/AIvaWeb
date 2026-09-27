"use client";

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
  return (
    <div
      aria-live="polite"
      onClick={onClick}
      className="fixed z-[60]"
      style={{
        bottom: "0.75rem",
        right: "0.5rem",
        opacity: open ? 0.88 : 1
      }}
    >
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 bottom-2 w-14 h-4 rounded-full blur-xl pointer-events-none transition-opacity"
        style={{
          background: "radial-gradient(ellipse, rgba(234,179,8,0.4) 0%, transparent 70%)",
          opacity: talking ? 1 : 0.55
        }}
      />
      <Mascot
        directions="/mascots/frog-cute-directions.webp"
        reactions="/mascots/frog-cute-reactions.webp"
        size={112}
        label={`AIVA chatbot — ${ariaLabel}`}
        className="relative block rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 active:scale-95"
      />
    </div>
  );
}
