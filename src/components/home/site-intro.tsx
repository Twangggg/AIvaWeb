"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/provider";

export const INTRO_STORAGE_KEY = "aiva_intro_seen";
export const INTRO_COMPLETE_EVENT = "aiva-intro-complete";
export const INTRO_SHOW_EVENT = "aiva-intro-show";

const SPOT_RADIUS = 168;

type Phase = "spotlight" | "exit";

interface SiteIntroProps {
  onComplete: () => void;
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
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    /* storage unavailable */
  }
}

export function clearIntroSeen(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(INTRO_STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

function isLikelyBot() {
  const ua = navigator.userAgent.toLowerCase();
  return (
    navigator.webdriver === true ||
    /(bot|crawler|spider|headless|scraper|googlebot|bingbot|yandex|baiduspider|duckduckgo|slurp|mediapartners|adsbot|preview)/.test(
      ua,
    )
  );
}

function shouldSkipIntro() {
  if (typeof window === "undefined") return true;
  if (isLikelyBot()) return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return true;
  return isIntroSeen();
}

function SpotlightPhase({
  onDiscover,
  onSkip,
  discoverLabel,
  brandLabel,
  skipLabel,
}: {
  onDiscover: () => void;
  onSkip: () => void;
  discoverLabel: string;
  brandLabel: string;
  skipLabel: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const [spot, setSpot] = useState(() => ({
    x: typeof window === "undefined" ? 0 : window.innerWidth / 2,
    y: typeof window === "undefined" ? 0 : window.innerHeight / 2,
  }));
  const [btnNear, setBtnNear] = useState(false);

  useEffect(() => {
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    posRef.current = { x, y };
    sceneRef.current?.setAttribute("aria-hidden", "false");

    const updateNear = (px: number, py: number) => {
      const btn = btnRef.current;
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setBtnNear(Math.hypot(px - cx, py - cy) < SPOT_RADIUS * 0.9);
    };

    const onPointer = (e: PointerEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current !== undefined) return;
      rafRef.current = window.requestAnimationFrame(() => {
        const { x: px, y: py } = posRef.current;
        setSpot({ x: px, y: py });
        updateNear(px, py);
        rafRef.current = undefined;
      });
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    updateNear(x, y);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      if (rafRef.current !== undefined)
        window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={sceneRef} className="site-intro-spotlight-scene">
        <div className="site-intro-bg" />
        <p className="site-intro-spotlight-brand">
          <span className="text-shimmer">{brandLabel}</span>
        </p>
        <button
          ref={btnRef}
          type="button"
          className={`site-intro-discover-btn ${btnNear ? "is-near" : ""}`}
          style={{ pointerEvents: btnNear ? "auto" : "none" }}
          tabIndex={btnNear ? 0 : -1}
          onClick={onDiscover}
        >
          {discoverLabel}
        </button>
        <button
          type="button"
          className="site-intro-skip-btn"
          tabIndex={0}
          onClick={onSkip}
        >
          {skipLabel}
        </button>
      </div>
      <div
        className="site-intro-spotlight-veil"
        style={
          {
            "--spot-x": `${spot.x}px`,
            "--spot-y": `${spot.y}px`,
            "--spot-r": `${SPOT_RADIUS}px`,
          } as React.CSSProperties
        }
        aria-hidden
      />
    </>
  );
}

export function SiteIntro({ onComplete }: SiteIntroProps) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("spotlight");

  const finish = useCallback(() => {
    setPhase("exit");
    markIntroSeen();
    window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
    window.setTimeout(onComplete, 480);
  }, [onComplete]);

  const skipForever = useCallback(() => {
    markIntroSeen();
    finish();
  }, [finish]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase !== "spotlight") return;
    const timer = window.setTimeout(finish, 12000);
    return () => window.clearTimeout(timer);
  }, [phase, finish]);

  return (
    <div
      className={`site-intro ${phase === "exit" ? "site-intro-exit" : ""} ${phase === "spotlight" ? "site-intro-spotlight-mode" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={t.introAriaLabel}
    >
      {phase === "spotlight" && (
        <SpotlightPhase
          brandLabel={t.introBrand}
          discoverLabel={t.introDiscover}
          skipLabel={t.introSkip}
          onDiscover={finish}
          onSkip={skipForever}
        />
      )}
    </div>
  );
}

export function useSiteIntro() {
  const eligible = useSyncExternalStore(
    () => () => {},
    () => !shouldSkipIntro(),
    () => false
  );
  const [pointerSeen, setPointerSeen] = useState(false);
  const [seen, setSeen] = useState(() => isIntroSeen());
  const [requested, setRequested] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!eligible) return;
    const onHumanSignal = () => setPointerSeen(true);
    window.addEventListener("pointermove", onHumanSignal, { passive: true });
    window.addEventListener("pointerdown", onHumanSignal, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onHumanSignal);
      window.removeEventListener("pointerdown", onHumanSignal);
    };
  }, [eligible]);

  useEffect(() => {
    const onShow = () => {
      clearIntroSeen();
      setSeen(false);
      setRequested(true);
    };
    window.addEventListener(INTRO_SHOW_EVENT, onShow);
    return () => window.removeEventListener(INTRO_SHOW_EVENT, onShow);
  }, []);

  const completeIntro = useCallback(() => {
    setDismissed(true);
  }, []);

  const showIntro =
    (requested || (eligible && pointerSeen && !seen)) && !dismissed;

  return { showIntro, completeIntro };
}

export function useHomeIntroBlocking() {
  const pathname = usePathname();
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return true;
    if (window.location.pathname !== "/") return true;
    return isIntroSeen();
  });

  useEffect(() => {
    const sync = () => {
      setReady(pathname !== "/" || isIntroSeen());
    };
    sync();
    window.addEventListener(INTRO_COMPLETE_EVENT, sync);
    return () => window.removeEventListener(INTRO_COMPLETE_EVENT, sync);
  }, [pathname]);

  return pathname === "/" && !ready;
}
