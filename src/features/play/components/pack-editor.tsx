"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import type { PlayKind } from "@/features/iot/protocol";
import { BUILTIN_PACKS, defaultPackFor } from "@/features/play/play.packs";
import { allPacks, upsertCustomPack } from "@/features/play/play.storage";
import type { HuntItem, PlayPack, QuizItem, StoryNode } from "@/features/play/play.types";
import { useI18n } from "@/lib/i18n/provider";

function newHunt(kind: PlayPack["kind"], idx: number): HuntItem {
  const word = kind === "cards" ? `Thẻ ${idx + 1}` : `Đồ ${idx + 1}`;
  return {
    id: `c-${Date.now()}-${idx}`,
    label: word,
    prompt: kind === "cards" ? `Tìm thẻ ${word}.` : `Tìm ${word}.`,
    hint: word,
    aliases: [],
  };
}

function newQuiz(idx: number): QuizItem {
  return {
    id: `q-${Date.now()}-${idx}`,
    emoji: "❓",
    prompt: "Câu hỏi",
    answers: ["A", "B"],
    correctIndex: 0,
  };
}

function newStory(idx: number): StoryNode {
  return {
    id: idx === 0 ? "start" : `n${idx}`,
    text: "Lời kể…",
    choices: [],
    end: false,
  };
}

const HELP: Record<PlayKind, { vi: string; en: string }> = {
  hunt: {
    vi: "Mỗi dòng: nhãn khớp camera + câu máy nói.",
    en: "Each row: camera label + speak prompt.",
  },
  cards: {
    vi: "Giống săn đồ — nhãn = tên thẻ.",
    en: "Like hunt — label is the card name.",
  },
  quiz: {
    vi: "Emoji | câu hỏi | đáp án cách nhau bởi dấu phẩy | index đúng (0-based).",
    en: "Emoji | question | comma answers | correct index (0-based).",
  },
  story: {
    vi: "id | lời kể | lựa chọn dạng Nhãn>nextId, … | đánh dấu kết thúc.",
    en: "id | narration | choices Label>nextId, … | mark end.",
  },
};

const BUILTIN_IDS = new Set(BUILTIN_PACKS.map((p) => p.id));

export function PackEditor({ kind }: { kind: PlayKind }) {
  const { locale } = useI18n();
  const en = locale === "en";
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [packId, setPackId] = useState(`${kind}-custom`);
  const [items, setItems] = useState<HuntItem[]>([]);
  const [quiz, setQuiz] = useState<QuizItem[]>([]);
  const [story, setStory] = useState<StoryNode[]>([]);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void allPacks().then((packs) => {
      if (cancelled) return;
      const source =
        (editId ? packs.find((p) => p.id === editId) : undefined) ??
        packs.find((p) => p.id === `${kind}-custom`) ??
        defaultPackFor(kind);

      // Editing a builtin clones into a custom id so builtins stay intact.
      const nextId =
        editId && !BUILTIN_IDS.has(editId) ? editId : `${kind}-custom`;

      setPackId(nextId);
      setTitle(source.title + (BUILTIN_IDS.has(source.id) && nextId !== source.id ? " (tùy chỉnh)" : ""));
      if (kind === "quiz") setQuiz(source.quiz?.length ? structuredClone(source.quiz) : [newQuiz(0)]);
      else if (kind === "story")
        setStory(source.story?.length ? structuredClone(source.story) : [newStory(0)]);
      else setItems(source.items?.length ? structuredClone(source.items) : [newHunt(kind, 0)]);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [kind, editId]);

  const onSave = async () => {
    setBusy(true);
    try {
      const pack: PlayPack = {
        id: packId.trim() || `${kind}-custom`,
        kind,
        title: title.trim() || defaultPackFor(kind).title,
      };
      if (kind === "quiz") pack.quiz = quiz;
      else if (kind === "story") {
        pack.story = story;
        pack.storyStartId = story[0]?.id ?? "start";
      } else pack.items = items;
      await upsertCustomPack(pack);
      router.push("/console/play/packs");
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return <p className="text-sm text-[#6b7280]">{en ? "Loading…" : "Đang tải…"}</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8a7a4a]">{kind}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">
              {en ? "Edit pack" : "Sửa pack"}
            </h1>
            <p className="mt-2 text-sm text-[#6b7280]">{en ? HELP[kind].en : HELP[kind].vi}</p>
          </div>
          <Link
            href="/console/play/packs"
            className="inline-flex min-h-10 items-center rounded-lg border border-black/15 bg-white px-3 text-sm font-semibold hover:bg-black/5"
          >
            {en ? "All packs" : "Tất cả pack"}
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-black/8 bg-white/70 p-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">{en ? "Title" : "Tiêu đề"}</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="min-h-11 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none ring-brand-gold/40 focus:ring-2"
          />
        </label>
        <label className="mt-4 flex flex-col gap-1.5">
          <span className="text-sm font-medium">ID</span>
          <input
            value={packId}
            onChange={(e) => setPackId(e.target.value)}
            className="min-h-11 rounded-lg border border-black/10 bg-white px-3 font-mono text-sm outline-none ring-brand-gold/40 focus:ring-2"
          />
        </label>
      </section>

      {(kind === "hunt" || kind === "cards") &&
        items.map((item, idx) => (
          <ItemCard key={item.id} title={`#${idx + 1}`} onRemove={() => setItems((prev) => prev.filter((_, i) => i !== idx))}>
            <Field
              label={en ? "Label" : "Nhãn"}
              value={item.label}
              onChange={(v) => setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, label: v } : x)))}
            />
            <Field
              label={en ? "Prompt" : "Câu nói"}
              value={item.prompt}
              onChange={(v) => setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, prompt: v } : x)))}
            />
            <Field
              label={en ? "Hint" : "Gợi ý"}
              value={item.hint}
              onChange={(v) => setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, hint: v } : x)))}
            />
            <Field
              label={en ? "Aliases (comma)" : "Alias (phẩy)"}
              value={item.aliases.join(", ")}
              onChange={(v) =>
                setItems((prev) =>
                  prev.map((x, i) =>
                    i === idx
                      ? {
                          ...x,
                          aliases: v
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }
                      : x,
                  ),
                )
              }
            />
          </ItemCard>
        ))}

      {kind === "quiz" &&
        quiz.map((q, idx) => (
          <ItemCard key={q.id} title={`#${idx + 1}`} onRemove={() => setQuiz((prev) => prev.filter((_, i) => i !== idx))}>
            <Field
              label="Emoji"
              value={q.emoji}
              onChange={(v) => setQuiz((prev) => prev.map((x, i) => (i === idx ? { ...x, emoji: v } : x)))}
            />
            <Field
              label={en ? "Question" : "Câu hỏi"}
              value={q.prompt}
              onChange={(v) => setQuiz((prev) => prev.map((x, i) => (i === idx ? { ...x, prompt: v } : x)))}
            />
            <Field
              label={en ? "Answers (comma)" : "Đáp án (phẩy)"}
              value={q.answers.join(", ")}
              onChange={(v) =>
                setQuiz((prev) =>
                  prev.map((x, i) =>
                    i === idx
                      ? {
                          ...x,
                          answers: v
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        }
                      : x,
                  ),
                )
              }
            />
            <Field
              label={en ? "Correct index" : "Index đúng"}
              value={String(q.correctIndex)}
              onChange={(v) =>
                setQuiz((prev) =>
                  prev.map((x, i) => (i === idx ? { ...x, correctIndex: Math.max(0, Number(v) || 0) } : x)),
                )
              }
            />
          </ItemCard>
        ))}

      {kind === "story" &&
        story.map((node, idx) => (
          <ItemCard
            key={`${node.id}-${idx}`}
            title={`#${idx + 1}`}
            onRemove={() => setStory((prev) => prev.filter((_, i) => i !== idx))}
          >
            <Field
              label="ID"
              value={node.id}
              onChange={(v) => setStory((prev) => prev.map((x, i) => (i === idx ? { ...x, id: v } : x)))}
            />
            <Field
              label={en ? "Text" : "Lời kể"}
              value={node.text}
              onChange={(v) => setStory((prev) => prev.map((x, i) => (i === idx ? { ...x, text: v } : x)))}
            />
            <Field
              label={en ? "Choices (Label>nextId, …)" : "Lựa chọn (Nhãn>nextId, …)"}
              value={node.choices.map((c) => `${c.label}>${c.nextId}`).join(", ")}
              onChange={(v) =>
                setStory((prev) =>
                  prev.map((x, i) =>
                    i === idx
                      ? {
                          ...x,
                          choices: v
                            .split(",")
                            .map((s) => s.trim())
                            .filter((s) => s.includes(">"))
                            .map((s) => {
                              const [label, nextId] = s.split(">");
                              return { label: (label || "").trim(), nextId: (nextId || "").trim() };
                            }),
                        }
                      : x,
                  ),
                )
              }
            />
            <label className="mt-3 flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={Boolean(node.end)}
                onChange={(e) =>
                  setStory((prev) => prev.map((x, i) => (i === idx ? { ...x, end: e.target.checked } : x)))
                }
              />
              {en ? "End node" : "Nút kết thúc"}
            </label>
          </ItemCard>
        ))}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (kind === "quiz") setQuiz((prev) => [...prev, newQuiz(prev.length)]);
            else if (kind === "story") setStory((prev) => [...prev, newStory(prev.length)]);
            else setItems((prev) => [...prev, newHunt(kind, prev.length)]);
          }}
          className="min-h-11 rounded-lg border border-black/15 bg-white px-4 text-sm font-semibold hover:bg-black/5"
        >
          {en ? "Add item" : "Thêm mục"}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void onSave()}
          className="min-h-11 rounded-lg bg-[#1a1a1a] px-4 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
        >
          {busy ? (en ? "Saving…" : "Đang lưu…") : en ? "Save pack" : "Lưu pack"}
        </button>
      </div>
    </div>
  );
}

function ItemCard({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/8 bg-white/70 p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-[#8a7a4a]">{title}</p>
        <button type="button" onClick={onRemove} className="text-sm font-semibold text-red-700 hover:underline">
          Xóa
        </button>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-[#3f3f46]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 rounded-lg border border-black/10 bg-white px-3 text-sm outline-none ring-brand-gold/40 focus:ring-2"
      />
    </label>
  );
}
