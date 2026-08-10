"use client";

import { useEffect, useState } from "react";

/**
 * True while a fullpage section is active / entering.
 * Re-triggers every time the user scrolls back to the section.
 */
export function useFpSectionEnter(sectionId: string) {
  const [entered, setEntered] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;

    const sync = () => {
      const transit = el.dataset.fpTransit ?? "";
      const active = el.dataset.fpActive === "true";
      const entering = transit.startsWith("enter");
      setEntered(active || entering);
      const d = Number(el.dataset.fpSceneDir || document.documentElement.dataset.fpDir || 1);
      if (d === 1 || d === -1) setDir(d);
    };

    sync();

    const mo = new MutationObserver(sync);
    mo.observe(el, { attributes: true, attributeFilter: ["data-fp-active", "data-fp-transit", "data-fp-scene-dir"] });

    const onSection = (e: Event) => {
      const detail = (e as CustomEvent<{ id?: string; dir?: number }>).detail;
      if (detail?.id === sectionId) {
        if (detail.dir === 1 || detail.dir === -1) setDir(detail.dir);
        setEntered(true);
      } else if (detail?.id) {
        setEntered(false);
      }
    };
    window.addEventListener("fp-section", onSection);

    return () => {
      mo.disconnect();
      window.removeEventListener("fp-section", onSection);
    };
  }, [sectionId]);

  return { entered, dir } as const;
}
