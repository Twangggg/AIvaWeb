"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { usePlayModeStore, STATIONS, type StationId } from "../../store/usePlayModeStore";

interface PlayerCharacterProps {
  onInteractStation?: (stationId: StationId) => void;
}

export function PlayerCharacter({ onInteractStation }: PlayerCharacterProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { joystick, jumpCount, setNearbyStation, nearbyStation } = usePlayModeStore();

  const keys = useRef<{ [key: string]: boolean }>({});
  const pos = useRef(new THREE.Vector3(0, 0, 4));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const currentSpeed = useRef(0);
  const verticalVel = useRef(0);
  const isGrounded = useRef(true);
  const facingAngle = useRef(0);
  const turnTilt = useRef(0);
  const jumpSpin = useRef(0);
  const prevJumpCount = useRef(jumpCount);
  const isMovingRef = useRef(false);

  // Keyboard event listeners (Zero React state re-render)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === "KeyE" || e.code === "Enter") {
        if (nearbyStation) {
          onInteractStation?.(nearbyStation);
        }
      }
      if (e.code === "Space" && isGrounded.current) {
        verticalVel.current = 7.5;
        isGrounded.current = false;
        jumpSpin.current = Math.PI * 2;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [nearbyStation, onInteractStation]);

  // Jump from mobile virtual button
  useEffect(() => {
    if (jumpCount > prevJumpCount.current && isGrounded.current) {
      verticalVel.current = 7.5;
      isGrounded.current = false;
      jumpSpin.current = Math.PI * 2;
    }
    prevJumpCount.current = jumpCount;
  }, [jumpCount]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const dt = Math.min(delta, 0.05);

    let inputX = 0;
    let inputZ = 0;
    let hasInput = false;

    if (keys.current["KeyW"] || keys.current["ArrowUp"]) inputZ -= 1;
    if (keys.current["KeyS"] || keys.current["ArrowDown"]) inputZ += 1;
    if (keys.current["KeyA"] || keys.current["ArrowLeft"]) inputX -= 1;
    if (keys.current["KeyD"] || keys.current["ArrowRight"]) inputX += 1;

    if (Math.abs(joystick.x) > 0.08 || Math.abs(joystick.y) > 0.08) {
      inputX += joystick.x;
      inputZ += joystick.y;
    }

    const inputLength = Math.sqrt(inputX * inputX + inputZ * inputZ);
    if (inputLength > 0.05) {
      inputX /= Math.max(1, inputLength);
      inputZ /= Math.max(1, inputLength);
      hasInput = true;
    }

    // Smooth Acceleration & Deceleration
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

    // Smooth Rotation via Shortest Angle
    if (hasInput) {
      const targetAngle = Math.atan2(inputX, inputZ);
      let angleDiff = targetAngle - facingAngle.current;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

      facingAngle.current += angleDiff * Math.min(1, 14 * dt);
      turnTilt.current = THREE.MathUtils.damp(turnTilt.current, -angleDiff * 0.35, 10, dt);

      velocity.current.set(
        Math.sin(facingAngle.current) * currentSpeed.current,
        0,
        Math.cos(facingAngle.current) * currentSpeed.current
      );
    } else {
      turnTilt.current = THREE.MathUtils.damp(turnTilt.current, 0, 12, dt);
      velocity.current.multiplyScalar(Math.max(0, 1 - 12 * dt));
    }

    pos.current.x += velocity.current.x * dt;
    pos.current.z += velocity.current.z * dt;

    const distFromOrigin = Math.sqrt(pos.current.x * pos.current.x + pos.current.z * pos.current.z);
    if (distFromOrigin > 14) {
      pos.current.x = (pos.current.x / distFromOrigin) * 14;
      pos.current.z = (pos.current.z / distFromOrigin) * 14;
    }

    // Jump & Gravity
    if (!isGrounded.current) {
      pos.current.y += verticalVel.current * dt;
      verticalVel.current -= 19 * dt;
      if (jumpSpin.current > 0) {
        jumpSpin.current = Math.max(0, jumpSpin.current - dt * 14);
      }
      if (pos.current.y <= 0) {
        pos.current.y = 0;
        verticalVel.current = 0;
        isGrounded.current = true;
        jumpSpin.current = 0;
      }
    }

    // Update Model Position
    groupRef.current.position.set(pos.current.x, pos.current.y, pos.current.z);
    groupRef.current.rotation.y = facingAngle.current + jumpSpin.current;
    groupRef.current.rotation.z = turnTilt.current;

    // Proximity check
    let closestStation: StationId | null = null;
    const minDistance = 2.8;

    for (const st of STATIONS) {
      const stPos = new THREE.Vector3(...st.position);
      const d = pos.current.distanceTo(stPos);
      if (d < minDistance) {
        closestStation = st.id;
        break;
      }
    }
    setNearbyStation(closestStation);

    // Smooth Camera Follow
    const camTarget = new THREE.Vector3(
      pos.current.x,
      pos.current.y + 7.5,
      pos.current.z + 9.5
    );
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, camTarget.x, 6, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, camTarget.y, 8, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, camTarget.z, 6, dt);
    state.camera.lookAt(pos.current.x, pos.current.y + 1.1, pos.current.z);
  });

  return (
    <group ref={groupRef} position={[0, 0, 4]}>
      {/* Contact shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[0.55, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.35} />
      </mesh>

      {/* Official 3D Mascot */}
      <Suspense fallback={<MascotFallback />}>
        <MascotModel
          isMovingRef={isMovingRef}
          isGroundedRef={isGrounded}
          speedRef={currentSpeed}
        />
      </Suspense>
    </group>
  );
}

function MascotModel({
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
      modelRef.current.position.y = 0.15;
      modelRef.current.scale.set(baseScale * 0.94, baseScale * 1.1, baseScale * 0.94);
      modelRef.current.rotation.x = -0.15;
    } else if (isMoving) {
      const hopFreq = time * (10 + (speed / 7.5) * 4);
      const hopCycle = Math.abs(Math.sin(hopFreq));
      const hopHeight = hopCycle * 0.24 * (speed / 7.5);

      modelRef.current.position.y = hopHeight;

      const stretch = (hopCycle - 0.5) * 0.12 * (speed / 7.5);
      modelRef.current.scale.set(
        baseScale * (1 - stretch * 0.5),
        baseScale * (1 + stretch),
        baseScale * (1 - stretch * 0.5)
      );

      const targetLean = 0.14 * (speed / 7.5);
      modelRef.current.rotation.x = THREE.MathUtils.damp(
        modelRef.current.rotation.x,
        targetLean,
        12,
        dt
      );
    } else {
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

function MascotFallback() {
  return (
    <group position={[0, 0.6, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.55, 24, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.3} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/mascot.glb");
