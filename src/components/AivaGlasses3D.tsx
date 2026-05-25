"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import type * as THREE from "three";

useGLTF.preload("/models/glasses.glb");

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        <p className="text-xs text-white/60">{Math.round(progress)}%</p>
      </div>
    </Html>
  );
}

function Model({ scrollY }: { scrollY: MutableRefObject<number> }) {
  const { scene } = useGLTF("/models/glasses.glb");
  const group = useRef<THREE.Group>(null!);
  const lastScroll = useRef(-1);

  useFrame(() => {
    const s = scrollY.current;
    if (!group.current || Math.abs(s - lastScroll.current) < 0.0005) return;
    lastScroll.current = s;

    group.current.rotation.y = s * Math.PI * 2;
    group.current.rotation.x = Math.sin(s * Math.PI * 2) * 0.35;

    group.current.position.x = 0;
    group.current.position.y = -0.2 + Math.sin(s * Math.PI * 3) * 0.4;
    group.current.position.z = -s * 1.2;

    const baseScale = 2.0;
    const scrollScale = 1 + s * 0.1;
    group.current.scale.setScalar(baseScale * scrollScale);
  });

  return <primitive ref={group} object={scene} />;
}

export default function AivaGlasses3D({
  scrollY,
  onInvalidateReady
}: {
  scrollY: MutableRefObject<number>;
  onInvalidateReady?: (invalidate: () => void) => void;
}) {
  const invalidateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!onInvalidateReady || !invalidateRef.current) return;
    onInvalidateReady(invalidateRef.current);
  }, [onInvalidateReady]);

  return (
    <Canvas
      frameloop="demand"
      camera={{ position: [0, 0, 3.0], fov: 45, near: 0.5, far: 20 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ invalidate }) => {
        invalidateRef.current = invalidate;
        onInvalidateReady?.(invalidate);
        invalidate();
      }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} color="#facc15" />
      <directionalLight position={[-4, -2, 3]} intensity={1.3} color="#0ea5e9" />
      <pointLight position={[0, 0, 2]} intensity={0.9} color="#38bdf8" />
      <Suspense fallback={<Loader />}>
        <Model scrollY={scrollY} />
        <Environment preset="night" environmentIntensity={1.5} />
      </Suspense>
    </Canvas>
  );
}
