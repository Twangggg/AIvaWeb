"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture, Billboard } from "@react-three/drei";
import * as THREE from "three";
import {
  GARDEN_STATIONS,
  GARDEN_SHARDS,
  useGardenStore,
  type GardenStationId,
} from "../store/useGardenStore";
import { gardenSound } from "../audio/garden-soundscape";

interface GardenPlayerProps {
  onInteractStation?: (stationId: GardenStationId) => void;
}

export function GardenPlayer({ onInteractStation }: GardenPlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const {
    joystick,
    jumpCount,
    nearbyStationId,
    setNearbyStationId,
    setCurrentStationIndex,
    autoWalkTarget,
    setAutoWalkTarget,
    clickMoveTarget,
    setClickMoveTarget,
    collectedShards,
    addShard,
    playerModelType,
  } = useGardenStore();

  const keys = useRef<{ [key: string]: boolean }>({});
  // Start player near Station 01 (Gate): [0, 0, 29]
  const pos = useRef(new THREE.Vector3(0, 0, 29));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const currentSpeed = useRef(0);
  const verticalVel = useRef(0);
  const isGrounded = useRef(true);
  const facingAngle = useRef(Math.PI);
  const turnTilt = useRef(0);
  const jumpSpin = useRef(0);
  const prevJumpCount = useRef(jumpCount);
  const isMovingRef = useRef(false);
  const idleTimer = useRef(0);
  const lastNearbyStation = useRef<GardenStationId | null>(null);

  // Right-click Camera Orbit & Zoom Controls
  const isRightDragging = useRef(false);
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraYaw = useRef(0);
  const cameraPitch = useRef(0.62);
  const cameraDistance = useRef(12.5);

  // Keyboard & Mouse controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      gardenSound.enableOnUserInteraction();
      keys.current[e.code] = true;
      if (
        e.code === "KeyW" ||
        e.code === "KeyS" ||
        e.code === "KeyA" ||
        e.code === "KeyD" ||
        e.code.startsWith("Arrow")
      ) {
        setAutoWalkTarget(null);
        setClickMoveTarget(null);
      }
      if (e.code === "KeyE" || e.code === "Enter") {
        if (nearbyStationId) {
          onInteractStation?.(nearbyStationId);
        }
      }
      if (e.code === "KeyC" || e.code === "KeyR") {
        cameraYaw.current = 0;
        cameraPitch.current = 0.62;
        cameraDistance.current = 12.5;
      }
      if (e.code === "Space" && isGrounded.current) {
        verticalVel.current = 8.0;
        isGrounded.current = false;
        jumpSpin.current = 0;
        gardenSound.playJump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        // Right click
        isRightDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
        idleTimer.current = 0;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isRightDragging.current) {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        lastMouse.current = { x: e.clientX, y: e.clientY };

        cameraYaw.current -= dx * 0.006;
        cameraPitch.current = THREE.MathUtils.clamp(
          cameraPitch.current + dy * 0.005,
          0.12,
          1.28
        );
        idleTimer.current = 0;
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 2) {
        isRightDragging.current = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      cameraDistance.current = THREE.MathUtils.clamp(
        cameraDistance.current + e.deltaY * 0.012,
        6.5,
        25.0
      );
      idleTimer.current = 0;
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [nearbyStationId, onInteractStation, setAutoWalkTarget, setClickMoveTarget]);

  // Touch jump from mobile
  useEffect(() => {
    if (jumpCount > prevJumpCount.current && isGrounded.current) {
      gardenSound.enableOnUserInteraction();
      verticalVel.current = 8.0;
      isGrounded.current = false;
      jumpSpin.current = 0;
      gardenSound.playJump();
    }
    prevJumpCount.current = jumpCount;
  }, [jumpCount]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const dt = Math.min(delta, 0.05);

    let inputX = 0;
    let inputZ = 0;
    let hasInput = false;

    // 1. Navigation Targets (Auto-Walk or Click-to-Move)
    const activeTarget = autoWalkTarget || clickMoveTarget;
    if (activeTarget) {
      const diffX = activeTarget[0] - pos.current.x;
      const diffZ = activeTarget[2] - pos.current.z;
      const dist = Math.sqrt(diffX * diffX + diffZ * diffZ);

      if (dist > 0.4) {
        inputX = diffX / dist;
        inputZ = diffZ / dist;
        hasInput = true;
      } else {
        if (autoWalkTarget) setAutoWalkTarget(null);
        if (clickMoveTarget) setClickMoveTarget(null);
      }
    } else {
      // 2. Manual Controls
      let rawX = 0;
      let rawZ = 0;
      if (keys.current["KeyW"] || keys.current["ArrowUp"]) rawZ -= 1;
      if (keys.current["KeyS"] || keys.current["ArrowDown"]) rawZ += 1;
      if (keys.current["KeyA"] || keys.current["ArrowLeft"]) rawX -= 1;
      if (keys.current["KeyD"] || keys.current["ArrowRight"]) rawX += 1;

      if (Math.abs(joystick.x) > 0.08 || Math.abs(joystick.y) > 0.08) {
        rawX += joystick.x;
        rawZ += joystick.y;
      }

      const len = Math.sqrt(rawX * rawX + rawZ * rawZ);
      if (len > 0.05) {
        rawX /= Math.max(1, len);
        rawZ /= Math.max(1, len);

        // Transform movement relative to camera yaw
        inputX = rawX * Math.cos(cameraYaw.current) - rawZ * Math.sin(cameraYaw.current);
        inputZ = rawX * Math.sin(cameraYaw.current) + rawZ * Math.cos(cameraYaw.current);
        hasInput = true;
      }
    }

    // 3. Smooth Acceleration & Deceleration
    const maxSpeed = 7.5;
    const targetSpeed = hasInput ? maxSpeed : 0;
    const accelRate = hasInput ? 12 : 16;
    currentSpeed.current = THREE.MathUtils.damp(
      currentSpeed.current,
      targetSpeed,
      accelRate,
      dt
    );

    isMovingRef.current = currentSpeed.current > 0.25;

    // Footsteps SFX while grounded and moving
    if (isMovingRef.current && isGrounded.current) {
      gardenSound.playFootstep();
      idleTimer.current = 0;
    } else if (!hasInput) {
      idleTimer.current += dt;
    }

    // 4. Direct, crisp velocity without curved steering delay
    if (hasInput) {
      velocity.current.set(
        inputX * currentSpeed.current,
        0,
        inputZ * currentSpeed.current
      );
      facingAngle.current = Math.atan2(inputX, inputZ);
      turnTilt.current = 0;
    } else {
      turnTilt.current = 0;
      velocity.current.multiplyScalar(Math.max(0, 1 - 16 * dt));
    }

    // Apply smooth velocity to position
    pos.current.x += velocity.current.x * dt;
    pos.current.z += velocity.current.z * dt;

    // Garden fence perimeter boundary constraint (expanded 32.5m)
    const distFromCenter = Math.sqrt(
      pos.current.x * pos.current.x + pos.current.z * pos.current.z
    );
    if (distFromCenter > 32.5) {
      pos.current.x = (pos.current.x / distFromCenter) * 32.5;
      pos.current.z = (pos.current.z / distFromCenter) * 32.5;
    }

    // 5. Interactive Bouncy Mushrooms Detection
    const bouncyMushroom1 = new THREE.Vector2(-6.0, 9.0);
    const bouncyMushroom2 = new THREE.Vector2(6.5, -6.0);
    const player2D = new THREE.Vector2(pos.current.x, pos.current.z);

    if (
      isGrounded.current &&
      (player2D.distanceTo(bouncyMushroom1) < 1.1 || player2D.distanceTo(bouncyMushroom2) < 1.1)
    ) {
      verticalVel.current = 14.5; // Trampoline launch
      isGrounded.current = false;
      jumpSpin.current = 0;
      gardenSound.playMushroomBounce();
    }

    // 6. Jump Physics
    if (!isGrounded.current) {
      pos.current.y += verticalVel.current * dt;
      verticalVel.current -= 21 * dt;
      jumpSpin.current = 0;
      if (pos.current.y <= 0) {
        pos.current.y = 0;
        verticalVel.current = 0;
        isGrounded.current = true;
        jumpSpin.current = 0;
      }
    }

    // 7. Energy Shards Collection Detection
    for (const shard of GARDEN_SHARDS) {
      if (!collectedShards.includes(shard.id)) {
        const shardVec = new THREE.Vector3(...shard.position);
        if (pos.current.distanceTo(shardVec) < 1.35) {
          addShard(shard.id);
          gardenSound.playCollectShard();
          break;
        }
      }
    }

    // 8. Update Character Root Transform (No auto-rotation)
    groupRef.current.position.set(pos.current.x, pos.current.y, pos.current.z);
    if (playerModelType === "arms-down-2d") {
      // 2D Arms-down frog reference: Lock rotation to 0 (stable front reference for modeling/rigging)
      groupRef.current.rotation.set(0, 0, 0);
    } else {
      // 3D Mascot: face movement direction when moving, never auto-rotates when idle
      groupRef.current.rotation.set(0, facingAngle.current, 0);
    }

    // 9. Station Proximity Detection
    let nearest: GardenStationId | null = null;
    const minD = 2.8;

    for (const st of GARDEN_STATIONS) {
      const stVec = new THREE.Vector3(...st.position);
      const dist = pos.current.distanceTo(stVec);
      if (dist < minD) {
        nearest = st.id;
        setCurrentStationIndex(st.index);
        break;
      }
    }

    if (nearest !== lastNearbyStation.current) {
      if (nearest !== null) {
        gardenSound.playStationArrival();
      }
      lastNearbyStation.current = nearest;
      setNearbyStationId(nearest);
    }

    // 10. Smart Camera Follow with Manual Right-Click Drag Orbit (NO auto-drift)
    // Idle camera auto-drift is deleted so the camera NEVER rotates by itself!
    const dist = cameraDistance.current;
    const pitch = cameraPitch.current;
    const yaw = cameraYaw.current;

    const horizontalDist = dist * Math.cos(pitch);
    const camOffsetX = Math.sin(yaw) * horizontalDist;
    const camOffsetZ = Math.cos(yaw) * horizontalDist;
    const camOffsetY = Math.sin(pitch) * dist;

    const camTarget = new THREE.Vector3(
      pos.current.x + camOffsetX,
      pos.current.y + camOffsetY,
      pos.current.z + camOffsetZ
    );

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, camTarget.x, 6.0, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, camTarget.y, 7.5, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, camTarget.z, 6.0, dt);
    state.camera.lookAt(pos.current.x, pos.current.y + 1.15, pos.current.z);
  });

  return (
    <group ref={groupRef} position={[0, 0, 29]}>
      {/* Dynamic contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      {/* Character Model: 2D Arms-Down Frog Reference or 3D Model */}
      <Suspense fallback={<MascotPlaceholder />}>
        {playerModelType === "arms-down-2d" ? (
          <ArmsDownFrogMascot
            isMovingRef={isMovingRef}
            isGroundedRef={isGrounded}
            speedRef={currentSpeed}
          />
        ) : (
          <AnimatedMascot
            isMovingRef={isMovingRef}
            isGroundedRef={isGrounded}
            speedRef={currentSpeed}
          />
        )}
      </Suspense>
    </group>
  );
}

function AnimatedMascot({
  isMovingRef,
  isGroundedRef,
  speedRef,
}: {
  isMovingRef: React.MutableRefObject<boolean>;
  isGroundedRef: React.MutableRefObject<boolean>;
  speedRef: React.MutableRefObject<number>;
}) {
  const { scene } = useGLTF("/models/mascot.glb");
  const modelRef = useRef<THREE.Group>(null);

  const clonedScene = useMemo(() => {
    const c = scene.clone();
    c.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  useFrame((state, delta) => {
    if (!modelRef.current) return;
    const time = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);
    const baseScale = 1.45;

    const isMoving = isMovingRef.current;
    const isGrounded = isGroundedRef.current;
    const speed = speedRef.current;

    if (!isGrounded) {
      // In-air leap pose
      modelRef.current.position.y = 0.15;
      modelRef.current.scale.set(baseScale * 0.94, baseScale * 1.1, baseScale * 0.94);
      modelRef.current.rotation.x = -0.15;
    } else if (isMoving) {
      // Bouncy hopping gait proportional to speed
      const hopFreq = time * (10 + (speed / 7.5) * 4);
      const hopCycle = Math.abs(Math.sin(hopFreq));
      const hopHeight = hopCycle * 0.24 * (speed / 7.5);

      modelRef.current.position.y = hopHeight;

      // Elastic squash & stretch
      const stretch = (hopCycle - 0.5) * 0.12 * (speed / 7.5);
      modelRef.current.scale.set(
        baseScale * (1 - stretch * 0.5),
        baseScale * (1 + stretch),
        baseScale * (1 - stretch * 0.5)
      );

      // Forward lean proportional to speed
      const targetLean = 0.14 * (speed / 7.5);
      modelRef.current.rotation.x = THREE.MathUtils.damp(
        modelRef.current.rotation.x,
        targetLean,
        12,
        dt
      );
    } else {
      // Gentle idle breathing
      const breathe = Math.sin(time * 2.8) * 0.035;
      modelRef.current.position.y = THREE.MathUtils.damp(
        modelRef.current.position.y,
        breathe * 0.4,
        8,
        dt
      );
      modelRef.current.scale.set(
        baseScale * (1 - breathe * 0.3),
        baseScale * (1 + breathe),
        baseScale * (1 - breathe * 0.3)
      );
      modelRef.current.rotation.x = THREE.MathUtils.damp(
        modelRef.current.rotation.x,
        0,
        10,
        dt
      );
    }
  });

  return (
    <group ref={modelRef} scale={[1.45, 1.45, 1.45]}>
      <primitive object={clonedScene} />
    </group>
  );
}

function MascotPlaceholder() {
  return (
    <group position={[0, 0.6, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.55, 24, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.3} />
      </mesh>
    </group>
  );
}

function ArmsDownFrogMascot({
  isMovingRef,
  isGroundedRef,
  speedRef,
}: {
  isMovingRef: React.MutableRefObject<boolean>;
  isGroundedRef: React.MutableRefObject<boolean>;
  speedRef: React.MutableRefObject<number>;
}) {
  const texture = useTexture("/mascots/frog-arms-down-front.png", (tex) => {
    (tex as THREE.Texture).colorSpace = THREE.SRGBColorSpace;
  });
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);
    const baseW = 1.35;
    const baseH = 1.92;

    const isMoving = isMovingRef.current;
    const isGrounded = isGroundedRef.current;
    const speed = speedRef.current;

    if (!isGrounded) {
      // In-air leap stretch (no flip, no spin)
      meshRef.current.position.y = 1.15;
      meshRef.current.scale.set(baseW * 0.9, baseH * 1.12, 1);
    } else if (isMoving) {
      // Bouncy hopping gait (stable forward reference)
      const hopFreq = time * (11 + (speed / 7.5) * 4);
      const hopCycle = Math.abs(Math.sin(hopFreq));
      const hopHeight = 0.96 + hopCycle * 0.26 * (speed / 7.5);

      meshRef.current.position.y = hopHeight;

      const stretch = (hopCycle - 0.5) * 0.14 * (speed / 7.5);
      meshRef.current.scale.set(
        baseW * (1 - stretch * 0.5),
        baseH * (1 + stretch),
        1
      );
    } else {
      // Idle breathing (stable forward reference)
      const breathe = Math.sin(time * 2.8) * 0.035;
      meshRef.current.position.y = 0.96 + breathe * 0.25;
      meshRef.current.scale.set(
        baseW * (1 - breathe * 0.3),
        baseH * (1 + breathe),
        1
      );
    }
  });

  return (
    <Billboard follow={true} lockX={true} lockZ={true}>
      <mesh ref={meshRef} position={[0, 0.96, 0]} castShadow>
        <planeGeometry args={[1.35, 1.92]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.08}
          side={THREE.DoubleSide}
          roughness={0.4}
        />
      </mesh>
    </Billboard>
  );
}

useGLTF.preload("/models/mascot.glb");
useTexture.preload("/mascots/frog-arms-down-front.png");
