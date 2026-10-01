"use client";

import { useEffect, useRef } from "react";

type GameUpdate = {
  collected: number;
  completed: boolean;
  message: string;
};

type AivaGardenGameProps = {
  onUpdate: (update: GameUpdate) => void;
  round: number;
};

const WIDTH = 15;
const HEIGHT = 10;
const START = { x: 1, y: 8 };
const GATE = { x: 13, y: 1 };

const keyOf = (point: { x: number; y: number }) => `${point.x}:${point.y}`;

type LevelLayout = { map: string[]; shards: { x: number; y: number }[] };

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

function createLevel(): LevelLayout {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const grid = Array.from({ length: HEIGHT }, () => Array.from({ length: WIDTH }, () => "."));
    const protectedCells = new Set<string>();
    [START, GATE].forEach((point) => {
      for (let y = point.y - 1; y <= point.y + 1; y += 1) {
        for (let x = point.x - 1; x <= point.x + 1; x += 1) protectedCells.add(keyOf({ x, y }));
      }
    });
    let obstacles = 0;
    const obstacleGoal = 16 + Math.floor(Math.random() * 10);
    while (obstacles < obstacleGoal) {
      const point = { x: Math.floor(Math.random() * WIDTH), y: Math.floor(Math.random() * HEIGHT) };
      if (protectedCells.has(keyOf(point)) || grid[point.y][point.x] !== ".") continue;
      grid[point.y][point.x] = Math.random() > 0.3 ? "#" : "~";
      obstacles += 1;
    }
    const map = grid.map((row) => row.join(""));
    const reachable = reachableCells(map);
    if (!reachable.has(keyOf(GATE))) continue;
    const candidates = [...reachable]
      .map((cell) => cell.split(":").map(Number))
      .map(([x, y]) => ({ x, y }))
      .filter((point) => Math.abs(point.x - START.x) + Math.abs(point.y - START.y) > 4)
      .filter((point) => Math.abs(point.x - GATE.x) + Math.abs(point.y - GATE.y) > 3)
      .sort(() => Math.random() - 0.5);
    if (candidates.length >= 3) return { map, shards: candidates.slice(0, 3) };
  }
  return {
    map: ["...............", "..###....~~~...", ".#.....#...#...", ".###...#..###..", "...#...........", ".#....##..##...", ".#.......#.....", ".#####...#.....", "...............", "..............."],
    shards: [{ x: 4, y: 8 }, { x: 11, y: 7 }, { x: 10, y: 2 }],
  };
}

export function AivaGardenGame({ onUpdate, round }: AivaGardenGameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const updateRef = useRef(onUpdate);

  useEffect(() => {
    updateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    let cancelled = false;
    let game: { destroy: (removeCanvas: boolean) => void } | undefined;
    const tileSize = window.matchMedia("(max-width: 639px)").matches ? 40 : 56;
    const animateShards = !window.matchMedia("(max-width: 639px)").matches;

    const start = async () => {
      const { default: Phaser } = await import("phaser");
      if (cancelled || !hostRef.current) return;

      class GardenScene extends Phaser.Scene {
        private bot!: Phaser.GameObjects.Container;
        private gate!: Phaser.GameObjects.Graphics;
        private position = { ...START };
        private moving = false;
        private completed = false;
        private layout!: LevelLayout;
        private collected = new Set<string>();
        private shards = new Map<string, Phaser.GameObjects.Graphics>();

        constructor() {
          super("garden");
        }

        create() {
          this.layout = createLevel();
          this.drawGarden();
          this.bot = this.createBot(this.toPixels(START));
          this.report("Chạm vào ô cỏ để AIVA tự tìm đường.");

          let touchStart: { x: number; y: number } | null = null;
          this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            touchStart = { x: pointer.x, y: pointer.y };
          });
          this.input.on("pointerup", (pointer: Phaser.Input.Pointer) => {
            if (!touchStart) return;
            const deltaX = pointer.x - touchStart.x;
            const deltaY = pointer.y - touchStart.y;
            touchStart = null;
            const swipeThreshold = 20;
            if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= swipeThreshold) {
              const step = Math.abs(deltaX) > Math.abs(deltaY)
                ? { x: Math.sign(deltaX), y: 0 }
                : { x: 0, y: Math.sign(deltaY) };
              this.moveTo({ x: this.position.x + step.x, y: this.position.y + step.y });
              return;
            }
            this.moveTo({ x: Math.floor(pointer.x / tileSize), y: Math.floor(pointer.y / tileSize) });
          });

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
              this.moveTo({ x: this.position.x + step.x, y: this.position.y + step.y });
            }
          });
        }

        private drawGarden() {
          const terrain = this.add.graphics();
          terrain.fillStyle(0x1a4f44, 1).fillRect(0, 0, WIDTH * tileSize, HEIGHT * tileSize);

          this.layout.map.forEach((row, y) => {
            [...row].forEach((cell, x) => {
              const px = x * tileSize;
              const py = y * tileSize;
              terrain.fillStyle(cell === "~" ? 0x237aa6 : 0x367c52, 1).fillRoundedRect(px + 2, py + 2, tileSize - 4, tileSize - 4, 10);
              if (cell === "#") {
                terrain.fillStyle(0x17452f, 1).fillCircle(px + 18, py + 25, 16).fillCircle(px + 34, py + 21, 18).fillCircle(px + 38, py + 35, 14);
              }
              if (cell === "~") {
                terrain.lineStyle(2, 0x6fc7e8, 0.55).lineBetween(px + 10, py + 24, px + 24, py + 20).lineBetween(px + 30, py + 34, px + 46, py + 30);
              }
            });
          });

          const gatePixels = this.toPixels(GATE);
          this.gate = this.add.graphics();
          this.paintGate(false);
          this.add.text(gatePixels.x, gatePixels.y + 38, "CỔNG", { fontFamily: "Arial", fontSize: "11px", color: "#dcebe3", fontStyle: "bold" }).setOrigin(0.5);

          this.layout.shards.forEach((shard) => {
            const point = this.toPixels(shard);
            const graphic = this.add.graphics();
            graphic.fillStyle(0xffd34e, 1).fillTriangle(point.x, point.y - 16, point.x + 13, point.y, point.x, point.y + 16).fillTriangle(point.x, point.y - 16, point.x - 13, point.y, point.x, point.y + 16);
            graphic.lineStyle(2, 0xfff3aa, 0.85).strokeTriangle(point.x, point.y - 16, point.x + 13, point.y, point.x, point.y + 16).strokeTriangle(point.x, point.y - 16, point.x - 13, point.y, point.x, point.y + 16);
            if (animateShards) {
              this.tweens.add({ targets: graphic, y: graphic.y - 6, duration: 800, yoyo: true, repeat: -1, ease: "Sine.inOut" });
            }
            this.shards.set(keyOf(shard), graphic);
          });
        }

        private createBot(point: { x: number; y: number }) {
          const art = this.add.graphics();
          art.fillStyle(0x142b4c, 1).fillRoundedRect(-18, -14, 36, 31, 10);
          art.fillStyle(0x5ec7ed, 1).fillRoundedRect(-15, -11, 30, 20, 7);
          art.fillStyle(0xffffff, 1).fillCircle(-7, -2, 4).fillCircle(7, -2, 4);
          art.fillStyle(0x142b4c, 1).fillCircle(-7, -2, 1.8).fillCircle(7, -2, 1.8);
          art.lineStyle(3, 0x142b4c, 1).lineBetween(-7, 12, 7, 12).lineBetween(-11, -17, 0, -26);
          art.fillStyle(0xffd34e, 1).fillCircle(0, -27, 4);
          return this.add.container(point.x, point.y, [art]);
        }

        private paintGate(open: boolean) {
          const point = this.toPixels(GATE);
          this.gate.clear();
          this.gate.fillStyle(open ? 0x76d69b : 0xc95c58, 1).fillRoundedRect(point.x - 17, point.y - 22, 34, 44, 8);
          this.gate.lineStyle(3, open ? 0xd7ffe5 : 0xffd0c8, 1).strokeRoundedRect(point.x - 17, point.y - 22, 34, 44, 8);
        }

        private toPixels(point: { x: number; y: number }) {
          return { x: point.x * tileSize + tileSize / 2, y: point.y * tileSize + tileSize / 2 };
        }

        private canWalk(point: { x: number; y: number }) {
          return point.x >= 0 && point.x < WIDTH && point.y >= 0 && point.y < HEIGHT && !["#", "~"].includes(this.layout.map[point.y][point.x]);
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
          if (this.moving || this.completed) return;
          if (destination.x === GATE.x && destination.y === GATE.y && this.collected.size < this.layout.shards.length) {
            this.report("Cổng chưa mở. Hãy tìm đủ các mảnh năng lượng.");
            return;
          }
          const path = this.findPath(destination);
          if (!path.length) {
            if (destination.x !== this.position.x || destination.y !== this.position.y) this.report("AIVA chưa thể đi tới ô này.");
            return;
          }
          this.moving = true;
          this.walk(path);
        }

        private walk(path: { x: number; y: number }[]) {
          const next = path.shift();
          if (!next) {
            this.moving = false;
            return;
          }
          const pixels = this.toPixels(next);
          this.tweens.add({
            targets: this.bot,
            x: pixels.x,
            y: pixels.y,
            duration: 150,
            ease: "Sine.out",
            onComplete: () => {
              this.position = next;
              this.collectShard();
              if (this.position.x === GATE.x && this.position.y === GATE.y && this.collected.size === this.layout.shards.length) {
                this.completed = true;
                this.moving = false;
                this.report("AIVA đã mang năng lượng về khu vườn!");
                return;
              }
              this.walk(path);
            },
          });
        }

        private collectShard() {
          const key = keyOf(this.position);
          const shard = this.shards.get(key);
          if (!shard || this.collected.has(key)) return;
          this.collected.add(key);
          this.tweens.killTweensOf(shard);
          this.tweens.add({ targets: shard, alpha: 0, scale: 1.8, duration: 240, onComplete: () => shard.destroy() });
          if (this.collected.size === this.layout.shards.length) {
            this.paintGate(true);
            this.report("Cổng đã mở. Hãy đưa AIVA đến cổng.");
          } else {
            this.report(`Đã tìm thấy ${this.collected.size}/${this.layout.shards.length} mảnh năng lượng.`);
          }
        }

        private report(message: string) {
          updateRef.current({ collected: this.collected.size, completed: this.completed, message });
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        parent: hostRef.current,
        width: WIDTH * tileSize,
        height: HEIGHT * tileSize,
        backgroundColor: "#1a4f44",
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
  }, [round]);

  return (
    <div
      ref={hostRef}
      tabIndex={0}
      aria-label="Bản đồ Giải cứu khu vườn AIVA. Chạm để chọn điểm đến hoặc vuốt để đi từng bước."
      className="w-full flex items-center justify-center touch-none select-none overflow-hidden rounded-2xl border border-white/15 bg-[#1a4f44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-200 [&_canvas]:mx-auto [&_canvas]:block [&_canvas]:h-auto [&_canvas]:max-h-[calc(100svh-8.5rem)] sm:[&_canvas]:max-h-[68svh] [&_canvas]:max-w-full [&_canvas]:object-contain"
    />
  );
}
