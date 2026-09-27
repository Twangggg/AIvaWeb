---
name: framer-motion-aiva
description: >-
  Use this skill when the user asks to add animations, transitions, scroll-driven
  effects, or motion design to AIVAWeb components. Covers Framer Motion patterns,
  variants, scroll animations, and the design principles learned from framer.com/skills.
---

# Framer Motion — AIVAWeb Animation Guide

Học từ **framer.com/skills** — Framer dùng skill system để agents hiểu design system và animate đúng chuẩn.

---

## Framer Skills Concept (framer.com/skills)

Framer Skills = **reusable prompt workflows** cho AI agent:

- Agent biết design system rules (màu, spacing, typography)
- Agent biết animation conventions của project
- Skills có thể share giữa team

**AIVAWeb đã có tương đương**: `.agents/skills/design-system/SKILL.md`

---

## Core Animation Tokens của AIVAWeb

Dùng các giá trị này khi animate, không hardcode:

```ts
// Easing chuẩn (học từ framer.com)
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
const EASE_IN_OUT = [0.76, 0, 0.24, 1];

// Duration
const DUR_FAST = 0.35; // micro interactions
const DUR_MID = 0.55; // section transitions
const DUR_SLOW = 0.85; // hero, full-page reveals

// Colors (từ CSS variables)
// var(--accent) = #eab308 (amber/gold)
// var(--glass-bg), var(--glass-border)
// var(--text-on-glass), var(--text-dim)
```

---

## Framer Motion Patterns

### Fade + Slide Up (text reveal)

```tsx
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

<motion.h1 variants={fadeUp} initial="hidden" animate="visible">
  AIVA
</motion.h1>;
```

### Stagger children

```tsx
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

<motion.ul variants={container} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.li key={item} variants={fadeUp}>
      {item}
    </motion.li>
  ))}
</motion.ul>;
```

### Scroll-driven (useScroll + useTransform)

```tsx
import { useScroll, useTransform, motion } from "framer-motion";

export function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <div ref={ref}>
      <motion.div style={{ y }}>{/* content */}</motion.div>
    </div>
  );
}
```

### Viewport reveal (IntersectionObserver via whileInView)

```tsx
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
>
```

### Glass card hover

```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
>
```

---

## Layout Animations

```tsx
// Animates layout changes (height, width, position)
<motion.div layout layoutId="glasses-card">
  {/* Khi component move giữa positions, Framer animate tự động */}
</motion.div>
```

---

## Page Transitions (Next.js App Router)

```tsx
// src/components/providers/page-transition.tsx
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

---

## Framer Skills Principles (từ framer.com/skills)

Framer tổ chức skills theo các domain:

1. **Design System Skill** — màu sắc, typography, spacing rules
2. **Content Skill** — tone of voice, content guidelines
3. **SEO Skill** — meta, OG, structured data rules
4. **Animation Skill** — easing, timing, interaction patterns

**AIVAWeb skills mapping:**

| Framer Skill  | AIVAWeb equivalent                                      |
| ------------- | ------------------------------------------------------- |
| Design System | `.agents/skills/design-system/SKILL.md`                 |
| Animation     | `.agents/skills/framer-motion-aiva/SKILL.md` (file này) |
| Smooth Scroll | `.agents/skills/lenis-scroll/SKILL.md`                  |

---

## ⚠️ Rules

- **Không dùng `framer-motion` bên trong R3F Canvas** — dùng `useFrame` thay thế
- Luôn dùng `viewport={{ once: true }}` để avoid re-animation khi scroll back
- Không animate `width`/`height` trực tiếp — dùng `scaleX`/`scaleY` hoặc `layout`
- `whileHover` cần `touch-action: none` trên mobile nếu có drag
