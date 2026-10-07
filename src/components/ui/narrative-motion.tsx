"use client";

import {
  AnimatePresence,
  motion,
  useIsPresent,
  useInView,
  useReducedMotion,
  type TargetAndTransition,
} from "motion/react";
import { type CSSProperties, type ReactNode, useRef } from "react";

export const STORY_EASE = [0.16, 1, 0.3, 1] as const;
export const STORY_DURATION = 0.55;

export function JourneyTrace() {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 1000 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -top-12 left-[10%] hidden h-20 w-[80%] md:block"
      aria-hidden="true"
    >
      <motion.path
        d="M 0 90 C 180 -10 280 -10 500 90 S 820 -10 1000 90"
        fill="none"
        stroke="var(--ocean)"
        strokeWidth="2"
        strokeDasharray="5 6"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: false }}
        transition={{ duration: reduced ? 0 : 1.4, ease: STORY_EASE }}
      />
    </svg>
  );
}

export function MaskedWords({ text }: { text: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className="narrative-words"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.01 }}
    >
      <span className="sr-only">{text}</span>
      {text.split(" ").map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="narrative-word-mask"
          aria-hidden="true"
        >
          <motion.span
            variants={{
              hidden: {
                clipPath: reduced ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              },
              visible: { clipPath: "inset(0 0% 0 0)" },
            }}
            transition={{
              duration: reduced ? 0 : STORY_DURATION,
              delay: Math.min(index * 0.025, 0.25),
              ease: STORY_EASE,
            }}
          >
            {word}
          </motion.span>{" "}
        </span>
      ))}
    </motion.span>
  );
}

type SceneKind = "iris" | "shutter" | "ticket";
function ScenePanel({
  kind,
  direction,
  children,
  className,
}: {
  kind: SceneKind;
  direction: number;
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const present = useIsPresent();
  const enter: TargetAndTransition =
    kind === "iris"
      ? { clipPath: "circle(0% at 50% 50%)", scale: 1.08 }
      : kind === "shutter"
        ? {
            clipPath: direction > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
          }
        : { rotateY: direction * -16, x: direction * 30, opacity: 0 };
  const visible: TargetAndTransition =
    kind === "iris"
      ? { clipPath: "circle(75% at 50% 50%)", scale: 1 }
      : kind === "shutter"
        ? { clipPath: "inset(0 0% 0 0%)" }
        : { rotateY: 0, x: 0, opacity: 1 };
  return (
    <motion.div
      className={className}
      inert={!present}
      aria-hidden={!present || undefined}
      data-narrative-scene={present ? "current" : "outgoing"}
      style={{
        gridArea: "1 / 1",
        minWidth: 0,
        transformOrigin: direction > 0 ? "left center" : "right center",
      }}
      initial={reduced ? false : enter}
      animate={visible}
      exit={
        reduced ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.2 } }
      }
      transition={{ duration: reduced ? 0 : STORY_DURATION, ease: STORY_EASE }}
    >
      {children}
    </motion.div>
  );
}

export function SceneSwap({
  scene,
  kind,
  direction = 1,
  className,
  slotClassName = "",
  children,
}: {
  scene: string | number;
  kind: SceneKind;
  direction?: number;
  className?: string;
  slotClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={`narrative-scene-slot ${slotClassName}`}>
      <AnimatePresence initial={false}>
        <ScenePanel
          key={scene}
          kind={kind}
          direction={direction}
          className={className}
        >
          {children}
        </ScenePanel>
      </AnimatePresence>
    </div>
  );
}

/** Different editorial entrances for people, steps, and printed data. */
export function EditorialPanel({
  children,
  className,
  style,
  index = 0,
  kind = "print",
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  index?: number;
  kind?: "print" | "portrait" | "fold";
}) {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null);
  const inView = useInView(frame, { once: false, amount: 0.01 });
  const hidden =
    kind === "portrait"
      ? { clipPath: "inset(50% 0 50% 0)", rotate: index % 2 ? 3 : -3 }
      : kind === "fold"
        ? { rotateX: -28, opacity: 1 }
        : { clipPath: "inset(0 100% 0 0)" };
  return (
    <div ref={frame} className="narrative-panel-wrap">
      <motion.div
        className={className}
        style={{ ...style, transformOrigin: "center top", perspective: 1000 }}
        initial={reduced ? false : hidden}
        animate={
          inView || reduced
            ? {
                clipPath: "inset(0 0% 0 0)",
                rotate: 0,
                rotateX: 0,
                opacity: 1,
              }
            : hidden
        }
        transition={{
          duration: reduced ? 0 : 0.85,
          delay: Math.min(index * 0.07, 0.28),
          ease: STORY_EASE,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
