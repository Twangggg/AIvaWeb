"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  glowSize: number;
  baseAlpha: number;
  currentAlpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  colorType: "gold" | "mint" | "sky" | "amber";
  wanderAngle: number;
  wanderSpeed: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

type AtmosphereKey = "dawn" | "meadow" | "twilight" | "sunset";

interface AtmosphereTheme {
  glow1Rgb: [number, number, number];
  glow2Rgb: [number, number, number];
  accentRgb: string;
}

const ATMOSPHERES_LIGHT: Record<AtmosphereKey, AtmosphereTheme> = {
  dawn: {
    glow1Rgb: [255, 214, 87], // warm morning gold
    glow2Rgb: [186, 230, 253], // sky blue
    accentRgb: "255, 190, 45",
  },
  meadow: {
    glow1Rgb: [134, 239, 172], // fresh spring mint
    glow2Rgb: [253, 224, 71], // gentle sunlight
    accentRgb: "74, 222, 128",
  },
  twilight: {
    glow1Rgb: [147, 197, 253], // soft blue glow
    glow2Rgb: [216, 180, 254], // lavender glow
    accentRgb: "129, 140, 248",
  },
  sunset: {
    glow1Rgb: [254, 215, 170], // warm peach
    glow2Rgb: [233, 213, 255], // dusk lilac
    accentRgb: "251, 146, 60",
  },
};

const ATMOSPHERES_DARK: Record<AtmosphereKey, AtmosphereTheme> = {
  dawn: {
    glow1Rgb: [245, 190, 60],
    glow2Rgb: [56, 130, 200],
    accentRgb: "255, 214, 87",
  },
  meadow: {
    glow1Rgb: [52, 211, 153],
    glow2Rgb: [234, 179, 8],
    accentRgb: "110, 231, 183",
  },
  twilight: {
    glow1Rgb: [96, 165, 250],
    glow2Rgb: [168, 85, 247],
    accentRgb: "129, 140, 248",
  },
  sunset: {
    glow1Rgb: [249, 115, 22],
    glow2Rgb: [192, 132, 252],
    accentRgb: "251, 146, 60",
  },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

export function AivaVisionBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;
    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener?.("change", onReducedMotionChange);

    let isDark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId: number;
    let particles: Particle[] = [];
    const ripples: WaterRipple[] = [];

    // Pointer state: purely tracks mouse position for natural fluid wind / light halo
    const pointer = {
      x: -1000,
      y: -1000,
      active: false,
      alpha: 0,
      idleTimer: 0,
    };

    let activeAtmosphereKey: AtmosphereKey = "dawn";
    const currentThemeState = {
      glow1: [...ATMOSPHERES_LIGHT.dawn.glow1Rgb] as [number, number, number],
      glow2: [...ATMOSPHERES_LIGHT.dawn.glow2Rgb] as [number, number, number],
    };

    const updateActiveAtmosphere = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      const expEl = document.getElementById("experience");
      const expRect = expEl?.getBoundingClientRect();
      if (expRect && expRect.top <= vh * 0.7 && expRect.bottom >= vh * 0.2) {
        activeAtmosphereKey = "twilight";
        return;
      }

      const visionEl = document.getElementById("vision");
      const visionRect = visionEl?.getBoundingClientRect();
      if (visionRect && visionRect.top <= vh * 0.7 && visionRect.bottom >= vh * 0.2) {
        activeAtmosphereKey = "twilight";
        return;
      }

      const featuresEl = document.getElementById("features");
      const featuresRect = featuresEl?.getBoundingClientRect();
      if (featuresRect && featuresRect.top <= vh * 0.7 && featuresRect.bottom >= vh * 0.2) {
        activeAtmosphereKey = "twilight";
        return;
      }

      const companionEl = document.getElementById("companion");
      const companionRect = companionEl?.getBoundingClientRect();
      if (companionRect && companionRect.top <= vh * 0.8) {
        activeAtmosphereKey = "sunset";
        return;
      }

      const discoverEl = document.getElementById("discover");
      const discoverRect = discoverEl?.getBoundingClientRect();
      if (discoverEl && discoverRect && discoverRect.top <= vh * 0.8) {
        activeAtmosphereKey = "meadow";
        return;
      }

      if (scrollY < vh * 0.9) {
        activeAtmosphereKey = "dawn";
        return;
      }

      activeAtmosphereKey = "meadow";
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      const targetCount = width < 768 ? 28 : 46;
      if (particles.length === 0 || Math.abs(particles.length - targetCount) > 8) {
        initParticles(targetCount);
      }
    };

    const particleColors: Record<Particle["colorType"], { light: string; dark: string }> = {
      gold: { light: "250, 180, 40", dark: "255, 214, 87" },
      mint: { light: "60, 190, 100", dark: "110, 231, 183" },
      sky: { light: "56, 160, 240", dark: "125, 211, 252" },
      amber: { light: "245, 130, 45", dark: "253, 186, 116" },
    };

    const initParticles = (count: number) => {
      const types: Array<Particle["colorType"]> = [
        "gold",
        "gold",
        "mint",
        "mint",
        "sky",
        "amber",
      ];
      particles = Array.from({ length: count }, () => {
        const size = Math.random() * 2.2 + 2.0;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -Math.random() * 0.4 - 0.12,
          size,
          glowSize: size * (Math.random() * 4 + 4),
          baseAlpha: Math.random() * 0.35 + 0.55,
          currentAlpha: Math.random() * 0.3 + 0.6,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          pulsePhase: Math.random() * Math.PI * 2,
          colorType: types[Math.floor(Math.random() * types.length)],
          wanderAngle: Math.random() * Math.PI * 2,
          wanderSpeed: (Math.random() - 0.5) * 0.035,
        };
      });
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in e && e.touches.length > 0
          ? e.touches[0].clientX
          : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e && e.touches.length > 0
          ? e.touches[0].clientY
          : (e as MouseEvent).clientY;

      pointer.x = clientX;
      pointer.y = clientY;
      pointer.active = true;
      pointer.idleTimer = 160;
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -1000;
      pointer.y = -1000;
    };

    // Organic water ripple on click/tap
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const clientX =
        "touches" in e && e.touches.length > 0
          ? e.touches[0].clientX
          : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e && e.touches.length > 0
          ? e.touches[0].clientY
          : (e as MouseEvent).clientY;

      ripples.push({
        x: clientX,
        y: clientY,
        radius: 10,
        maxRadius: 180,
        alpha: 0.7,
      });

      // Scatter nearby fireflies naturally like startled fish in water
      for (const p of particles) {
        const dx = p.x - clientX;
        const dy = p.y - clientY;
        const dist = Math.hypot(dx, dy);
        if (dist < 180 && dist > 1) {
          const force = (1 - dist / 180) * 3.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          p.currentAlpha = 1.0;
        }
      }
    };

    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("touchstart", onPointerMove, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onPointerDown, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", updateActiveAtmosphere, { passive: true });

    resize();
    updateActiveAtmosphere();

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const targetTheme = isDark
        ? ATMOSPHERES_DARK[activeAtmosphereKey]
        : ATMOSPHERES_LIGHT[activeAtmosphereKey];

      const lerpSpeed = 0.04;
      currentThemeState.glow1 = lerpRgb(
        currentThemeState.glow1,
        targetTheme.glow1Rgb,
        lerpSpeed
      );
      currentThemeState.glow2 = lerpRgb(
        currentThemeState.glow2,
        targetTheme.glow2Rgb,
        lerpSpeed
      );

      ctx.clearRect(0, 0, width, height);

      // 1. Smooth Atmosphere Gradients
      const glow1Grad = ctx.createRadialGradient(
        width * 0.85,
        height * 0.15,
        0,
        width * 0.85,
        height * 0.15,
        width * 0.65
      );
      glow1Grad.addColorStop(
        0,
        `rgba(${currentThemeState.glow1.join(",")}, ${isDark ? 0.35 : 0.22})`
      );
      glow1Grad.addColorStop(1, `rgba(${currentThemeState.glow1.join(",")}, 0)`);
      ctx.fillStyle = glow1Grad;
      ctx.fillRect(0, 0, width, height);

      const glow2Grad = ctx.createRadialGradient(
        width * 0.15,
        height * 0.7,
        0,
        width * 0.15,
        height * 0.7,
        width * 0.6
      );
      glow2Grad.addColorStop(
        0,
        `rgba(${currentThemeState.glow2.join(",")}, ${isDark ? 0.3 : 0.18})`
      );
      glow2Grad.addColorStop(1, `rgba(${currentThemeState.glow2.join(",")}, 0)`);
      ctx.fillStyle = glow2Grad;
      ctx.fillRect(0, 0, width, height);

      // Pointer decay
      if (pointer.idleTimer > 0) {
        pointer.idleTimer--;
        pointer.alpha = Math.min(1, pointer.alpha + 0.08);
      } else {
        pointer.alpha = Math.max(0, pointer.alpha - 0.04);
        if (pointer.alpha === 0) pointer.active = false;
      }

      // 2. Soft Ambient Halo beneath the cursor (pure background light, no shape over cursor)
      if (pointer.alpha > 0.01) {
        const haloRadius = 180;
        const haloGrad = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          haloRadius
        );
        haloGrad.addColorStop(
          0,
          `rgba(${targetTheme.accentRgb}, ${0.2 * pointer.alpha})`
        );
        haloGrad.addColorStop(
          0.5,
          `rgba(${targetTheme.accentRgb}, ${0.08 * pointer.alpha})`
        );
        haloGrad.addColorStop(1, `rgba(${targetTheme.accentRgb}, 0)`);

        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, haloRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Smooth Water Ripples on Click
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += 140 * dt;
        rip.alpha = Math.max(0, 1 - rip.radius / rip.maxRadius);

        ctx.save();
        ctx.strokeStyle = `rgba(${targetTheme.accentRgb}, ${rip.alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        if (rip.radius >= rip.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 4. Subtle Constellation Connections between nearby particles
      const maxConnectDist = 95;
      const maxConnectDistSq = maxConnectDist * maxConnectDist;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxConnectDistSq) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / maxConnectDist) * (isDark ? 0.35 : 0.2);
            ctx.strokeStyle = `rgba(${currentThemeState.glow1.join(",")}, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 5. Update & Render Organic Fireflies with Natural Wind Push
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!isReducedMotion) {
          p.wanderAngle += p.wanderSpeed;
          p.vx += Math.cos(p.wanderAngle) * 0.018;
          p.vy += Math.sin(p.wanderAngle) * 0.015;

          p.vx *= 0.983;
          p.vy *= 0.983;
          p.vy -= 0.008; // upward buoyancy

          // Natural fluid wind push from cursor
          if (pointer.alpha > 0.05) {
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            const windRadius = 170;

            if (dist < windRadius && dist > 1) {
              const force = (1 - dist / windRadius) * 1.0 * pointer.alpha;
              p.vx += (dx / dist) * force * 2.2;
              p.vy += (dy / dist) * force * 2.2;
              p.currentAlpha = Math.min(1.0, p.currentAlpha + force * 0.4);
            }
          }

          p.x += p.vx * 60 * dt;
          p.y += p.vy * 60 * dt;

          p.pulsePhase += p.pulseSpeed;
          const pulse = (Math.sin(p.pulsePhase) + 1) * 0.5;
          const targetAlpha = p.baseAlpha * (0.45 + pulse * 0.55);
          p.currentAlpha += (targetAlpha - p.currentAlpha) * 0.08;

          const pad = p.glowSize + 15;
          if (p.x < -pad) p.x = width + pad;
          if (p.x > width + pad) p.x = -pad;
          if (p.y < -pad) {
            p.y = height + pad;
            p.x = Math.random() * width;
          }
          if (p.y > height + pad) p.y = -pad;
        }

        const colorCfg = particleColors[p.colorType];
        const rgb = isDark ? colorCfg.dark : colorCfg.light;
        const alpha = isDark ? p.currentAlpha * 0.95 : p.currentAlpha * 0.85;

        // Outer soft glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowSize);
        grad.addColorStop(0, `rgba(${rgb}, ${alpha * 0.7})`);
        grad.addColorStop(0.38, `rgba(${rgb}, ${alpha * 0.25})`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Luminous core
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${Math.min(1, alpha * 1.3)})`
          : `rgba(${rgb}, ${Math.min(1, alpha * 1.25)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        lastTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      themeObserver.disconnect();
      mediaQuery.removeEventListener?.("change", onReducedMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchstart", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseleave", onPointerLeave);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", updateActiveAtmosphere);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[1] transition-opacity duration-700"
    />
  );
}
