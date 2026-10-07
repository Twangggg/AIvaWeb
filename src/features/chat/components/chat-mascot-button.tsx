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
  ariaLabel,
}: ChatMascotButtonProps) {
  const [mascotSize, setMascotSize] = useState(56);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      setMascotSize(width < 640 ? 56 : width < 1024 ? 68 : 88);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      onClick={onClick}
      data-talking={talking || undefined}
      className="fixed bottom-[0.65rem] right-[0.65rem] z-[60]"
      style={{ opacity: open ? 0.88 : 1 }}
    >
      <Mascot
        directions="/mascots/frog-2d-arms-down-directions.png"
        reactions="/mascots/frog-2d-arms-down-reactions.png"
        size={mascotSize}
        label={`AIVA chatbot — ${ariaLabel}`}
        className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
      />
    </div>
  );
}
