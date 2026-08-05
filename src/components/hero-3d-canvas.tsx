"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Html, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import type * as THREE_NS from "three";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      <p className="text-xs mt-2 text-center" style={{ color: "var(--text-dim)" }}>{Math.round(progress)}%</p>
    </Html>
  );
}

function RotatingModel({ pointerRef }: { pointerRef: RefObject<{ x: number; y: number }> }) {
  const { scene } = useGLTF("/models/glasses.glb");
  const group = useRef<THREE_NS.Group>(null!);
  const optimizedScene = useMemo(() => scene, [scene]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const pointer = pointerRef.current;
    const baseY = clock.getElapsedTime() * 0.4;
    const targetX = pointer.y * 0.14;
    const targetY = baseY + pointer.x * 0.2;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, 0.14);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, 0.14);
  });

  return (
    <Center>
      <group ref={group}>
        <primitive object={optimizedScene} scale={1.7} />
      </group>
    </Center>
  );
}

export default function Hero3DCanvas({
  active,
  pointerRef
}: {
  active: boolean;
  pointerRef: RefObject<{ x: number; y: number }>;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "demand"}
      flat
      camera={{ position: [0, 0, 4.2], fov: 36, near: 0.1, far: 30 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.4} color="#facc15" />
      <directionalLight position={[-4, 1, 3]} intensity={0.7} color="#38bdf8" />
      <Suspense fallback={<Loader />}>
        {active ? <RotatingModel pointerRef={pointerRef} /> : null}
      </Suspense>
    </Canvas>
  );
}
