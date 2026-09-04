"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";

import type { PlayKind } from "@/features/iot/protocol";
import { PackEditor } from "@/features/play/components/pack-editor";

const KINDS = new Set<PlayKind>(["hunt", "cards", "quiz", "story"]);

export default function PlayPackEditorPage() {
  const params = useParams<{ kind: string }>();
  const kind = params.kind as PlayKind;

  if (!KINDS.has(kind)) {
    return <p className="text-sm text-red-700">Loại pack không hợp lệ.</p>;
  }

  return (
    <Suspense fallback={<p className="text-sm text-[#6b7280]">Đang tải…</p>}>
      <PackEditor kind={kind} />
    </Suspense>
  );
}
