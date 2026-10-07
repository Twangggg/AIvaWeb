"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "./game-toolbar.css";

interface GameFullscreenContextValue {
  isFullscreen: boolean;
  isVirtualLandscape: boolean;
  isDeviceLandscape: boolean;
  isMobile: boolean;
  onBack?: () => void;
  toggleFullscreen: () => void;
  toggleRotate: () => void;
  exitFullscreen: () => void;
}

const GameFullscreenContext = createContext<GameFullscreenContextValue | null>(
  null
);

export function useGameFullscreen() {
  return useContext(GameFullscreenContext);
}

export function FullscreenToggleBtn({ className }: { className?: string }) {
  const ctx = useGameFullscreen();
  if (!ctx) return null;
  const { isFullscreen, toggleFullscreen } = ctx;

  return (
    <button
      type="button"
      onClick={toggleFullscreen}
      className={
        className ||
        "game-toolbar-button inline-flex h-11 w-11 items-center justify-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap shrink-0"
      }
      aria-label={isFullscreen ? "Thu nhỏ màn hình" : "Mở toàn màn hình"}
      title={isFullscreen ? "Thu nhỏ màn hình (Esc)" : "Mở toàn màn hình"}
    >
      <span className="material-symbols-outlined text-base">
        {isFullscreen ? "fullscreen_exit" : "fullscreen"}
      </span>
      <span className="game-toolbar-button-label">
        {isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
      </span>
    </button>
  );
}

export function RotateToggleBtn({ className }: { className?: string }) {
  const ctx = useGameFullscreen();
  if (!ctx) return null;
  const { isFullscreen, isMobile, isDeviceLandscape, toggleRotate } = ctx;

  if (!isFullscreen || !isMobile || isDeviceLandscape) return null;

  return (
    <button
      type="button"
      onClick={toggleRotate}
      className={
        className ||
        "inline-flex h-8 sm:h-9 items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 px-2.5 sm:px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white active:scale-95 whitespace-nowrap shrink-0"
      }
      title="Xoay hướng hiển thị ngang/dọc"
    >
      <span className="material-symbols-outlined text-sm sm:text-base">
        screen_rotation
      </span>
      <span className="hidden sm:inline text-[11px]">Xoay</span>
    </button>
  );
}

export interface GameHeaderBarProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onBack?: () => void;
  onReset?: () => void;
  stats?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function GameHeaderBar({
  title,
  subtitle,
  icon = "sports_esports",
  onBack: onBackProp,
  onReset,
  stats,
  actions,
  className,
}: GameHeaderBarProps) {
  const ctx = useGameFullscreen();
  const onBack = onBackProp || ctx?.onBack;

  return (
    <header
      className={
        className ||
        "game-toolbar w-full rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm p-2.5 sm:px-4 sm:py-3 space-y-2 sm:space-y-0"
      }
    >
      {/* Identity and controls share a row when the game container has room */}
      <div className="flex flex-wrap items-center justify-between gap-2 min-w-0">
        {/* Identity can wrap independently of the controls. */}
        <div className="flex flex-[1_1_230px] items-center gap-2 sm:gap-2.5 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition shadow-sm shrink-0"
              aria-label="Quay lại danh sách trò chơi"
              title="Quay lại danh sách trò chơi"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">
                arrow_back
              </span>
            </button>
          )}
          <div className="game-toolbar-icon flex h-9 w-9 items-center justify-center rounded-xl sm:rounded-2xl bg-[var(--ocean-alpha)] text-[var(--ocean)] shrink-0 border border-[var(--ocean)]/30">
            <span className="material-symbols-outlined text-base sm:text-xl">
              {icon}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white break-words tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed break-words">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Controls wrap within the game container, including fullscreen. */}
        <div className="game-toolbar-actions flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 min-w-0 max-w-full">
          {actions}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="game-toolbar-button inline-flex h-11 w-11 items-center justify-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white active:scale-95 whitespace-nowrap shrink-0"
              aria-label="Chơi lại từ đầu"
              title="Chơi lại từ đầu"
            >
              <span className="material-symbols-outlined text-base">
                replay
              </span>
              <span className="game-toolbar-button-label">Chơi lại</span>
            </button>
          )}
          <FullscreenToggleBtn />
          <RotateToggleBtn />
        </div>
      </div>

      {stats && (
        <div className="game-toolbar-stats min-w-0 border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-2 text-xs">
          {stats}
        </div>
      )}
    </header>
  );
}

interface GameFullscreenWrapperProps {
  onBack?: () => void;
  children: React.ReactNode;
}

export function GameFullscreenWrapper({
  onBack,
  children,
}: GameFullscreenWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVirtualLandscape, setIsVirtualLandscape] = useState(false);
  const [isDeviceLandscape, setIsDeviceLandscape] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Sync orientation & device type
  useEffect(() => {
    const updateOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isTouch = window.matchMedia("(max-width: 1024px)").matches;
      setIsDeviceLandscape(isLandscape);
      setIsMobile(isTouch);

      if (isLandscape) {
        setIsVirtualLandscape(false);
      }
    };

    updateOrientation();
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
    };
  }, []);

  // Listen to native fullscreen changes
  useEffect(() => {
    const onFullscreenChange = () => {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
      };
      const active = Boolean(
        doc.fullscreenElement || doc.webkitFullscreenElement
      );
      if (!active && isFullscreen) {
        setIsFullscreen(false);
        setIsVirtualLandscape(false);
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFullscreenChange
      );
    };
  }, [isFullscreen]);

  const handleExitFullscreen = useCallback(async () => {
    setIsFullscreen(false);
    setIsVirtualLandscape(false);

    try {
      const doc = document as unknown as {
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => Promise<void>;
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
      };
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        const efs = doc.exitFullscreen || doc.webkitExitFullscreen;
        if (efs) {
          await efs.call(document);
        }
      }
    } catch {
      // Ignore
    }

    try {
      const orientation = window.screen?.orientation as unknown as {
        unlock?: () => void;
      };
      if (orientation && typeof orientation.unlock === "function") {
        orientation.unlock();
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleEnterFullscreen = useCallback(async () => {
    setIsFullscreen(true);

    const isLandscape = window.innerWidth > window.innerHeight;
    if (!isLandscape) {
      setIsVirtualLandscape(true);
    }

    try {
      const el = containerRef.current || document.documentElement;
      const rfs =
        el.requestFullscreen ||
        (el as unknown as { webkitRequestFullscreen?: () => Promise<void> })
          .webkitRequestFullscreen;
      if (rfs) {
        await rfs.call(el);
      }
    } catch {
      // Browser restricted fullscreen request
    }

    try {
      const orientation = window.screen?.orientation as unknown as {
        lock?: (type: string) => Promise<void>;
      };
      if (orientation && typeof orientation.lock === "function") {
        await orientation.lock("landscape");
      }
    } catch {
      // Orientation lock not supported
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      void handleExitFullscreen();
    } else {
      void handleEnterFullscreen();
    }
  }, [isFullscreen, handleEnterFullscreen, handleExitFullscreen]);

  // Handle body overflow lock when in fullscreen mode
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isFullscreen]);

  // Listen for Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        void handleExitFullscreen();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFullscreen, handleExitFullscreen]);

  const toggleRotate = useCallback(() => {
    setIsVirtualLandscape((prev) => !prev);
  }, []);

  const contextValue: GameFullscreenContextValue = {
    isFullscreen,
    isVirtualLandscape,
    isDeviceLandscape,
    isMobile,
    onBack,
    toggleFullscreen,
    toggleRotate,
    exitFullscreen: handleExitFullscreen,
  };

  return (
    <GameFullscreenContext.Provider value={contextValue}>
      <div ref={containerRef} className="w-full">
        {/* FULLSCREEN OVERLAY MODE (Theme-aware for Light & Dark) */}
        {isFullscreen ? (
          <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-start bg-[#f6f8fc] dark:bg-[#070d18] text-slate-900 dark:text-white select-none overflow-hidden p-0 transition-colors duration-200">
            {/* Ambient Lighting FX (Theme adaptive) */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.08),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.15),transparent_60%)]" />

            <div
              className={`flex flex-col w-full h-full ${
                isVirtualLandscape && !isDeviceLandscape
                  ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-y-auto"
                  : "relative overflow-y-auto"
              }`}
              style={
                isVirtualLandscape && !isDeviceLandscape
                  ? {
                      width: "100svh",
                      height: "100svw",
                      transform: "translate(-50%, -50%) rotate(90deg)",
                    }
                  : undefined
              }
            >
              {/* Main Game Viewport - Responsive Container */}
              <div className="w-full min-h-full flex flex-col items-center justify-start p-2 sm:p-3 md:p-4 max-w-4xl mx-auto">
                <div className="w-full flex flex-col items-center">
                  {children}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EMBEDDED MODE */
          <div className="w-full">{children}</div>
        )}
      </div>
    </GameFullscreenContext.Provider>
  );
}
