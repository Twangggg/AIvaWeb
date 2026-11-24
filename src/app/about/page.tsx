"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { EditorialPanel } from "@/components/ui/narrative-motion";
import { FamilyGreeting } from "@/components/common/family-greeting";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";
import { useI18n } from "@/lib/i18n/provider";

const MILESTONES = [
  { id: "story-team", title: "Đội ngũ sáng lập" },
  { id: "story-survey", title: "Khảo sát Cần Thơ" },
  { id: "story-event", title: "Sự kiện AI ơi" },
  { id: "story-school", title: "TH Trung Hiệp" },
  { id: "story-fschool", title: "Fschool Sóc Trăng" },
  { id: "story-fptu", title: "ĐH FPT Cần Thơ" },
  { id: "story-binhminh", title: "THPT Bình Minh" },
];

/** Thanh tiến trình hành trình bên trái màn hình giúp người xem theo dõi và biết còn bài ở dưới */
function LeftJourneyProgress() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 24,
    restDelta: 0.001,
  });

  const [activeId, setActiveId] = useState<string>("story-team");
  const [currentProgress, setCurrentProgress] = useState(0);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    setCurrentProgress(latest);
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.35;
      for (let i = MILESTONES.length - 1; i >= 0; i--) {
        const el = document.getElementById(MILESTONES[i].id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveId(MILESTONES[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToMilestone = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const hasMoreBelow = currentProgress < 0.88;

  return (
    <>
      {/* Mobile/Tablet: Thanh vệt tiến trình siêu mỏng ở mép trái màn hình */}
      <div
        className="fixed left-1 top-24 bottom-24 w-1 rounded-full bg-[var(--glass-border)]/50 z-40 pointer-events-none lg:hidden"
        aria-hidden="true"
      >
        <motion.div
          className="w-full bg-gradient-to-b from-[var(--ocean)] via-[var(--ocean-glow)] to-[var(--ocean)] rounded-full origin-top shadow-[0_0_8px_var(--ocean-glow)]"
          style={{ height: "100%", scaleY: smoothProgress }}
        />
      </div>

      {/* Desktop: Cột mốc hành trình trực quan bên trái */}
      <nav
        aria-label="Tiến trình hành trình AIVA"
        className="hidden lg:flex fixed left-4 xl:left-7 top-1/2 -translate-y-1/2 z-40 flex-col items-start gap-3 select-none"
      >
        <div
          className="relative flex flex-col items-center py-4 px-2.5 rounded-full backdrop-blur-md"
          style={{
            backgroundColor: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Đường ray nền */}
          <div
            className="absolute top-4 bottom-4 w-[2px] bg-[var(--glass-border)] rounded-full left-1/2 -translate-x-1/2"
            aria-hidden="true"
          />

          {/* Dải tiến trình lấp đầy theo cuộn trang */}
          <motion.div
            className="absolute top-4 w-[2px] bg-gradient-to-b from-[var(--ocean)] via-[var(--ocean-glow)] to-[var(--ocean)] rounded-full left-1/2 -translate-x-1/2 origin-top shadow-[0_0_8px_var(--ocean-glow)]"
            style={{
              bottom: "16px",
              scaleY: smoothProgress,
            }}
            aria-hidden="true"
          />

          {/* Các điểm mốc bài viết */}
          <div className="relative z-10 flex flex-col gap-5 items-center">
            {MILESTONES.map((m, idx) => {
              const isActive = activeId === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => scrollToMilestone(m.id)}
                  className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
                  aria-label={`Chuyển đến ${m.title}`}
                >
                  {/* Vòng sáng khi đang ở bài này */}
                  {isActive && (
                    <motion.span
                      layoutId="activeMilestoneIndicator"
                      className="absolute w-5 h-5 rounded-full border border-[var(--ocean-glow)]/80"
                      transition={{ duration: 0.25 }}
                    />
                  )}

                  {/* Nút điểm mốc */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? "bg-[var(--ocean-glow)] scale-125 shadow-[0_0_10px_var(--ocean-glow)]"
                        : "bg-[var(--glass-border)] group-hover:bg-[var(--ocean)] group-hover:scale-110"
                    }`}
                  />

                  {/* Tooltip hiển thị tên bài viết */}
                  <span
                    className={`absolute left-8 px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-all duration-200 pointer-events-none backdrop-blur-md shadow-sm border border-[var(--glass-border)] ${
                      isActive
                        ? "opacity-100 translate-x-0 font-semibold text-[var(--ocean-glow)] bg-[var(--glass-bg)]"
                        : "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--text-dim)] bg-[var(--glass-bg)]"
                    }`}
                  >
                    <span className="opacity-60 text-[10px] mr-1.5 font-mono">
                      0{idx + 1}
                    </span>
                    {m.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nhãn báo hiệu còn bài bên dưới */}
        <AnimatePresence>
          {hasMoreBelow && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              onClick={() => {
                const nextIdx =
                  MILESTONES.findIndex((m) => m.id === activeId) + 1;
                if (nextIdx < MILESTONES.length) {
                  scrollToMilestone(MILESTONES[nextIdx].id);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium backdrop-blur-md border border-[var(--glass-border)] shadow-sm self-center text-[var(--text-dim)] bg-[var(--glass-bg)] hover:text-[var(--ocean-glow)] hover:border-[var(--ocean-glow)]/50 transition-all cursor-pointer"
              title="Nhấn để cuộn đến bài viết tiếp theo"
            >
              <span>Còn bài dưới</span>
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="text-xs text-[var(--ocean-glow)]"
              >
                ↓
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

const SURVEY_ITEMS = [
  {
    id: "survey-photo-1",
    src: "/activities/survey/729499568_122111506263338894_6468955471817821982_n.jpg",
    alt: "Khảo sát và trò chuyện ngoài trời tại Công viên Lưu Hữu Phước",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: "survey-photo-2",
    src: "/activities/survey/731495847_122111505987338894_8399912238569442609_n.jpg",
    alt: "Khảo sát thực tế môi trường sinh hoạt tại Nhà Văn hóa Thiếu nhi",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "survey-photo-3",
    src: "/activities/survey/732441677_122111736405338894_3233669272805089385_n.jpg",
    alt: "Phỏng vấn các em nhỏ và phụ huynh tại Bến Ninh Kiều",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "survey-photo-4",
    src: "/activities/survey/733040872_122111736411338894_4727030670261050115_n.jpg",
    alt: "Ghi nhận góc nhìn thực tế để tiếp tục hoàn thiện AIVA",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
];

const EVENT_ACTIVITIES_ITEMS = [
  {
    id: "event-photo-1",
    src: "/activities/activities_1/748741217_122115126339338894_2877976947895893553_n.jpg",
    alt: "Không gian gian hàng và trải nghiệm sự kiện AI ơi, đây là gì?",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: "event-photo-2",
    src: "/activities/activities_1/746067848_122115126597338894_7613460080686551348_n.jpg",
    alt: "Thử thách bịt mắt trải nghiệm nhìn thế giới cùng chiếc kính AIVA",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "event-photo-3",
    src: "/activities/activities_1/748175735_122115126675338894_2725119892163980274_n.jpg",
    alt: "Các bạn trẻ tham gia thử thách tinh mắt và tìm hiểu công nghệ AI",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "event-photo-4",
    src: "/activities/activities_1/750570154_122115387087338894_2361499969444766949_n.jpg",
    alt: "Giao lưu, lắng nghe phản hồi thực tế cùng Câu lạc bộ F-AI",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
];

const SCHOOL_ACTIVITIES_ITEMS = [
  {
    id: "school-photo-1",
    src: "/activities/TieuHocTH/843167841_122133086709338894_309079305067722911_n.jpg",
    alt: "Gặp gỡ và trao đổi chuyên môn cùng Ban Giám hiệu Trường Tiểu học Trung Hiệp",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: "school-photo-2",
    src: "/activities/TieuHocTH/844557498_122133088611338894_4236430686453311204_n.jpg",
    alt: "Giới thiệu nguyên mẫu kính AIVA trong môi trường giáo dục",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "school-photo-3",
    src: "/activities/TieuHocTH/846023778_122133089577338894_7919601433724890599_n.jpg",
    alt: "Trao đổi về cơ hội ứng dụng công nghệ hỗ trợ học tập thực tế",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "school-photo-4",
    src: "/activities/TieuHocTH/843758485_122133087999338894_6651384881906884722_n.jpg",
    alt: "Ký kết thỏa thuận hợp tác giữa nhóm AIVA và Trường Tiểu học Trung Hiệp",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
];

const FSCHOOL_ACTIVITIES_ITEMS = [
  {
    id: "fschool-photo-1",
    src: "/activities/FSchool/843923077_122135142333338894_8491954841307032371_n.jpg",
    alt: "Các bạn nhỏ hào hứng tham gia chương trình Ai ơi, đây là gì tại Fschool Sóc Trăng",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: "fschool-photo-2",
    src: "/activities/FSchool/848563448_122135142531338894_957006210095766085_n.jpg",
    alt: "Trải nghiệm chiếc túi bí mật và lắng nghe âm thanh nhận diện thế giới",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "fschool-photo-3",
    src: "/activities/FSchool/849508341_122135143065338894_5076868202648203137_n.jpg",
    alt: "Học sinh tự tay trải nghiệm chiếc kính thông minh AIVA",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "fschool-photo-4",
    src: "/activities/FSchool/851041141_122135142213338894_1729032968421375575_n.jpg",
    alt: "Các em gửi gắm những thắc mắc ngộ nghĩnh vào Vườn câu hỏi",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: "fschool-photo-5",
    src: "/activities/FSchool/853001810_122135142453338894_1215023634047626690_n.jpg",
    alt: "Khoảnh khắc giao lưu sôi nổi giữa nhóm AIVA và các em học sinh",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: "fschool-photo-6",
    src: "/activities/FSchool/853372277_122135142735338894_7543643306451196490_n.jpg",
    alt: "Đội khám phá nhí Fschool Sóc Trăng cùng lưu giữ kỷ niệm cùng Ếch AIVA",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
];

const FPTU_ACTIVITIES_ITEMS = [
  {
    id: "fptu-photo-1",
    src: "/activities/FPTU-CanTho/863471781_122136073167338894_5227908516427967607_n.jpg",
    alt: "Không gian gian hàng và các bạn sinh viên tham gia thử thách cùng AIVA",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: "fptu-photo-2",
    src: "/activities/FPTU-CanTho/870640878_122136378753338894_5254323113943386824_n.jpg",
    alt: "Trải nghiệm đeo kính thông minh AIVA và khám phá tính năng tương tác",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "fptu-photo-3",
    src: "/activities/FPTU-CanTho/870468783_122136380025338894_6982592475999728079_n.jpg",
    alt: "Chinh phục thử thách Mật mã năng lượng và sáng tạo cùng Vẽ tiếp đi nào",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "fptu-photo-4",
    src: "/activities/FPTU-CanTho/870582835_122136380805338894_3747846795525196431_n.jpg",
    alt: "Ghi nhận phản hồi thực tế và lưu giữ kỷ niệm cùng CLB F-AI",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
];

const BINHMINH_ACTIVITIES_ITEMS = [
  {
    id: "binhminh-photo-1",
    src: "/activities/THPTBinhMinh/855053266_122136512913338894_5432508632360490856_n.jpg",
    alt: "Gặp gỡ và trao đổi cùng cô Hiệu trưởng Trường THPT Bình Minh",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
  {
    id: "binhminh-photo-2",
    src: "/activities/THPTBinhMinh/848787178_122136510351338894_7634439257958564484_n.jpg",
    alt: "Ký biên bản bàn giao sản phẩm kính thông minh AIVA đầu tiên",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "binhminh-photo-3",
    src: "/activities/THPTBinhMinh/862347955_122136513009338894_6033024015743163423_n.jpg",
    alt: "Giới thiệu nguyên mẫu và định hướng ứng dụng STEM cho học sinh THPT",
    span: "md:col-span-5",
    aspect: "aspect-[16/10] sm:aspect-[4/3] md:aspect-[16/10]",
  },
  {
    id: "binhminh-photo-4",
    src: "/activities/THPTBinhMinh/884080108_122136511023338894_7732893983390752590_n.jpg",
    alt: "Cột mốc đáng nhớ đánh dấu sản phẩm đầu tiên của AIVA được đưa vào trường học",
    span: "md:col-span-7",
    aspect: "aspect-[16/10]",
  },
];

/** Đoạn đường cong uốn lượn liên kết giữa các mục - Trực tiếp điều khiển theo thao tác cuộn (Scroll-driven) */
function SectionConnectorRoad({
  variant = "team-to-survey",
}: {
  variant?:
    | "team-to-survey"
    | "survey-to-event"
    | "event-to-school"
    | "school-to-fschool"
    | "fschool-to-fptu"
    | "fptu-to-binhminh";
}) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  // Bắt nhịp cuộn trang của người dùng qua khoảng đệm liên kết
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 30%"],
  });

  // Spring physics giúp chuyển động mượt mà, hữu cơ theo lực lăn chuột/vuốt màn hình
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 24,
    restDelta: 0.001,
  });

  const pathOpacity = useTransform(smoothProgress, [0, 0.04, 1], [0.3, 1, 1]);

  const [mascotPos, setMascotPos] = useState({
    x: 200,
    y: 0,
    facingLeft: false,
    bob: 0,
  });
  const [currentProgress, setCurrentProgress] = useState(0);

  const isCurveRight =
    variant === "survey-to-event" ||
    variant === "school-to-fschool" ||
    variant === "fptu-to-binhminh";

  const roadPath = isCurveRight
    ? "M 200 0 C 320 80, 350 140, 240 180 C 130 220, 40 250, 110 320 C 180 370, 290 390, 230 440 C 200 465, 200 475, 200 480"
    : "M 200 0 C 80 80, 50 140, 160 180 C 270 220, 360 250, 290 320 C 220 370, 110 390, 170 440 C 200 465, 200 475, 200 480";

  const milestonePoints = isCurveRight
    ? [
        { cx: 240, cy: 180, threshold: 0.35 },
        { cx: 110, cy: 320, threshold: 0.68 },
        { cx: 230, cy: 440, threshold: 0.9 },
      ]
    : [
        { cx: 160, cy: 180, threshold: 0.35 },
        { cx: 290, cy: 320, threshold: 0.68 },
        { cx: 170, cy: 440, threshold: 0.9 },
      ];

  // Đồng bộ vị trí của Mascot trực tiếp theo thao tác cuộn của người dùng
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (!pathRef.current) return;
    const path = pathRef.current;
    const totalLength = path.getTotalLength();
    const clamped = Math.max(0, Math.min(1, latest));
    setCurrentProgress(clamped);

    if (reduced) {
      setMascotPos({ x: 200, y: 476, facingLeft: false, bob: 0 });
      return;
    }

    const currentLength = clamped * totalLength;
    const pt = path.getPointAtLength(currentLength);
    const nextPt = path.getPointAtLength(
      Math.min(currentLength + 3, totalLength)
    );

    const facingLeft = nextPt.x < pt.x;
    const bob =
      clamped > 0 && clamped < 1 ? Math.sin(clamped * Math.PI * 18) * 3 : 0;

    setMascotPos({ x: pt.x, y: pt.y, facingLeft, bob });
  });

  // Thiết lập vị trí ban đầu
  useEffect(() => {
    if (pathRef.current) {
      const pt = pathRef.current.getPointAtLength(0);
      setMascotPos({ x: pt.x, y: pt.y, facingLeft: false, bob: 0 });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[580px] lg:h-[660px] my-8 sm:my-14 flex items-center justify-center pointer-events-none overflow-visible"
    >
      <svg
        viewBox="0 0 400 480"
        preserveAspectRatio="none"
        className="w-full h-full max-w-xl mx-auto overflow-visible"
        aria-hidden="true"
      >
        {/* Nền vệt đường mờ */}
        <path
          d={roadPath}
          fill="none"
          stroke="var(--ocean)"
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.14"
        />

        {/* Vệt đường nét đứt vẽ trực tiếp theo tiến độ cuộn trang (Scroll-driven) */}
        <motion.path
          ref={pathRef}
          d={roadPath}
          fill="none"
          stroke="var(--ocean-glow)"
          strokeWidth="3.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
          style={{ pathLength: smoothProgress, opacity: pathOpacity }}
        />

        {/* Điểm xuất phát */}
        <circle
          cx="200"
          cy="4"
          r="5"
          fill="var(--ocean)"
          stroke="#ffffff"
          strokeWidth="2"
        />

        {/* Các điểm mốc dừng chân dọc theo các khúc quanh uốn lượn */}
        {milestonePoints.map((pt, i) => {
          const reached = currentProgress >= pt.threshold;
          return (
            <g key={i}>
              <circle
                cx={pt.cx}
                cy={pt.cy}
                r="10"
                fill="var(--ocean-glow)"
                className="transition-all duration-300"
                opacity={reached ? 0.3 : 0.08}
                style={{
                  transform: reached ? "scale(1.25)" : "scale(1)",
                  transformOrigin: `${pt.cx}px ${pt.cy}px`,
                }}
              />
              <circle
                cx={pt.cx}
                cy={pt.cy}
                r="4"
                fill={reached ? "var(--ocean)" : "var(--glass-border)"}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="transition-colors duration-300"
              />
            </g>
          );
        })}

        {/* Điểm đích đến */}
        <circle
          cx="200"
          cy="476"
          r="5.5"
          fill={
            currentProgress >= 0.98 ? "var(--ocean)" : "var(--glass-border)"
          }
          stroke="#ffffff"
          strokeWidth="2"
          className="transition-colors duration-300"
        />

        {/* Bạn ếch Mascot AIVA di chuyển trực tiếp theo thao tác cuộn của người dùng */}
        <g
          transform={`translate(${mascotPos.x}, ${mascotPos.y + mascotPos.bob})`}
          className="transition-transform duration-75"
        >
          {/* Bóng đổ nhẹ dưới chân mascot */}
          <ellipse
            cx="0"
            cy="20"
            rx="15"
            ry="5"
            fill="black"
            opacity="0.18"
          />

          {/* Mascot bạn ếch thám hiểm quay mặt theo hướng di chuyển */}
          <g
            transform={
              mascotPos.facingLeft ? "scale(-1, 1)" : "scale(1, 1)"
            }
          >
            <image
              href="/mascots/frog-explorer.webp"
              width="50"
              height="50"
              x="-25"
              y="-25"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function SurveyStoryGallery() {
  return (
    <section id="story-survey" className="relative scroll-mt-24">
      {/* Tiêu đề phần khảo sát thực địa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto text-center mb-10 sm:mb-14"
      >
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
          style={{
            backgroundColor: "var(--ocean-alpha)",
            color: "var(--ocean-glow)",
          }}
        >
          Hành trình thực địa
        </div>
        <h3
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--text-on-glass)" }}
        >
          Khởi đầu hành trình thấu hiểu
        </h3>
        <p
          className="mt-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--text-dim)" }}
        >
          Trực tiếp gặp gỡ các bậc phụ huynh và em nhỏ tại Cần Thơ để lắng nghe
          rào cản công nghệ, từng bước kiến tạo người bạn đồng hành an toàn và
          gần gũi.
        </p>
      </motion.div>

      {/* 4 Khung hình nghệ thuật xuất hiện theo nhịp mượt mà (Hoàn toàn không có đường ở dưới) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {SURVEY_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={item.span}
          >
            <div
              className={`relative ${item.aspect} w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--glass-border)] shadow-sm`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function EventStoryGallery() {
  return (
    <section id="story-event" className="relative scroll-mt-24">
      {/* Tiêu đề sự kiện */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto text-center mb-10 sm:mb-14"
      >
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
          style={{
            backgroundColor: "var(--ocean-alpha)",
            color: "var(--ocean-glow)",
          }}
        >
          Trải nghiệm thực tế
        </div>
        <h3
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--text-on-glass)" }}
        >
          Sự kiện &ldquo;AI ơi, đây là gì?&rdquo;
        </h3>
        <p
          className="mt-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--text-dim)" }}
        >
          Cảm ơn các bạn đã ghé gian hàng, cùng thử thách tinh mắt và dũng cảm bịt
          mắt để thử &ldquo;nhìn thế giới&rdquo; bằng chiếc kính AIVA. Sự đồng hành của Câu lạc bộ
          F-AI và những góp ý chân thành từ người trải nghiệm là hành trang quý giá
          để AIVA hoàn thiện hơn trong chặng đường phía trước.
        </p>
      </motion.div>

      {/* 4 Khung hình nghệ thuật xuất hiện theo nhịp mượt mà */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {EVENT_ACTIVITIES_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={item.span}
          >
            <div
              className={`relative ${item.aspect} w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--glass-border)] shadow-sm`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Thông điệp kết thúc chặng */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 text-center"
      >
        <p
          className="text-xs sm:text-sm font-medium tracking-wide"
          style={{ color: "var(--ocean-glow)" }}
        >
          AIVA — Học từ thế giới thật.
        </p>
      </motion.div>
    </section>
  );
}

function SchoolStoryGallery() {
  return (
    <section id="story-school" className="relative scroll-mt-24">
      {/* Tiêu đề chặng hợp tác học đường */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto text-center mb-10 sm:mb-14"
      >
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
          style={{
            backgroundColor: "var(--ocean-alpha)",
            color: "var(--ocean-glow)",
          }}
        >
          Hợp tác giáo dục
        </div>
        <h3
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--text-on-glass)" }}
        >
          AIVA — Thêm một bước đến gần lớp học
        </h3>
        <p
          className="mt-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--text-dim)" }}
        >
          Nhóm AIVA đã trực tiếp đến Trường Tiểu học Trung Hiệp tại Vũng Liêm, Vĩnh
          Long để gặp gỡ Hiệu trưởng nhà trường, trao đổi và ký kết thỏa thuận hợp
          tác. Cột mốc ý nghĩa mở ra hành trình đưa kính thông minh AIVA vào môi
          trường sử dụng thực tế, lắng nghe phản hồi và hoàn thiện sản phẩm đồng hành
          cùng các em học sinh.
        </p>
      </motion.div>

      {/* 4 Khung hình nghệ thuật xuất hiện theo nhịp mượt mà (không có chữ dưới ảnh) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {SCHOOL_ACTIVITIES_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={item.span}
          >
            <div
              className={`relative ${item.aspect} w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--glass-border)] shadow-sm`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Thông điệp kết thúc chặng */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 text-center"
      >
        <p
          className="text-xs sm:text-sm font-medium tracking-wide"
          style={{ color: "var(--ocean-glow)" }}
        >
          AIVA — Học từ thế giới thật.
        </p>
      </motion.div>
    </section>
  );
}

function FSchoolStoryGallery() {
  return (
    <section id="story-fschool" className="relative scroll-mt-24">
      {/* Tiêu đề chặng FSchool Sóc Trăng */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto text-center mb-10 sm:mb-14"
      >
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
          style={{
            backgroundColor: "var(--ocean-alpha)",
            color: "var(--ocean-glow)",
          }}
        >
          Khám phá & Học đường
        </div>
        <h3
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--text-on-glass)" }}
        >
          Cảm ơn Sóc Trăng vì cuộc hẹn cùng AIVA
        </h3>
        <p
          className="mt-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--text-dim)" }}
        >
          Chương trình &ldquo;Ai ơi, đây là gì?&rdquo; tại Fschool Sóc Trăng đã
          khép lại với những khoảnh khắc đáng nhớ cùng các bạn nhỏ và Ếch AIVA. Từ
          chiếc túi bí mật, những âm thanh quen thuộc đến trải nghiệm kính thông
          minh AIVA, các em đã cùng quan sát, lắng nghe và gửi gắm những thắc mắc
          vào &ldquo;Vườn câu hỏi&rdquo;. Sự đồng hành từ quý thầy cô và Ban tuyển
          sinh là nguồn động lực quý giá để AIVA tiếp tục hoàn thiện hành trình.
        </p>
      </motion.div>

      {/* 6 Khung hình nghệ thuật xuất hiện theo nhịp mượt mà (không có chữ dưới ảnh) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {FSCHOOL_ACTIVITIES_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: idx * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={item.span}
          >
            <div
              className={`relative ${item.aspect} w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--glass-border)] shadow-sm`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Thông điệp kết thúc chặng */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 text-center"
      >
        <p
          className="text-xs sm:text-sm font-medium tracking-wide"
          style={{ color: "var(--ocean-glow)" }}
        >
          AIVA — Học từ thế giới thật.
        </p>
      </motion.div>
    </section>
  );
}

function FptuStoryGallery() {
  return (
    <section id="story-fptu" className="relative scroll-mt-24">
      {/* Tiêu đề chặng FPTU Cần Thơ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto text-center mb-10 sm:mb-14"
      >
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
          style={{
            backgroundColor: "var(--ocean-alpha)",
            color: "var(--ocean-glow)",
          }}
        >
          Giao lưu & Trải nghiệm
        </div>
        <h3
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--text-on-glass)" }}
        >
          Nhìn lại một ngày làm học sinh cùng AIVA
        </h3>
        <p
          className="mt-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--text-dim)" }}
        >
          Sự kiện ngày 29/10 đã mang đến không gian trải nghiệm sôi nổi với các
          thử thách &ldquo;Mật mã năng lượng&rdquo;, &ldquo;Vẽ tiếp đi
          nào!&rdquo; và cơ hội trực tiếp đeo thử kính thông minh AIVA. Sự đồng
          hành của CLB F-AI cùng những chia sẻ thực tế từ các bạn sinh viên là
          gợi ý thiết thực để nhóm tiếp tục hoàn thiện sản phẩm.
        </p>
      </motion.div>

      {/* 4 Khung hình nghệ thuật xuất hiện theo nhịp mượt mà (không có chữ dưới ảnh) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {FPTU_ACTIVITIES_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={item.span}
          >
            <div
              className={`relative ${item.aspect} w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--glass-border)] shadow-sm`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Thông điệp kết thúc chặng */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 text-center"
      >
        <p
          className="text-xs sm:text-sm font-medium tracking-wide"
          style={{ color: "var(--ocean-glow)" }}
        >
          AIVA — Học từ thế giới thật.
        </p>
      </motion.div>
    </section>
  );
}

function BinhMinhStoryGallery() {
  return (
    <section id="story-binhminh" className="relative scroll-mt-24">
      {/* Tiêu đề chặng THPT Bình Minh */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl mx-auto text-center mb-10 sm:mb-14"
      >
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-4"
          style={{
            backgroundColor: "var(--ocean-alpha)",
            color: "var(--ocean-glow)",
          }}
        >
          Cột mốc bàn giao
        </div>
        <h3
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ color: "var(--text-on-glass)" }}
        >
          Chiếc kính đầu tiên đã tìm được điểm đến
        </h3>
        <p
          className="mt-3 text-sm sm:text-base leading-relaxed"
          style={{ color: "var(--text-dim)" }}
        >
          Nhóm AIVA đã trực tiếp đến Trường THPT Bình Minh (Vĩnh Long) để gặp gỡ
          cô Hiệu trưởng, trao đổi và ký biên bản bàn giao chiếc kính thông minh
          đầu tiên. Cột mốc đáng nhớ mở ra hướng ứng dụng AIVA tại bậc THPT, hỗ
          trợ các bạn học sinh tiếp cận STEM, trí tuệ nhân tạo và tương tác âm
          thanh qua trải nghiệm thực tế.
        </p>
      </motion.div>

      {/* 4 Khung hình nghệ thuật xuất hiện theo nhịp mượt mà (không có chữ dưới ảnh) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
        {BINHMINH_ACTIVITIES_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.65,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={item.span}
          >
            <div
              className={`relative ${item.aspect} w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[var(--bg-subtle)] border border-[var(--glass-border)] shadow-sm`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Thông điệp kết thúc chặng */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 text-center"
      >
        <p
          className="text-xs sm:text-sm font-medium tracking-wide"
          style={{ color: "var(--ocean-glow)" }}
        >
          AIVA — Học từ thế giới thật.
        </p>
      </motion.div>
    </section>
  );
}

function AboutUs() {
  const { t } = useI18n();

  const TEAM = [
    {
      image: "/3.png",
      name: t.teamMember1Name,
      role: t.teamMember1Role,
      desc: t.teamMember1Desc,
    },
    {
      image: "/6.png",
      name: t.teamMember2Name,
      role: t.teamMember2Role,
      desc: t.teamMember2Desc,
    },
    {
      image: "/4.png",
      name: t.teamMember3Name,
      role: t.teamMember3Role,
      desc: t.teamMember3Desc,
    },
    {
      image: "/1.png",
      name: t.teamMember4Name,
      role: t.teamMember4Role,
      desc: t.teamMember4Desc,
    },
    {
      image: "/2.png",
      name: t.teamMember5Name,
      role: t.teamMember5Role,
      desc: t.teamMember5Desc,
    },
    {
      image: "/5.png",
      name: t.teamMember6Name,
      role: t.teamMember6Role,
      desc: t.teamMember6Desc,
    },
  ];

  return (
    <section id="about" className="pb-16 px-6 relative">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[var(--ocean)]/10 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[var(--accent)]/8 blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <FamilyGreeting
          topic="about"
          label={t.aboutTag}
          title={
            <>
              {t.aboutTitle}{" "}
              <span className="text-gradient-ocean">{t.aboutTitleAccent}</span>
            </>
          }
          description={t.aboutDesc}
        />

        <div className="text-center mb-12">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-5"
            style={{
              backgroundColor: "var(--ocean-alpha)",
              color: "var(--ocean-glow)",
            }}
          >
            {t.aboutTeamTitle}
          </div>
        </div>

        <div id="story-team" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-24">
          {TEAM.map((member, index) => (
            <EditorialPanel
              key={member.name}
              index={index}
              kind="portrait"
              className="rounded-2xl p-6 backdrop-blur flex flex-col h-full"
              style={{
                backgroundColor: "var(--glass-bg)",
                border: "1px solid",
                borderColor: "var(--glass-border)",
              }}
            >
              <div
                className="rounded-xl overflow-hidden mb-5 aspect-[3313/4638] bg-[var(--bg-subtle)]"
                style={{
                  aspectRatio: "3313 / 4638",
                  border: "1px solid",
                  borderColor: "var(--glass-border)",
                }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={3313}
                  height={4638}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4
                className="text-lg font-bold mb-1"
                style={{ color: "var(--text-on-glass)" }}
              >
                {member.name}
              </h4>
              <p className="text-sm font-medium mb-3 text-gradient-ocean">
                {member.role}
              </p>
              <p className="text-sm mt-auto" style={{ color: "var(--text-dim)" }}>
                {member.desc}
              </p>
            </EditorialPanel>
          ))}
        </div>

        {/* Đoạn đường uốn lượn liên kết giữa mục Thành viên và mục Khảo sát */}
        <SectionConnectorRoad variant="team-to-survey" />

        {/* Khảo sát thực địa với trải nghiệm Storytelling */}
        <SurveyStoryGallery />

        {/* Đoạn đường uốn lượn liên kết giữa Khảo sát và Sự kiện trải nghiệm */}
        <SectionConnectorRoad variant="survey-to-event" />

        {/* Sự kiện "AI ơi, đây là gì?" */}
        <EventStoryGallery />

        {/* Đoạn đường uốn lượn liên kết giữa Sự kiện và Hợp tác trường học */}
        <SectionConnectorRoad variant="event-to-school" />

        {/* AIVA – Thêm một bước đến gần lớp học */}
        <SchoolStoryGallery />

        {/* Đoạn đường uốn lượn liên kết giữa Trường Tiểu học và Fschool Sóc Trăng */}
        <SectionConnectorRoad variant="school-to-fschool" />

        {/* Cảm ơn Sóc Trăng vì cuộc hẹn cùng AIVA */}
        <FSchoolStoryGallery />

        {/* Đoạn đường uốn lượn liên kết giữa Fschool Sóc Trăng và FPTU Cần Thơ */}
        <SectionConnectorRoad variant="fschool-to-fptu" />

        {/* Một ngày làm học sinh cùng AIVA */}
        <FptuStoryGallery />

        {/* Đoạn đường uốn lượn liên kết giữa FPTU Cần Thơ và THPT Bình Minh */}
        <SectionConnectorRoad variant="fptu-to-binhminh" />

        {/* Chiếc kính đầu tiên đã tìm được điểm đến */}
        <BinhMinhStoryGallery />

        <div className="mt-20 text-center">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-medium tracking-wider uppercase mb-8"
            style={{
              backgroundColor: "var(--ocean-alpha)",
              color: "var(--ocean-glow)",
            }}
          >
            {t.aboutContact}
          </div>
          <div
            className="rounded-2xl p-8 backdrop-blur max-w-2xl mx-auto"
            style={{
              backgroundColor: "var(--glass-bg)",
              border: "1px solid",
              borderColor: "var(--glass-border)",
            }}
          >
            <div className="flex flex-col gap-3 text-left">
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-lg shrink-0 mt-0.5"
                  style={{ color: "var(--ocean-glow)" }}
                >
                  location_on
                </span>
                <span style={{ color: "var(--text-dim)" }}>
                  {t.aboutAddress}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-lg shrink-0 mt-0.5"
                  style={{ color: "var(--ocean-glow)" }}
                >
                  mail
                </span>
                <span style={{ color: "var(--text-dim)" }}>{t.aboutEmail}</span>
              </div>
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-lg shrink-0 mt-0.5"
                  style={{ color: "var(--ocean-glow)" }}
                >
                  language
                </span>
                <span style={{ color: "var(--text-dim)" }}>
                  {t.aboutWebsite}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-lg shrink-0 mt-0.5"
                  style={{ color: "var(--ocean-glow)" }}
                >
                  facebook
                </span>
                <a
                  href="https://www.facebook.com/AIVAGlass/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "var(--ocean-glow)" }}
                >
                  {t.aboutFanpage}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const [preorderOpen, setPreorderOpen] = useState(false);

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <LeftJourneyProgress />
      <main className="family-page min-h-screen">
        <AboutUs />
      </main>
      <Footer />
      <PreorderModal
        open={preorderOpen}
        onClose={() => setPreorderOpen(false)}
      />
    </>
  );
}


