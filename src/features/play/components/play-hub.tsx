"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { DeviceBridge } from "@/features/iot/device.bridge";
import { useDeviceStore } from "@/features/iot/device.store";
import type { PlayKind } from "@/features/iot/protocol";
import { BUILTIN_PACKS, defaultPackFor } from "@/features/play/play.packs";
import { allPacks } from "@/features/play/play.storage";
import { usePlayStore } from "@/features/play/play.store";
import { DEFAULT_TEAMS, type PlayPack } from "@/features/play/play.types";
import { useI18n } from "@/lib/i18n/provider";

const KINDS: { id: PlayKind; labelVi: string; labelEn: string; descVi: string; descEn: string }[] = [
  { id: "hunt", labelVi: "Săn đồ", labelEn: "Hunt", descVi: "Tìm đồ trong lớp", descEn: "Find classroom objects" },
  { id: "cards", labelVi: "Thẻ", labelEn: "Cards", descVi: "Nghe rồi tìm thẻ", descEn: "Listen and find cards" },
  { id: "quiz", labelVi: "Đố ảnh", labelEn: "Quiz", descVi: "Ảnh / emoji trên màn", descEn: "Emoji quiz on screen" },
  { id: "story", labelVi: "Chuyện", labelEn: "Story", descVi: "Chọn nhánh câu chuyện", descEn: "Branching story" },
];

export function PlayHub() {
  const router = useRouter();
  const { locale } = useI18n();
  const en = locale === "en";
  const linked = useDeviceStore((s) => s.linked);
  const online = useDeviceStore((s) => s.online);
  const hydrateJar = usePlayStore((s) => s.hydrateJar);
  const start = usePlayStore((s) => s.start);
  const jarStars = usePlayStore((s) => s.jarStars);
  const rules = usePlayStore((s) => s.rules);

  const [kind, setKind] = useState<PlayKind>("hunt");
  const [mode, setMode] = useState<"solo" | "teams">("solo");
  const [phoneOnly, setPhoneOnly] = useState(false);
  const [packs, setPacks] = useState<PlayPack[]>(BUILTIN_PACKS);
  const [packId, setPackId] = useState(defaultPackFor("hunt").id);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void hydrateJar();
    void DeviceBridge.getShared().hydrate();
    void allPacks().then(setPacks);
  }, [hydrateJar]);

  const packList = packs.filter((p) => p.kind === kind);
  const selected =
    packList.find((p) => p.id === packId) ?? packList[0] ?? defaultPackFor(kind);

  const selectKind = (next: PlayKind) => {
    setKind(next);
    const forKind = packs.filter((p) => p.kind === next);
    setPackId((forKind[0] ?? defaultPackFor(next)).id);
  };

  const onStart = async () => {
    setBusy(true);
    setError(null);
    try {
      await start({
        mode,
        pack: selected,
        teams: mode === "teams" ? DEFAULT_TEAMS : undefined,
        phoneOnly: phoneOnly || !linked,
      });
      router.push("/console/play/session");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không bắt đầu được");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{en ? "Play" : "Chơi"}</h1>
            <p className="mt-2 max-w-xl text-base text-[#6b7280]">
              {en
                ? "Pick a game, solo or teams, then run the round on tablet."
                : "Chọn trò, solo hoặc đội, rồi chạy ván trên tablet."}
            </p>
            <p className="mt-3 text-sm text-[#6b7280]">
              {en ? "Device" : "Thiết bị"}:{" "}
              <span className="font-semibold text-[#1a1a1a]">
                {!linked ? (en ? "Not linked" : "Chưa gắn") : online ? "Online" : "Offline"}
              </span>
              {rules.jarEnabled && (
                <>
                  {" · "}
                  {en ? "Class jar" : "Hũ lớp"}:{" "}
                  <span className="font-semibold text-[#1a1a1a]">
                    {jarStars}/{rules.jarGoal} ★
                  </span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/console/play/packs"
              className="inline-flex min-h-10 items-center rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold hover:bg-black/5"
            >
              {en ? "Packs" : "Pack"}
            </Link>
            <Link
              href="/console/history"
              className="inline-flex min-h-10 items-center rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold hover:bg-black/5"
            >
              {en ? "History" : "Lịch sử"}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {KINDS.map((k) => {
          const active = kind === k.id;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => selectKind(k.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                active
                  ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                  : "border-black/8 bg-white/70 hover:border-black/20 hover:bg-white"
              }`}
            >
              <p className="text-lg font-semibold">{en ? k.labelEn : k.labelVi}</p>
              <p className={`mt-1 text-sm ${active ? "text-white/70" : "text-[#6b7280]"}`}>
                {en ? k.descEn : k.descVi}
              </p>
            </button>
          );
        })}
      </section>

      <section className="rounded-2xl border border-black/8 bg-white/70 p-5">
        <h2 className="text-lg font-semibold">{en ? "Round setup" : "Thiết lập ván"}</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          <ModeChip active={mode === "solo"} onClick={() => setMode("solo")} label={en ? "Solo" : "Solo"} />
          <ModeChip active={mode === "teams"} onClick={() => setMode("teams")} label={en ? "Teams" : "Đội"} />
        </div>

        {mode === "teams" && (
          <p className="mt-3 text-sm text-[#6b7280]">
            {DEFAULT_TEAMS.map((t) => `${t.emoji} ${t.name}`).join(" · ")}
          </p>
        )}

        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[#3f3f46]">{en ? "Pack" : "Pack nội dung"}</span>
          <select
            value={selected.id}
            onChange={(e) => setPackId(e.target.value)}
            className="min-h-11 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none ring-brand-gold/40 focus:ring-2"
          >
            {packList.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 flex items-start gap-3">
          <input
            type="checkbox"
            checked={phoneOnly || !linked}
            disabled={!linked}
            onChange={(e) => setPhoneOnly(e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm text-[#3f3f46]">
            {en
              ? "Phone-only (browser TTS if no bot / teacher reads aloud)"
              : "Chỉ tablet (TTS trình duyệt nếu không bot / cô đọc to)"}
            {!linked && (
              <span className="mt-1 block text-[#6b7280]">
                {en ? "No bot linked — phone-only is on." : "Chưa gắn bot — đang bật chế độ tablet."}
              </span>
            )}
          </span>
        </label>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          disabled={busy}
          onClick={() => void onStart()}
          className="mt-5 min-h-12 w-full rounded-lg bg-[#1a1a1a] px-4 text-base font-semibold text-white hover:bg-black disabled:opacity-60 sm:w-auto"
        >
          {busy ? (en ? "Starting…" : "Đang bắt đầu…") : en ? "Start round" : "Bắt đầu ván"}
        </button>
      </section>
    </div>
  );
}

function ModeChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-lg px-4 text-sm font-semibold ${
        active ? "bg-[#1a1a1a] text-white" : "border border-black/15 bg-white hover:bg-black/5"
      }`}
    >
      {label}
    </button>
  );
}
