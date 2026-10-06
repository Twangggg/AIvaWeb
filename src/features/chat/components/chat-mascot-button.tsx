"use client";

import Image from "next/image";

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
  ariaLabel,
}: ChatMascotButtonProps) {
  return (
    <div
      className="fixed bottom-[0.65rem] right-[0.65rem] z-[60] rounded-full"
      style={{
        background:
          "radial-gradient(circle at 45% 30%, #ffffff 0%, #fff9e8 65%, #e5f1fc 100%)",
        boxShadow: "0 4px 16px rgba(50, 109, 168, 0.12)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1.5 left-1/2 h-3 w-10 -translate-x-1/2 rounded-full blur-lg transition-opacity"
        style={{
          background:
            "radial-gradient(ellipse, rgba(255,214,87,0.4) 0%, transparent 70%)",
          opacity: talking ? 1 : 0.55,
        }}
      />
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        aria-expanded={open}
        className="chatbot-friend relative block h-14 w-14 rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 active:scale-95 sm:h-[68px] sm:w-[68px] lg:h-[88px] lg:w-[88px]"
      >
        <Image
          src="/mascots/frog-waving.webp"
          alt=""
          width={88}
          height={88}
          sizes="(min-width: 1024px) 88px, (min-width: 640px) 68px, 56px"
          className="h-full w-full select-none object-contain"
        />
      </button>
    </div>
  );
}
