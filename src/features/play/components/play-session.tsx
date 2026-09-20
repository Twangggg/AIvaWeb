"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { PlayHuntSession } from "@/features/play/components/play-hunt-session";
import { PlayCardsSession } from "@/features/play/components/play-cards-session";
import { PlayQuizSession } from "@/features/play/components/play-quiz-session";
import { PlayStorySession } from "@/features/play/components/play-story-session";
import { DeviceBridge } from "@/features/iot/device.bridge";
import { usePlayStore } from "@/features/play/play.store";
import { useI18n } from "@/lib/i18n/provider";

export function PlaySession() {
  const router = useRouter();
  const { locale } = useI18n();
  const en = locale === "en";

  const running = usePlayStore((s) => s.running);
  const finished = usePlayStore((s) => s.finished);
  const pack = usePlayStore((s) => s.pack);
  const sessionId = usePlayStore((s) => s.sessionId);

  const stop = usePlayStore((s) => s.stop);
  const onDeviceMatch = usePlayStore((s) => s.onDeviceMatch);

  useEffect(() => {
    if (!running && !finished && !sessionId) {
      router.replace("/console/play");
    }
  }, [running, finished, sessionId, router]);

  useEffect(() => {
    const bridge = DeviceBridge.getShared();
    return bridge.onEvent((ev) => {
      if (ev.event === "capture_match") {
        void onDeviceMatch(Boolean(ev.payload?.matched ?? true));
      } else if (ev.event === "session_timeout") {
        void stop();
      }
    });
  }, [onDeviceMatch, stop]);

  if (!running && !finished) {
    return <p className="text-sm text-[var(--console-muted)]">{en ? "Loading…" : "Đang tải…"}</p>;
  }

  switch (pack.kind) {
    case "hunt":
      return <PlayHuntSession />;
    case "cards":
      return <PlayCardsSession />;
    case "quiz":
      return <PlayQuizSession />;
    case "story":
      return <PlayStorySession />;
    default:
      return <PlayHuntSession />;
  }
}
