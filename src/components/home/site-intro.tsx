"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Mascot } from "page-mascot";
import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";
import { useFloatingSurface } from "@/hooks/use-floating-surface";

export const INTRO_STORAGE_KEY = "aiva_intro_seen";
export const INTRO_COMPLETE_EVENT = "aiva-intro-complete";
export const INTRO_SHOW_EVENT = "aiva-intro-show";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const DUR_MID = 0.55;
const MIN_DISPLAY_MS = 1400;
const MAX_WAIT_MS = 8000;
let introPending = true;
const listeners = new Set<() => void>();
function setIntroPending(pending: boolean) {
  introPending = pending;
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isIntroSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(INTRO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}
export function markIntroSeen(): void {
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    /* Storage is optional. */
  }
}
export function clearIntroSeen(): void {
  try {
    window.localStorage.removeItem(INTRO_STORAGE_KEY);
  } catch {
    /* Storage is optional. */
  }
}

export function SiteIntro({ onComplete }: { onComplete: () => void }) {
  const { locale } = useI18n();
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const en = locale === "en";
  const {
    setReference: setGreetingReference,
    setFloating: setGreetingFloating,
    floatingStyles: greetingStyles,
    isPositioned: greetingPositioned,
  } = useFloatingSurface({
    open: true,
    placement: "top-end",
    gap: -28,
    animationFrame: true,
    strategy: "absolute",
  });

  useEffect(() => {
    let active = true;
    const started = performance.now();
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    let minimumTimer: ReturnType<typeof setTimeout> | undefined;
    let timeoutTimer: ReturnType<typeof setTimeout> | undefined;
    let loadListener: (() => void) | undefined;
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else {
        loadListener = resolve;
        window.addEventListener("load", loadListener, { once: true });
      }
    });
    const heroImages = Array.from(
      document.querySelectorAll<HTMLImageElement>("#hero img")
    );
    const checkpoints = [
      loaded,
      document.fonts.ready,
      Promise.allSettled(heroImages.map((image) => image.decode())),
    ];
    const ready = Promise.allSettled(
      checkpoints.map(async (checkpoint) => {
        try {
          await checkpoint;
        } finally {
          if (active)
            setProgress((value) => Math.min(1, value + 1 / checkpoints.length));
        }
      })
    );
    const timeout = new Promise<void>((resolve) => {
      timeoutTimer = setTimeout(resolve, MAX_WAIT_MS);
    });
    void Promise.race([ready, timeout]).then(() => {
      if (!active) return;
      minimumTimer = setTimeout(
        () => {
          if (active) setExiting(true);
        },
        Math.max(0, MIN_DISPLAY_MS - (performance.now() - started))
      );
    });
    return () => {
      active = false;
      clearTimeout(minimumTimer);
      clearTimeout(timeoutTimer);
      if (loadListener) window.removeEventListener("load", loadListener);
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, []);

  return (
    <motion.div
      className="home-loading-intro"
      data-testid="home-loading-intro"
      role="dialog"
      aria-modal="true"
      aria-label={en ? "Welcome to AIVA" : "Chào mừng đến với AIVA"}
      onWheelCapture={(event) => event.stopPropagation()}
      onTouchMoveCapture={(event) => event.stopPropagation()}
      onKeyDownCapture={(event) => event.stopPropagation()}
      initial={false}
      animate={
        exiting
          ? { clipPath: "circle(0% at 50% 42%)", opacity: reduceMotion ? 0 : 1 }
          : { clipPath: "circle(150% at 50% 42%)", opacity: 1 }
      }
      transition={{
        duration: reduceMotion ? 0 : 0.85,
        ease: [0.76, 0, 0.24, 1],
      }}
      onAnimationComplete={() => {
        if (exiting) onComplete();
      }}
    >
      <div className="home-loading-atmosphere" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`home-loading-blob home-loading-blob-${index}`}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, index % 2 ? -45 : 45, 0],
                    y: [0, index % 2 ? 35 : -35, 0],
                    rotate: [0, 30, 0],
                    scale: [1, 1.12, 1],
                  }
            }
            transition={{
              duration: 6 + index * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        {["✦", "✿", "✧", "✦", "✿", "✧"].map((shape, index) => (
          <motion.span
            key={index}
            className={`home-loading-confetti home-loading-confetti-${index}`}
            animate={
              reduceMotion
                ? undefined
                : {
                    y: [0, -18, 0],
                    rotate: [0, index % 2 ? -25 : 25, 0],
                  }
            }
            transition={{
              duration: 3 + index * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.12,
            }}
          >
            {shape}
          </motion.span>
        ))}
      </div>
      <div className="home-loading-topline" aria-hidden="true">
        <span>
          AIVA <span>✦</span>
        </span>
        <span>{en ? "A little world of wonder" : "Một thế giới diệu kỳ"}</span>
      </div>
      <motion.div
        className="home-loading-content"
        animate={
          exiting && !reduceMotion ? { scale: 0.9, y: -16 } : { scale: 1, y: 0 }
        }
        transition={{ duration: DUR_MID, ease: EASE_OUT_EXPO }}
      >
        <div ref={setGreetingReference} className="home-loading-stage">
          <motion.div
            className="home-loading-orbit"
            aria-hidden="true"
            animate={reduceMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            <span />
            <span />
            <span />
          </motion.div>
          <motion.div
            className="home-loading-planet"
            aria-hidden="true"
            initial={reduceMotion ? false : { scale: 0.8, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.85, ease: EASE_OUT_EXPO }}
          />
          <motion.div
            className="home-loading-mascot"
            initial={reduceMotion ? false : { scale: 0.88, y: 12 }}
            animate={
              reduceMotion
                ? { scale: 1, y: 0 }
                : { scale: 1, y: [12, -7, 0, -7, 0] }
            }
            transition={{
              scale: { duration: DUR_MID, ease: EASE_OUT_EXPO },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Mascot
              directions="/mascots/frog-2d-arms-down-directions.png"
              reactions="/mascots/frog-2d-arms-down-reactions.png"
              size={180}
              label="AIVA"
              className="!h-full !w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white"
            />
          </motion.div>
          <div
            ref={setGreetingFloating}
            style={{
              ...greetingStyles,
              zIndex: 2,
              visibility: greetingPositioned ? "visible" : "hidden",
            }}
          >
            <motion.span
              className="home-loading-hello"
              initial={reduceMotion ? false : { rotate: -8, scale: 0.8 }}
              animate={
                reduceMotion ? undefined : { rotate: [-8, -3, -8], scale: 1 }
              }
              transition={{
                rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: DUR_MID },
              }}
            >
              {en ? "Hey, friend!" : "Chào bạn nha!"}{" "}
              <span aria-hidden="true">✦</span>
            </motion.span>
          </div>
        </div>
        <h1 className="home-loading-wordmark" aria-label="AIVA">
          {Array.from("AIVA").map((letter, index) => (
            <motion.span
              key={index}
              aria-hidden="true"
              initial={
                reduceMotion
                  ? false
                  : { y: 20, rotate: index % 2 ? 7 : -7, scale: 0.9 }
              }
              animate={
                reduceMotion
                  ? { y: 0 }
                  : { y: [20, -5, 0], rotate: 0, scale: 1 }
              }
              transition={{
                duration: 0.85,
                delay: index * 0.09,
                ease: EASE_OUT_EXPO,
              }}
            >
              <motion.span
                className="inline-block"
                initial={false}
                animate={
                  reduceMotion
                    ? { y: 0, rotate: 0, scale: 1 }
                    : {
                        y: [0, -12, 0, 4, 0],
                        rotate: [
                          0,
                          index % 2 ? 5 : -5,
                          0,
                          index % 2 ? -2 : 2,
                          0,
                        ],
                        scale: [1, 1.07, 1, 0.98, 1],
                      }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 2.2,
                        delay: 0.6 + index * 0.14,
                        repeat: Infinity,
                        repeatDelay: 0.15,
                        ease: "easeInOut",
                      }
                }
                style={{ color: "inherit", transformOrigin: "50% 80%" }}
              >
                {letter}
              </motion.span>
            </motion.span>
          ))}
        </h1>
        <p className="home-loading-tagline">
          {en
            ? "Little friend. Big adventures."
            : "Bạn nhỏ thôi. Phiêu lưu thật lớn."}
        </p>
        <div className="home-loading-status">
          <span className="home-loading-status-dots" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <motion.i
                key={index}
                animate={
                  reduceMotion
                    ? undefined
                    : { y: [0, -4, 0], opacity: [0.5, 1, 0.5] }
                }
                transition={{
                  duration: 0.85,
                  repeat: Infinity,
                  delay: index * 0.14,
                }}
              />
            ))}
          </span>
          <p role="status">
            {en
              ? "Getting our little world ready…"
              : "Đang mở cánh cửa diệu kỳ…"}
          </p>
        </div>
        <div className="home-loading-track" aria-hidden="true">
          <motion.div
            className="home-loading-progress"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{
              duration: reduceMotion ? 0 : 0.35,
              ease: EASE_OUT_EXPO,
            }}
          />
        </div>
        <button
          type="button"
          className="home-loading-skip"
          onClick={() => setExiting(true)}
        >
          {en ? "Enter the website" : "Vào trang ngay"}{" "}
          <span aria-hidden="true">↗</span>
        </button>
      </motion.div>
      <p className="home-loading-bottomline" aria-hidden="true">
        {en ? "PLAY · WONDER · GROW" : "VUI CHƠI · KHÁM PHÁ · LỚN LÊN"}
      </p>
    </motion.div>
  );
}

export function useSiteIntro() {
  const [showIntro, setShowIntro] = useState(true);
  useEffect(() => {
    setIntroPending(true);
    const replay = () => {
      setIntroPending(true);
      setShowIntro(true);
    };
    window.addEventListener(INTRO_SHOW_EVENT, replay);
    return () => window.removeEventListener(INTRO_SHOW_EVENT, replay);
  }, []);
  const completeIntro = useCallback(() => {
    setShowIntro(false);
    setIntroPending(false);
    markIntroSeen();
    window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
  }, []);
  return { showIntro, completeIntro };
}

export function useHomeIntroBlocking() {
  const pathname = usePathname();
  const pending = useSyncExternalStore(
    subscribe,
    () => introPending,
    () => true
  );
  return pathname === "/" && pending;
}
