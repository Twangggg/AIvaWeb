"use client";

import { useState } from "react";

interface SurveyQuestion {
  id: number;
  question: string;
  options: string[];
}

const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 1,
    question: "Độ tuổi của con bạn và thói quen tiếp xúc công nghệ hàng ngày?",
    options: [
      "Trẻ từ 4 - 6 tuổi (Mới bắt đầu khám phá môi trường)",
      "Trẻ từ 7 - 9 tuổi (Học tiểu học, cần hỗ trợ Tiếng Anh)",
      "Trẻ từ 10 - 12 tuổi (Tự lập học tập & rèn luyện tư duy)"
    ]
  },
  {
    id: 2,
    question: "Tính năng AI nào bạn đánh giá quan trọng nhất cho sự phát triển của trẻ?",
    options: [
      "Nhận diện đồ vật xung quanh & giải thích bằng giọng nói song ngữ Việt - Anh",
      "Cảnh báo khoảng cách nhìn, tư thế ngồi & bảo vệ tối đa thị lực",
      "Báo cáo hành trình & các chủ đề con tò mò trong ngày gửi về App phụ huynh"
    ]
  },
  {
    id: 3,
    question: "Yếu tố thiết kế phần cứng kính AIVA nào bạn quan tâm hàng đầu?",
    options: [
      "Không màn hình điện tử (Bảo vệ mắt hoàn toàn khỏi ánh sáng xanh)",
      "Khung kính siêu nhẹ dưới 50g & chất liệu an toàn cho da trẻ",
      "Âm thanh truyền qua gọng kính an toàn cho thính giác của trẻ"
    ]
  },
  {
    id: 4,
    question: "Mức giá dự kiến bạn sẵn sàng đầu tư cho trợ lý học tập AIVA của con?",
    options: [
      "Từ 2.500.000đ - 3.500.000đ",
      "Từ 3.500.000đ - 4.500.000đ",
      "Trên 4.500.000đ (Yêu cầu phiên bản cao cấp)"
    ]
  }
];

export function InteractiveSurveyWidget() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const q = SURVEY_QUESTIONS[currentStep];

  const handleSelectOption = (option: string) => {
    const updated = { ...selectedAnswers, [q.id]: option };
    setSelectedAnswers(updated);

    if (currentStep < SURVEY_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 md:p-8 border shadow-xl transition-all"
      style={{
        backgroundColor: "var(--modal-bg)",
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-modal)"
      }}
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[90px] pointer-events-none opacity-30"
        style={{ background: "var(--ocean)" }}
      />

      <div className="relative z-10">
        {/* Header Badge */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
            style={{
              backgroundColor: "var(--ocean-alpha)",
              borderColor: "var(--ocean)",
              color: "var(--ocean)"
            }}
          >
            <span className="material-symbols-outlined text-sm">engineering</span>
            KHẢO SÁT ĐỊNH HƯỚNG PHÁT TRIỂN SẢN PHẨM AIVA
          </div>
          <div className="text-xs font-medium" style={{ color: "var(--text-dim)" }}>
            Dữ liệu hỗ trợ đội ngũ R&D AIVA
          </div>
        </div>

        {!submitted ? (
          <div>
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: "var(--text-dim)" }}>
                <span>Câu hỏi {currentStep + 1} / {SURVEY_QUESTIONS.length}</span>
                <span>{Math.round(((currentStep + 1) / SURVEY_QUESTIONS.length) * 100)}% Hoàn thành</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-subtle)" }}>
                <div
                  className="h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${((currentStep + 1) / SURVEY_QUESTIONS.length) * 100}%`,
                    background: "var(--gradient-ocean)"
                  }}
                />
              </div>
            </div>

            {/* Question Title */}
            <h3 className="text-lg md:text-xl font-bold mb-5 leading-snug" style={{ color: "var(--text-on-glass)" }}>
              {q.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-4 rounded-2xl border font-medium text-xs md:text-sm transition-all duration-200 flex items-center justify-between group hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "var(--bg-subtle)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-on-glass)"
                  }}
                >
                  <span className="group-hover:text-[var(--ocean)] transition-colors pr-2 leading-relaxed">{opt}</span>
                  <span
                    className="w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs transition-colors group-hover:border-[var(--ocean)]"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100" style={{ color: "var(--ocean)" }}>
                      arrow_forward
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Survey Completed Display */
          <div className="text-center py-6 animate-fadeIn">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center border shadow-lg"
              style={{
                backgroundColor: "var(--ocean-alpha)",
                borderColor: "var(--ocean)",
                color: "var(--ocean)"
              }}
            >
              <span className="material-symbols-outlined text-3xl">task_alt</span>
            </div>

            <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--text-on-glass)" }}>
              Cảm ơn đóng góp ý kiến của bạn!
            </h3>
            <p className="text-sm max-w-md mx-auto mb-6 leading-relaxed" style={{ color: "var(--text-dim)" }}>
              Dữ liệu phản hồi chi tiết của bạn đã được chuyển trực tiếp tới phòng nghiên cứu & phát triển (R&D) AIVA để hoàn thiện sản phẩm tốt nhất cho trẻ.
            </p>

            <button
              onClick={() => {
                setSubmitted(false);
                setCurrentStep(0);
                setSelectedAnswers({});
              }}
              className="text-xs font-semibold hover:underline"
              style={{ color: "var(--ocean)" }}
            >
              ← Thực hiện lại bài khảo sát
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
