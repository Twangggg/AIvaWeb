"use client";

import { useServerInsertedHTML } from "next/navigation";

/** Blocking theme bootstrap injected outside the React tree (avoids React 19 script warning). */
const THEME_INIT = `try{document.documentElement.classList.add(localStorage.getItem("theme")||"dark");if(window.matchMedia("(pointer: fine)").matches&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("custom-cursor-active");document.documentElement.style.cursor="none"}}catch(e){}`;

export function ThemeInitScript() {
  useServerInsertedHTML(() => (
    <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
  ));

  return null;
}
