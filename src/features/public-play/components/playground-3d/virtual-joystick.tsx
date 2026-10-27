"use client";

import { useEffect, useRef, useState } from "react";
import { usePlayModeStore } from "../../store/usePlayModeStore";

export function VirtualJoystick() {
  const { setJoystick, triggerJump } = usePlayModeStore();
  const baseRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const radius = 45; // Max drag radius in pixels

  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setActive(true);
    handleTouchMove(e);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!baseRef.current || touchIdRef.current === null) return;
    const touch = Array.from(e.changedTouches).find(
      (t) => t.identifier === touchIdRef.current
    );
    if (!touch) return;

    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= radius) {
      setKnobPos({ x: dx, y: dy });
      setJoystick({ x: dx / radius, y: dy / radius });
    } else {
      const angle = Math.atan2(dy, dx);
      const clampedX = Math.cos(angle) * radius;
      const clampedY = Math.sin(angle) * radius;
      setKnobPos({ x: clampedX, y: clampedY });
      setJoystick({ x: clampedX / radius, y: clampedY / radius });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = Array.from(e.changedTouches).find(
      (t) => t.identifier === touchIdRef.current
    );
    if (!touch) return;

    touchIdRef.current = null;
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    setJoystick({ x: 0, y: 0 });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex items-end justify-between px-6 sm:hidden">
      {/* Joystick Base (Left) */}
      <div
        ref={baseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="pointer-events-auto relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-900/40 backdrop-blur-md border-2 border-white/30 shadow-lg touch-none"
      >
        {/* Joystick Stick / Knob */}
        <div
          className={`h-12 w-12 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-white shadow-md transition-transform duration-75 ${
            active ? "scale-110" : ""
          }`}
          style={{
            transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          }}
        />
        <span className="pointer-events-none absolute text-[10px] font-bold text-white/60">
          Di chuyển
        </span>
      </div>

      {/* Jump Button (Right) */}
      <button
        type="button"
        onTouchStart={(e) => {
          e.preventDefault();
          triggerJump();
        }}
        onClick={triggerJump}
        className="pointer-events-auto h-16 w-16 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 border-2 border-white text-slate-950 font-black shadow-xl flex items-center justify-center active:scale-90 transition-transform touch-none select-none text-xl"
        aria-label="Nhảy lên"
      >
        🦘
      </button>
    </div>
  );
}
