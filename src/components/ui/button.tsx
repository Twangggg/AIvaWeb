"use client";

import { clsx } from "clsx";
import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  fullWidth,
  children,
  className,
  whileHover,
  whileTap,
  transition,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={whileHover ?? { scale: 1.03, y: -1 }}
      whileTap={whileTap ?? { scale: 0.96, y: 1 }}
      transition={
        transition ?? {
          type: "spring",
          stiffness: 400,
          damping: 25,
        }
      }
      className={clsx(
        "inline-flex items-center justify-center font-semibold cursor-pointer select-none",
        variant === "primary" && "btn-primary px-8 py-3.5",
        variant === "ghost" && "btn-ghost px-8 py-3.5",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
