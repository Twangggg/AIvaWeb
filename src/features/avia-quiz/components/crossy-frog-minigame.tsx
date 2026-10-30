"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { quizSound } from "../sound";

interface CrossyFrogMinigameProps {
  onComplete: (result: { won: boolean; bonusPoints: number; stars: number }) => void;
  onSkip: () => void;
  soundEnabled?: boolean;
  lessonTitle?: string;
}

interface LaneConfig {
  row: number;
  type: "grass" | "road" | "river" | "stones" | "goal";
  speed: number; // positive = right, negative = left, 0 = static
  itemType: "car-bus" | "car-small" | "car-fast" | "lily" | "log" | "stone" | "none";
  itemCount: number;
  itemWidth: number;
  color?: string;
}

// 13 rows total: 0 = Goal, 12 = Starting Grass
const LANE_CONFIGS: LaneConfig[] = [
  { row: 0, type: "goal", speed: 0, itemType: "none", itemCount: 0, itemWidth: 0 },
  { row: 1, type: "goal", speed: 0, itemType: "none", itemCount: 0, itemWidth: 0 },
  { row: 2, type: "stones", speed: 0, itemType: "stone", itemCount: 5, itemWidth: 50 },
  { row: 3, type: "river", speed: -85, itemType: "log", itemCount: 3, itemWidth: 120 },
  { row: 4, type: "river", speed: 90, itemType: "lily", itemCount: 3, itemWidth: 68 },
  { row: 5, type: "river", speed: -95, itemType: "log", itemCount: 2, itemWidth: 135 },
  { row: 6, type: "river", speed: 80, itemType: "lily", itemCount: 4, itemWidth: 64 },
  { row: 7, type: "grass", speed: 0, itemType: "none", itemCount: 0, itemWidth: 0 },
  { row: 8, type: "road", speed: 120, itemType: "car-fast", itemCount: 2, itemWidth: 70, color: "#ec4899" },
  { row: 9, type: "road", speed: -95, itemType: "car-bus", itemCount: 2, itemWidth: 115, color: "#eab308" },
  { row: 10, type: "road", speed: 105, itemType: "car-small", itemCount: 3, itemWidth: 65, color: "#0ea5e9" },
  { row: 11, type: "grass", speed: 0, itemType: "none", itemCount: 0, itemWidth: 0 },
  { row: 12, type: "grass", speed: 0, itemType: "none", itemCount: 0, itemWidth: 0 },
];

export function CrossyFrogMinigame({
  onComplete,
  onSkip,
  soundEnabled = true,
  lessonTitle,
}: CrossyFrogMinigameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // React state solely for UI HUD overlays
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(35);
  const [gameState, setGameState] = useState<"intro" | "playing" | "won" | "lost">("playing");

  const COLS = 9;
  const ROWS = 13;

  // Refs for real-time physics to avoid any React re-render stutter
  const gameStateRef = useRef<"intro" | "playing" | "won" | "lost">("playing");
  const heartsRef = useRef(3);
  const timeLeftRef = useRef(35);
  const checkpointYRef = useRef(12);

  // Player state
  const playerRef = useRef({
    gridX: 4,
    gridY: 12,
    prevGridX: 4,
    prevGridY: 12,
    hopProgress: 1, // 0 to 1
    direction: "up" as "up" | "down" | "left" | "right",
    isInvulnerable: false,
    invulnerableTimer: 0,
    isFalling: false,
    fallTimer: 0,
    driftSpeed: 0, // current speed from floating log / lily pad
    screenX: 270,
    screenY: 660,
  });

  const totalTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  // Synchronize ref with state
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const triggerGameOver = useCallback((won: boolean) => {
    if (gameStateRef.current !== "playing") return;
    gameStateRef.current = won ? "won" : "lost";
    setGameState(won ? "won" : "lost");

    if (won) {
      quizSound.playMiniGameWin();
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    } else {
      quizSound.playMiniGameLose();
    }
  }, []);

  const respawn = useCallback(() => {
    const p = playerRef.current;
    p.gridY = checkpointYRef.current;
    p.gridX = 4;
    p.prevGridX = 4;
    p.prevGridY = checkpointYRef.current;
    p.hopProgress = 1;
    p.driftSpeed = 0;
    p.isFalling = false;
    p.isInvulnerable = true;
    p.invulnerableTimer = 1.6;
  }, []);

  // Countdown timer decoupled from game loop
  useEffect(() => {
    if (gameState !== "playing") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = Math.max(0, prev - 1);
        timeLeftRef.current = next;
        if (next === 0) {
          triggerGameOver(false);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, triggerGameOver]);

  // Player movement
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (gameStateRef.current !== "playing") return;
      const p = playerRef.current;
      if (p.isFalling) return;

      const newGridX = Math.max(0, Math.min(COLS - 1, Math.round(p.gridX) + dx));
      const newGridY = Math.max(0, Math.min(ROWS - 1, p.gridY + dy));

      if (newGridX === Math.round(p.gridX) && newGridY === p.gridY) return;

      p.prevGridX = p.gridX;
      p.prevGridY = p.gridY;
      p.gridX = newGridX;
      p.gridY = newGridY;
      p.hopProgress = 0; // Trigger hop animation

      if (dx > 0) p.direction = "right";
      else if (dx < 0) p.direction = "left";
      else if (dy > 0) p.direction = "down";
      else if (dy < 0) p.direction = "up";

      quizSound.playMiniGameMove();

      // Checkpoint at rest grass
      if (newGridY === 7 && checkpointYRef.current > 7) {
        checkpointYRef.current = 7;
      }

      // Check win condition
      if (newGridY <= 1) {
        triggerGameOver(true);
      }
    },
    [COLS, ROWS, triggerGameOver]
  );

  // -------------------------------------------------------------
  // Persistent 60 FPS Canvas Game Loop
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 540;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    const cellW = width / COLS;
    const cellH = height / ROWS;

    // Splash particles
    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; size: number; color: string }[] = [];

    const renderLoop = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      // Cap delta time to 0.033s to eliminate any sudden physics spikes
      const dt = Math.min(0.033, (timestamp - lastTimestampRef.current) / 1000);
      lastTimestampRef.current = timestamp;

      totalTimeRef.current += dt;
      const t = totalTimeRef.current;
      const p = playerRef.current;

      // Update Invulnerability
      if (p.isInvulnerable) {
        p.invulnerableTimer -= dt;
        if (p.invulnerableTimer <= 0) p.isInvulnerable = false;
      }

      // Smooth hop progression
      if (p.hopProgress < 1) {
        // Fast, satisfying hop curve (120ms total)
        p.hopProgress = Math.min(1, p.hopProgress + dt * 8.5);
      }

      // Current lane config
      const curLane = LANE_CONFIGS[p.gridY];

      // Interpolate frog render coordinates
      // Ease out cubic
      const hopEased = 1 - Math.pow(1 - p.hopProgress, 3);
      const lerpGridX = p.prevGridX + (p.gridX - p.prevGridX) * hopEased;
      const lerpGridY = p.prevGridY + (p.gridY - p.prevGridY) * hopEased;

      let pixelX = lerpGridX * cellW + cellW / 2;
      const pixelY = lerpGridY * cellH + cellH / 2;

      // Handle river drifting smoothly
      if (curLane.type === "river" && !p.isFalling && gameStateRef.current === "playing") {
        let onFloatingSurface = false;
        let padSpeed = 0;

        // Calculate positions of all floating items on this lane mathematically
        const laneWidth = width + curLane.itemWidth * 2;
        const spacing = laneWidth / curLane.itemCount;

        for (let i = 0; i < curLane.itemCount; i++) {
          // Continuous, butter-smooth position using modulo
          const rawX = (i * spacing + curLane.speed * t) % laneWidth;
          const itemX = rawX < 0 ? rawX + laneWidth - curLane.itemWidth : rawX - curLane.itemWidth;

          if (pixelX >= itemX - 6 && pixelX <= itemX + curLane.itemWidth + 6) {
            onFloatingSurface = true;
            padSpeed = curLane.speed;
            break;
          }
        }

        if (onFloatingSurface && p.hopProgress >= 0.7) {
          // Drift smoothly with log / lily pad
          p.gridX += (padSpeed * dt) / cellW;
          p.prevGridX = p.gridX;

          // If drifted outside canvas boundaries -> fall into water
          if (p.gridX < -0.4 || p.gridX > COLS - 0.6) {
            onFloatingSurface = false;
          }
        }

        // Falling into water condition
        if (!onFloatingSurface && p.hopProgress >= 0.85) {
          p.isFalling = true;
          quizSound.playMiniGameFall();

          // Water splash particles
          for (let i = 0; i < 18; i++) {
            particles.push({
              x: pixelX,
              y: pixelY,
              vx: (Math.random() - 0.5) * 160,
              vy: (Math.random() - 0.5) * 160,
              alpha: 1,
              size: 3 + Math.random() * 4,
              color: "#38bdf8",
            });
          }

          heartsRef.current -= 1;
          setHearts(heartsRef.current);
          if (heartsRef.current <= 0) {
            triggerGameOver(false);
          } else {
            setTimeout(respawn, 550);
          }
        }
      }

      // Check Road vehicle collisions
      if (curLane.type === "road" && !p.isInvulnerable && !p.isFalling && gameStateRef.current === "playing") {
        const frogLeft = pixelX - cellW * 0.25;
        const frogRight = pixelX + cellW * 0.25;
        const frogTop = pixelY - cellH * 0.25;
        const frogBottom = pixelY + cellH * 0.25;

        const laneWidth = width + curLane.itemWidth * 2;
        const spacing = laneWidth / curLane.itemCount;

        for (let i = 0; i < curLane.itemCount; i++) {
          const rawX = (i * spacing + curLane.speed * t) % laneWidth;
          const carX = rawX < 0 ? rawX + laneWidth - curLane.itemWidth : rawX - curLane.itemWidth;
          const carY = curLane.row * cellH + 4;
          const carH = cellH - 8;

          const carLeft = carX + 4;
          const carRight = carX + curLane.itemWidth - 4;
          const carTop = carY + 4;
          const carBottom = carY + carH - 4;

          const collided =
            frogLeft < carRight &&
            frogRight > carLeft &&
            frogTop < carBottom &&
            frogBottom > carTop;

          if (collided) {
            p.isFalling = true;
            quizSound.playMiniGameFall();

            // Collision sparks
            for (let k = 0; k < 14; k++) {
              particles.push({
                x: pixelX,
                y: pixelY,
                vx: (Math.random() - 0.5) * 180,
                vy: (Math.random() - 0.5) * 180,
                alpha: 1,
                size: 3 + Math.random() * 4,
                color: "#f59e0b",
              });
            }

            heartsRef.current -= 1;
            setHearts(heartsRef.current);
            if (heartsRef.current <= 0) {
              triggerGameOver(false);
            } else {
              setTimeout(respawn, 550);
            }
            break;
          }
        }
      }

      // -------------------------------------------------------------
      // RENDER CANVAS SCENE (ZERO STUTTER)
      // -------------------------------------------------------------
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Lanes
      LANE_CONFIGS.forEach((lane) => {
        const laneY = lane.row * cellH;

        if (lane.type === "goal") {
          // Lush Green Goal Bank with Lotus Pattern & Golden Pedestals
          ctx.fillStyle = lane.row === 0 ? "#15803d" : "#22c55e";
          ctx.fillRect(0, laneY, width, cellH);

          // Golden star markers
          ctx.fillStyle = "#fef08a";
          for (let c = 0; c < COLS; c++) {
            ctx.beginPath();
            ctx.arc((c + 0.5) * cellW, laneY + cellH * 0.5, 4.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Goal Flag on row 0
          if (lane.row === 0) {
            ctx.fillStyle = "#f59e0b";
            ctx.fillRect(width * 0.5 - 2, laneY + 6, 4, cellH - 12);
            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.moveTo(width * 0.5 + 2, laneY + 8);
            ctx.lineTo(width * 0.5 + 24, laneY + 16);
            ctx.lineTo(width * 0.5 + 2, laneY + 24);
            ctx.fill();
          }
        } else if (lane.type === "stones") {
          // Shimmering Pond with Stepping Stones
          ctx.fillStyle = "#0284c7";
          ctx.fillRect(0, laneY, width, cellH);

          // Water ripple wave
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          const waveShift = (t * 40) % width;
          ctx.moveTo(-width + waveShift, laneY + cellH * 0.5);
          ctx.lineTo(width * 2 + waveShift, laneY + cellH * 0.5);
          ctx.stroke();

          // Stepping Stones
          for (let c = 1; c < COLS; c += 2) {
            const stoneX = (c + 0.5) * cellW;
            const stoneY = laneY + cellH * 0.5;
            ctx.fillStyle = "#64748b";
            ctx.beginPath();
            ctx.ellipse(stoneX, stoneY + 2, cellW * 0.42, cellH * 0.38, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#94a3b8";
            ctx.beginPath();
            ctx.ellipse(stoneX - 2, stoneY - 2, cellW * 0.35, cellH * 0.3, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (lane.type === "river") {
          // Deep Blue Water
          ctx.fillStyle = lane.row % 2 === 0 ? "#0369a1" : "#0284c7";
          ctx.fillRect(0, laneY, width, cellH);

          // Moving River Highlights
          ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
          const waveSpeed = lane.speed * 0.5;
          const shift = ((t * waveSpeed) % 80 + 80) % 80;
          for (let x = -80 + shift; x < width + 80; x += 90) {
            ctx.fillRect(x, laneY + cellH * 0.45, 38, 3.5);
          }

          // Draw River Objects (Continuous Math-based)
          const laneWidth = width + lane.itemWidth * 2;
          const spacing = laneWidth / lane.itemCount;

          for (let i = 0; i < lane.itemCount; i++) {
            const rawX = (i * spacing + lane.speed * t) % laneWidth;
            const itemX = rawX < 0 ? rawX + laneWidth - lane.itemWidth : rawX - lane.itemWidth;
            const itemY = laneY + 4;
            const itemH = cellH - 8;

            if (lane.itemType === "lily") {
              // Round Lily Pad
              const r = lane.itemWidth / 2;
              const cx = itemX + r;
              const cy = itemY + itemH / 2;

              ctx.fillStyle = "#15803d";
              ctx.beginPath();
              ctx.arc(cx, cy, r, 0.25, Math.PI * 1.8);
              ctx.lineTo(cx, cy);
              ctx.closePath();
              ctx.fill();

              // Leaf veins
              ctx.strokeStyle = "#4ade80";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.arc(cx, cy, r * 0.7, 0.35, Math.PI * 1.7);
              ctx.stroke();

              // Lotus Flower
              if (i % 2 === 0) {
                ctx.fillStyle = "#f472b6";
                ctx.beginPath();
                ctx.arc(cx + 8, cy - 6, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#fde047";
                ctx.beginPath();
                ctx.arc(cx + 8, cy - 6, 3, 0, Math.PI * 2);
                ctx.fill();
              }
            } else if (lane.itemType === "log") {
              // Bamboo Raft / Wood Log
              ctx.fillStyle = "#b45309";
              ctx.beginPath();
              ctx.roundRect(itemX, itemY + 2, lane.itemWidth, itemH - 4, 10);
              ctx.fill();

              // Log segments
              ctx.fillStyle = "#78350f";
              for (let lx = itemX + 16; lx < itemX + lane.itemWidth - 10; lx += 22) {
                ctx.fillRect(lx, itemY + 4, 3, itemH - 8);
              }
            }
          }
        } else if (lane.type === "grass") {
          // Safe Rest & Start Grass
          ctx.fillStyle = lane.row === 7 ? "#16a34a" : "#15803d";
          ctx.fillRect(0, laneY, width, cellH);

          // Decorative wildflowers
          ctx.fillStyle = lane.row === 7 ? "#fde047" : "#86efac";
          for (let c = 0; c < COLS; c += 2) {
            ctx.beginPath();
            ctx.arc((c + 0.5) * cellW, laneY + cellH * 0.5, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (lane.type === "road") {
          // Asphalt Paved Road
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(0, laneY, width, cellH);

          // White Dashed Highway Line
          ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
          ctx.lineWidth = 2.5;
          ctx.setLineDash([16, 16]);
          ctx.beginPath();
          ctx.moveTo(0, laneY + cellH);
          ctx.lineTo(width, laneY + cellH);
          ctx.stroke();
          ctx.setLineDash([]);

          // Draw Road Vehicles (Continuous Math-based)
          const laneWidth = width + lane.itemWidth * 2;
          const spacing = laneWidth / lane.itemCount;

          for (let i = 0; i < lane.itemCount; i++) {
            const rawX = (i * spacing + lane.speed * t) % laneWidth;
            const carX = rawX < 0 ? rawX + laneWidth - lane.itemWidth : rawX - lane.itemWidth;
            const carY = laneY + 5;
            const carH = cellH - 10;

            if (lane.itemType === "car-bus") {
              // Yellow School Bus
              ctx.fillStyle = lane.color || "#eab308";
              ctx.beginPath();
              ctx.roundRect(carX, carY, lane.itemWidth, carH, 8);
              ctx.fill();

              // Bus Windows
              ctx.fillStyle = "#0f172a";
              for (let wx = carX + 12; wx < carX + lane.itemWidth - 14; wx += 18) {
                ctx.fillRect(wx, carY + 6, 12, carH * 0.38);
              }

              // Lights
              ctx.fillStyle = "#fef08a";
              const lightX = lane.speed < 0 ? carX + 3 : carX + lane.itemWidth - 8;
              ctx.fillRect(lightX, carY + 4, 5, 7);
              ctx.fillRect(lightX, carY + carH - 11, 5, 7);
            } else {
              // Eco Car
              ctx.fillStyle = lane.color || "#0ea5e9";
              ctx.beginPath();
              ctx.roundRect(carX, carY, lane.itemWidth, carH, 8);
              ctx.fill();

              // Windshield
              ctx.fillStyle = "#0f172a";
              const wsX = lane.speed > 0 ? carX + lane.itemWidth * 0.55 : carX + 10;
              ctx.fillRect(wsX, carY + 6, lane.itemWidth * 0.3, carH * 0.45);
            }
          }
        }
      });

      // 2. Draw Frog Mascot
      const frogHopLift = Math.sin(p.hopProgress * Math.PI) * 16;
      const frogScreenY = pixelY - frogHopLift;

      // Soft oval shadow under frog
      ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
      ctx.beginPath();
      ctx.ellipse(pixelX, pixelY + 12, cellW * 0.28, cellH * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();

      // Invulnerability blinking
      if (!p.isInvulnerable || Math.floor(t * 10) % 2 === 0) {
        ctx.save();
        ctx.translate(pixelX, frogScreenY);

        // Rotation
        if (p.direction === "left") ctx.rotate(-Math.PI / 2);
        else if (p.direction === "right") ctx.rotate(Math.PI / 2);
        else if (p.direction === "down") ctx.rotate(Math.PI);

        // Scale jump bounce
        const scale = 1 + Math.sin(p.hopProgress * Math.PI) * 0.16;
        ctx.scale(scale, scale);

        // Frog Green Body (Larger, cuter proportions)
        ctx.fillStyle = "#22c55e";
        ctx.beginPath();
        ctx.ellipse(0, 3, cellW * 0.32, cellH * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Frog Cream Belly
        ctx.fillStyle = "#bbf7d0";
        ctx.beginPath();
        ctx.ellipse(0, 7, cellW * 0.2, cellH * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Big Cheerful Frog Eyes
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(-cellW * 0.16, -cellH * 0.18, cellW * 0.12, 0, Math.PI * 2);
        ctx.arc(cellW * 0.16, -cellH * 0.18, cellW * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(-cellW * 0.16, -cellH * 0.2, cellW * 0.06, 0, Math.PI * 2);
        ctx.arc(cellW * 0.16, -cellH * 0.2, cellW * 0.06, 0, Math.PI * 2);
        ctx.fill();

        // Cheerful pink cheeks
        ctx.fillStyle = "rgba(244, 114, 182, 0.7)";
        ctx.beginPath();
        ctx.arc(-cellW * 0.22, 4, 4.5, 0, Math.PI * 2);
        ctx.arc(cellW * 0.22, 4, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 3. Update & Draw Particles (Water Splash / Sparks)
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha -= dt * 2.2;

        if (pt.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [triggerGameOver, respawn]); // Minimal deps: renderLoop persists without teardown

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (["ArrowDown", "KeyS"].includes(e.code)) {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (["ArrowLeft", "KeyA"].includes(e.code)) {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (["ArrowRight", "KeyD"].includes(e.code)) {
        e.preventDefault();
        movePlayer(1, 0);
      } else if (e.code === "Space") {
        e.preventDefault();
        movePlayer(0, -1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [movePlayer]);

  // Touch Swipe & Tap gesture handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 20) {
      // Tap on canvas = Hop Forward
      movePlayer(0, -1);
    } else if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      movePlayer(dx > 0 ? 1 : -1, 0);
    } else {
      // Vertical swipe
      movePlayer(0, dy > 0 ? 1 : -1);
    }
    touchStartRef.current = null;
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto rounded-3xl bg-gradient-to-b from-sky-400/20 via-emerald-100/40 to-emerald-200/50 p-2 sm:p-4 shadow-xl border border-emerald-300 dark:border-emerald-800 dark:from-slate-900 dark:to-slate-950 select-none overflow-hidden">
      {/* Top Banner: Informing that this is a Post-Lesson Bonus Challenge */}
      <div className="w-full flex items-center justify-between gap-2 px-3 py-2 mb-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-emerald-300/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">🐸</span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide truncate">
              Thử Thách Thưởng: Vượt Sông Avia
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
              {lessonTitle ? `Sau bài: ${lessonTitle}` : "Hoàn thành bài học để rinh thêm sao!"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Heart Lives */}
          <div className="flex items-center gap-1 bg-rose-50 dark:bg-rose-950/60 px-2 py-1 rounded-xl border border-rose-200 dark:border-rose-900/40">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className={`text-sm transition-transform duration-200 ${
                  i < hearts ? "scale-100 opacity-100" : "scale-75 opacity-25 grayscale"
                }`}
              >
                ❤️
              </span>
            ))}
          </div>

          {/* Time Countdown */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border font-black text-xs ${
              timeLeft <= 10
                ? "bg-rose-500 text-white animate-pulse border-rose-600"
                : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800"
            }`}
          >
            <span>⏱️</span>
            <span>{timeLeft}s</span>
          </div>

          {/* Skip Button */}
          <button
            type="button"
            onClick={onSkip}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition active:scale-95 whitespace-nowrap shadow-xs"
            title="Bỏ qua thử thách thưởng để xem bảng điểm bài học"
          >
            Bỏ qua ➔
          </button>
        </div>
      </div>

      {/* Main Canvas Container (Responsive 3:4 Aspect Ratio) */}
      <div className="relative w-full aspect-[3/4] max-h-[500px] flex items-center justify-center rounded-2xl overflow-hidden shadow-inner border-2 border-emerald-400/50 bg-slate-900">
        <canvas
          ref={canvasRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full object-contain cursor-pointer touch-none"
        />

        {/* Victory Modal */}
        {gameState === "won" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20 animate-in fade-in zoom-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border-2 border-emerald-400 max-w-sm w-full space-y-4">
              <span className="text-5xl animate-bounce">🏆</span>
              <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-300">
                XUẤT SẮC! BÉ ĐÃ VỀ ĐÍCH!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Bé đã giúp Ếch Avia vượt sông an toàn và nhận thêm điểm thưởng!
              </p>

              <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-2xl border border-emerald-200">
                <span className="text-2xl">⭐</span>
                <span className="font-black text-emerald-800 dark:text-emerald-200 text-lg">
                  +20 Điểm Thưởng
                </span>
              </div>

              <button
                type="button"
                onClick={() => onComplete({ won: true, bonusPoints: 20, stars: 3 })}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition active:scale-95"
              >
                Xem Bảng Điểm Tổng Kết ➔
              </button>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        {gameState === "lost" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20 animate-in fade-in zoom-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border-2 border-amber-400 max-w-sm w-full space-y-4">
              <span className="text-5xl">🐸💦</span>
              <h3 className="text-xl font-black text-amber-700 dark:text-amber-300">
                CỐ LÊN NHÉ BÉ ƠI!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                Avia đã bơi về bờ an toàn. Cùng xem kết quả bài học vừa rồi nhé!
              </p>

              <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/60 rounded-2xl border border-amber-200">
                <span className="text-xl">🌟</span>
                <span className="font-bold text-amber-800 dark:text-amber-200 text-sm">
                  +5 Điểm Khuyến khích
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    heartsRef.current = 3;
                    timeLeftRef.current = 35;
                    setHearts(3);
                    setTimeLeft(35);
                    checkpointYRef.current = 12;
                    respawn();
                    gameStateRef.current = "playing";
                    setGameState("playing");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition active:scale-95"
                >
                  Thử lại ↺
                </button>
                <button
                  type="button"
                  onClick={() => onComplete({ won: false, bonusPoints: 5, stars: 1 })}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition active:scale-95"
                >
                  Xem Kết Quả ➔
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* D-Pad Controls for Mobile & Kids */}
      <div className="w-full mt-3 flex items-center justify-between px-2 gap-4">
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border text-[11px] font-bold">
            W / ↑
          </kbd>
          <kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded-lg shadow-sm border text-[11px] font-bold">
            A S D / ← ↓ →
          </kbd>
          <span>hoặc chạm màn hình</span>
        </div>

        {/* 4 D-Pad Buttons */}
        <div className="flex items-center justify-center gap-2 mx-auto">
          <button
            type="button"
            onClick={() => movePlayer(-1, 0)}
            className="w-12 h-11 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white font-black text-lg shadow-md border border-slate-200 dark:border-slate-700 active:scale-90 transition hover:bg-emerald-50"
            aria-label="Nhảy sang trái"
          >
            ⬅️
          </button>

          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => movePlayer(0, -1)}
              className="w-12 h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-md active:scale-90 transition"
              aria-label="Nhảy tiến"
            >
              ⬆️
            </button>
            <button
              type="button"
              onClick={() => movePlayer(0, 1)}
              className="w-12 h-11 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white font-black text-lg shadow-md border border-slate-200 dark:border-slate-700 active:scale-90 transition hover:bg-emerald-50"
              aria-label="Nhảy lùi"
            >
              ⬇️
            </button>
          </div>

          <button
            type="button"
            onClick={() => movePlayer(1, 0)}
            className="w-12 h-11 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white font-black text-lg shadow-md border border-slate-200 dark:border-slate-700 active:scale-90 transition hover:bg-emerald-50"
            aria-label="Nhảy sang phải"
          >
            ➡️
          </button>
        </div>
      </div>
    </div>
  );
}
