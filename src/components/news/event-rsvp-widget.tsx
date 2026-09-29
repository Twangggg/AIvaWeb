"use client";

import { useState } from "react";

export function EventRsvpWidget() {
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    setSubmitted(true);
  };

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 md:p-8 border shadow-xl transition-all max-w-lg mx-auto"
      style={{
        backgroundColor: "var(--modal-bg)",
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-modal)"
      }}
    >
      {/* Ambient Glow */}
      <div
        className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none opacity-30"
        style={{ background: "var(--ocean)" }}
      />

      <div className="relative z-10 text-center">
        {/* Header Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border mb-4"
          style={{
            backgroundColor: "var(--ocean-alpha)",
            borderColor: "var(--ocean)",
            color: "var(--ocean)"
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[var(--ocean)] animate-ping" />
          WORKSHOP TRONG TƯƠNG LAI
        </div>

        <h3 className="text-xl md:text-2xl font-bold mb-2 text-[var(--text-on-glass)]">
          Workshop Trải Nghiệm Kính AIVA
        </h3>
        <p className="text-xs md:text-sm text-[var(--text-dim)] max-w-sm mx-auto mb-6 leading-relaxed">
          Sự kiện trải nghiệm thực tế kính AIVA dành cho phụ huynh và học sinh sẽ được tổ chức trong tương lai. Hãy đăng ký để nhận thông báo sớm nhất ngay khi mở cổng.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              required
              placeholder="Nhập Số điện thoại hoặc Email của bạn..."
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-3.5 rounded-2xl border text-xs bg-[var(--bg-subtle)] border-[var(--border-subtle)] text-[var(--text-on-glass)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-[var(--ocean)] transition-colors"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all transform hover:scale-[1.01]"
              style={{
                background: "var(--gradient-ocean)",
                color: "var(--text-on-accent)",
                boxShadow: "var(--shadow-glow)"
              }}
            >
              Đăng Ký Nhận Thông Báo Workshop
            </button>
          </form>
        ) : (
          <div className="p-4 rounded-2xl border border-dashed border-[var(--ocean)] bg-amber-500/10 text-center animate-fadeIn">
            <span className="material-symbols-outlined text-2xl text-[var(--ocean)] mb-1">verified</span>
            <div className="text-xs font-bold text-[var(--text-on-glass)] mb-1">ĐÃ ĐĂNG KÝ THÀNH CÔNG!</div>
            <p className="text-[11px] text-[var(--text-dim)]">
              AIVA sẽ gửi thông báo ưu tiên giữ chỗ cho <span className="text-[var(--text-on-glass)] font-semibold">{contact}</span> ngay khi sự kiện được tổ chức.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
