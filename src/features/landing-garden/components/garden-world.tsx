"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import {
  GARDEN_STATIONS,
  GARDEN_SHARDS,
  useGardenStore,
  type GardenStationMeta,
  type GardenShardMeta,
} from "../store/useGardenStore";

export function GardenWorld() {
  const { timeOfDay } = useGardenStore();

  return (
    <group>
      {/* 1. Infinite Expansive Rolling Parkland (No cut-off cliffs or void) */}
      <InfiniteVastTerrain timeOfDay={timeOfDay} />

      {/* 2. Seamless Perfectly Flat Cobblestone Ribbon Path (No twisting walls) */}
      <FlatWindingRoad />

      {/* 3. Tranquil Lotus Pond (Placed peacefully beside the path) */}
      <TranquilLotusPond />

      {/* 4. Swaying Instanced Grass Lawn in Garden Exploration Zone */}
      <InstancedGrassLawn />

      {/* 5. Dynamic Ambient Fireflies & Pollen */}
      <DynamicAtmosphereParticles timeOfDay={timeOfDay} />

      {/* 6. Distant Low-Poly Floating Clouds */}
      <DriftingSkyClouds />

      {/* 7. Beautiful Trees, Flowering Bushes & Wildflower Patches */}
      <HarmoniousGardenFoliage />

      {/* 8. Interactive Bouncy Mushroom Jump Pads */}
      <BouncyMushroomPad position={[-6.0, 0, 9.0]} scale={1.2} />
      <BouncyMushroomPad position={[6.5, 0, -6.0]} scale={1.2} />

      {/* 9. 12 Collectible Energy Shards */}
      {GARDEN_SHARDS.map((shard) => (
        <CollectibleShardNode key={shard.id} shard={shard} />
      ))}

      {/* 10. 9 Storybook Diorama Pavilions (Flush on the ground, no concrete blocks) */}
      {GARDEN_STATIONS.map((station) => (
        <GardenStationNode key={station.id} station={station} />
      ))}
    </group>
  );
}

/* ================= 1. INFINITE EXPANSIVE TERRAIN ================= */

function InfiniteVastTerrain({ timeOfDay }: { timeOfDay: "day" | "sunset" | "night" }) {
  const grassColor =
    timeOfDay === "night" ? "#0f2318" : timeOfDay === "sunset" ? "#3b8256" : "#4ade80";
  const innerGrassColor =
    timeOfDay === "night" ? "#132d1e" : timeOfDay === "sunset" ? "#4a9c69" : "#86efac";
  const hillColor =
    timeOfDay === "night" ? "#0a1911" : timeOfDay === "sunset" ? "#285c3b" : "#22c55e";

  return (
    <group>
      {/* Giant Expansive Ground Plane extending far into the horizon fog (220m radius) */}
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[220, 64]} />
        <meshStandardMaterial color={grassColor} roughness={0.85} />
      </mesh>

      {/* Central Garden Lawn (Vibrant, welcoming green for exploration, 40m radius) */}
      <mesh receiveShadow position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[40, 64]} />
        <meshStandardMaterial color={innerGrassColor} roughness={0.75} />
      </mesh>

      {/* Distant Rolling Low-Poly Hills breaking the horizon line */}
      {[
        { pos: [-55, 3.2, -75], scale: [48, 8, 36] },
        { pos: [62, 3.8, -65], scale: [52, 9.5, 38] },
        { pos: [-68, 3.5, 45], scale: [44, 8, 34] },
        { pos: [65, 3.2, 50], scale: [48, 8.5, 36] },
        { pos: [0, 4.5, -98], scale: [60, 11, 44] },
        { pos: [-35, 3.4, 85], scale: [50, 9, 36] },
        { pos: [38, 3.2, 82], scale: [46, 8.5, 34] },
      ].map((hill, idx) => (
        <mesh
          key={idx}
          position={hill.pos as [number, number, number]}
          scale={hill.scale as [number, number, number]}
        >
          <sphereGeometry args={[1, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={hillColor} roughness={0.9} />
        </mesh>
      ))}

      {/* Rustic Wooden Garden Fence along radius ~33m naturally bounding the player */}
      <GardenBoundaryFences />
    </group>
  );
}

/**
 * Natural split-rail wooden fence posts around the garden boundary (radius ~33m)
 */
function GardenBoundaryFences() {
  const posts = useMemo(() => {
    const list: { pos: [number, number, number]; rotY: number }[] = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const z = Math.sin(angle) * 33.0;
      const x = Math.cos(angle) * 33.0;

      // Leave wide openings at entrance (South) and pre-order garden (North)
      const nearEntrance = z > 28 && Math.abs(x) < 6;
      const nearExit = z < -28 && Math.abs(x) < 6;
      if (nearEntrance || nearExit) continue;

      list.push({
        pos: [x, 0, z],
        rotY: angle + Math.PI / 2,
      });
    }
    return list;
  }, []);

  return (
    <group>
      {posts.map((p, idx) => (
        <group key={idx} position={p.pos} rotation={[0, p.rotY, 0]}>
          {/* Wooden Post */}
          <mesh castShadow position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.07, 0.09, 0.9, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          {/* Top & Lower Cross Rails */}
          <mesh castShadow position={[0.75, 0.65, 0]}>
            <boxGeometry args={[1.5, 0.07, 0.07]} />
            <meshStandardMaterial color="#92400e" roughness={0.75} />
          </mesh>
          <mesh castShadow position={[0.75, 0.3, 0]}>
            <boxGeometry args={[1.5, 0.07, 0.07]} />
            <meshStandardMaterial color="#92400e" roughness={0.75} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ================= 2. FLAT WINDING COBBLESTONE ROAD ================= */

/**
 * Mathematically generates a strictly horizontal planar quad-strip
 * ribbon with normal = (0, 1, 0).
 * Prevents ExtrudeGeometry's Frenet twist 100%!
 */
function FlatWindingRoad() {
  const roadGeom = useMemo(() => {
    const points = [
      new THREE.Vector3(0, 0, 31),
      new THREE.Vector3(-4.5, 0, 25.5),
      new THREE.Vector3(-10.0, 0, 19), // St 02: Glasses
      new THREE.Vector3(-3.5, 0, 15.5),
      new THREE.Vector3(10.0, 0, 12),  // St 03: Vision
      new THREE.Vector3(2.5, 0, 8.5),
      new THREE.Vector3(-11.0, 0, 5),  // St 04: Features
      new THREE.Vector3(-2.0, 0, 1.5),
      new THREE.Vector3(11.0, 0, -2),  // St 05: Safety
      new THREE.Vector3(2.0, 0, -5.5),
      new THREE.Vector3(-10.0, 0, -9), // St 06: Parent
      new THREE.Vector3(-1.8, 0, -12.5),
      new THREE.Vector3(10.0, 0, -16), // St 07: Colors
      new THREE.Vector3(1.8, 0, -19.5),
      new THREE.Vector3(-9.0, 0, -23), // St 08: Minigames
      new THREE.Vector3(-2.5, 0, -26.5),
      new THREE.Vector3(0, 0, -29),    // St 09: Preorder
      new THREE.Vector3(0, 0, -32),
    ];

    const curve = new THREE.CatmullRomCurve3(points);
    const steps = 200;
    const width = 2.6;
    const halfW = width / 2;

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt = curve.getPoint(t);
      const tangent = curve.getTangent(t);

      // Perpendicular vector in XZ plane
      const len = Math.sqrt(tangent.x * tangent.x + tangent.z * tangent.z) || 1;
      const perpX = -tangent.z / len;
      const perpZ = tangent.x / len;

      // Left vertex (Y = 0.015 flat above grass)
      positions.push(pt.x + perpX * halfW, 0.015, pt.z + perpZ * halfW);
      uvs.push(0, t * 24);

      // Right vertex (Y = 0.015)
      positions.push(pt.x - perpX * halfW, 0.015, pt.z - perpZ * halfW);
      uvs.push(1, t * 24);

      if (i < steps) {
        const v0 = i * 2;
        const v1 = i * 2 + 1;
        const v2 = (i + 1) * 2;
        const v3 = (i + 1) * 2 + 1;
        indices.push(v0, v1, v2);
        indices.push(v1, v3, v2);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group>
      {/* 100% Flat Cobblestone Pavement */}
      <mesh receiveShadow geometry={roadGeom}>
        <meshStandardMaterial color="#cbd5e1" roughness={0.65} />
      </mesh>

      {/* Roadside Japanese Pagoda Stone Lanterns with Emissive Glow */}
      {GARDEN_STATIONS.map((st, i) => {
        const sideOffset = i % 2 === 0 ? 2.1 : -2.1;
        return (
          <group key={st.id} position={[st.position[0] + sideOffset, 0, st.position[2]]}>
            {/* Stone Pillar */}
            <mesh castShadow position={[0, 0.6, 0]}>
              <cylinderGeometry args={[0.08, 0.12, 1.2, 8]} />
              <meshStandardMaterial color="#94a3b8" roughness={0.7} />
            </mesh>
            {/* Lantern Core */}
            <mesh position={[0, 1.3, 0]}>
              <boxGeometry args={[0.34, 0.32, 0.34]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#fbbf24"
                emissiveIntensity={0.85}
              />
            </mesh>
            {/* Point Light for night glow */}
            <pointLight position={[0, 1.3, 0]} color="#fde047" intensity={0.4} distance={3.2} />
            {/* Pagoda Cap */}
            <mesh position={[0, 1.55, 0]}>
              <coneGeometry args={[0.42, 0.2, 4]} />
              <meshStandardMaterial color="#475569" roughness={0.5} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ================= 3. TRANQUIL LOTUS POND ================= */

function TranquilLotusPond() {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = 0.82 + Math.sin(state.clock.elapsedTime * 2.5) * 0.05;
      }
    }
  });

  return (
    <group position={[15.5, 0.01, 5.0]}>
      {/* Pond Water Basin */}
      <mesh ref={waterRef} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.5, 32]} />
        <meshStandardMaterial
          color="#38bdf8"
          roughness={0.12}
          metalness={0.2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Smooth River Stones circling the shoreline */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 4.5 + (i % 2 === 0 ? 0.2 : -0.15);
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        return (
          <mesh key={i} castShadow position={[x, 0.15, z]}>
            <dodecahedronGeometry args={[0.38 + (i % 3) * 0.1, 1]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.7} />
          </mesh>
        );
      })}

      {/* Floating Lily Pads & Lotus Flowers */}
      {[
        { pos: [-1.2, 0.02, 0.8], scale: 0.85 },
        { pos: [1.6, 0.02, -0.9], scale: 0.75 },
        { pos: [0.3, 0.02, 2.0], scale: 0.9 },
        { pos: [-1.8, 0.02, -1.2], scale: 0.7 },
      ].map((lily, idx) => (
        <group key={idx} position={lily.pos as [number, number, number]} scale={lily.scale}>
          <mesh rotation={[-Math.PI / 2, 0, idx]}>
            <circleGeometry args={[0.7, 16, 0, Math.PI * 1.85]} />
            <meshStandardMaterial color="#15803d" roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <coneGeometry args={[0.2, 0.26, 6]} />
            <meshStandardMaterial color="#f472b6" roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Cozy Wooden Viewing Pier */}
      <group position={[-4.1, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
          <boxGeometry args={[1.8, 0.1, 2.0]} />
          <meshStandardMaterial color="#92400e" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[-0.8, 0.4, -0.9]}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
        <mesh castShadow position={[-0.8, 0.4, 0.9]}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 8]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      </group>
    </group>
  );
}

/* ================= 4. INSTANCED GRASS LAWN ================= */

function createSeededRandom(initialSeed = 42) {
  let seed = initialSeed;
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function InstancedGrassLawn() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 1200;

  const transforms = useMemo(() => {
    const dummy = new THREE.Object3D();
    const matrices: THREE.Matrix4[] = [];
    const random = createSeededRandom(42);

    let placed = 0;
    while (placed < count) {
      const angle = random() * Math.PI * 2;
      const radius = 3.5 + random() * 26.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Keep grass off the central road path
      const nearRoad = Math.abs(x) < 2.0 && z > 25;
      if (nearRoad) continue;

      const scale = 0.6 + random() * 0.7;
      const rotY = random() * Math.PI * 2;

      dummy.position.set(x, 0.03, z);
      dummy.rotation.set(0, rotY, 0);
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      matrices.push(dummy.matrix.clone());
      placed++;
    }

    return matrices;
  }, [count]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < transforms.length; i++) {
      meshRef.current.setMatrixAt(i, transforms[i]);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [transforms]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = Math.sin(time * 1.5) * 0.015;
    meshRef.current.rotation.z = Math.cos(time * 1.2) * 0.015;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      <coneGeometry args={[0.06, 0.42, 3]} />
      <meshStandardMaterial color="#22c55e" roughness={0.6} />
    </instancedMesh>
  );
}

/* ================= 5. ATMOSPHERE & CLOUDS ================= */

function DynamicAtmosphereParticles({ timeOfDay }: { timeOfDay: "day" | "sunset" | "night" }) {
  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  return (
    <group>
      <Sparkles
        count={isNight ? 100 : isSunset ? 70 : 45}
        scale={[34, 9, 38]}
        position={[0, 4.0, 0]}
        size={isNight ? 5.0 : 3.6}
        speed={0.4}
        opacity={isNight ? 0.85 : 0.6}
        color={isNight ? "#67e8f9" : isSunset ? "#fde047" : "#fef08a"}
      />
    </group>
  );
}

function DriftingSkyClouds() {
  const cloudsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.015;
    }
  });

  const cloudClusters = [
    { pos: [18, 14, 12], scale: 1.3 },
    { pos: [-22, 15, -10], scale: 1.5 },
    { pos: [10, 16, -22], scale: 1.2 },
    { pos: [-16, 13, 20], scale: 1.1 },
  ];

  return (
    <group ref={cloudsRef}>
      {cloudClusters.map((c, i) => (
        <group key={i} position={c.pos as [number, number, number]} scale={c.scale}>
          <mesh castShadow>
            <sphereGeometry args={[1.6, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.88} />
          </mesh>
          <mesh position={[1.2, -0.2, 0]}>
            <sphereGeometry args={[1.2, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.88} />
          </mesh>
          <mesh position={[-1.2, -0.15, 0.2]}>
            <sphereGeometry args={[1.1, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.88} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ================= 6. BOUNCY MUSHROOM PADS ================= */

function BouncyMushroomPad({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  const capRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (capRef.current) {
      const t = state.clock.getElapsedTime();
      capRef.current.scale.y = 1 + Math.sin(t * 3.5) * 0.05;
    }
  });

  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Springy Stalk */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.32, 0.6, 16]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.5} />
      </mesh>

      {/* Red Cap */}
      <group ref={capRef} position={[0, 0.65, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.75, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color="#ef4444" roughness={0.35} />
        </mesh>
        {[
          [0, 0.7, 0],
          [0.4, 0.5, 0.25],
          [-0.4, 0.5, 0.25],
          [0, 0.5, -0.48],
        ].map((dot, idx) => (
          <mesh key={idx} position={dot as [number, number, number]}>
            <sphereGeometry args={[0.11, 8, 8]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))}
        {/* Glow Ring under cap */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
          <ringGeometry args={[0.25, 0.68, 16]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

/* ================= 7. COLLECTIBLE SHARDS ================= */

function CollectibleShardNode({ shard }: { shard: GardenShardMeta }) {
  const { collectedShards } = useGardenStore();
  const isCollected = collectedShards.includes(shard.id);
  const crystalRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 2.0;
      crystalRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2.5) * 0.2;
      crystalRef.current.position.y =
        shard.position[1] + Math.sin(state.clock.elapsedTime * 3.0 + shard.position[0]) * 0.12;
    }
  });

  if (isCollected) return null;

  return (
    <group position={[shard.position[0], 0, shard.position[2]]}>
      <Float speed={3.0} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh ref={crystalRef} position={[0, shard.position[1], 0]}>
          <octahedronGeometry args={[0.26]} />
          <meshStandardMaterial
            color={shard.color}
            emissive={shard.color}
            emissiveIntensity={0.8}
            roughness={0.15}
            metalness={0.4}
          />
        </mesh>
      </Float>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.25, 0.45, 16]} />
        <meshBasicMaterial
          color={shard.color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ================= 8. 9 STORYBOOK DIORAMA PAVILIONS ================= */

function GardenStationNode({ station }: { station: GardenStationMeta }) {
  const { nearbyStationId } = useGardenStore();
  const isNear = nearbyStationId === station.id;
  const pulseRingRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (pulseRingRef.current) {
      pulseRingRef.current.rotation.z += delta * (isNear ? 2.5 : 0.8);
    }
  });

  return (
    <group position={station.position}>
      {/* 1. Flush Cobblestone Patio (NO giant elevated concrete blocks) */}
      <mesh receiveShadow position={[0, 0.018, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.6} />
      </mesh>
      <mesh receiveShadow position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.75, 1.95, 32]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.7} />
      </mesh>

      {/* 2. Pulsing Energy Ring */}
      <mesh ref={pulseRingRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[2.0, 2.35, 36]} />
        <meshBasicMaterial
          color={isNear ? "#fbbf24" : station.themeColor}
          transparent
          opacity={isNear ? 0.95 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 3. Numbered Wooden Signpost */}
      <group position={[1.4, 0, 0.8]}>
        <mesh castShadow position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 1.3, 8]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.35, 0]}>
          <boxGeometry args={[0.65, 0.38, 0.08]} />
          <meshStandardMaterial color={station.themeColor} roughness={0.3} />
        </mesh>
      </group>

      {/* 4. Thematic Diorama Models directly grounded */}
      {station.id === "gate" && <PagodaToriiGate />}
      {station.id === "glasses" && <GlassesFloatingExhibit />}
      {station.id === "vision" && <ObservatoryTelescope />}
      {station.id === "features" && <FairyCottagePavilion />}
      {station.id === "safety" && <CrystalShieldMonument />}
      {station.id === "parent" && <FamilyGazebo />}
      {station.id === "colors" && <ArtistPaletteStudio />}
      {station.id === "minigames" && <CarnivalTent />}
      {station.id === "preorder" && <CelebrationGiftFountain />}
    </group>
  );
}

/* ---------------- 9 Pavilion Models (Grounded at Y = 0) ---------------- */

function PagodaToriiGate() {
  return (
    <group position={[0, 0, 0]}>
      {/* Pillars */}
      {[-1.1, 1.1].map((x, i) => (
        <group key={i}>
          <mesh castShadow position={[x, 1.3, 0]}>
            <cylinderGeometry args={[0.16, 0.2, 2.6, 16]} />
            <meshStandardMaterial color="#dc2626" roughness={0.3} />
          </mesh>
          <mesh castShadow position={[x, 0.15, 0]}>
            <cylinderGeometry args={[0.26, 0.32, 0.3, 12]} />
            <meshStandardMaterial color="#64748b" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {/* Crossbeams */}
      <mesh castShadow position={[0, 2.15, 0]}>
        <boxGeometry args={[2.8, 0.18, 0.3]} />
        <meshStandardMaterial color="#dc2626" roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, 2.7, 0]}>
        <boxGeometry args={[3.2, 0.24, 0.42]} />
        <meshStandardMaterial color="#991b1b" roughness={0.25} />
      </mesh>
      {/* Hanging Red Lanterns */}
      {[-0.8, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 1.6, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function GlassesFloatingExhibit() {
  const { scene } = useGLTF("/models/glasses.glb");
  const { selectedGlassesColor, setSelectedGlassesColor } = useGardenStore();
  const modelRef = useRef<THREE.Group>(null);

  const cloned = useMemo(() => {
    const c = scene.clone();
    c.traverse((node) => {
      if ((node as THREE.Mesh).isMesh) {
        node.castShadow = true;
      }
    });
    return c;
  }, [scene]);

  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.75;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Low-profile Sleek Tech Pedestal */}
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.65, 0.85, 0.5, 6]} />
        <meshStandardMaterial color="#0284c7" metalness={0.3} roughness={0.2} />
      </mesh>

      {/* Holographic Glowing Glass Core */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.2, 16]} />
        <meshStandardMaterial
          color={selectedGlassesColor}
          transparent
          opacity={0.65}
          roughness={0.1}
        />
      </mesh>

      {/* Floating 3D AIva Glasses */}
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <group ref={modelRef} position={[0, 1.2, 0]} scale={[2.8, 2.8, 2.8]}>
          <primitive object={cloned} />
        </group>
      </Float>

      {/* Interactive Color Orbs */}
      {[
        { color: "#06b6d4", pos: [-0.6, 0.65, 0.6] },
        { color: "#ec4899", pos: [0, 0.65, 0.8] },
        { color: "#fbbf24", pos: [0.6, 0.65, 0.6] },
      ].map((orb, i) => (
        <mesh
          key={i}
          position={orb.pos as [number, number, number]}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedGlassesColor(orb.color);
          }}
        >
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color={orb.color}
            emissive={orb.color}
            emissiveIntensity={selectedGlassesColor === orb.color ? 0.9 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function ObservatoryTelescope() {
  const tubeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (tubeRef.current) {
      tubeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.35;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Natural Stone Base */}
      <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.9, 1.1, 0.3, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.8} />
      </mesh>

      {/* Tripod Legs */}
      <mesh castShadow position={[-0.35, 0.65, 0.2]} rotation={[0.2, 0, -0.2]}>
        <cylinderGeometry args={[0.04, 0.06, 1.0, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh castShadow position={[0.35, 0.65, 0.2]} rotation={[0.2, 0, 0.2]}>
        <cylinderGeometry args={[0.04, 0.06, 1.0, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh castShadow position={[0, 0.65, -0.38]} rotation={[-0.25, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 1.0, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* Brass Mount Head */}
      <mesh position={[0, 1.15, 0]}>
        <sphereGeometry args={[0.14, 16, 12]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Telescope Tube */}
      <group ref={tubeRef} position={[0, 1.25, 0]} rotation={[0.4, 0, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.22, 1.2, 16]} />
          <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.08, 16]} />
          <meshStandardMaterial color="#67e8f9" metalness={0.3} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

function FairyCottagePavilion() {
  const smokeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (smokeRef.current) {
      smokeRef.current.position.y = 1.9 + Math.sin(state.clock.elapsedTime * 2.0) * 0.15;
      smokeRef.current.scale.setScalar(0.8 + Math.sin(state.clock.elapsedTime * 2.5) * 0.2);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* House Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1.2, 1.0, 1.2]} />
        <meshStandardMaterial color="#fef08a" roughness={0.6} />
      </mesh>
      {/* Sloped Roof */}
      <mesh castShadow position={[0, 1.3, 0]}>
        <coneGeometry args={[1.2, 0.8, 4]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.4} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.35, 0.61]}>
        <planeGeometry args={[0.35, 0.65]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Chimney */}
      <mesh castShadow position={[0.4, 1.5, 0.2]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#ef4444" roughness={0.5} />
      </mesh>
      {/* Animated Smoke Puff */}
      <mesh ref={smokeRef} position={[0.4, 1.9, 0.2]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function CrystalShieldMonument() {
  const gyroRef = useRef<THREE.Group>(null);
  const gemRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (gyroRef.current) gyroRef.current.rotation.y += delta * 1.2;
    if (gemRef.current) gemRef.current.rotation.x += delta * 0.9;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 0.7, 16]} />
        <meshStandardMaterial color="#0f766e" roughness={0.3} />
      </mesh>

      <group ref={gyroRef} position={[0, 1.15, 0]}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.65, 0.04, 12, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, 0, 0]}>
          <torusGeometry args={[0.55, 0.04, 12, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      <mesh ref={gemRef} position={[0, 1.15, 0]}>
        <octahedronGeometry args={[0.38]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.65}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

function FamilyGazebo() {
  return (
    <group position={[0, 0, 0]}>
      {[-0.55, 0.55].flatMap((x) =>
        [-0.55, 0.55].map((z, idx) => (
          <mesh key={`${x}-${z}-${idx}`} castShadow position={[x, 0.65, z]}>
            <cylinderGeometry args={[0.07, 0.08, 1.3, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
        ))
      )}
      <mesh castShadow position={[0, 1.55, 0]}>
        <coneGeometry args={[1.1, 0.65, 4]} />
        <meshStandardMaterial color="#ea580c" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#d97706" />
      </mesh>
    </group>
  );
}

function ArtistPaletteStudio() {
  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[-0.25, 0.6, -0.1]} rotation={[0.1, 0, -0.15]}>
        <boxGeometry args={[0.06, 1.3, 0.06]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh castShadow position={[0.25, 0.6, -0.1]} rotation={[0.1, 0, 0.15]}>
        <boxGeometry args={[0.06, 1.3, 0.06]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh castShadow position={[0, 0.75, 0.05]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.85, 0.65, 0.06]} />
        <meshStandardMaterial color="#fdf4ff" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.42, 0.2]} rotation={[-Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 16]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.2} />
      </mesh>
    </group>
  );
}

function CarnivalTent() {
  const starRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (starRef.current) starRef.current.rotation.y += delta * 1.5;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.85, 0.95, 0.9, 16]} />
        <meshStandardMaterial color="#e0e7ff" roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0]}>
        <coneGeometry args={[1.1, 0.9, 12]} />
        <meshStandardMaterial color="#4f46e5" roughness={0.3} />
      </mesh>
      <mesh ref={starRef} position={[0, 1.95, 0]}>
        <octahedronGeometry args={[0.22]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function CelebrationGiftFountain() {
  const giftRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (giftRef.current) {
      giftRef.current.position.y = 0.85 + Math.sin(state.clock.elapsedTime * 2.2) * 0.1;
      giftRef.current.rotation.y += 0.015;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh castShadow position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.3, 1.5, 0.4, 24]} />
        <meshStandardMaterial color="#f87171" roughness={0.3} />
      </mesh>

      <group ref={giftRef} position={[0, 0.85, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.75, 0.75, 0.75]} />
          <meshStandardMaterial color="#e11d48" roughness={0.2} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.77, 0.77, 0.16]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.16, 0.77, 0.77]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.44, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

/* ================= 9. HARMONIOUS TREES & FOLIAGE ================= */

function HarmoniousGardenFoliage() {
  const trees: { pos: [number, number, number]; color: string; scale: number }[] = [
    // Entrance Cherry Blossom Gate
    { pos: [-5.5, 0, 28], color: "#f472b6", scale: 1.2 },
    { pos: [5.5, 0, 28], color: "#f472b6", scale: 1.2 },

    // Middle Exploration Area Trees
    { pos: [-18, 0, 22], color: "#16a34a", scale: 1.3 },
    { pos: [19, 0, 18], color: "#22c55e", scale: 1.25 },
    { pos: [-22, 0, 12], color: "#4ade80", scale: 1.35 },
    { pos: [-20, 0, 0], color: "#16a34a", scale: 1.4 },
    { pos: [22, 0, -6], color: "#22c55e", scale: 1.3 },
    { pos: [-19, 0, -14], color: "#f472b6", scale: 1.3 },
    { pos: [20, 0, -20], color: "#16a34a", scale: 1.35 },
    { pos: [-14, 0, -28], color: "#4ade80", scale: 1.3 },
    { pos: [14, 0, -28], color: "#f472b6", scale: 1.3 },

    // Distant background trees for depth illusion
    { pos: [-38, 0, -40], color: "#15803d", scale: 2.0 },
    { pos: [40, 0, -36], color: "#15803d", scale: 2.0 },
    { pos: [-42, 0, 25], color: "#166534", scale: 2.1 },
    { pos: [45, 0, 18], color: "#166534", scale: 2.1 },
    { pos: [-25, 0, 48], color: "#15803d", scale: 2.0 },
    { pos: [28, 0, 46], color: "#15803d", scale: 2.0 },
  ];

  return (
    <group>
      {trees.map((item, idx) => (
        <group key={idx} position={item.pos} scale={[item.scale, item.scale, item.scale]}>
          <mesh castShadow position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.16, 0.28, 1.7, 8]} />
            <meshStandardMaterial color="#78350f" roughness={0.8} />
          </mesh>
          <mesh castShadow position={[0, 1.85, 0]}>
            <sphereGeometry args={[1.0, 12, 10]} />
            <meshStandardMaterial color={item.color} roughness={0.6} />
          </mesh>
          <mesh castShadow position={[0, 2.6, 0]}>
            <sphereGeometry args={[0.7, 10, 8]} />
            <meshStandardMaterial color={item.color} roughness={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
