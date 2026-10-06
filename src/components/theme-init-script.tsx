"use client";

import { useServerInsertedHTML } from "next/navigation";

/** Blocking theme bootstrap injected outside the React tree (avoids React 19 script warning). */
const THEME_INIT = `try{document.documentElement.classList.add(localStorage.getItem("theme")||"light")}catch(e){}`;

export function ThemeInitScript() {
  useServerInsertedHTML(() => (
    <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
  ));

  return null;
}
