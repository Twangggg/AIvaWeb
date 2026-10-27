"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { GardenWorld } from "./garden-world";
import { GardenPlayer } from "./garden-player";
import { GardenHUD } from "./garden-hud";
import { GardenStationModal } from "./garden-station-modal";
import { PhotoModeOverlay } from "./photo-mode-overlay";
import { useGardenStore, type GardenStationId } from "../store/useGardenStore";
import { gardenSound } from "../audio/garden-soundscape";

interface LandingGardenCanvasProps {
  onOpenPreorder?: () => void;
  onOpenJournal: () => void;
}

export function LandingGardenCanvas({
  onOpenPreorder,
  onOpenJournal,
}: LandingGardenCanvasProps) {
  const {
    timeOfDay,
    soundEnabled,
    setActiveStationId,
    clickMoveTarget,
    setClickMoveTarget,
  } = useGardenStore();

  useEffect(() => {
    gardenSound.setMuted(!soundEnabled);
  }, [soundEnabled]);

  const handleInteract = (stationId: GardenStationId) => {
    setActiveStationId(stationId);
  };

  const handleGroundPointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Only capture clicks on the ground plane, don't interfere with station interaction clicks
    if (e.point) {
      gardenSound.enableOnUserInteraction();
      setClickMoveTarget([e.point.x, 0, e.point.z]);
    }
  };

  // Visual ambiance presets based on timeOfDay
  const isNight = timeOfDay === "night";
  const isSunset = timeOfDay === "sunset";

  const dirLightColor = isNight ? "#93c5fd" : isSunset ? "#fed7aa" : "#fffbeb";
  const dirLightIntensity = isNight ? 0.6 : isSunset ? 1.15 : 1.45;
  const ambientIntensity = isNight ? 0.45 : isSunset ? 0.75 : 0.85;
  const fogColor = isNight ? "#0f172a" : isSunset ? "#fed7aa" : "#e0f2fe";

  const bgGradient = isNight
    ? "bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900"
    : isSunset
    ? "bg-gradient-to-b from-amber-400 via-rose-300 to-indigo-950"
    : "bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-100 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900";

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className={`relative h-screen w-screen overflow-hidden ${bgGradient} transition-colors duration-700`}
    >
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [0, 8, 22], fov: 48 }}
        className="h-full w-full touch-none"
      >
        <Suspense fallback={null}>
          {/* Dynamic Sun/Moon and Ambiance Lights */}
          <ambientLight intensity={ambientIntensity} />
          <directionalLight
            castShadow
            position={isSunset ? [24, 18, 15] : [18, 30, 22]}
            intensity={dirLightIntensity}
            color={dirLightColor}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={75}
            shadow-camera-left={-36}
            shadow-camera-right={36}
            shadow-camera-top={36}
            shadow-camera-bottom={-36}
          />
          <hemisphereLight
            args={[
              isNight ? "#1e1b4b" : isSunset ? "#f59e0b" : "#bae6fd",
              isNight ? "#064e3b" : isSunset ? "#7c2d12" : "#bbf7d0",
              0.5,
            ]}
          />

          {/* Dreamy soft horizon fog blending ground and sky */}
          <fog attach="fog" args={[fogColor, 35, 120]} />

          {/* Transparent Raycast Plane for Click-to-Move */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.01, 0]}
            onPointerDown={handleGroundPointerDown}
            visible={false}
          >
            <circleGeometry args={[36, 32]} />
            <meshBasicMaterial />
          </mesh>

          {/* Click-to-Move Target Destination Beacon */}
          {clickMoveTarget && <DestinationBeacon target={clickMoveTarget} />}

          {/* 3D Garden World & Path */}
          <GardenWorld />

          {/* 3D Player Character on the Path */}
          <GardenPlayer onInteractStation={handleInteract} />
        </Suspense>
      </Canvas>

      {/* 2D HUD UI Layer */}
      <GardenHUD
        onOpenJournal={onOpenJournal}
        onOpenPreorder={onOpenPreorder}
      />

      {/* Station Story Diorama Modal */}
      <GardenStationModal onOpenPreorder={onOpenPreorder} />

      {/* Photo Mode Viewfinder & Controls */}
      <PhotoModeOverlay />
    </div>
  );
}

function DestinationBeacon({ target }: { target: [number, number, number] }) {
  const beaconRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (beaconRef.current) {
      const t = state.clock.getElapsedTime();
      const s = 1 + Math.sin(t * 8) * 0.2;
      beaconRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={target}>
      {/* Animated Glowing Ring */}
      <mesh ref={beaconRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[0.35, 0.5, 24]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>
      {/* Center point beam */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
