"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { STATIONS, usePlayModeStore, type StationMeta } from "../../store/usePlayModeStore";

export function PlaygroundWorld() {
  return (
    <group>
      {/* Main Island Ground (Gentle rolling terrain) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <cylinderGeometry args={[16, 17, 1.2, 48]} />
        <meshStandardMaterial color="#86efac" roughness={0.7} />
      </mesh>

      {/* Earth / Cliff base under the grass */}
      <mesh receiveShadow position={[0, -1.2, 0]}>
        <cylinderGeometry args={[17, 14, 1.6, 48]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>

      {/* Central Plaza Cobblestone (Round stone pavement) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0, 3.5, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>

      {/* Cobblestone paths radiating to stations */}
      <CobblestonePaths />

      {/* Fluffy drifting clouds */}
      <FloatingClouds />

      {/* Decorative trees, flowers & festival lanterns */}
      <WorldDecorations />

      {/* 6 Interactive Stations */}
      {STATIONS.map((station) => (
        <StationModel key={station.id} station={station} />
      ))}
    </group>
  );
}

function CobblestonePaths() {
  return (
    <group position={[0, 0.015, 0]}>
      {/* Path to Avia Quiz (North) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4.5]}>
        <planeGeometry args={[1.6, 6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* Path to Vision Quest (North-East) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, -Math.PI / 4]} position={[4.5, 0, -2.5]}>
        <planeGeometry args={[1.5, 6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* Path to Garden (North-West) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[-4.5, 0, -2.5]}>
        <planeGeometry args={[1.5, 6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* Path to Energy Sequence (South-East) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, Math.PI / 3]} position={[4, 0, 3.2]}>
        <planeGeometry args={[1.5, 5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>

      {/* Path to Route Builder (South-West) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, -Math.PI / 3]} position={[-4, 0, 3.2]}>
        <planeGeometry args={[1.5, 5]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
    </group>
  );
}

function FloatingClouds() {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={cloudsRef} position={[0, 9, 0]}>
      {/* Cloud 1 */}
      <group position={[10, 0, 8]}>
        <mesh castShadow>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.88} />
        </mesh>
        <mesh position={[1.1, -0.2, 0]}>
          <sphereGeometry args={[1.1, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.88} />
        </mesh>
        <mesh position={[-1.1, -0.2, 0]}>
          <sphereGeometry args={[1.0, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.88} />
        </mesh>
      </group>

      {/* Cloud 2 */}
      <group position={[-11, 1, -7]}>
        <mesh castShadow>
          <sphereGeometry args={[1.6, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.88} />
        </mesh>
        <mesh position={[1.2, -0.1, 0.4]}>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.88} />
        </mesh>
        <mesh position={[-1.2, -0.2, -0.3]}>
          <sphereGeometry args={[1.1, 16, 16]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} transparent opacity={0.88} />
        </mesh>
      </group>
    </group>
  );
}

function WorldDecorations() {
  const treePositions: [number, number, number][] = [
    [-11, 0, 1],
    [-12, 0, -8],
    [11, 0, 1],
    [12, 0, -8],
    [-2, 0, -12],
    [2, 0, -12],
    [-11, 0, 9],
    [11, 0, 9],
    [0, 0, 12],
  ];

  return (
    <group>
      {treePositions.map((pos, idx) => (
        <group key={idx} position={pos}>
          {/* Tree Trunk */}
          <mesh castShadow position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.22, 0.35, 1.6, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Tree Foliage (Double puff) */}
          <mesh castShadow position={[0, 2.0, 0]}>
            <sphereGeometry args={[1.0, 12, 10]} />
            <meshStandardMaterial color={idx % 2 === 0 ? "#16a34a" : "#22c55e"} roughness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 2.7, 0]}>
            <sphereGeometry args={[0.7, 10, 8]} />
            <meshStandardMaterial color={idx % 2 === 0 ? "#22c55e" : "#4ade80"} roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Decorative colored mushroom patches */}
      <mesh castShadow position={[3.2, 0.25, 1.5]}>
        <sphereGeometry args={[0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </mesh>
      <mesh castShadow position={[-3.2, 0.25, 1.5]}>
        <sphereGeometry args={[0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </mesh>
    </group>
  );
}

function StationModel({ station }: { station: StationMeta }) {
  const { nearbyStation } = usePlayModeStore();
  const isNear = nearbyStation === station.id;
  const ringRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isNear ? 2.5 : 1.0);
    }
    if (beaconRef.current) {
      beaconRef.current.rotation.y += delta * 1.5;
      beaconRef.current.position.y = 2.6 + Math.sin(state.clock.elapsedTime * 2.5) * 0.15;
    }
  });

  return (
    <group position={station.position}>
      {/* 1. Interactive Pulsing Floor Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[1.8, 2.3, 32]} />
        <meshBasicMaterial
          color={isNear ? "#fbbf24" : station.color}
          transparent
          opacity={isNear ? 0.9 : 0.45}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Station Landmark Base */}
      <mesh castShadow receiveShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.7, 16]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.4} />
      </mesh>

      {/* 3. Specific Themed Architecture per Station */}
      {station.id === "avia-quiz" && (
        <group position={[0, 0.7, 0]}>
          <mesh castShadow position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.6, 0.8, 1.4, 16]} />
            <meshStandardMaterial color="#10b981" roughness={0.3} />
          </mesh>
        </group>
      )}

      {station.id === "vision-quest" && (
        <group position={[0, 0.7, 0]}>
          <mesh castShadow position={[0, 0.6, 0]} rotation={[0.4, 0.3, 0]}>
            <cylinderGeometry args={[0.3, 0.5, 1.2, 16]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      )}

      {station.id === "garden" && (
        <group position={[0, 0.7, 0]}>
          <mesh castShadow position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.7, 16, 12]} />
            <meshStandardMaterial color="#34d399" transparent opacity={0.7} />
          </mesh>
        </group>
      )}

      {station.id === "sequence" && (
        <group position={[0, 0.7, 0]}>
          <mesh castShadow position={[0, 0.7, 0]}>
            <octahedronGeometry args={[0.65]} />
            <meshStandardMaterial color="#d946ef" metalness={0.3} roughness={0.2} />
          </mesh>
        </group>
      )}

      {station.id === "route" && (
        <group position={[0, 0.7, 0]}>
          <mesh castShadow position={[0, 0.6, 0]}>
            <boxGeometry args={[0.9, 1.0, 0.9]} />
            <meshStandardMaterial color="#06b6d4" roughness={0.4} />
          </mesh>
        </group>
      )}

      {station.id === "du-ky" && (
        <group position={[0, 0.7, 0]}>
          {/* Wooden desk table */}
          <mesh castShadow position={[0, 0.2, 0]}>
            <boxGeometry args={[1.3, 0.15, 0.9]} />
            <meshStandardMaterial color="#92400e" roughness={0.5} />
          </mesh>
          {/* Giant open book on table */}
          <mesh castShadow position={[0, 0.35, 0]} rotation={[-0.3, 0, 0]}>
            <boxGeometry args={[0.85, 0.1, 0.6]} />
            <meshStandardMaterial color="#fef08a" roughness={0.7} />
          </mesh>
        </group>
      )}

      {/* 4. Floating Emoji / Icon Beacon */}
      <group ref={beaconRef} position={[0, 2.6, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial
            color={station.color}
            emissive={station.color}
            emissiveIntensity={isNear ? 0.7 : 0.3}
          />
        </mesh>
      </group>
    </group>
  );
}
