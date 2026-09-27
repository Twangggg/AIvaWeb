---
name: lenis-smooth-scroll
description: >-
  Use this skill when the user asks to add smooth scrolling, improve scroll
  feel, implement scroll-driven animations, or integrate Lenis into the AIVAWeb
  project. Covers installation, Next.js App Router setup, scroll-driven
  animation patterns, and integration with the existing fullpage scroll system.
---

# Lenis Smooth Scroll — AIVAWeb Integration Guide

**Lenis** (by darkroom.engineering) là thư viện smooth scroll nhẹ (~4KB), performant, open-source. Dùng bởi Netflix, Lando Norris, Animate và hàng trăm agency lớn.

---

## Key Concepts

- **Butter-smooth**: Interpolates native scroll position → tạo cảm giác nhẹ nhàng, không lag
- **Scroll-driven animations**: `lenis.on('scroll', ...)` → nhận `progress`, `velocity`, `direction` realtime
- **Không thay thế native scroll** — chỉ làm mượt, vẫn accessible/keyboard-friendly
- **Tích hợp với GSAP ScrollTrigger**, Framer Motion, hoặc custom RAF

---

## Installation

```bash
npm install lenis
```

Package đã có sẵn trong AIVAWeb nếu đã cài. Kiểm tra:

```bash
cat package.json | grep lenis
```

---

## Next.js App Router Setup (AIVAWeb pattern)

### 1. Tạo Provider

```tsx
// src/components/providers/lenis-provider.tsx
"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef } from "react";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
```

### 2. Wrap layout

```tsx
// src/app/layout.tsx — thêm LenisProvider bọc ngoài {children}
import { LenisProvider } from "@/components/providers/lenis-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
```

---

## ⚠️ Conflict với useFullpageScroll

AIVAWeb dùng custom `useFullpageScroll` (hook tại `src/hooks/use-fullpage-scroll.ts`) intercept `wheel` events với `preventDefault()`. **Nếu bật Lenis song song sẽ conflict.**

**Chiến lược tích hợp:**

| Trường hợp                                    | Giải pháp                                                       |
| --------------------------------------------- | --------------------------------------------------------------- |
| Trang có fullpage scroll (homepage)           | **Không dùng Lenis** — giữ nguyên hook hiện tại                 |
| Trang không có fullpage (news, play, product) | Dùng Lenis bình thường                                          |
| Muốn dùng Lenis thay thế fullpage scroll      | Rebuild fullpage logic với `lenis.scrollTo()` + scroll snapping |

---

## Scroll-driven Animation Pattern

```tsx
"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

export function useScrollAnimation(
  ref: React.RefObject<HTMLElement>,
  onScroll: (progress: number) => void
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const lenis = new Lenis({ wrapper: el, content: el });

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      onScroll(progress);
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, [ref, onScroll]);
}
```

---

## scrollTo API

```ts
lenis.scrollTo("#target-section", {
  offset: -80, // offset từ target
  duration: 1.5,
  easing: (t) => 1 - Math.pow(1 - t, 4),
  onComplete: () => console.log("arrived"),
});

// Scroll to top
lenis.scrollTo(0, { immediate: true });
```

---

## Horizontal Scroll

```ts
const lenis = new Lenis({
  orientation: "horizontal",
  gestureOrientation: "both",
});
```

---

## Scroll Snapping (thay thế fullpage)

```ts
const lenis = new Lenis({
  duration: 1.0,
  syncTouch: true,
});

// Snap tới section sau mỗi scroll
lenis.on("scroll", ({ progress, velocity, direction }) => {
  if (Math.abs(velocity) > 0.5) {
    const sections = document.querySelectorAll("[data-snap]");
    // implement snap logic
  }
});
```

---

## Performance Notes

- `duration` ngắn (~0.8–1.2) = nhẹ hơn, phù hợp mobile
- `smoothTouch: false` (default) = không mượt trên touch → tốt vì iOS đã smooth native
- Dùng `lenis.stop()` / `lenis.start()` khi mở modal để tránh scroll conflict
- Pair với `will-change: transform` trên các element animate

---

## Framer Skills (framer.com/skills) Concept

Framer Skills là hệ thống tương tự AGY Skills — người dùng định nghĩa "skills" (prompt templates + rules) cho Framer AI agent:

- Mỗi skill = tập rules về design system, naming, layout
- Skill được apply khi prompt ("Use my brand skill")
- Lưu tại project hoặc global

**Tương đương trong AGY**: file `SKILL.md` tại `.agents/skills/<name>/SKILL.md`
