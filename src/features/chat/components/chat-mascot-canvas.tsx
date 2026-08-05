"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, useAnimations, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import type * as THREE_NS from "three";

useGLTF.preload("/models/mascot.glb");

function MascotModel({ hovering }: { hovering: boolean }) {
  const group = useRef<THREE_NS.Group>(null!);
  const { scene, animations } = useGLTF("/models/mascot.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (!animations.length || !actions) return;
    const action = Object.values(actions).find(Boolean);
    action?.reset().fadeIn(0.3).play();
    return () => {
      action?.fadeOut(0.3);
    };
  }, [actions, animations.length]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const targetScale = hovering ? 1.05 : 1;
    const current = group.current.scale.x;
    group.current.scale.setScalar(THREE.MathUtils.lerp(current, targetScale, 0.12));

    if (animations.length === 0) {
      group.current.position.y = Math.sin(t * 2.2) * 0.03;
      group.current.rotation.y = Math.sin(t * 0.6) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

export default function ChatMascotCanvas({
  hovering,
  active
}: {
  hovering: boolean;
  active: boolean;
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
          <MascotModel hovering={hovering} />
        </Bounds>
      </Suspense>
    </Canvas>
  );
}
