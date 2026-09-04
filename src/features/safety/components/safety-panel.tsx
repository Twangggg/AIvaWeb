"use client";

import { useEffect, useState } from "react";

import {
  evaluateSafetyGateSync,
  type SafetyGateResult,
} from "@/features/safety/safety.policy";
import {
  DEFAULT_CHILD,
  DEFAULT_SAFETY,
  getActiveChild,
  loadSafetySettings,
  saveSafetySettings,
  upsertChild,
  type ChildProfile,
  type PersonaId,
  type SafetySettings,
} from "@/features/safety/safety.storage";
import { useI18n } from "@/lib/i18n/provider";

const PERSONAS: { id: PersonaId; vi: string; en: string }[] = [
  { id: "mentor", vi: "Mentor", en: "Mentor" },
  { id: "robot", vi: "Robot", en: "Robot" },
  { id: "bear", vi: "Gấu", en: "Bear" },
];

export function SafetyPanel() {
  const { locale } = useI18n();
  const en = locale === "en";
  const [settings, setSettings] = useState<SafetySettings>(DEFAULT_SAFETY);
  const [child, setChild] = useState<ChildProfile>(DEFAULT_CHILD);
  const [gate, setGate] = useState<SafetyGateResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const [s, c] = await Promise.all([loadSafetySettings(), getActiveChild()]);
      setSettings(s);
      setChild(c);
      setGate(evaluateSafetyGateSync(s));
      setReady(true);
    })();
  }, []);

  const patchSettings = (partial: Partial<SafetySettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      setGate(evaluateSafetyGateSync(next));
      return next;
    });
    setSaved(false);
  };

  const onSave = async () => {
    await saveSafetySettings(settings);
    await upsertChild({
      ...child,
      persona: settings.persona,
    });
    setSaved(true);
    setGate(evaluateSafetyGateSync(settings));
  };

  if (!ready) {
    return <p className="text-sm text-[var(--console-muted)]">{en ? "Loading…" : "Đang tải…"}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {en ? "Safety" : "An toàn"}
        </h1>
        <p className="mt-2 max-w-xl text-base text-[var(--console-muted)]">
          {en
            ? "Child profile and gates for starting play. Saved in this browser."
            : "Hồ sơ bé và cổng chặn bắt đầu chơi. Lưu trên trình duyệt này."}
        </p>
        {gate && !gate.allowed && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900" role="status">
            {en ? gate.messageEn : gate.messageVi}
          </p>
        )}
        {gate?.allowed && (
          <p className="mt-3 text-sm text-green-700">
            {en ? "Play is currently allowed." : "Hiện đang cho phép bắt đầu chơi."}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
        <h2 className="text-lg font-semibold">{en ? "Active profile" : "Hồ sơ đang dùng"}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">{en ? "Display name" : "Tên hiển thị"}</span>
            <input
              value={child.name}
              onChange={(e) => {
                setChild((c) => ({ ...c, name: e.target.value }));
                setSaved(false);
              }}
              className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">{en ? "Age" : "Tuổi"}</span>
            <input
              type="number"
              min={3}
              max={15}
              value={child.ageYears}
              onChange={(e) => {
                setChild((c) => ({ ...c, ageYears: Math.max(3, Number(e.target.value) || 7) }));
                setSaved(false);
              }}
              className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                patchSettings({ persona: p.id });
                setChild((c) => ({ ...c, persona: p.id }));
              }}
              className={`min-h-10 rounded-lg px-4 text-sm font-semibold ${
                settings.persona === p.id
                  ? "bg-[var(--console-inverse)] text-[var(--console-inverse-fg)]"
                  : "border border-[var(--console-border)] bg-[var(--console-chip)] hover:opacity-90"
              }`}
            >
              {en ? p.en : p.vi}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
        <h2 className="text-lg font-semibold">{en ? "Gates" : "Cổng chặn"}</h2>
        <div className="mt-4 flex flex-col gap-3">
          <Toggle
            label={en ? "Bedtime gate" : "Giờ ngủ"}
            checked={settings.bedtime}
            onChange={(v) => patchSettings({ bedtime: v })}
          />
          {settings.bedtime && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">{en ? "Start" : "Bắt đầu"}</span>
                <input
                  type="time"
                  value={settings.bedtimeStart}
                  onChange={(e) => patchSettings({ bedtimeStart: e.target.value })}
                  className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">{en ? "End" : "Kết thúc"}</span>
                <input
                  type="time"
                  value={settings.bedtimeEnd}
                  onChange={(e) => patchSettings({ bedtimeEnd: e.target.value })}
                  className="min-h-11 rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm"
                />
              </label>
            </div>
          )}
          <Toggle
            label={en ? "School mode" : "School mode"}
            checked={settings.schoolMode}
            onChange={(v) => patchSettings({ schoolMode: v })}
          />
          <Toggle
            label={en ? "Classroom mode (teacher override)" : "Classroom mode (cô mở lớp)"}
            checked={settings.classroomMode}
            onChange={(v) => patchSettings({ classroomMode: v })}
          />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">
              {en ? "Daily limit (minutes)" : "Giới hạn phút/ngày"}
            </span>
            <input
              type="number"
              min={10}
              max={480}
              value={settings.dailyLimitMinutes}
              onChange={(e) =>
                patchSettings({ dailyLimitMinutes: Math.max(10, Number(e.target.value) || 120) })
              }
              className="min-h-11 max-w-xs rounded-lg border border-[var(--console-border)] bg-[var(--console-chip)] px-3 text-sm outline-none ring-brand-gold/40 focus:ring-2"
            />
            <span className="text-xs text-[var(--console-muted)]">
              {en ? "Used today" : "Đã dùng hôm nay"}: {settings.usageMinutesToday} phút
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--console-border)] bg-[var(--console-card)] p-5">
        <h2 className="text-lg font-semibold">{en ? "Filters" : "Bộ lọc"}</h2>
        <div className="mt-4 flex flex-col gap-3">
          <Toggle
            label={en ? "Block toxic content" : "Chặn nội dung độc hại"}
            checked={settings.toxicBlock}
            onChange={(v) => patchSettings({ toxicBlock: v })}
          />
          <Toggle
            label={en ? "Age-appropriate voice" : "Giọng phù hợp tuổi"}
            checked={settings.ageVoice}
            onChange={(v) => patchSettings({ ageVoice: v })}
          />
          <Toggle
            label={en ? "Safe search" : "Safe search"}
            checked={settings.safeSearch}
            onChange={(v) => patchSettings({ safeSearch: v })}
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void onSave()}
          className="min-h-11 rounded-lg bg-[var(--console-inverse)] px-4 text-sm font-semibold text-[var(--console-inverse-fg)] hover:opacity-90"
        >
          {en ? "Save" : "Lưu"}
        </button>
        {saved && <p className="text-sm text-green-700">{en ? "Saved" : "Đã lưu"}</p>}
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl bg-black/[0.03] px-3 py-3">
      <span className="text-sm font-medium text-[#3f3f46]">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
}
