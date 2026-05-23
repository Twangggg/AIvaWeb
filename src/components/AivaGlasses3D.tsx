"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, useGLTF } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { MutableRefObject } from "react";
import type * as THREE from "three";

function Model({ scrollY }: { scrollY: MutableRefObject<number> }) {
  const { scene } = useGLTF("/models/glasses.glb");
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const s = scrollY.current;
    const t = state.clock.getElapsedTime();
    if (!group.current) return;

    group.current.rotation.y = s * Math.PI * 2 + Math.sin(t * 0.6) * 0.05;
    group.current.rotation.x = Math.sin(s * Math.PI * 2) * 0.35 + Math.sin(t * 0.4) * 0.03;
    group.current.position.y = -0.2 + Math.sin(s * Math.PI * 3) * 0.4 + Math.sin(t * 0.8) * 0.05;
    group.current.position.z = -s * 1.2;
    const baseScale = 1.8;
    const scrollScale = 1 - s * 0.15;
    group.current.scale.setScalar(baseScale * scrollScale);
  });

  return <primitive ref={group} object={scene} />;
}

export default function AivaGlasses3D({ scrollY }: { scrollY: MutableRefObject<number> }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.6], fov: 38 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} color="#facc15" />
      <directionalLight position={[-4, -2, 3]} intensity={0.9} color="#0ea5e9" />
      <pointLight position={[0, 0, 2]} intensity={0.6} color="#38bdf8" />
      <Suspense fallback={null}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
          <Model scrollY={scrollY} />
        </Float>
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
