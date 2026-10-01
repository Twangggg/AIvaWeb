"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type GardenGameUpdate = {
  collected: number;
  totalShards: number;
  stepsRemaining: number;
  maxSteps: number;
  hearts: number;
  maxHearts: number;
  completed: boolean;
  failed: boolean;
  message: string;
};

type AivaGardenGameProps = {
  onUpdate: (update: GardenGameUpdate) => void;
  round: number;
  level?: number;
};

const WIDTH = 15;
const HEIGHT = 10;
const START = { x: 1, y: 8 };
const GATE = { x: 13, y: 1 };

const keyOf = (point: { x: number; y: number }) => `${point.x}:${point.y}`;

interface PatrolBotDef {
  x: number; // tile X
  y: number; // tile Y
  axis: "x" | "y";
  min: number;
  max: number;
  speed: number;
}

type LevelLayout = {
  map: string[];
  shards: { x: number; y: number }[];
  traps: { x: number; y: number }[];
  patrols: PatrolBotDef[];
  maxSteps: number;
  hasFog: boolean;
};

function reachableCells(map: string[]) {
  const queue = [{ ...START }];
  const seen = new Set([keyOf(START)]);
  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];
  while (queue.length) {
    const current = queue.shift()!;
    directions.forEach((direction) => {
      const next = { x: current.x + direction.x, y: current.y + direction.y };
      const inside = next.x >= 0 && next.x < WIDTH && next.y >= 0 && next.y < HEIGHT;
      if (inside && !["#", "~"].includes(map[next.y][next.x]) && !seen.has(keyOf(next))) {
        seen.add(keyOf(next));
        queue.push(next);
      }
    });
  }
  return seen;
}

function createLevel(level = 1): LevelLayout {
  const shardGoal = Math.min(6, 2 + level); // Level 1: 3, Level 2: 4, Level 3: 5, Level 4: 5, Level 5: 6
  const obstacleGoal = Math.min(32, 14 + level * 4 + Math.floor(Math.random() * 4));
  const maxSteps = 26 + shardGoal * 6;
  const hasFog = level >= 4;

  let bestLayout: LevelLayout | null = null;

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const grid = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => "."));
    const protectedCells = new Set<string>();
    [START, GATE].forEach((point) => {
      for (let y = point.y - 1; y <= point.y + 1; y += 1) {
        for (let x = point.x - 1; x <= point.x + 1; x += 1) protectedCells.add(keyOf({ x, y }));
      }
    });

    let obstacles = 0;
    while (obstacles < obstacleGoal) {
      const point = { x: Math.floor(Math.random() * WIDTH), y: Math.floor(Math.random() * HEIGHT) };
      if (protectedCells.has(keyOf(point)) || grid[point.y][point.x] !== ".") continue;
      grid[point.y][point.x] = Math.random() > 0.35 ? "#" : "~";
      obstacles += 1;
    }

    const map = grid.map((row) => row.join(""));
    const reachable = reachableCells(map);
    if (!reachable.has(keyOf(GATE))) continue;

    const candidates = [...reachable]
      .map((cell) => cell.split(":").map(Number))
      .map(([x, y]) => ({ x, y }))
      .filter((point) => Math.abs(point.x - START.x) + Math.abs(point.y - START.y) > 3)
      .filter((point) => Math.abs(point.x - GATE.x) + Math.abs(point.y - GATE.y) > 2)
      .sort(() => Math.random() - 0.5);

    if (candidates.length < shardGoal) continue;

    const shards = candidates.slice(0, shardGoal);
    const shardKeys = new Set(shards.map(keyOf));

    // Traps for level 3+
    const traps: { x: number; y: number }[] = [];
    if (level >= 3) {
      const trapCandidates = candidates
        .slice(shardGoal)
        .filter((p) => !protectedCells.has(keyOf(p)) && !shardKeys.has(keyOf(p)));
      const trapCount = Math.min(4, level);
      traps.push(...trapCandidates.slice(0, trapCount));
    }

    // Patrol Bots for level 2+
    const patrolCount = Math.min(4, Math.max(0, level - 1));
    const patrols: PatrolBotDef[] = [];

    if (patrolCount > 0) {
      // Find horizontal/vertical open corridors
      for (let y = 1; y < HEIGHT - 1 && patrols.length < patrolCount; y += 2) {
        let openStreak: number[] = [];
        for (let x = 1; x < WIDTH - 1; x += 1) {
          if (reachable.has(keyOf({ x, y })) && !protectedCells.has(keyOf({ x, y }))) {
            openStreak.push(x);
          } else {
            if (openStreak.length >= 3 && patrols.length < patrolCount) {
              patrols.push({
                x: openStreak[0],
                y,
                axis: "x",
                min: openStreak[0],
                max: openStreak[openStreak.length - 1],
                speed: 1.2 + level * 0.25,
              });
            }
            openStreak = [];
          }
        }
        if (openStreak.length >= 3 && patrols.length < patrolCount) {
          patrols.push({
            x: openStreak[0],
            y,
            axis: "x",
            min: openStreak[0],
            max: openStreak[openStreak.length - 1],
            speed: 1.2 + level * 0.25,
          });
        }
      }
    }

    bestLayout = { map, shards, traps, patrols, maxSteps, hasFog };
    break;
  }

  if (bestLayout) return bestLayout;

  // Fallback map
  const fallbackShards = [
    { x: 4, y: 8 },
    { x: 11, y: 7 },
    { x: 10, y: 2 },
    { x: 2, y: 3 },
    { x: 7, y: 4 },
  ].slice(0, shardGoal);

  return {
    map: [
      "...............",
      "..###....~~~...",
      ".#.....#...#...",
      ".###...#..###..",
      "...#...........",
      ".#....##..##...",
      ".#.......#.....",
      ".#####...#.....",
      "...............",
      "...............",
    ],
    shards: fallbackShards,
    traps: level >= 3 ? [{ x: 5, y: 4 }, { x: 9, y: 5 }] : [],
    patrols:
      level >= 2
        ? [
            { x: 3, y: 4, axis: "x" as const, min: 3, max: 8, speed: 1.5 },
            ...(level >= 3 ? [{ x: 9, y: 2, axis: "y" as const, min: 2, max: 6, speed: 1.6 }] : []),
          ]
        : [],
    maxSteps,
    hasFog,
  };
}

export function AivaGardenGame({ onUpdate, round, level = 1 }: AivaGardenGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const updateRef = useRef(onUpdate);
  const moveBotRef = useRef<((dir: { x: number; y: number }) => void) | null>(null);
  const [activeLevel, setActiveLevel] = useState(level);

  useEffect(() => {
    setActiveLevel(level);
  }, [level]);

  useEffect(() => {
    updateRef.current = onUpdate;
  }, [onUpdate]);

  const handleDPad = useCallback((dx: number, dy: number) => {
    if (moveBotRef.current) {
      moveBotRef.current({ x: dx, y: dy });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let game: { destroy: (removeCanvas: boolean) => void } | undefined;
    const tileSize = window.matchMedia("(max-width: 639px)").matches ? 40 : 54;
    const animateShards = !window.matchMedia("(max-width: 639px)").matches;

    const start = async () => {
      const { default: Phaser } = await import("phaser");
      if (cancelled || !hostRef.current) return;

      class GardenScene extends Phaser.Scene {
        private bot!: Phaser.GameObjects.Container;
        private botBody!: Phaser.GameObjects.Graphics;
        private gate!: Phaser.GameObjects.Graphics;
        private fogMask!: Phaser.GameObjects.Graphics;
        private fogOverlay!: Phaser.GameObjects.RenderTexture;
        private position = { ...START };
        private moving = false;
        private completed = false;
        private failed = false;
        private invulnerable = false;
        private layout!: LevelLayout;
        private stepsRemaining = 30;
        private maxSteps = 30;
        private hearts = 3;
        private maxHearts = 3;
        private collected = new Set<string>();
        private shards = new Map<string, Phaser.GameObjects.Graphics>();
        private trapGraphics = new Map<string, Phaser.GameObjects.Graphics>();
        private trapsActive = true;
        private trapTimer = 0;
        private patrolSprites: {
          container: Phaser.GameObjects.Container;
          laser: Phaser.GameObjects.Graphics;
          def: PatrolBotDef;
          pixelX: number;
          pixelY: number;
          dir: number;
        }[] = [];
        private audioCtx: AudioContext | null = null;

        constructor() {
          super("garden");
        }

        private playSound(type: "step" | "shard" | "gate" | "win" | "fail" | "zap" | "trap") {
          try {
            if (!this.audioCtx) {
              const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
              this.audioCtx = new AudioCtx();
            }
            if (this.audioCtx.state === "suspended") void this.audioCtx.resume();
            const ctx = this.audioCtx;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === "step") {
              osc.type = "sine";
              osc.frequency.setValueAtTime(320, ctx.currentTime);
              gain.gain.setValueAtTime(0.04, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
              osc.start();
              osc.stop(ctx.currentTime + 0.07);
            } else if (type === "shard") {
              osc.type = "triangle";
              osc.frequency.setValueAtTime(659.25, ctx.currentTime);
              osc.frequency.setValueAtTime(880, ctx.currentTime + 0.09);
              osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.18);
              gain.gain.setValueAtTime(0.2, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
              osc.start();
              osc.stop(ctx.currentTime + 0.35);
            } else if (type === "zap" || type === "trap") {
              osc.type = "sawtooth";
              osc.frequency.setValueAtTime(140, ctx.currentTime);
              osc.frequency.setValueAtTime(280, ctx.currentTime + 0.06);
              osc.frequency.setValueAtTime(90, ctx.currentTime + 0.14);
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
              osc.start();
              osc.stop(ctx.currentTime + 0.3);
            } else if (type === "gate") {
              osc.type = "sine";
              osc.frequency.setValueAtTime(523.25, ctx.currentTime);
              osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15);
              gain.gain.setValueAtTime(0.2, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
              osc.start();
              osc.stop(ctx.currentTime + 0.45);
            } else if (type === "win") {
              osc.type = "triangle";
              osc.frequency.setValueAtTime(523.25, ctx.currentTime);
              osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12);
              osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24);
              osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.36);
              gain.gain.setValueAtTime(0.25, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
              osc.start();
              osc.stop(ctx.currentTime + 0.6);
            } else if (type === "fail") {
              osc.type = "sawtooth";
              osc.frequency.setValueAtTime(220, ctx.currentTime);
              osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
              gain.gain.setValueAtTime(0.25, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
              osc.start();
              osc.stop(ctx.currentTime + 0.4);
            }
          } catch {
            // Audio fallback
          }
        }

        create() {
          this.layout = createLevel(activeLevel);
          this.maxSteps = this.layout.maxSteps;
          this.stepsRemaining = this.layout.maxSteps;
          this.hearts = 3;
          this.maxHearts = 3;
          this.failed = false;
          this.completed = false;
          this.invulnerable = false;
          this.patrolSprites = [];

          this.drawGarden();
          this.drawTraps();
          this.drawPatrols();
          this.bot = this.createBot(this.toPixels(START));

          if (this.layout.hasFog) {
            this.setupFogOfWar();
          }

          const patrolNote =
            this.layout.patrols.length > 0 ? ` Né tránh ${this.layout.patrols.length} bọ tuần tra!` : "";
          const fogNote = this.layout.hasFog ? " 🌙 Màn đêm: Giới hạn tầm nhìn!" : "";
          this.report(
            `Màn ${activeLevel}: Nhặt đủ ${this.layout.shards.length} tinh thể để mở cổng.${patrolNote}${fogNote}`
          );

          // Connect external D-Pad ref
          moveBotRef.current = (dir: { x: number; y: number }) => {
            this.stepManual(dir);
          };

          // Touch / Pointer controls
          let touchStart: { x: number; y: number } | null = null;
          this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            touchStart = { x: pointer.x, y: pointer.y };
          });
          this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (!touchStart) return;
            const deltaX = pointer.x - touchStart.x;
            const deltaY = pointer.y - touchStart.y;
            touchStart = null;
            const swipeThreshold = 18;
            if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= swipeThreshold) {
              const step =
                Math.abs(deltaX) > Math.abs(deltaY)
                  ? { x: Math.sign(deltaX), y: 0 }
                  : { x: 0, y: Math.sign(deltaY) };
              this.stepManual(step);
              return;
            }
            const targetX = Math.floor(pointer.x / tileSize);
            const targetY = Math.floor(pointer.y / tileSize);
            this.moveTo({ x: targetX, y: targetY });
          });

          // Keyboard Controls
          this.input.keyboard?.on("keydown", (event: KeyboardEvent) => {
            const steps: Record<string, { x: number; y: number }> = {
              ArrowUp: { x: 0, y: -1 },
              w: { x: 0, y: -1 },
              ArrowDown: { x: 0, y: 1 },
              s: { x: 0, y: 1 },
              ArrowLeft: { x: -1, y: 0 },
              a: { x: -1, y: 0 },
              ArrowRight: { x: 1, y: 0 },
              d: { x: 1, y: 0 },
            };
            const step = steps[event.key] ?? steps[event.key.toLowerCase()];
            if (step) {
              event.preventDefault();
              this.stepManual(step);
            }
          });
        }

        private setupFogOfWar() {
          this.fogOverlay = this.add.renderTexture(0, 0, WIDTH * tileSize, HEIGHT * tileSize);
          this.fogOverlay.setDepth(40);
          this.fogMask = this.make.graphics();
          this.updateFogOfWar();
        }

        private updateFogOfWar() {
          if (!this.layout.hasFog || !this.fogOverlay) return;
          this.fogOverlay.clear();
          this.fogOverlay.fill(0x050d1a, 0.88);

          // Cut out vision circle around AIVA bot
          const radius = tileSize * 3.4;
          this.fogMask.clear();
          this.fogMask.fillStyle(0xffffff, 1);
          this.fogMask.fillCircle(this.bot.x, this.bot.y, radius);

          this.fogOverlay.erase(this.fogMask, 0, 0);
        }

        private drawGarden() {
          const terrain = this.add.graphics();
          terrain.fillStyle(0x133e35, 1).fillRect(0, 0, WIDTH * tileSize, HEIGHT * tileSize);

          this.layout.map.forEach((row, y) => {
            [...row].forEach((cell, x) => {
              const px = x * tileSize;
              const py = y * tileSize;
              terrain
                .fillStyle(cell === "~" ? 0x1d5f82 : 0x2b6643, 1)
                .fillRoundedRect(px + 2, py + 2, tileSize - 4, tileSize - 4, 8);
              if (cell === "#") {
                terrain
                  .fillStyle(0x143524, 1)
                  .fillCircle(px + 16, py + 22, 14)
                  .fillCircle(px + 30, py + 18, 16)
                  .fillCircle(px + 34, py + 30, 12);
              }
              if (cell === "~") {
                terrain
                  .lineStyle(2, 0x6fc7e8, 0.5)
                  .lineBetween(px + 8, py + 20, px + 20, py + 16)
                  .lineBetween(px + 24, py + 28, px + 38, py + 24);
              }
            });
          });

          const gatePixels = this.toPixels(GATE);
          this.gate = this.add.graphics();
          this.paintGate(false);
          this.add
            .text(gatePixels.x, gatePixels.y + 36, "CỔNG", {
              fontFamily: "Arial",
              fontSize: "11px",
              color: "#dcebe3",
              fontStyle: "bold",
            })
            .setOrigin(0.5);

          this.layout.shards.forEach((shard) => {
            const point = this.toPixels(shard);
            const graphic = this.add.graphics();
            graphic
              .fillStyle(0xffd34e, 1)
              .fillTriangle(point.x, point.y - 15, point.x + 12, point.y, point.x, point.y + 15)
              .fillTriangle(point.x, point.y - 15, point.x - 12, point.y, point.x, point.y + 15);
            graphic
              .lineStyle(2, 0xfff3aa, 0.85)
              .strokeTriangle(point.x, point.y - 15, point.x + 12, point.y, point.x, point.y + 15)
              .strokeTriangle(point.x, point.y - 15, point.x - 12, point.y, point.x, point.y + 15);
            if (animateShards) {
              this.tweens.add({
                targets: graphic,
                y: graphic.y - 5,
                duration: 750,
                yoyo: true,
                repeat: -1,
                ease: "Sine.inOut",
              });
            }
            this.shards.set(keyOf(shard), graphic);
          });
        }

        private drawTraps() {
          this.layout.traps.forEach((trap) => {
            const point = this.toPixels(trap);
            const g = this.add.graphics();
            this.renderTrapGraphic(g, point, true);
            this.trapGraphics.set(keyOf(trap), g);
          });
        }

        private renderTrapGraphic(g: Phaser.GameObjects.Graphics, point: { x: number; y: number }, active: boolean) {
          g.clear();
          if (active) {
            g.fillStyle(0xd946ef, 0.25).fillRoundedRect(point.x - 20, point.y - 20, 40, 40, 8);
            g.fillStyle(0xf43f5e, 1);
            g.fillTriangle(point.x - 12, point.y + 10, point.x - 6, point.y - 12, point.x, point.y + 10);
            g.fillTriangle(point.x, point.y + 10, point.x + 6, point.y - 12, point.x + 12, point.y + 10);
            g.lineStyle(2, 0xffe4e6, 0.8).strokeCircle(point.x, point.y, 16);
          } else {
            g.fillStyle(0x64748b, 0.2).fillRoundedRect(point.x - 20, point.y - 20, 40, 40, 8);
            g.lineStyle(2, 0x94a3b8, 0.4).strokeRoundedRect(point.x - 18, point.y - 18, 36, 36, 6);
          }
        }

        private drawPatrols() {
          this.layout.patrols.forEach((def) => {
            const p = this.toPixels({ x: def.x, y: def.y });
            const container = this.add.container(p.x, p.y);
            container.setDepth(30);

            // Drone Art
            const body = this.add.graphics();
            body.fillStyle(0x881337, 1).fillCircle(0, 0, 15);
            body.fillStyle(0xe11d48, 1).fillCircle(0, 0, 11);
            body.fillStyle(0xffffff, 1).fillCircle(0, 0, 5);
            body.fillStyle(0xff0000, 1).fillCircle(0, 0, 2.5);
            body.lineStyle(2, 0xfecdd3, 0.9).strokeCircle(0, 0, 16);

            const laser = this.add.graphics();
            laser.setDepth(29);

            container.add([body]);

            this.patrolSprites.push({
              container,
              laser,
              def,
              pixelX: p.x,
              pixelY: p.y,
              dir: 1,
            });
          });
        }

        private createBot(point: { x: number; y: number }) {
          const art = this.add.graphics();
          art.fillStyle(0x142b4c, 1).fillRoundedRect(-18, -14, 36, 31, 10);
          art.fillStyle(0x38bdf8, 1).fillRoundedRect(-15, -11, 30, 20, 7);
          art.fillStyle(0xffffff, 1).fillCircle(-7, -2, 4).fillCircle(7, -2, 4);
          art.fillStyle(0x0f172a, 1).fillCircle(-7, -2, 1.8).fillCircle(7, -2, 1.8);
          art.lineStyle(3, 0x142b4c, 1).lineBetween(-7, 12, 7, 12).lineBetween(-11, -17, 0, -26);
          art.fillStyle(0xffd34e, 1).fillCircle(0, -27, 4);

          this.botBody = art;
          const container = this.add.container(point.x, point.y, [art]);
          container.setDepth(35);
          return container;
        }

        private paintGate(open: boolean) {
          const point = this.toPixels(GATE);
          this.gate.clear();
          this.gate.fillStyle(open ? 0x10b981 : 0xbe123c, 1).fillRoundedRect(point.x - 17, point.y - 22, 34, 44, 8);
          this.gate
            .lineStyle(3, open ? 0x6ee7b7 : 0xfda4af, 1)
            .strokeRoundedRect(point.x - 17, point.y - 22, 34, 44, 8);
        }

        private toPixels(point: { x: number; y: number }) {
          return { x: point.x * tileSize + tileSize / 2, y: point.y * tileSize + tileSize / 2 };
        }

        private canWalk(point: { x: number; y: number }) {
          return (
            point.x >= 0 &&
            point.x < WIDTH &&
            point.y >= 0 &&
            point.y < HEIGHT &&
            !["#", "~"].includes(this.layout.map[point.y][point.x])
          );
        }

        private stepManual(dir: { x: number; y: number }) {
          if (this.moving || this.completed || this.failed) return;
          const next = { x: this.position.x + dir.x, y: this.position.y + dir.y };

          if (!this.canWalk(next)) {
            this.report("AIVA chạm phải chướng ngại vật!");
            return;
          }

          if (next.x === GATE.x && next.y === GATE.y && this.collected.size < this.layout.shards.length) {
            this.report(
              `Cổng bị khóa! Cần nhặt đủ ${this.collected.size}/${this.layout.shards.length} mảnh năng lượng.`
            );
            return;
          }

          this.moving = true;
          this.walkSingleStep(next);
        }

        private walkSingleStep(next: { x: number; y: number }) {
          this.stepsRemaining = Math.max(0, this.stepsRemaining - 1);
          this.playSound("step");

          const pixels = this.toPixels(next);
          this.tweens.add({
            targets: this.bot,
            x: pixels.x,
            y: pixels.y,
            duration: 110,
            ease: "Sine.out",
            onComplete: () => {
              this.position = next;
              this.updateFogOfWar();
              this.checkTileEvents();
              this.moving = false;
            },
          });
        }

        private findPath(destination: { x: number; y: number }) {
          if (!this.canWalk(destination)) return [];
          const queue = [{ ...this.position }];
          const previous = new Map<string, { x: number; y: number } | null>([[keyOf(this.position), null]]);
          const steps = [
            { x: 0, y: -1 },
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
          ];

          while (queue.length) {
            const current = queue.shift()!;
            if (current.x === destination.x && current.y === destination.y) break;
            steps.forEach((step) => {
              const next = { x: current.x + step.x, y: current.y + step.y };
              if (this.canWalk(next) && !previous.has(keyOf(next))) {
                previous.set(keyOf(next), current);
                queue.push(next);
              }
            });
          }

          if (!previous.has(keyOf(destination))) return [];
          const path = [] as { x: number; y: number }[];
          let current: { x: number; y: number } | null = destination;
          while (current && keyOf(current) !== keyOf(this.position)) {
            path.unshift(current);
            current = previous.get(keyOf(current)) ?? null;
          }
          return path;
        }

        private moveTo(destination: { x: number; y: number }) {
          if (this.moving || this.completed || this.failed) return;
          if (
            destination.x === GATE.x &&
            destination.y === GATE.y &&
            this.collected.size < this.layout.shards.length
          ) {
            this.report("Cổng chưa mở. Hãy thu thập đủ các mảnh năng lượng.");
            return;
          }
          const path = this.findPath(destination);
          if (!path.length) {
            if (destination.x !== this.position.x || destination.y !== this.position.y) {
              this.report("AIVA chưa thể đi tới ô này (vướng chướng ngại vật).");
            }
            return;
          }
          this.moving = true;
          this.walkPath(path);
        }

        private walkPath(path: { x: number; y: number }[]) {
          const next = path.shift();
          if (!next) {
            this.moving = false;
            return;
          }

          this.stepsRemaining = Math.max(0, this.stepsRemaining - 1);
          this.playSound("step");

          const pixels = this.toPixels(next);
          this.tweens.add({
            targets: this.bot,
            x: pixels.x,
            y: pixels.y,
            duration: 130,
            ease: "Sine.out",
            onComplete: () => {
              this.position = next;
              this.updateFogOfWar();
              const stopMove = this.checkTileEvents();

              if (stopMove || this.failed || this.completed) {
                this.moving = false;
                return;
              }

              this.walkPath(path);
            },
          });
        }

        private checkTileEvents(): boolean {
          // Check Shards
          this.collectShard();

          // Check Traps
          const trapKey = keyOf(this.position);
          if (this.layout.traps.some((t) => keyOf(t) === trapKey) && this.trapsActive && !this.invulnerable) {
            this.takeDamage(1, "⚡ AIVA dẫm phải bẫy điện! Mất 1 Tim ❤️");
            return true; // Stop auto-walk on hit
          }

          // Check Goal
          if (
            this.position.x === GATE.x &&
            this.position.y === GATE.y &&
            this.collected.size === this.layout.shards.length
          ) {
            this.completed = true;
            this.moving = false;
            this.playSound("win");
            this.report(`🎉 Xuất sắc! AIVA đã vượt qua Màn ${activeLevel} ngoạn mục!`);
            return true;
          }

          // Check Battery
          if (this.stepsRemaining <= 0) {
            this.failed = true;
            this.moving = false;
            this.playSound("fail");
            this.report("⚡ AIVA đã cạn kiệt pin! Chạm 'Thử Lại' để tối ưu hóa lộ trình.");
            return true;
          }

          return false;
        }

        private collectShard() {
          const key = keyOf(this.position);
          const shard = this.shards.get(key);
          if (!shard || this.collected.has(key)) return;
          this.collected.add(key);
          this.playSound("shard");
          this.stepsRemaining = Math.min(this.maxSteps, this.stepsRemaining + 8);
          this.tweens.killTweensOf(shard);
          this.tweens.add({
            targets: shard,
            alpha: 0,
            scale: 1.9,
            duration: 220,
            onComplete: () => shard.destroy(),
          });
          if (this.collected.size === this.layout.shards.length) {
            this.paintGate(true);
            this.playSound("gate");
            this.report("Cổng không gian đã kích hoạt! Hãy đưa AIVA đến cổng ngay.");
          } else {
            this.report(`Đã nhặt ${this.collected.size}/${this.layout.shards.length} mảnh (+8 Pin ⚡).`);
          }
        }

        private takeDamage(damage: number, reason: string) {
          if (this.invulnerable || this.failed || this.completed) return;
          this.hearts = Math.max(0, this.hearts - damage);
          this.invulnerable = true;
          this.playSound("zap");
          this.cameras.main.shake(180, 0.012);

          // Flash invulnerability effect
          this.tweens.add({
            targets: this.bot,
            alpha: 0.25,
            duration: 100,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
              this.bot.alpha = 1;
              this.invulnerable = false;
            },
          });

          if (this.hearts <= 0) {
            this.failed = true;
            this.moving = false;
            this.playSound("fail");
            this.report("AIVA đã cạn kiệt tim! Hãy bấm 'Thử Lại' để phục hồi.");
          } else {
            this.report(`${reason} (Còn ${this.hearts} Tim)`);
          }
        }

        update(time: number, delta: number) {
          if (this.completed || this.failed) return;

          // Toggle Traps on timer
          this.trapTimer += delta;
          if (this.trapTimer > 2400) {
            this.trapTimer = 0;
            this.trapsActive = !this.trapsActive;
            this.layout.traps.forEach((trap) => {
              const g = this.trapGraphics.get(keyOf(trap));
              if (g) {
                this.renderTrapGraphic(g, this.toPixels(trap), this.trapsActive);
              }
            });
            if (this.trapsActive && keyOf(this.position) in this.trapGraphics) {
              this.takeDamage(1, "⚡ Bẫy điện vừa kích hoạt ngay chân AIVA!");
            }
          }

          // Move Patrol Drones
          this.patrolSprites.forEach((patrol) => {
            const { def, container, laser } = patrol;
            const minPx = def.min * tileSize + tileSize / 2;
            const maxPx = def.max * tileSize + tileSize / 2;
            const moveSpeed = def.speed * (delta / 16) * 1.8;

            if (def.axis === "x") {
              patrol.pixelX += patrol.dir * moveSpeed;
              if (patrol.pixelX >= maxPx) {
                patrol.pixelX = maxPx;
                patrol.dir = -1;
              } else if (patrol.pixelX <= minPx) {
                patrol.pixelX = minPx;
                patrol.dir = 1;
              }
              container.x = patrol.pixelX;
            } else {
              patrol.pixelY += patrol.dir * moveSpeed;
              if (patrol.pixelY >= maxPx) {
                patrol.pixelY = maxPx;
                patrol.dir = -1;
              } else if (patrol.pixelY <= minPx) {
                patrol.pixelY = minPx;
                patrol.dir = 1;
              }
              container.y = patrol.pixelY;
            }

            // Draw red patrol beam
            laser.clear();
            laser.lineStyle(1.5, 0xf43f5e, 0.45);
            if (def.axis === "x") {
              laser.lineBetween(minPx, container.y, maxPx, container.y);
            } else {
              laser.lineBetween(container.x, minPx, container.x, maxPx);
            }

            // Drone Collision with AIVA Bot
            const dist = Phaser.Math.Distance.Between(this.bot.x, this.bot.y, container.x, container.y);
            if (dist < tileSize * 0.7 && !this.invulnerable) {
              this.takeDamage(1, "🚨 AIVA bị bọ tuần tra phát hiện & tấn công!");
            }
          });
        }

        private report(message: string) {
          updateRef.current({
            collected: this.collected.size,
            totalShards: this.layout ? this.layout.shards.length : 3,
            stepsRemaining: this.stepsRemaining,
            maxSteps: this.maxSteps,
            hearts: this.hearts,
            maxHearts: this.maxHearts,
            completed: this.completed,
            failed: this.failed,
            message,
          });
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        width: WIDTH * tileSize,
        height: HEIGHT * tileSize,
        backgroundColor: "#133e35",
        scene: GardenScene,
        render: { antialias: false, pixelArt: false, roundPixels: true },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      });
    };

    void start();
    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, [round, activeLevel]);

  return (
    <div className="w-full space-y-3">
      <div
        ref={hostRef}
        tabIndex={0}
        aria-label="Bản đồ Giải cứu khu vườn AIVA."
        className="w-full flex items-center justify-center touch-none select-none overflow-hidden rounded-2xl border border-white/15 bg-[#133e35] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-200 [&_canvas]:mx-auto [&_canvas]:block [&_canvas]:h-auto [&_canvas]:max-h-[calc(100svh-11rem)] sm:[&_canvas]:max-h-[64svh] [&_canvas]:max-w-full [&_canvas]:object-contain shadow-2xl"
      />

      {/* Virtual Tactile D-Pad Controller for Mobile & Touch Action */}
      <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 pt-1">
        <button
          type="button"
          onClick={() => handleDPad(0, -1)}
          aria-label="Đi lên"
          className="h-10 w-14 sm:h-11 sm:w-16 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 flex items-center justify-center shadow-md active:scale-90 transition hover:bg-amber-400 hover:text-black"
        >
          <span className="material-symbols-outlined text-xl">arrow_upward</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleDPad(-1, 0)}
            aria-label="Sang trái"
            className="h-10 w-14 sm:h-11 sm:w-16 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 flex items-center justify-center shadow-md active:scale-90 transition hover:bg-amber-400 hover:text-black"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>

          <button
            type="button"
            onClick={() => handleDPad(0, 1)}
            aria-label="Đi xuống"
            className="h-10 w-14 sm:h-11 sm:w-16 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 flex items-center justify-center shadow-md active:scale-90 transition hover:bg-amber-400 hover:text-black"
          >
            <span className="material-symbols-outlined text-xl">arrow_downward</span>
          </button>

          <button
            type="button"
            onClick={() => handleDPad(1, 0)}
            aria-label="Sang phải"
            className="h-10 w-14 sm:h-11 sm:w-16 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 flex items-center justify-center shadow-md active:scale-90 transition hover:bg-amber-400 hover:text-black"
          >
            <span className="material-symbols-outlined text-xl">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
