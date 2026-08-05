"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ChatMascotCanvas = dynamic(() => import("./chat-mascot-canvas"), { ssr: false });

interface ChatMascotButtonProps {
  open: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function ChatMascotButton({ open, onClick, ariaLabel }: ChatMascotButtonProps) {
  const [hovering, setHovering] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 300);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
      className="fixed z-[60] flex items-center justify-center transition-transform hover:scale-[1.03] active:scale-[0.97]"
      style={{
        bottom: "0.75rem",
        right: "0.5rem",
        width: "9rem",
        height: "10rem",
        background: "transparent",
        opacity: open ? 0.9 : 1,
        overflow: "visible"
      }}
      aria-label={ariaLabel}
      aria-expanded={open}
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-2 w-16 h-5 rounded-full blur-xl pointer-events-none transition-opacity"
        style={{
          background: "radial-gradient(ellipse, rgba(234,179,8,0.4) 0%, transparent 70%)",
          opacity: hovering ? 1 : 0.55
        }}
      />

      <div className="relative w-full h-full" style={{ overflow: "visible" }}>
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          </div>
        )}
        {ready && <ChatMascotCanvas hovering={hovering} active />}
      </div>
    </button>
  );
}
