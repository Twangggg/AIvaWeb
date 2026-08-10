"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type * as THREE_NS from "three";

type GlassesMode = "orbit" | "front" | "brand";

function ModelReadyPing({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current || !onReady) return;
    fired.current = true;
    const id = requestAnimationFrame(() => onReady());
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}

/**
 * - front: face camera, tiny sway
 * - orbit: continuous turntable (product preview)
 * - brand: face front on open/drop, then gentle Y spin (upright, no skew)
 */
function GlassesModel({
  pointerRef,
  mode,
  brandOpen,
  onReady
}: {
  pointerRef: RefObject<{ x: number; y: number }>;
  mode: GlassesMode;
  brandOpen: boolean;
  onReady?: () => void;
}) {
  const { scene } = useGLTF("/models/glasses.glb");
  const spin = useRef<THREE_NS.Group>(null!);
  const openAt = useRef(0);
  const wasOpen = useRef(false);
  const optimizedScene = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    optimizedScene.traverse((obj) => {
      obj.frustumCulled = false;
    });
  }, [optimizedScene]);

  useEffect(() => {
    if (brandOpen && !wasOpen.current) {
      openAt.current = -1;
      if (spin.current) spin.current.rotation.set(0, 0, 0);
    }
    if (!brandOpen && wasOpen.current && spin.current) {
      spin.current.rotation.set(0, 0, 0);
    }
    wasOpen.current = brandOpen;
  }, [brandOpen]);

  useFrame(({ clock }) => {
    if (!spin.current) return;
    const pointer = pointerRef.current;
    const t = clock.getElapsedTime();

    if (mode === "front") {
      const targetX = THREE.MathUtils.clamp(pointer.y * 0.05, -0.06, 0.06);
      const targetY = THREE.MathUtils.clamp(pointer.x * 0.08, -0.1, 0.1);
      spin.current.rotation.x = THREE.MathUtils.lerp(spin.current.rotation.x, targetX, 0.12);
      spin.current.rotation.y = THREE.MathUtils.lerp(spin.current.rotation.y, targetY, 0.12);
      spin.current.rotation.z = THREE.MathUtils.lerp(spin.current.rotation.z, 0, 0.2);
      spin.current.position.y = Math.sin(t * 1.3) * 0.015;
      return;
    }

    if (mode === "brand") {
      if (!brandOpen) {
        spin.current.rotation.x = THREE.MathUtils.lerp(spin.current.rotation.x, 0, 0.15);
        spin.current.rotation.y = THREE.MathUtils.lerp(spin.current.rotation.y, 0, 0.15);
        spin.current.rotation.z = THREE.MathUtils.lerp(spin.current.rotation.z, 0, 0.2);
        spin.current.position.y = THREE.MathUtils.lerp(spin.current.position.y, 0, 0.15);
        return;
      }

      if (openAt.current < 0) openAt.current = t;
      const local = t - openAt.current;
      const spinT = Math.max(0, local - 0.9);
      const targetX = THREE.MathUtils.clamp(pointer.y * 0.04, -0.05, 0.05);
      const targetY = spinT * 0.55 + pointer.x * 0.12;
      spin.current.rotation.x = THREE.MathUtils.lerp(spin.current.rotation.x, targetX, 0.1);
      spin.current.rotation.y = THREE.MathUtils.lerp(spin.current.rotation.y, targetY, 0.08);
      spin.current.rotation.z = THREE.MathUtils.lerp(spin.current.rotation.z, 0, 0.25);
      spin.current.position.y = Math.sin(t * 1.2) * 0.018;
      return;
    }

    const targetX = THREE.MathUtils.clamp(pointer.y * 0.06, -0.08, 0.08);
    const targetY = t * 0.5 + pointer.x * 0.14;
    spin.current.rotation.x = THREE.MathUtils.lerp(spin.current.rotation.x, targetX, 0.1);
    spin.current.rotation.y = THREE.MathUtils.lerp(spin.current.rotation.y, targetY, 0.08);
    spin.current.rotation.z = THREE.MathUtils.lerp(spin.current.rotation.z, 0, 0.2);
    spin.current.position.y = Math.sin(t * 1.2) * 0.02;
  });

  const scale = mode === "orbit" ? 1.55 : 1.68;

  return (
    <group ref={spin}>
      <Center precise>
        <primitive object={optimizedScene} scale={scale} />
      </Center>
      <ModelReadyPing onReady={onReady} />
    </group>
  );
}

export default function Hero3DCanvas({
  active,
  pointerRef,
  mode = "orbit",
  brandOpen = false,
  onReady
}: {
  active: boolean;
  pointerRef: RefObject<{ x: number; y: number }>;
  mode?: GlassesMode;
  brandOpen?: boolean;
  onReady?: () => void;
}) {
  const camZ = mode === "orbit" ? 4.2 : 3.7;

  return (
    <Canvas
      frameloop={active ? "always" : "demand"}
      flat
      camera={{
        position: [0, 0.02, camZ],
        fov: 32,
        near: 0.1,
        far: 30
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", width: "100%", height: "100%", display: "block" }}
      onCreated={({ camera, gl }) => {
        camera.position.set(0, 0.02, camZ);
        camera.lookAt(0, 0, 0);
        gl.setClearColor(0x000000, 0);
      }}
    >
      <ambientLight intensity={0.95} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#facc15" />
      <directionalLight position={[-4, 1, 3]} intensity={0.7} color="#38bdf8" />
      <Suspense fallback={null}>
        {active ? (
          <GlassesModel
            pointerRef={pointerRef}
            mode={mode}
            brandOpen={brandOpen}
            onReady={onReady}
          />
        ) : null}
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload("/models/glasses.glb");
