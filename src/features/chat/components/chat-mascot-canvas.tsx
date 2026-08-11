"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type * as THREE_NS from "three";

useGLTF.preload("/models/mascot.glb");

function MascotModel({
  hovering,
  talking,
  onReady
}: {
  hovering: boolean;
  talking: boolean;
  onReady?: () => void;
}) {
  const group = useRef<THREE_NS.Group>(null!);
  const { scene } = useGLTF("/models/mascot.glb");

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();

    const targetScale = hovering ? 1.08 : talking ? 1.04 : 1;
    const current = group.current.scale.x;
    group.current.scale.setScalar(THREE.MathUtils.lerp(current, targetScale, 0.08));

    const bobAmp = talking ? 0.055 : hovering ? 0.04 : 0.028;
    const bobSpeed = talking ? 5.2 : hovering ? 3.2 : 2.1;
    group.current.position.y = Math.sin(t * bobSpeed) * bobAmp;

    const sway = talking ? 0.18 : hovering ? 0.14 : 0.1;
    group.current.rotation.y = Math.sin(t * 0.7) * sway;
    group.current.rotation.z = Math.sin(t * 1.1) * (talking ? 0.05 : 0.025);
    group.current.rotation.x = Math.sin(t * 0.9) * 0.04 + (hovering ? -0.06 : 0);
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

export default function ChatMascotCanvas({
  hovering,
  talking = false,
  active,
  onReady
}: {
  hovering: boolean;
  talking?: boolean;
  active: boolean;
  onReady?: () => void;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "demand"}
      flat
      camera={{ position: [0, 0, 4], fov: 35, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{
        background: "transparent",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        display: "block",
        cursor: "none"
      }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[2, 4, 5]} intensity={1.4} color="#facc15" />
      <directionalLight position={[-4, 2, 3]} intensity={0.6} color="#38bdf8" />
      <Suspense fallback={null}>
        <Bounds fit observe margin={1.3}>
          <MascotModel hovering={hovering} talking={talking} onReady={onReady} />
        </Bounds>
      </Suspense>
    </Canvas>
  );
}
