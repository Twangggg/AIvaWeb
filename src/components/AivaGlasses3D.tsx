"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Suspense, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

function Lens({ x }: { x: number }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.55, 0.06, 24, 64]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh>
        <circleGeometry args={[0.55, 64]} />
        <meshPhysicalMaterial
          color="#0ea5e9"
          metalness={0.4}
          roughness={0.05}
          transmission={0.85}
          thickness={0.4}
          transparent
          opacity={0.55}
          emissive="#0c4a6e"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, 0, 0.001]}>
        <ringGeometry args={[0.42, 0.5, 64]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function Glasses({ scrollY }: { scrollY: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const s = scrollY.current;
    const t = state.clock.getElapsedTime();
    if (!group.current) return;

    group.current.rotation.y = s * Math.PI * 2 + Math.sin(t * 0.6) * 0.05;
    group.current.rotation.x = Math.sin(s * Math.PI * 2) * 0.35 + Math.sin(t * 0.4) * 0.03;
    group.current.position.y = Math.sin(s * Math.PI * 3) * 0.4 + Math.sin(t * 0.8) * 0.05;
    group.current.position.z = -s * 1.2;
    const scale = 1 - s * 0.15;
    group.current.scale.setScalar(scale);
  });

  return (
    <group ref={group}>
      <Lens x={-0.7} />
      <Lens x={0.7} />
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.4, 0.06, 0.08]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.9} roughness={0.3} />
      </mesh>
      <group position={[1.25, 0.4, 0.05]}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.08, 32]} />
          <meshStandardMaterial
            color="#facc15"
            metalness={0.8}
            roughness={0.2}
            emissive="#facc15"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 32]} />
          <meshStandardMaterial color="#000" metalness={1} roughness={0.1} />
        </mesh>
      </group>
      {[-1.25, 1.25].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh
            position={[x > 0 ? 0.3 : -0.3, 0, -0.6]}
            rotation={[0, x > 0 ? -0.25 : 0.25, 0]}
          >
            <boxGeometry args={[0.6, 0.06, 0.06]} />
            <meshStandardMaterial color="#0a0f1a" metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh
            position={[x > 0 ? 0.55 : -0.55, -0.04, -1]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.08, 0.08, 0.06, 24]} />
            <meshStandardMaterial
              color="#0ea5e9"
              metalness={0.7}
              roughness={0.3}
              emissive="#0ea5e9"
              emissiveIntensity={0.6}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ScanLines() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = s.clock.getElapsedTime() * 0.2;
  });

  return (
    <mesh ref={ref} position={[0, 0, -2]}>
      <ringGeometry args={[2.5, 2.55, 64]} />
      <meshBasicMaterial
        color="#0ea5e9"
        transparent
        opacity={0.25}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
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
          <Glasses scrollY={scrollY} />
        </Float>
        <ScanLines />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
