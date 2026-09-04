"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { PlayKind } from "@/features/iot/protocol";
import { BUILTIN_PACKS } from "@/features/play/play.packs";
import { allPacks, deleteCustomPack, loadCustomPacks } from "@/features/play/play.storage";
import type { PlayPack } from "@/features/play/play.types";
import { useI18n } from "@/lib/i18n/provider";

const KINDS: PlayKind[] = ["hunt", "cards", "quiz", "story"];

const KIND_LABEL: Record<PlayKind, { vi: string; en: string }> = {
  hunt: { vi: "Săn đồ", en: "Hunt" },
  cards: { vi: "Thẻ", en: "Cards" },
  quiz: { vi: "Đố ảnh", en: "Quiz" },
  story: { vi: "Chuyện", en: "Story" },
};

export function PackList() {
  const { locale } = useI18n();
  const en = locale === "en";
  const [packs, setPacks] = useState<PlayPack[]>(BUILTIN_PACKS);
  const [customIds, setCustomIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [all, custom] = await Promise.all([allPacks(), loadCustomPacks()]);
      if (cancelled) return;
      setPacks(all);
      setCustomIds(new Set(custom.map((p) => p.id)));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onDelete = async (id: string) => {
    await deleteCustomPack(id);
    const [all, custom] = await Promise.all([allPacks(), loadCustomPacks()]);
    setPacks(all);
    setCustomIds(new Set(custom.map((p) => p.id)));
  };

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {en ? "Packs" : "Pack nội dung"}
            </h1>
            <p className="mt-2 max-w-xl text-base text-[#6b7280]">
              {en
                ? "Edit classroom content. Custom packs save in this browser."
                : "Sửa nội dung lớp. Pack tùy chỉnh lưu trên trình duyệt này."}
            </p>
          </div>
          <Link
            href="/console/play"
            className="inline-flex min-h-10 items-center rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold hover:bg-black/5"
          >
            {en ? "Back to Play" : "Về Chơi"}
          </Link>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {KINDS.map((kind) => (
          <Link
            key={kind}
            href={`/console/play/packs/${kind}`}
            className="rounded-2xl border border-black/8 bg-white/70 p-5 transition hover:border-black/20 hover:bg-white"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">{kind}</p>
            <p className="mt-2 text-lg font-semibold">{en ? KIND_LABEL[kind].en : KIND_LABEL[kind].vi}</p>
            <p className="mt-2 text-sm text-[#6b7280]">
              {en ? "Create / edit custom pack" : "Tạo / sửa pack tùy chỉnh"}
            </p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl border border-black/8 bg-white/70 p-5">
        <h2 className="text-lg font-semibold">{en ? "All packs" : "Tất cả pack"}</h2>
        <ul className="mt-4 divide-y divide-black/5">
          {packs.map((p) => {
            const isCustom = customIds.has(p.id);
            return (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-[#6b7280]">
                    {p.kind} · {p.id}
                    {isCustom ? ` · ${en ? "custom" : "tùy chỉnh"}` : ` · ${en ? "builtin" : "mặc định"}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/console/play/packs/${p.kind}?id=${encodeURIComponent(p.id)}`}
                    className="inline-flex min-h-10 items-center rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold hover:bg-black/5"
                  >
                    {en ? "Edit" : "Sửa"}
                  </Link>
                  {isCustom && (
                    <button
                      type="button"
                      onClick={() => void onDelete(p.id)}
                      className="min-h-10 rounded-lg border border-red-200 bg-red-50 px-3 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      {en ? "Delete" : "Xóa"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
