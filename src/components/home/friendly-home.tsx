"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/provider";
import "./friendly-home.css";

const MASCOT_IMAGES: Record<string, string> = {
  waving: "/mascots/frog-waving.webp",
  shopping: "/mascots/frog-shopping.webp",
  success: "/mascots/frog-success.webp",
  peek: "/mascots/frog-peek.webp",
  parentApp: "/mascots/frog-parent-app.webp",
  thinking: "/mascots/frog-thinking.webp",
  explorer: "/mascots/frog-explorer.webp",
  camera: "/mascots/frog-camera.webp",
  doctor: "/mascots/frog-doctor.webp",
  magnifier: "/mascots/frog-magnifier.webp",
  artist: "/mascots/frog-artist.webp",
  reading: "/mascots/frog-reading.webp",
};

export type MascotVariant =
  | "waving"
  | "shopping"
  | "success"
  | "peek"
  | "parentApp"
  | "thinking"
  | "explorer"
  | "camera"
  | "doctor"
  | "magnifier"
  | "artist"
  | "reading";

function getMascotSrc(pose?: number, variant?: MascotVariant): string {
  if (variant && MASCOT_IMAGES[variant]) return MASCOT_IMAGES[variant];
  switch (pose) {
    case 1:
      return MASCOT_IMAGES.magnifier;
    case 2:
      return MASCOT_IMAGES.reading;
    case 3:
      return MASCOT_IMAGES.parentApp;
    case 4:
      return MASCOT_IMAGES.waving;
    case 5:
      return MASCOT_IMAGES.explorer;
    case 6:
      return MASCOT_IMAGES.shopping;
    case 7:
      return MASCOT_IMAGES.waving;
    case 8:
      return MASCOT_IMAGES.explorer;
    case 9:
    case 10:
      return MASCOT_IMAGES.thinking;
    default:
      return MASCOT_IMAGES.waving;
  }
}

function Friend({
  pose = 0,
  variant,
  className = "",
  stationary = false,
}: {
  pose?: number;
  variant?: MascotVariant;
  className?: string;
  stationary?: boolean;
}) {
  const src = getMascotSrc(pose, variant);
  return (
    <div
      className={`garden-friend ${stationary ? "garden-friend-static" : ""} ${className}`}
      aria-label="AIVA, người bạn ếch nhỏ"
    >
      <Image
        src={src}
        alt="AIVA, người bạn ếch nhỏ"
        width={360}
        height={360}
        className="w-full h-full object-contain filter drop-shadow-sm select-none"
        priority={pose === 4 || variant === "waving"}
      />
    </div>
  );
}

export function FriendlyHome({
  onPreorder,
  story,
}: {
  onPreorder: () => void;
  story?: ReactNode;
}) {
  const { locale, t } = useI18n();
  const en = locale === "en";
  const c = (vi: string, english: string) => (en ? english : vi);
  const [activity, setActivity] = useState(0);
  const activities = [
    {
      icon: "🌱",
      label: c("Khám phá thiên nhiên", "Explore nature"),
      message: c(
        "Mình cùng tìm một chiếc lá nhé! Bạn thấy lá có màu gì?",
        "Let's find a leaf! What colour is it?"
      ),
      pose: 1, // frog-magnifier
    },
    {
      icon: "📖",
      label: c("Nghe một câu chuyện", "Story time"),
      message: c(
        "Ngày xửa ngày xưa, có một bạn ếch nhỏ rất thích khám phá… Bạn muốn cùng mình viết tiếp không?",
        "Once upon a time, a little frog loved exploring… Shall we imagine the next chapter?"
      ),
      pose: 2, // frog-reading
    },
    {
      icon: "☀️",
      label: c("Chào AIVA một cái!", "Say hello to AIVA!"),
      message: c(
        "Chào bạn! Mình vui quá vì được gặp bạn. Hôm nay có điều gì làm bạn mỉm cười?",
        "Hello, friend! I'm so happy to meet you. What made you smile today?"
      ),
      pose: 4, // frog-waving
    },
  ];
  const faqs = [
    { q: t.faq1Q, a: t.faq1A },
    { q: t.faq2Q, a: t.faq2A },
    { q: t.faq3Q, a: t.faq3A },
    { q: t.faq4Q, a: t.faq4A },
    { q: t.faq5Q, a: t.faq5A },
  ];
  return (
    <main className="garden-home">
      <section data-fp-section className="garden-intro-chapter" id="hero">
        <div className="garden-hero garden-wrap">
          <div className="garden-hero-copy">
            <span className="garden-eyebrow">
              {c(
                "MỘT NGƯỜI BẠN NHỎ. MỘT THẾ GIỚI DIỆU KỲ.",
                "A LITTLE FRIEND. A WORLD OF WONDER."
              )}
            </span>
            <h1>
              {c("Lớn lên cùng", "Grow with")}
              <br />
              <span>{c("những điều vui.", "little joys.")}</span>
            </h1>
            <p>
              {c(
                "Có AIVA bên cạnh, mỗi câu hỏi của bé mở ra một cuộc phiêu lưu. Cùng trò chuyện, vui chơi và khám phá thế giới — theo cách thật gần gũi.",
                "With AIVA by their side, every question starts an adventure. Chat, play and discover the world together, one little moment at a time."
              )}
            </p>
            <div className="garden-actions">
              <Link className="garden-button" href="/play">
                {c("Chơi cùng AIVA", "Play with AIVA")}{" "}
                <span aria-hidden="true">↗</span>
              </Link>
              <a className="garden-button garden-button-light" href="#parents">
                {c("Ba mẹ tìm hiểu thêm", "For parents")}{" "}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className="garden-world">
            <span className="garden-sun" aria-hidden="true">
              ☀
            </span>
            <span className="garden-cloud" aria-hidden="true" />
            <div className="garden-hello">
              {c("Xin chào, mình là AIVA!", "Hello, I'm AIVA!")}
              <br />
              <small>
                {c("Làm bạn với mình nhé?", "Shall we be friends?")}
              </small>
            </div>
            <Friend pose={4} className="garden-hero-friend" stationary />
            <span
              className="garden-flower garden-flower-one"
              aria-hidden="true"
            >
              ✿
            </span>
            <span
              className="garden-flower garden-flower-two"
              aria-hidden="true"
            >
              ✿
            </span>
            <span className="garden-world-label">
              {c(
                "Bạn đồng hành của những nhà thám hiểm nhí",
                "A companion for little explorers"
              )}
            </span>
          </div>
        </div>
        <div className="garden-ribbon">
          <span>✦ {c("Hỏi thật nhiều", "Ask questions")}</span>
          <span>✿ {c("Chơi thật vui", "Play together")}</span>
          <span>♡ {c("Khám phá mỗi ngày", "Discover every day")}</span>
        </div>
      </section>
      <section
        data-fp-section
        className="garden-wrap garden-section garden-play-chapter"
        id="play-corner"
      >
        <div className="garden-section-heading">
          <span className="garden-eyebrow">
            {c("GẶP NGƯỜI BẠN MỚI CỦA BÉ", "MEET YOUR CHILD'S NEW FRIEND")}
          </span>
          <h2>{c("Hôm nay, mình chơi gì nhỉ?", "What shall we do today?")}</h2>
          <p>
            {c(
              "Chạm vào một hoạt động để nghe lời gợi ý từ AIVA.",
              "Pick an activity for a little suggestion from AIVA."
            )}
          </p>
        </div>
        <div className="garden-playground">
          <div className="garden-activity-list">
            {activities.map((item, i) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={activity === i}
                className={`garden-activity ${activity === i ? "is-selected" : ""}`}
                onClick={() => setActivity(i)}
              >
                <span aria-hidden="true">{item.icon}</span>
                {item.label}
                <span aria-hidden="true">↗</span>
              </button>
            ))}
            <Link href="/play" className="garden-text-link">
              {c("Đến góc trò chơi", "Visit the play corner")} →
            </Link>
          </div>
          <div className="garden-dialogue">
            <Friend pose={activities[activity].pose} />
            <div className="garden-speech" aria-live="polite">
              <span>AIVA</span>
              <p>{activities[activity].message}</p>
              <small>
                {c(
                  "Một gợi ý nhỏ để bé và ba mẹ cùng chơi",
                  "A little prompt for children and parents to share"
                )}
              </small>
            </div>
          </div>
        </div>
      </section>
      <section
        data-fp-section
        className="garden-wrap garden-section"
        id="discover"
      >
        <div className="garden-section-heading">
          <span className="garden-eyebrow">
            {c("NIỀM VUI TỪ NHỮNG ĐIỀU NHỎ", "JOY IN LITTLE THINGS")}
          </span>
          <h2>
            {c(
              "Một người bạn, nhiều cách khám phá.",
              "One friend, so much to discover."
            )}
          </h2>
        </div>
        <div className="garden-cards">
          {[
            {
              icon: "🌼",
              title: c("Thế giới là lớp học", "The world is a classroom"),
              text: c(
                "Chiếc lá, món đồ chơi hay trang sách: bắt đầu từ những điều bé nhìn thấy mỗi ngày.",
                "A leaf, a toy or a book: start with things your child sees every day."
              ),
              pose: 1, // frog-magnifier
            },
            {
              icon: "💬",
              title: c("Luôn có chuyện để kể", "Always a story to share"),
              text: c(
                "Khuyến khích bé đặt câu hỏi, kể chuyện và chia sẻ những ý tưởng của riêng mình.",
                "Encourage questions, stories and ideas in your child's own words."
              ),
              pose: 2, // frog-reading
            },
            {
              icon: "🎒",
              title: c("Học mà cứ ngỡ đang chơi", "Learning feels like play"),
              text: c(
                "Những trò chơi và thử thách nhỏ mang đến thêm lý do để tò mò và thử sức.",
                "Little games and challenges give curiosity somewhere new to go."
              ),
              pose: 5, // frog-explorer
            },
          ].map((item) => (
            <article className="garden-card" key={item.title}>
              <div className="garden-card-art">
                <span aria-hidden="true">{item.icon}</span>
                <Friend pose={item.pose} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      {story}
      <section
        data-fp-section
        className="garden-wrap garden-section"
        id="video"
      >
        <div className="garden-section-heading">
          <span className="garden-eyebrow">
            {c("NHÌN AIVA GẦN HƠN MỘT CHÚT", "GET TO KNOW AIVA")}
          </span>
          <h2>
            {c("Những khoảnh khắc cùng AIVA.", "Little moments with AIVA.")}
          </h2>
        </div>
        <video
          className="garden-video"
          controls
          preload="none"
          playsInline
          src="/videos/aiva-demo.mp4"
          aria-label={c("Video giới thiệu AIVA", "Meet AIVA video")}
        />
      </section>
      <section
        data-fp-section
        data-fp-native
        className="garden-invitation garden-wrap"
      >
        <Friend pose={6} />
        <div>
          <span className="garden-eyebrow">
            {c(
              "CUỘC PHIÊU LƯU BẮT ĐẦU TỪ MỘT LỜI CHÀO",
              "EVERY ADVENTURE STARTS WITH HELLO"
            )}
          </span>
          <h2>
            {c("Hẹn gặp bạn trong thế giới AIVA!", "See you in AIVA's world!")}
          </h2>
          <p>
            {c(
              "Cùng dành cho bé thêm một người bạn và thật nhiều điều để khám phá.",
              "A new friend and a world of little discoveries await."
            )}
          </p>
          <button type="button" className="garden-button" onClick={onPreorder}>
            {c("Đăng ký đặt trước", "Preorder AIVA")} →
          </button>
        </div>
      </section>
      <section
        data-fp-section
        data-fp-native
        className="garden-wrap garden-section garden-faq"
        id="faq"
      >
        <div className="garden-section-heading flex flex-col items-center">
          <Friend variant="thinking" className="w-28 h-28 mb-2 animate-float" />
          <span className="garden-eyebrow">
            {c("MÌNH CÙNG TÌM HIỂU NHÉ", "LET'S FIND OUT TOGETHER")}
          </span>
          <h2>{c("Những điều ba mẹ muốn biết.", "Questions parents ask.")}</h2>
        </div>
        {faqs.map((faq) => (
          <details key={faq.q}>
            <summary>
              {faq.q}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{faq.a}</p>
          </details>
        ))}
      </section>
    </main>
  );
}
