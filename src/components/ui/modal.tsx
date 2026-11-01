"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const emptySubscribe = () => () => {};

export function Modal({ open, onClose, children, title }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

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

  if (!open || !mounted) return null;

  const content = (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: "var(--overlay-bg, rgba(0, 0, 0, 0.6))" }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border animate-in fade-in zoom-in-95 duration-200"
        style={{
          backgroundColor: "var(--modal-bg, #ffffff)",
          borderColor: "var(--border-subtle, rgba(0,0,0,0.1))",
          boxShadow: "var(--shadow-modal, 0 25px 50px -12px rgba(0,0,0,0.25))",
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: "1px solid",
            borderColor: "var(--border-subtle, rgba(0,0,0,0.1))",
          }}
        >
          {title ? (
            <h3
              className="text-lg font-bold tracking-[0.05em]"
              style={{ color: "var(--text-on-glass)" }}
            >
              {title}
            </h3>
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

  return createPortal(content, document.body);
}
