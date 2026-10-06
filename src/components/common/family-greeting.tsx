"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n/provider";

type Topic = "about" | "product" | "news" | "play";
const greetings = {
  about: [
    "Về AIVA",
    "About AIVA",
    "Một người bạn nhỏ được tạo nên từ sự quan tâm dành cho bé và gia đình.",
    "A little companion made with care for children and families.",
  ],
  product: [
    "Thông số mắt kính AIVA",
    "AIVA glasses specifications",
    "Xoay kính để xem từng góc nhìn và tìm hiểu các thông số kỹ thuật bên dưới.",
    "Rotate the glasses to explore every angle and find the technical specifications below.",
  ],
  news: [
    "Tin tức & câu chuyện AIVA",
    "AIVA news & stories",
    "Những câu chuyện, ý tưởng và hoạt động để cả nhà cùng khám phá.",
    "Stories, ideas and activities for your family to discover together.",
  ],
  play: [
    "Chơi cùng AIVA",
    "Play with AIVA",
    "Chọn một trò chơi, thử sức từng chút và khám phá cùng AIVA.",
    "Pick a game, try a little challenge and discover with AIVA.",
  ],
} satisfies Record<Topic, string[]>;

export function FamilyGreeting({
  topic,
  title,
  description,
  label,
}: {
  topic: Topic;
  title?: ReactNode;
  description?: ReactNode;
  label?: ReactNode;
}) {
  const { locale } = useI18n();
  const en = locale === "en";
  const words = greetings[topic];
  return (
    <header className="family-greeting">
      <span
        className="family-greeting-friend"
        style={{ backgroundImage: `url("/mascots/${topic === "play" ? "frog-explorer" : "frog-waving"}.webp")` }}
        role="img"
        aria-label={en ? "AIVA the little frog" : "Người bạn ếch AIVA"}
      />
      <div>
        {label && <span className="family-greeting-label">{label}</span>}
        <h1>{title ?? words[en ? 1 : 0]}</h1>
        <p>{description ?? words[en ? 3 : 2]}</p>
      </div>
    </header>
  );
}
