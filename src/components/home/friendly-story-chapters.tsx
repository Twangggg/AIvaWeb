"use client";

import { useState } from "react";
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
  return (
    <header className="storybook-heading">
      <span className="garden-eyebrow">{label}</span>
      <h2>{title}</h2>
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
  return (
    <div className="storybook-choices">
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          aria-pressed={active === index}
          onClick={() => onSelect(index)}
        >
          <span aria-hidden="true">{active === index ? "✦" : "○"}</span> {label}
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
  const { step, setScene } = useFpSceneSync("vision", 3);
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
        <div className="storybook-photo">
          <Image
            key={scene.image}
            src={scene.image}
            alt={scene.title}
            fill
            sizes="(min-width: 1024px) 450px, 80vw"
            className="object-cover"
          />
          <span className="storybook-photo-caption">
            {scene.icon} {scene.title}
          </span>
        </div>
        <div className="storybook-narrator">
          <Pal variant="peek" />
          <div key={step} className="storybook-bubble" aria-live="polite">
            <span>{c("AIVA kể bạn nghe", "AIVA has a story for you")}</span>
            <p>{scene.voice}</p>
            <small>
              {c(
                "Minh họa trải nghiệm khám phá cùng AIVA",
                "An illustration of exploring with AIVA"
              )}
            </small>
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
  const { step, setScene } = useFpSceneSync("features", 4);
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
      <div key={step} className="storybook-feature-page">
        <div className="storybook-feature-art">
          <span aria-hidden="true">{scene.icon}</span>
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
          <tbody>
            {rows.map(([label, screen, aiva]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{screen}</td>
                <td>{aiva}</td>
              </tr>
            ))}
          </tbody>
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
        {specs.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
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
  const { step, setScene } = useFpSceneSync("companion", 3);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const scenes = [
    {
      image: "/app/3a97d9280a498a17d358.jpg",
      title: c("Nhật ký những khám phá", "A diary of discoveries"),
      desc: c("Xem lại câu hỏi, những lần tra cứu và ảnh chụp để cùng bé trò chuyện về điều mới mỗi ngày.", "Revisit questions, lookups and photos to talk with your child about each day’s discoveries."),
      label: c("Nhật ký của bé", "Discovery diary"),
    },
    {
      image: "/app/0ad97e66ad072d597416.jpg",
      title: c("Một ngày của bé", "Your child’s day"),
      desc: c("Theo dõi thời lượng sử dụng và hoạt động gần đây ngay trên màn hình chính của ứng dụng.", "See usage time and recent activities on the app’s home screen."),
      label: c("Hoạt động mỗi ngày", "Daily activities"),
    },
    {
      image: "/app/fb81543c875d07035e4c.jpg",
      title: c("Cùng bé chơi và khám phá", "Play and explore together"),
      desc: c("Chọn trò săn đồ, thẻ từ, câu đố hay một câu chuyện và chỉnh nội dung để cùng bé chơi.", "Choose a scavenger hunt, word cards, a quiz or a story, and tailor the activities for your child."),
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
            <Image
              src={scene.image}
              alt={scene.label}
              width={965}
              height={2048}
              className="storybook-app-screen"
            />
            <Pal variant="parent-app" />
          </div>
          <div className="storybook-parent-copy">
            <div aria-live="polite">
              <h3>{scene.title}</h3>
              <p>{scene.desc}</p>
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
        <Pal variant="shopping" />
        <div className="storybook-color-preview">
          <GlassesPreview hex={color.hex} accent={color.accent} />
          <p aria-live="polite">{t[color.labelKey]}</p>
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
        {notes.map(([icon, title, desc]) => (
          <article key={title}>
            <span aria-hidden="true">{icon}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
