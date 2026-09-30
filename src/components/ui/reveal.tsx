"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import React, { type ReactNode } from "react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
  /** Soft blur while hidden — premium entrance feel */
  blur?: boolean;
  once?: boolean;
  distance?: number;
}

const EASE_APPLE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  blur = false,
  once = false,
  distance = 20,
  ...props
}: RevealProps) {
  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0, scale: 1 };
      case "down":
        return { y: -distance, x: 0, scale: 1 };
      case "left":
        return { x: distance, y: 0, scale: 1 };
      case "right":
        return { x: -distance, y: 0, scale: 1 };
      case "scale":
        return { y: distance * 0.3, scale: 0.96, x: 0 };
      case "none":
        return { y: 0, x: 0, scale: 1 };
      default:
        return { y: distance, x: 0, scale: 1 };
    }
  };

  const initialTransform = getInitialTransform();

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...initialTransform,
        filter: blur ? "blur(4px)" : "blur(0px)",
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{
        once,
        amount: 0.01,
        margin: "120px 0px 120px 0px",
      }}
      transition={{
        duration: 0.32,
        delay: Math.min(delay, 100) / 1000,
        ease: EASE_APPLE,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
