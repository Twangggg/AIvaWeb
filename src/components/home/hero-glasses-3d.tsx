"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import React, { Suspense, useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import type * as THREE_NS from "three";

/* ─────────────────────────────────────────────────────────────────
   GlassesModel — loaded inside Canvas via Suspense
   ──────────────────────────────────────────────────────────────── */
function GlassesModel({
  pointerRef,
  draggingRef,
}: {
  pointerRef: RefObject<{ x: number; y: number }>;
  draggingRef: RefObject<boolean>;
}) {
  const { scene } = useGLTF("/glass_mode_3d_opt.glb");
  const groupRef = useRef<THREE_NS.Group>(null!);
  const autoRotY = useRef(0);

  // One-time material setup — no clone needed (scene is cached by useGLTF)
  useEffect(() => {
    scene.traverse((obj) => {
      const mesh = obj as THREE_NS.Mesh;
      if (!mesh.isMesh) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((m) => {
        if (m instanceof THREE.MeshStandardMaterial) {
          m.envMapIntensity = 0.7;
          m.needsUpdate = true;
        }
      });
    });
  }, [scene]);

  useFrame(({ clock }) => {
    const g = groupRef.current;
    if (!g) return;
    const t = clock.getElapsedTime();

    if (!draggingRef.current) {
      autoRotY.current += 0.004;
      const { x: px, y: py } = pointerRef.current;
      const tiltX = THREE.MathUtils.clamp(py * 0.08, -0.12, 0.12);
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tiltX, 0.05);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, autoRotY.current, 0.05);
    }
    g.position.y = Math.sin(t * 0.9) * 0.02;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1.8} />
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Inner scene — must be inside Canvas
   ──────────────────────────────────────────────────────────────── */
function Scene({
  pointerRef,
  draggingRef,
}: {
  pointerRef: RefObject<{ x: number; y: number }>;
  draggingRef: RefObject<boolean>;
}) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 5, 5]} intensity={1.6} color="#facc15" />
      <directionalLight position={[-4, 1, 3]} intensity={0.8} color="#38bdf8" />
      <directionalLight position={[0, -2, 2]} intensity={0.4} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(Math.PI * 3) / 4}
        onStart={() => {
          draggingRef.current = true;
        }}
        onEnd={() => {
          draggingRef.current = false;
        }}
      />

      {/* Suspense wraps only the async model load */}
      <Suspense fallback={null}>
        <GlassesModel pointerRef={pointerRef} draggingRef={draggingRef} />
      </Suspense>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Public component
   ──────────────────────────────────────────────────────────────── */
export function HeroGlasses3D({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const pointerRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track pointer relative to canvas
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointerRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      };
    };
    el.addEventListener("pointermove", onMove);
    return () => el.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ touchAction: "none", ...style }}
    >
      {/* Loading placeholder — shown until Canvas is ready */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <div
          className="w-12 h-12 rounded-full border-2 animate-spin"
          style={{ borderColor: "var(--accent) transparent transparent transparent", opacity: 0.4 }}
        />
      </div>

      <Canvas
        frameloop="always"
        flat
        camera={{ position: [0, 0, 4.2], fov: 34, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "default" }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          background: "transparent",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Scene pointerRef={pointerRef} draggingRef={draggingRef} />
      </Canvas>

      {/* Drag hint */}
      <p
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[0.65rem] uppercase tracking-widest pointer-events-none"
        style={{ color: "var(--text-dim)", opacity: 0.5 }}
      >
        kéo để xoay
      </p>
    </div>
  );
}

// Preload optimized model (3.8 MB, no Draco)
useGLTF.preload("/glass_mode_3d_opt.glb");
