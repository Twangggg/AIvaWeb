"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type FpDir = 1 | -1;

/** Sync React scene index + scroll direction with fullpage `fp-scene` events. */
export function useFpSceneSync(sectionId: string, sceneCount: number, enabled = true) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<FpDir>(1);
  const stepRef = useRef(0);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el || !enabled) return;

    el.dataset.fpScenes = String(sceneCount);
    if (el.dataset.fpScene == null) el.dataset.fpScene = "0";

    const onScene = (e: Event) => {
      const detail = (e as CustomEvent<{ step: number; dir?: number }>).detail;
      if (typeof detail?.step !== "number") return;
      stepRef.current = detail.step;
      setStep(detail.step);
      if (detail.dir === 1 || detail.dir === -1) setDir(detail.dir);
    };

    el.addEventListener("fp-scene", onScene);
    return () => {
      el.removeEventListener("fp-scene", onScene);
    };
  }, [sectionId, sceneCount, enabled]);

  const setScene = useCallback(
    (next: number, nextDir?: FpDir) => {
      const el = document.getElementById(sectionId);
      const clamped = Math.max(0, Math.min(sceneCount - 1, next));
      const resolved: FpDir =
        nextDir ?? (clamped >= stepRef.current ? 1 : -1);
      stepRef.current = clamped;
      setStep(clamped);
      setDir(resolved);
      if (el) {
        el.dataset.fpScene = String(clamped);
        el.dataset.fpScenes = String(sceneCount);
        el.dataset.fpSceneDir = String(resolved);
      }
    },
    [sectionId, sceneCount]
  );

  return { step, dir, setScene } as const;
}
