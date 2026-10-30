"use client";

import { motion, AnimatePresence } from "motion/react";
import { useGardenStore, type UserPersona } from "@/features/landing-garden/store/useGardenStore";
import { useI18n } from "@/lib/i18n/provider";

interface WelcomeRoleGateProps {
  open: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
}

export function WelcomeRoleGate({ open, onClose, canDismiss = false }: WelcomeRoleGateProps) {
  const { locale } = useI18n();
  const en = locale === "en";
  const { selectPersonaAndMode } = useGardenStore();

  const handleSelect = (selected: UserPersona) => {
    selectPersonaAndMode(selected);
    onClose?.();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[1100] flex items-center justify-center p-4 sm:p-6"
      >
        {/* Subtle backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => {
            if (canDismiss && onClose) onClose();
          }}
          className="fixed inset-0 bg-black/50 backdrop-blur-md"
        />

        {/* Clean, minimalist panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800"
        >
          {canDismiss && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label={en ? "Close" : "Đóng"}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              ✕
            </button>
          )}

          <h2 className="text-xl sm:text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100 mb-6">
            {en ? "Who are you?" : "Bạn là ai?"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phụ huynh / Thầy cô */}
            <button
              type="button"
              onClick={() => handleSelect("parent")}
              className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform">
                👨‍👩‍👧
              </div>
              <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                {en ? "Parent / Teacher" : "Phụ huynh & Thầy cô"}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {en ? "Detailed page" : "Trang thông tin chi tiết"}
              </span>
            </button>

            {/* Học sinh */}
            <button
              type="button"
              onClick={() => handleSelect("student")}
              className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-white dark:hover:bg-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg transition-all duration-200 cursor-pointer text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform">
                🎒
              </div>
              <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                {en ? "Student" : "Học sinh"}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                {en ? "3D Discovery Garden" : "Khu vườn 3D khám phá"}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
