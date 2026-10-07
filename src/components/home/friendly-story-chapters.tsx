"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  EditorialPanel,
  MaskedWords,
  SceneSwap,
  STORY_DURATION,
  STORY_EASE,
} from "@/components/ui/narrative-motion";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/provider";
import { useFpSceneSync } from "@/hooks/use-fp-scene-sync";
import { AppDownloadModal } from "@/components/common/app-download-modal";
import { COLORS, GlassesPreview } from "@/components/home/color-picker-section";
import "./friendly-story-chapters.css";

function Pal({
  variant = "waving",
  className = "",
}: {
  variant?: string;
  className?: string;
}) {
  return (
    <Image
      src={`/mascots/frog-${variant}.webp`}
      alt=""
      width={240}
      height={240}
      className={`storybook-pal ${className}`}
    />
  );
}
function Heading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  const frame = useRef<HTMLElement>(null);
  useEffect(() => {
    const chapter = frame.current?.closest(".storybook-chapter");
    if (!chapter) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        chapter.setAttribute(
          "data-narrative-visible",
          String(entry.isIntersecting)
        );
        if (entry.isIntersecting) {
          chapter.setAttribute(
            "data-narrative-direction",
            entry.boundingClientRect.top < -1 ? "back" : "forward"
          );
        }
      },
      { threshold: 0.01 }
    );
    observer.observe(chapter);
    return () => observer.disconnect();
  }, []);
  return (
    <header ref={frame} className="storybook-heading">
      <span className="garden-eyebrow">{label}</span>
      <h2>
        <MaskedWords text={title} />
      </h2>
      {description && <p>{description}</p>}
    </header>
  );
}
function SceneChoices({
  labels,
  active,
  onSelect,
}: {
  labels: string[];
  active: number;
  onSelect: (index: number) => void;
}) {
  const selectionId = useId();
  const reduced = useReducedMotion();
  return (
    <div className="storybook-choices">
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          aria-pressed={active === index}
          onClick={() => onSelect(index)}
        >
          {active === index && (
            <motion.span
              className="storybook-choice-highlight"
              layoutId={selectionId}
              transition={{ duration: reduced ? 0 : 0.35, ease: STORY_EASE }}
              aria-hidden="true"
            />
          )}
          <span className="storybook-choice-label">
            <span aria-hidden="true">{active === index ? "✦" : "○"}</span>{" "}
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
function useWords() {
  const { t, locale } = useI18n();
  return { t, c: (vi: string, en: string) => (locale === "en" ? en : vi) };
}

export function FriendlyVisionChapter() {
  const { t, c } = useWords();
  const { step, dir, setScene } = useFpSceneSync("vision", 3);
  const scenes = [
    {
      title: c("Một mầm xanh nhỏ", "A little green sprout"),
      image: "/vision/cayxanh.jpg",
      voice: t.homeVisionVoice1,
      icon: "🌱",
    },
    {
      title: c("Một trang sách mới", "A new page to discover"),
      image: "/vision/quyensach.jpg",
      voice: t.homeVisionVoice2,
      icon: "📖",
    },
    {
      title: c("Một món đồ chơi quen", "A familiar little toy"),
      image: "/vision/dochoi.jpg",
      voice: t.homeVisionVoice3,
      icon: "🧸",
    },
  ];
  const scene = scenes[step] ?? scenes[0];
  return (
    <section data-fp-scroll className="storybook-chapter storybook-vision">
      <Heading
        label={c("CUỐN SỔ KHÁM PHÁ CỦA BÉ", "YOUR LITTLE DISCOVERY BOOK")}
        title={c(
          "Điều nhỏ xíu, câu chuyện thật hay.",
          "Little things, lovely stories."
        )}
        description={c(
          "Cùng nhìn một điều quen thuộc, rồi nghe AIVA kể thêm một điều mới.",
          "Notice something familiar and let AIVA share a little discovery."
        )}
      />
      <div className="storybook-discovery">
        <motion.div
          className="storybook-photo"
          animate={{ rotate: [-3, 2, -1][step] }}
          transition={{ duration: STORY_DURATION, ease: STORY_EASE }}
        >
          <span className="storybook-discovery-stamp" aria-hidden="true">
            {String(step + 1).padStart(2, "0")} / 03
          </span>
          <SceneSwap
            scene={step}
            kind="iris"
            direction={dir}
            slotClassName="storybook-photo-window"
          >
            <Image
              src={scene.image}
              alt={scene.title}
              fill
              sizes="(min-width: 1024px) 450px, 80vw"
              className="object-cover"
            />
          </SceneSwap>
          <span className="storybook-photo-caption">
            {scene.icon} {scene.title}
          </span>
        </motion.div>
        <div className="storybook-narrator">
          <Pal variant="peek" />
          <div aria-live="polite">
            <SceneSwap
              scene={step}
              kind="shutter"
              direction={dir}
              className="storybook-bubble"
            >
              <span>{c("AIVA kể bạn nghe", "AIVA has a story for you")}</span>
              <p>{scene.voice}</p>
              <small>
                {c(
                  "Minh họa trải nghiệm khám phá cùng AIVA",
                  "An illustration of exploring with AIVA"
                )}
              </small>
            </SceneSwap>
          </div>
        </div>
      </div>
      <SceneChoices
        labels={scenes.map((s) => s.title)}
        active={step}
        onSelect={setScene}
      />
    </section>
  );
}

export function FriendlyFeaturesChapter() {
  const { c } = useWords();
  const { step, dir, setScene } = useFpSceneSync("features", 4);
  const scenes = [
    {
      title: c("Ngẩng đầu, nhìn quanh", "Look up, look around"),
      desc: c(
        "Bé nhìn thế giới thật, nghe lời gợi ý và đặt câu hỏi bằng giọng nói.",
        "See the real world, listen to little prompts and ask questions aloud."
      ),
      icon: "🌼",
      variant: "waving",
    },
    {
      title: c("Có gì ở trước mắt nhỉ?", "What's right in front of us?"),
      desc: c(
        "Từ chiếc lá đến trang sách, camera và micro giúp AIVA cùng bé tìm hiểu những điều xung quanh.",
        "From leaves to books, AIVA's camera and microphone help explore what's around us."
      ),
      icon: "🔎",
      variant: "peek",
    },
    {
      title: c("Một câu hỏi, một khám phá", "One question, one discovery"),
      desc: c(
        "AIVA kết nối để cùng bé trò chuyện và tìm hiểu. Những điều tò mò trở thành khởi đầu cho một cuộc phiêu lưu.",
        "AIVA connects to chat and explore with your child. Curiosity is where an adventure begins."
      ),
      icon: "💬",
      variant: "thinking",
    },
    {
      title: c("Sẵn sàng cho chuyến đi nhỏ", "Ready for a little adventure"),
      desc: c(
        "Kính có pin sạc và thiết kế gọn để bé mang theo. Ba mẹ có thể tìm hiểu thông số ở trang sản phẩm.",
        "Rechargeable glasses with a compact design to take along. Parents can find specifications on the product page."
      ),
      icon: "🎒",
      variant: "shopping",
    },
  ];
  const scene = scenes[step] ?? scenes[0];
  return (
    <section data-fp-scroll className="storybook-chapter storybook-features">
      <Heading
        label={c(
          "NHỮNG ĐIỀU AIVA CÓ THỂ CÙNG BÉ LÀM",
          "THINGS TO DO WITH AIVA"
        )}
        title={c(
          "Mình cùng thử một điều mới nhé?",
          "Shall we try something new?"
        )}
      />
      <div className="storybook-feature-deck" data-discovery={step}>
        <div
          className="storybook-deck-sheet storybook-deck-sheet-one"
          aria-hidden="true"
        />
        <div
          className="storybook-deck-sheet storybook-deck-sheet-two"
          aria-hidden="true"
        />
        <SceneSwap
          scene={step}
          kind="ticket"
          direction={dir}
          className="storybook-feature-page"
        >
          <span className="storybook-ticket-index" aria-hidden="true">
            0{step + 1}
          </span>
          <div className="storybook-feature-art">
            <span aria-hidden="true">
              <svg
                width="38"
                height="38"
                viewBox="0 0 40 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {step === 0 ? (
                  <>
                    <circle cx="20" cy="20" r="7" />
                    <path d="M20 3v5m0 24v5M3 20h5m24 0h5M8 8l4 4m16 16 4 4M8 32l4-4m16-16 4-4" />
                  </>
                ) : step === 1 ? (
                  <>
                    <circle cx="17" cy="17" r="11" />
                    <path d="m26 26 10 10M12 17h10m-5-5v10" />
                  </>
                ) : step === 2 ? (
                  <>
                    <path d="M5 7h30v22H17L8 36v-7H5Z" />
                    <circle cx="13" cy="18" r="1" />
                    <circle cx="20" cy="18" r="1" />
                    <circle cx="27" cy="18" r="1" />
                  </>
                ) : (
                  <>
                    <path d="M10 14h20v22H10Z M15 14V9a5 5 0 0 1 10 0v5 M10 23h20 M15 28h10" />
                    <path d="M7 19H4v11h6m23-11h3v11h-6" />
                  </>
                )}
              </svg>
            </span>
            <Pal variant={scene.variant} />
          </div>
          <div className="storybook-feature-copy" aria-live="polite">
            <span className="storybook-page-number">
              {c("Chuyến khám phá", "Discovery")} {step + 1} / 4
            </span>
            <h3>{scene.title}</h3>
            <p>{scene.desc}</p>
            <a href="/product" className="garden-text-link">
              {c("Ba mẹ tìm hiểu thêm", "More for parents")} →
            </a>
          </div>
        </SceneSwap>
      </div>
      <SceneChoices
        labels={scenes.map((s) => s.title)}
        active={step}
        onSelect={setScene}
      />
    </section>
  );
}

export function FriendlyCompareChapter() {
  const { t, c } = useWords();
  const reduced = useReducedMotion();
  const rows = [
    [t.homeCompareRow1Label, t.homeCompareRow1Screen, t.homeCompareRow1Aiva],
    [t.homeCompareRow2Label, t.homeCompareRow2Screen, t.homeCompareRow2Aiva],
    [t.homeCompareRow3Label, t.homeCompareRow3Screen, t.homeCompareRow3Aiva],
    [t.homeCompareRow4Label, t.homeCompareRow4Screen, t.homeCompareRow4Aiva],
    [t.homeCompareRow5Label, t.homeCompareRow5Screen, t.homeCompareRow5Aiva],
  ];
  return (
    <section data-fp-scroll className="storybook-chapter storybook-compare">
      <Heading
        label={c("MỘT GÓC NHỎ CHO BA MẸ", "A LITTLE CORNER FOR PARENTS")}
        title={c("Thêm một cách để bé khám phá.", "Another way to explore.")}
        description={c(
          "Cùng xem trải nghiệm qua màn hình và trải nghiệm cùng AIVA khác nhau thế nào.",
          "See how screen activities and exploring with AIVA differ."
        )}
      />
      <div className="storybook-comparison" data-fp-scroll>
        <table>
          <caption className="sr-only">
            {t.homeCompareTitle} {t.homeCompareTitleAccent}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t.homeCompareColCriteria}</th>
              <th scope="col">{t.homeCompareColScreen}</th>
              <th scope="col">{t.homeCompareColAiva} ♡</th>
            </tr>
          </thead>
          <motion.tbody
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.01 }}
          >
            {rows.map(([label, screen, aiva], index) => (
              <motion.tr
                key={label}
                variants={{
                  hidden: {
                    clipPath: reduced ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                  },
                  visible: { clipPath: "inset(0 0% 0 0)" },
                }}
                transition={{
                  duration: reduced ? 0 : STORY_DURATION,
                  delay: index * 0.07,
                  ease: STORY_EASE,
                }}
              >
                <th scope="row">{label}</th>
                <td>{screen}</td>
                <td>{aiva}</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
      <div className="storybook-footnote">
        <Pal variant="thinking" />
        <p>
          {c(
            "Mỗi gia đình có một cách đồng hành. Ba mẹ cùng chọn trải nghiệm phù hợp với bé nhé.",
            "Every family has its own way of learning together. Choose what suits your child."
          )}
        </p>
      </div>
    </section>
  );
}

export function FriendlySpecsChapter() {
  const { t, c } = useWords();
  const specs = [
    [t.specLabel1, t.specValue1],
    [t.specLabel2, t.specValue2],
    [t.specLabel3, t.specValue3],
    [t.specLabel4, t.specValue4],
    [t.specLabel5, t.specValue5],
    [t.specLabel6, t.specValue6],
  ];
  return (
    <section className="storybook-chapter storybook-specs">
      <Heading
        label={c("BA MẸ CÙNG TÌM HIỂU", "GET TO KNOW THE GLASSES")}
        title={c("Thông số mắt kính AIVA", "AIVA glasses specifications")}
      />
      <dl className="storybook-specs-grid">
        {specs.map(([label, value], index) => (
          <EditorialPanel key={label} index={index} kind="print">
            <span className="storybook-spec-index" aria-hidden="true">
              0{index + 1}
            </span>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </EditorialPanel>
        ))}
      </dl>
      <Link href="/product" className="garden-text-link">
        {c("Tìm hiểu thêm về kính AIVA", "More about AIVA glasses")} →
      </Link>
    </section>
  );
}

export function FriendlyParentChapter() {
  const { c } = useWords();
  const { step, dir, setScene } = useFpSceneSync("companion", 3);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const scenes = [
    {
      image: "/app/3a97d9280a498a17d358.jpg",
      title: c("Nhật ký những khám phá", "A diary of discoveries"),
      desc: c(
        "Xem lại câu hỏi, những lần tra cứu và ảnh chụp để cùng bé trò chuyện về điều mới mỗi ngày.",
        "Revisit questions, lookups and photos to talk with your child about each day’s discoveries."
      ),
      label: c("Nhật ký của bé", "Discovery diary"),
    },
    {
      image: "/app/0ad97e66ad072d597416.jpg",
      title: c("Một ngày của bé", "Your child’s day"),
      desc: c(
        "Theo dõi thời lượng sử dụng và hoạt động gần đây ngay trên màn hình chính của ứng dụng.",
        "See usage time and recent activities on the app’s home screen."
      ),
      label: c("Hoạt động mỗi ngày", "Daily activities"),
    },
    {
      image: "/app/fb81543c875d07035e4c.jpg",
      title: c("Cùng bé chơi và khám phá", "Play and explore together"),
      desc: c(
        "Chọn trò săn đồ, thẻ từ, câu đố hay một câu chuyện và chỉnh nội dung để cùng bé chơi.",
        "Choose a scavenger hunt, word cards, a quiz or a story, and tailor the activities for your child."
      ),
      label: c("Cùng đồng hành", "Stay connected"),
    },
  ];
  const scene = scenes[step] ?? scenes[0];
  return (
    <>
      <section data-fp-scroll className="storybook-chapter storybook-parent">
        <Heading
          label={c("BA MẸ LUÔN Ở BÊN", "PARENTS ARE PART OF THE ADVENTURE")}
          title={c(
            "Những khám phá nhỏ, cả nhà cùng biết.",
            "Little discoveries to share."
          )}
        />
        <div className="storybook-parent-page">
          <div className="storybook-app-art">
            <div className="storybook-phone-frame">
              <SceneSwap
                scene={step}
                kind="shutter"
                direction={dir}
                slotClassName="storybook-phone-display"
              >
                <Image
                  src={scene.image}
                  alt={scene.label}
                  width={965}
                  height={2048}
                  className="storybook-app-screen"
                />
              </SceneSwap>
            </div>
            <Pal variant="parent-app" />
          </div>
          <div className="storybook-parent-copy">
            <div aria-live="polite">
              <SceneSwap scene={step} kind="shutter" direction={dir}>
                <h3>{scene.title}</h3>
                <p>{scene.desc}</p>
              </SceneSwap>
            </div>
            <SceneChoices
              labels={scenes.map((s) => s.label)}
              active={step}
              onSelect={setScene}
            />
            <button
              className="garden-button"
              type="button"
              onClick={() => setDownloadOpen(true)}
            >
              {c("Tải ứng dụng cho ba mẹ", "Get the parent app")} ↓
            </button>
          </div>
        </div>
      </section>
      <AppDownloadModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
      />
    </>
  );
}

export function FriendlyColorChapter() {
  const { t, c } = useWords();
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const color = COLORS[selected];
  return (
    <section data-fp-scroll className="storybook-chapter storybook-color">
      <Heading
        label={c("GÓC SẮC MÀU CỦA BÉ", "YOUR COLOUR CORNER")}
        title={c(
          "Một màu yêu thích, một người bạn nhỏ.",
          "A favourite colour, a little friend."
        )}
        description={c(
          "Thử chạm vào một màu để chọn chiếc kính bé yêu thích.",
          "Tap a colour and find your favourite glasses."
        )}
      />
      <div className="storybook-color-page">
        <motion.div
          key={color.id}
          className="storybook-color-bloom"
          aria-hidden="true"
          style={{ backgroundColor: color.accent }}
          initial={reduced ? false : { clipPath: "circle(0% at 75% 50%)" }}
          animate={{ clipPath: "circle(140% at 75% 50%)" }}
          transition={{ duration: reduced ? 0 : 0.85, ease: STORY_EASE }}
        />
        <Pal variant="shopping" />
        <div className="storybook-color-preview">
          <GlassesPreview hex={color.hex} accent={color.accent} />
          <div aria-live="polite">
            <SceneSwap scene={selected} kind="shutter">
              <p>{t[color.labelKey]}</p>
            </SceneSwap>
          </div>
        </div>
      </div>
      <div
        className="storybook-swatches"
        role="group"
        aria-label={t.homeColorPickerLabel}
      >
        {COLORS.map((item, i) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={i === selected}
            onClick={() => setSelected(i)}
          >
            <span style={{ background: item.hex }} aria-hidden="true" />
            {t[item.labelKey]}
          </button>
        ))}
      </div>
      <small className="storybook-hint">{t.homeColorHint}</small>
    </section>
  );
}

export function FriendlyMissionChapter() {
  const { c } = useWords();
  const notes = [
    [
      "🌱",
      c("Nuôi dưỡng trí tò mò", "Make room for curiosity"),
      c(
        "Để mỗi câu hỏi nhỏ đều có cơ hội mở ra điều mới.",
        "Give every little question a chance to start something new."
      ),
    ],
    [
      "💛",
      c("Cùng nhau lớn lên", "Grow together"),
      c(
        "Bé khám phá, ba mẹ lắng nghe và cùng đồng hành.",
        "Children explore, parents listen and share the journey."
      ),
    ],
    [
      "☀️",
      c("Niềm vui từ đời thật", "Find joy in the real world"),
      c(
        "Một trang sách, chiếc lá và những khoảnh khắc bên nhau.",
        "A book, a leaf and little moments spent together."
      ),
    ],
  ];
  return (
    <section data-fp-scroll className="storybook-chapter storybook-mission">
      <Pal variant="success" />
      <Heading
        label={c("ĐIỀU CHÚNG MÌNH MONG MUỐN", "WHAT WE HOPE FOR")}
        title={c(
          "Tuổi thơ có thêm những điều diệu kỳ.",
          "A childhood full of little wonders."
        )}
        description={c(
          "AIVA muốn cùng gia đình tạo thêm những khoảnh khắc học hỏi, vui chơi và trò chuyện mỗi ngày.",
          "AIVA joins families in making room for learning, play and conversation each day."
        )}
      />
      <div className="storybook-values">
        {notes.map(([icon, title, desc], index) => (
          <EditorialPanel
            key={title}
            kind="fold"
            index={index}
            className="storybook-value-note"
          >
            <span aria-hidden="true">{icon}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </EditorialPanel>
        ))}
      </div>
    </section>
  );
}
