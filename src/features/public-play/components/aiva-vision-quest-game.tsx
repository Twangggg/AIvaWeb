"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface QuestItem {
  id: string;
  nameVi: string;
  nameEn: string;
  phonetic: string;
  sentenceEn: string;
  sentenceVi: string;
  icon: string;
  category: string;
  confidence: number;
  description: string;
  tip: string;
  x: number; // percentage X
  y: number; // percentage Y
  question: string;
  options: string[];
  correctOption: string;
  hint: string;
}

const ITEMS: QuestItem[] = [
  {
    id: "book",
    nameVi: "Quyển Sách",
    nameEn: "Book",
    phonetic: "/bʊk/",
    sentenceEn: "I love reading books everyday.",
    sentenceVi: "Bé thích đọc sách mỗi ngày.",
    icon: "menu_book",
    category: "Tri Thức & Bài Học",
    confidence: 99.4,
    description: "Sách mở ra kho tàng tri thức thế giới.",
    tip: "AIVA nhận diện chữ viết (OCR) & giải thích nội dung bài học bằng giọng nói theo độ tuổi.",
    x: 18,
    y: 28,
    question: "Vật thể nào giúp AIVA đọc chữ và giải thích bài học cho bé?",
    options: ["Quyển Sách", "Gấu Bông", "Đồng Hồ"],
    correctOption: "Quyển Sách",
    hint: "Đây là đồ vật chứa nhiều trang giấy và câu chuyện hay.",
  },
  {
    id: "clock",
    nameVi: "Đồng Hồ",
    nameEn: "Clock",
    phonetic: "/klɒk/",
    sentenceEn: "The clock tells us the time.",
    sentenceVi: "Đồng hồ báo cho bé biết thời gian.",
    icon: "schedule",
    category: "Quản Lý Thời Gian",
    confidence: 98.8,
    description: "Dùng để xem giờ và quản lý thời gian.",
    tip: "AIVA nhắc nhở bé nghỉ ngơi bảo vệ mắt & điều chỉnh tư thế ngồi học đúng chuẩn.",
    x: 50,
    y: 20,
    question: "Đồ vật nào giúp AIVA canh giờ nhắc bé nghỉ ngơi bảo vệ mắt?",
    options: ["Chậu Cây", "Đồng Hồ", "Quả Táo"],
    correctOption: "Đồng Hồ",
    hint: "Vật này có kim giờ, kim phút quay liên tục trên tường.",
  },
  {
    id: "apple",
    nameVi: "Quả Táo",
    nameEn: "Apple",
    phonetic: "/ˈæp.əl/",
    sentenceEn: "An apple a day keeps the doctor away.",
    sentenceVi: "Mỗi ngày ăn một quả táo rất tốt cho sức khỏe.",
    icon: "nutrition",
    category: "Dinh Dưỡng & Sức Khỏe",
    confidence: 99.1,
    description: "Trái cây giàu Vitamin C tốt cho sức khỏe.",
    tip: "AIVA nhận diện đồ ăn & nhắc nhở bé chế độ dinh dưỡng lành mạnh hàng ngày.",
    x: 82,
    y: 28,
    question: "Món ăn nào chứa nhiều Vitamin C giúp bé có thêm năng lượng?",
    options: ["Quả Táo", "Gấu Bông", "Quyển Sách"],
    correctOption: "Quả Táo",
    hint: "Trái cây màu đỏ tròn ngọt giòn sần sật.",
  },
  {
    id: "teddy",
    nameVi: "Gấu Bông",
    nameEn: "Teddy Bear",
    phonetic: "/ˈted.i beər/",
    sentenceEn: "My teddy bear is very soft and cute.",
    sentenceVi: "Chú gấu bông của bé rất mềm mại và đáng yêu.",
    icon: "smart_toy",
    category: "Sáng Tạo & Đồ Chơi",
    confidence: 97.6,
    description: "Người bạn đồ chơi mềm mại của tuổi thơ.",
    tip: "AIVA nhận diện đồ chơi & gợi ý câu đố tư duy khoa học vui nhộn.",
    x: 28,
    y: 65,
    question: "Người bạn nhỏ nào giúp AIVA đặt câu đố tư duy sáng tạo?",
    options: ["Gấu Bông", "Chậu Cây", "Đồng Hồ"],
    correctOption: "Gấu Bông",
    hint: "Đồ chơi nhồi bông mềm mịn bé ôm khi đi ngủ.",
  },
  {
    id: "plant",
    nameVi: "Chậu Cây Xanh",
    nameEn: "Plant",
    phonetic: "/plɑːnt/",
    sentenceEn: "Plants give us fresh clean air.",
    sentenceVi: "Cây xanh cho chúng ta không khí trong lành.",
    icon: "potted_plant",
    category: "Sinh Học & Thiên Nhiên",
    confidence: 98.2,
    description: "Cây xanh quang hợp tạo Oxy cho môi trường.",
    tip: "AIVA thắp lên trí tò mò sinh học, khuyến khích bé khám phá thiên nhiên.",
    x: 75,
    y: 65,
    question: "Cây xanh tạo ra chất khí quan trọng nào cho con người hô hấp?",
    options: ["Oxy", "Nước", "Ánh sáng"],
    correctOption: "Oxy",
    hint: "Khí tự nhiên giúp chúng ta hít thở mỗi ngày.",
  },
];

export function AivaVisionQuestGame() {
  const [mode, setMode] = useState<"scan" | "flashcard" | "quiz" | "certificate">("scan");
  const [discoveredIds, setDiscoveredIds] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<QuestItem | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  // Certificate State
  const [studentName, setStudentName] = useState("");

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize Web Audio Effects
  const playSoundEffect = (type: "scan" | "correct" | "wrong" | "win" | "speak") => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "scan") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "correct") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "speak") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "win") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
        osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
        osc.start();
        osc.stop(ctx.currentTime + 0.7);
      }
    } catch {
      // Audio fallback
    }
  };

  const handleScanItem = (item: QuestItem) => {
    setActiveItem(item);
    setIsScanning(true);
    setShowSpeechBubble(true);
    playSoundEffect("scan");

    setTimeout(() => {
      setIsScanning(false);
      if (!discoveredIds.includes(item.id)) {
        setDiscoveredIds((prev) => [...prev, item.id]);
      }
    }, 700);
  };

  const handleSpeakText = (text: string) => {
    playSoundEffect("speak");
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startQuiz = () => {
    setMode("quiz");
    setCurrentQuizIdx(0);
    setScore(500); // Base XP for scanning 5 items
    setStreak(0);
    setShowHint(false);
    setQuizSelected(null);
    setQuizAnswered(false);
    playSoundEffect("correct");
  };

  const handleQuizAnswer = (option: string) => {
    if (quizAnswered) return;
    setQuizSelected(option);
    setQuizAnswered(true);

    const currentQ = ITEMS[currentQuizIdx];
    if (option === currentQ.correctOption) {
      const addedXP = 100 + streak * 20;
      setScore((prev) => prev + addedXP);
      setStreak((prev) => prev + 1);
      playSoundEffect("correct");
    } else {
      setStreak(0);
      playSoundEffect("wrong");
    }
  };

  const nextQuizQuestion = () => {
    if (currentQuizIdx < ITEMS.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
      setQuizSelected(null);
      setQuizAnswered(false);
      setShowHint(false);
    } else {
      playSoundEffect("win");
      setMode("certificate");
    }
  };

  const handleReset = () => {
    setMode("scan");
    setDiscoveredIds([]);
    setActiveItem(null);
    setIsScanning(false);
    setShowSpeechBubble(false);
    setCurrentQuizIdx(0);
    setScore(0);
    setStreak(0);
    setShowHint(false);
    setQuizSelected(null);
    setQuizAnswered(false);
    setStudentName("");
  };

  const allScanned = discoveredIds.length === ITEMS.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Game Mode Bar & Global Stats */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl border backdrop-blur"
        style={{
          backgroundColor: "var(--game-panel)",
          borderColor: "var(--game-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg"
            style={{
              backgroundColor: "var(--ocean-alpha)",
              borderColor: "var(--ocean)",
              color: "var(--ocean)",
            }}
          >
            <span className="material-symbols-outlined text-2xl">
              {mode === "scan"
                ? "center_focus_strong"
                : mode === "flashcard"
                ? "style"
                : mode === "quiz"
                ? "psychology"
                : "workspace_premium"}
            </span>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>MÔ PHỎNG ỐNG KÍNH AIVA</span>
              {streak > 1 && (
                <span className="px-2 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-400 text-black animate-pulse">
                  🔥 Combo x{streak}
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-[var(--game-ink)]">
              {mode === "scan" ? (
                <>Đã nhận diện: <span className="text-amber-700 dark:text-amber-300 font-mono">{discoveredIds.length}/{ITEMS.length}</span> vật thể</>
              ) : mode === "flashcard" ? (
                <>Thẻ từ vựng song ngữ AIVA</>
              ) : mode === "quiz" ? (
                <>Câu {currentQuizIdx + 1}/{ITEMS.length} • Điểm XP: <span className="text-amber-700 dark:text-amber-300 font-mono">{score}</span></>
              ) : (
                <>Tổng thành tích: <span className="text-amber-700 dark:text-amber-300 font-mono">{score} XP</span> ⭐⭐⭐</>
              )}
            </div>
          </div>
        </div>

        {/* Mode Switch Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {allScanned && mode !== "certificate" && (
            <>
              <button
                onClick={() => setMode(mode === "flashcard" ? "scan" : "flashcard")}
                className="min-h-11 px-3.5 py-1.5 rounded-full border text-xs font-bold text-[var(--game-ink)] transition-colors active:scale-[0.98] hover:opacity-75"
                style={{ borderColor: "var(--game-border)", backgroundColor: "var(--game-surface)" }}
              >
                {mode === "flashcard" ? "← Xem Phòng" : "📖 Thẻ Song Ngữ"}
              </button>

              <button
                onClick={startQuiz}
                className="min-h-11 px-4 py-1.5 rounded-full font-bold text-xs text-black shadow-lg transition-transform active:scale-[0.98] hover:scale-105"
                style={{ background: "var(--gradient-ocean)" }}
              >
                Thử Thách Quiz ➔
              </button>
            </>
          )}
          <button
            onClick={handleReset}
            className="min-h-11 px-3.5 py-1.5 rounded-full border text-xs font-semibold text-[var(--game-muted)] transition-colors active:scale-[0.98] hover:text-[var(--game-ink)]"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-subtle)" }}
          >
            Chơi lại
          </button>
        </div>
      </div>

      {/* MODE 1: INTERACTIVE ROOM SCANNER HUD */}
      {mode === "scan" && (
        <div
          className="relative h-[430px] w-full rounded-3xl border overflow-hidden p-3 shadow-2xl flex flex-col justify-between sm:h-[500px] sm:p-4"
          style={{
            backgroundColor: "var(--game-canvas)",
            borderColor: "var(--game-border)",
          }}
        >
          {/* Ambient Lighting FX */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-slate-100/25 to-white/70 pointer-events-none dark:from-slate-950/90 dark:via-slate-900/50 dark:to-slate-950" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20"
            style={{ background: "var(--ocean)" }}
          />

          {/* Guide Banner */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-slate-800 border border-slate-200 backdrop-blur shadow-lg dark:bg-black/80 dark:text-slate-200 dark:border-slate-700">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Chạm vào 5 điểm sáng trong phòng để mắt kính AIVA nhận diện vật thể & đọc tiếng Anh!
            </div>
          </div>

          {/* Room Canvas Grid - Absolute Pins */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {ITEMS.map((item) => {
              const discovered = discoveredIds.includes(item.id);
              const isActive = activeItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  style={{ top: `${item.y}%`, left: `${item.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                  <button
                    onClick={() => handleScanItem(item)}
                    className="group relative flex flex-col items-center focus:outline-none"
                  >
                    {/* Glowing Viewfinder Node */}
                    <div
                      className={`relative h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl transition-all duration-300 sm:h-16 sm:w-16 ${
                        isActive ? "scale-115 ring-4 ring-amber-400 bg-amber-400 text-black" : "hover:scale-110"
                      }`}
                      style={{
                        backgroundColor: discovered ? "rgba(234, 179, 8, 0.95)" : "var(--game-panel)",
                        borderColor: discovered ? "#eab308" : "var(--game-border)",
                        color: discovered ? "#000000" : "var(--game-ink)",
                      }}
                    >
                      <span className="material-symbols-outlined text-2xl md:text-3xl">{item.icon}</span>

                      {/* AR Bounding Box Lines */}
                      {isActive && (
                        <div className="absolute -inset-2 border-2 border-dashed border-amber-300 rounded-2xl pointer-events-none opacity-80" />
                      )}

                      {!discovered && (
                        <span className="absolute -inset-1.5 rounded-2xl border border-amber-400/60 pointer-events-none opacity-40" />
                      )}
                    </div>

                    {/* Category Pin Badge */}
                    <div
                      className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all shadow-md ${
                        discovered
                          ? "bg-amber-400/20 text-amber-700 border-amber-400/40 dark:text-amber-300"
                          : "bg-white/90 text-slate-700 border-slate-200 dark:bg-black/85 dark:text-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {item.nameVi}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Active Item AR HUD Card */}
          <div className="relative z-30 mt-auto">
            {activeItem ? (
              <div
                className="p-4 rounded-2xl border backdrop-blur-xl animate-fadeIn shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{
                  backgroundColor: "var(--game-panel)",
                  borderColor: "var(--ocean)",
                }}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg"
                    style={{
                      backgroundColor: "var(--ocean-alpha)",
                      borderColor: "var(--ocean)",
                      color: "var(--ocean)",
                    }}
                  >
                    <span className="material-symbols-outlined text-3xl">{activeItem.icon}</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-base font-bold text-[var(--game-ink)]">{activeItem.nameVi}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-400/20 text-amber-700 border border-amber-400/40 dark:text-amber-300">
                        {activeItem.nameEn} {activeItem.phonetic}
                      </span>
                      <button
                        onClick={() => handleSpeakText(activeItem.nameEn)}
                        className="inline-flex min-h-11 items-center gap-1 px-2 text-[11px] rounded-full bg-amber-400/10 text-amber-700 border border-amber-400/30 hover:bg-amber-400/20 transition dark:text-amber-300"
                      >
                        <span className="material-symbols-outlined text-xs">volume_up</span> Nghe phát âm
                      </button>
                    </div>

                    <p className="text-xs text-[var(--game-muted)]">{activeItem.description}</p>
                    <p className="text-[11px] text-amber-700/90 mt-1 flex items-center gap-1 font-medium dark:text-amber-300/90">
                      <span className="material-symbols-outlined text-xs">auto_awesome</span> Mẹo AIVA: {activeItem.tip}
                    </p>
                  </div>
                </div>

                {allScanned && (
                  <button
                    onClick={startQuiz}
                    className="min-h-11 w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-black shrink-0 shadow-lg transition-transform active:scale-[0.98] hover:scale-105"
                    style={{ background: "var(--gradient-ocean)" }}
                  >
                    Vào Quiz Tích Điểm ➔
                  </button>
                )}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white/85 border border-slate-200 text-center text-xs text-slate-600 dark:bg-black/60 dark:border-slate-800 dark:text-slate-400">
                Chạm vào các biểu tượng trong phòng để AIVA quét vật thể & hướng dẫn phát âm song ngữ.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 2: FLASHCARD STUDY LIST */}
      {mode === "flashcard" && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 animate-fadeIn">
          {ITEMS.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl border bg-white/90 backdrop-blur border-slate-200 space-y-3 hover:border-amber-400/50 transition-all dark:bg-slate-900/90 dark:border-slate-800"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {item.category}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-bold text-[var(--game-ink)]">{item.nameVi}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-amber-400 font-mono">{item.nameEn}</span>
                  <span className="text-xs text-slate-400 font-mono">{item.phonetic}</span>
                  <button
                    onClick={() => handleSpeakText(item.nameEn)}
                    className="min-h-11 min-w-11 text-amber-600 hover:text-amber-800 dark:text-amber-300 dark:hover:text-white"
                  >
                    <span className="material-symbols-outlined text-base">volume_up</span>
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 dark:bg-black/40 dark:border-slate-800 dark:text-slate-300">
                <p className="font-semibold text-amber-700 font-mono dark:text-amber-200">&quot;{item.sentenceEn}&quot;</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.sentenceVi}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODE 3: DYNAMIC AI QUIZ CHALLENGE */}
      {mode === "quiz" && (
        <div
          className="relative w-full rounded-3xl border p-5 shadow-2xl backdrop-blur-xl animate-fadeIn space-y-6 md:p-8"
          style={{
            backgroundColor: "var(--game-panel)",
            borderColor: "var(--ocean)",
          }}
        >
          {/* Quiz Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/20 text-amber-700 border border-amber-400/40 dark:text-amber-300">
                CÂU HỎI {currentQuizIdx + 1} / {ITEMS.length}
              </span>
              <span className="text-xs text-[var(--game-muted)]">Chủ đề: {ITEMS[currentQuizIdx].category}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowHint(!showHint)}
                className="min-h-11 text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 dark:text-amber-300"
              >
                <span className="material-symbols-outlined text-sm">lightbulb</span> {showHint ? "Ẩn Gợi Ý" : "Gợi Ý AIVA"}
              </button>
              <div className="text-sm font-bold text-amber-400 font-mono">
                {score} XP
              </div>
            </div>
          </div>

          {/* Hint Card */}
          {showHint && (
            <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-xs text-amber-800 animate-fadeIn flex items-center gap-2 dark:text-amber-200">
              <span className="material-symbols-outlined text-base shrink-0">tips_and_updates</span>
              <span>Gợi ý từ AIVA: {ITEMS[currentQuizIdx].hint}</span>
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-bold text-[var(--game-ink)] leading-snug">
              {ITEMS[currentQuizIdx].question}
            </h3>
            <p className="text-xs text-[var(--game-muted)]">Chọn 1 đáp án đúng nhất để nhận +100 XP & duy trì chuỗi Combo:</p>
          </div>

          {/* Options Grid */}
          <div className="grid gap-3 sm:grid-cols-3">
            {ITEMS[currentQuizIdx].options.map((option) => {
              const isSelected = quizSelected === option;
              const isCorrect = option === ITEMS[currentQuizIdx].correctOption;
              let btnStyle = "border-slate-200 bg-white text-slate-800 hover:border-amber-400/60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200";

              if (quizAnswered) {
                if (isCorrect) {
                  btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-200";
                } else if (isSelected) {
                  btnStyle = "border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleQuizAnswer(option)}
                  disabled={quizAnswered}
                  className={`min-h-14 p-4 rounded-2xl border text-left text-sm transition-all active:scale-[0.99] flex items-center justify-between ${btnStyle}`}
                >
                  <span>{option}</span>
                  {quizAnswered && isCorrect && (
                    <span className="material-symbols-outlined text-emerald-400">check_circle</span>
                  )}
                  {quizAnswered && isSelected && !isCorrect && (
                    <span className="material-symbols-outlined text-rose-400">cancel</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button */}
          {quizAnswered && (
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
              <div className="text-xs leading-relaxed">
                {quizSelected === ITEMS[currentQuizIdx].correctOption ? (
                  <p className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">stars</span> Chính xác! Bé nhận +{100 + (streak - 1) * 20} XP!
                  </p>
                ) : (
                  <p className="text-rose-400 font-medium">
                    Chưa chính xác! Đáp án đúng là: <strong>{ITEMS[currentQuizIdx].correctOption}</strong>
                  </p>
                )}
              </div>

              <button
                onClick={nextQuizQuestion}
                className="min-h-11 w-full sm:w-auto px-6 py-2.5 rounded-full font-bold text-xs text-black shadow-lg transition-transform active:scale-[0.98] hover:scale-105 shrink-0"
                style={{ background: "var(--gradient-ocean)" }}
              >
                {currentQuizIdx < ITEMS.length - 1 ? "Câu Hỏi Tiếp Theo ➔" : "Xem Bằng Khám Phá ➔"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 4: OFFICIAL CERTIFICATE BADGE */}
      {mode === "certificate" && (
        <div className="relative overflow-hidden rounded-3xl border p-5 text-center shadow-2xl bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(254,243,199,.6),rgba(255,255,255,.98))] border-amber-400/50 animate-fadeIn space-y-6 dark:bg-gradient-to-b dark:from-slate-900 dark:via-amber-950/30 dark:to-slate-900 md:p-10">
          <div className="flex justify-center mb-2">
            <Image
              src="/AIVALogo.png"
              alt="AIVA Logo"
              width={140}
              height={32}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-400/20 border border-amber-400/40 dark:text-amber-300">
            CHỨNG NHẬN XUẤT SẮC
          </div>

          <h2 className="text-2xl md:text-4xl font-black text-[var(--game-ink)] uppercase tracking-tight">
            NHÀ KHÁM PHÁ AIVA NHÍ
          </h2>

          {!studentName ? (
            <div className="max-w-sm mx-auto space-y-3 pt-2">
              <p className="text-xs text-[var(--game-muted)]">
                Chúc mừng bé đã xuất sắc hoàn thành thử thách với <strong className="text-amber-400 font-mono">{score} XP</strong>! Nhập tên bé để in bằng:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nhập tên bé (VD: Bảo Nam, Minh Anh...)"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-amber-400 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-[var(--game-muted)]">Trao tặng chứng nhận cho:</p>
              <div className="text-3xl md:text-5xl font-extrabold text-amber-400 font-serif tracking-wide drop-shadow-md">
                {studentName}
              </div>
              <div className="inline-block px-4 py-1 rounded-full bg-amber-400/10 text-amber-700 text-xs font-bold border border-amber-400/30 font-mono dark:text-amber-300">
                Hạng Xuất Sắc • {score} XP • ⭐⭐⭐
              </div>
              <p className="text-xs md:text-sm text-[var(--game-muted)] max-w-lg mx-auto leading-relaxed">
                Đã hoàn thành xuất sắc thử thách <strong>AIVA Vision Quest</strong>, làm chủ 5 đồ vật song ngữ & chinh phục thành công các câu đố tư duy AI.
              </p>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-full border border-slate-300 text-xs font-bold text-slate-700 hover:text-slate-950 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
            >
              Chơi Lại Từ Đầu
            </button>
            <a
              href="#companion"
              className="px-6 py-3 rounded-full text-xs font-bold text-black shadow-lg transition-transform hover:scale-105"
              style={{ background: "var(--gradient-ocean)" }}
            >
              Đặt Trước Kính AIVA Ngay ➔
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
