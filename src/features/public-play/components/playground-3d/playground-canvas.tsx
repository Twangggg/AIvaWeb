"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { PlaygroundWorld } from "./playground-world";
import { PlayerCharacter } from "./player-character";
import { VirtualJoystick } from "./virtual-joystick";
import { StationPromptOverlay } from "./station-prompt-overlay";
import type { StationId } from "../../store/usePlayModeStore";

interface PlaygroundCanvasProps {
  onInteractStation: (stationId: StationId) => void;
}

export function PlaygroundCanvas({ onInteractStation }: PlaygroundCanvasProps) {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
      <Canvas
        shadows
        camera={{ position: [0, 8, 12], fov: 48 }}
        className="h-full w-full touch-none"
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.75} />
          <directionalLight
            castShadow
            position={[10, 18, 10]}
            intensity={1.3}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={40}
            shadow-camera-left={-16}
            shadow-camera-right={16}
            shadow-camera-top={16}
            shadow-camera-bottom={-16}
          />
          <hemisphereLight args={["#bae6fd", "#bbf7d0", 0.4]} />

          {/* Dreamy sky fog */}
          <fog attach="fog" args={["#bae6fd", 15, 38]} />

          {/* 3D World */}
          <PlaygroundWorld />

          {/* 3D Player Character */}
          <PlayerCharacter onInteractStation={onInteractStation} />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      <VirtualJoystick />
      <StationPromptOverlay onInteractStation={onInteractStation} />
    </div>
  );
}
