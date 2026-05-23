"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, useProgress } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { MutableRefObject } from "react";
import type * as THREE from "three";

useGLTF.preload("/models/glasses.glb");

function Loader() {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      <p className="text-xs text-white/40">{Math.round(progress)}%</p>
    </div>
  );
}

function Model({ scrollY }: { scrollY: MutableRefObject<number> }) {
  const { scene } = useGLTF("/models/glasses.glb");
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const s = scrollY.current;
    const t = state.clock.getElapsedTime();
    if (!group.current) return;

    group.current.rotation.y = s * Math.PI * 2 + Math.sin(t * 0.6) * 0.05;
    group.current.rotation.x = Math.sin(s * Math.PI * 2) * 0.35 + Math.sin(t * 0.4) * 0.03;

    group.current.position.x = Math.sin(t * 0.5) * 0.08;
    group.current.position.y = -0.2 + Math.sin(s * Math.PI * 3) * 0.4 + Math.sin(t * 0.8) * 0.05;
    group.current.position.z = -s * 1.2 + Math.sin(t * 0.3) * 0.06;

    const baseScale = 2.0;
    const scrollScale = 1 + s * 0.1;
    group.current.scale.setScalar(baseScale * scrollScale);
  });

  return <primitive ref={group} object={scene} />;
}

export default function AivaGlasses3D({ scrollY }: { scrollY: MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.0], fov: 45, near: 0.5, far: 20 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
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
