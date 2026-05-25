"use client";

import { clsx } from "clsx";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className={clsx(
        "fixed inset-0 z-[100] flex items-center justify-center p-4",
        "bg-black/60 backdrop-blur-sm"
      )}
    >
      <div
        className={clsx(
          "relative w-full max-w-md rounded-2xl",
          "border border-white/10 bg-[#0d0d0d]/95 backdrop-blur-xl",
          "shadow-2xl shadow-black/50",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          {title ? (
            <h3 className="text-lg font-bold tracking-[0.05em] text-white">{title}</h3>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className={clsx(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              "text-white/40 transition-all hover:bg-white/10 hover:text-white"
            )}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
