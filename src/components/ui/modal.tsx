"use client";

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
        style={{ backgroundColor: "var(--overlay-bg)" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--modal-bg)",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-modal)"
        }}
      >
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid", borderColor: "var(--border-subtle)" }}
        >
          {title ? (
            <h3 className="text-lg font-bold tracking-[0.05em]" style={{ color: "var(--text-on-glass)" }}>{title}</h3>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-subtle)";
              e.currentTarget.style.color = "var(--text-on-glass)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-dim)";
            }}
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}
