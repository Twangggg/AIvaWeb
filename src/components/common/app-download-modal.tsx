"use client";

import { useState } from "react";
import Image from "next/image";

interface AppDownloadModalProps {
  open: boolean;
  onClose: () => void;
}

export function AppDownloadModal({ open, onClose }: AppDownloadModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!open) return null;

  const handleDirectDownload = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    const link = document.createElement("a");
    link.href = "/api/download/app?platform=android";
    link.download = "AIVA_Companion_v1.0.0.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
    }, 1200);
  };

  // Real URL for QR code scanning
  const qrTargetUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/download/app?platform=android`
    : "https://aiva.id.vn/api/download/app";

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrTargetUrl)}&color=0a0e14&bgcolor=ffffff`;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
      style={{ backgroundColor: "var(--overlay-bg)" }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl p-6 md:p-7 shadow-2xl transition-all border"
        style={{
          backgroundColor: "var(--modal-bg)",
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-modal)"
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none opacity-30"
          style={{ background: "var(--ocean)" }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ color: "var(--text-dim)" }}
          aria-label="Đóng"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        {/* Brand Logo & Mascot Header */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <Image
              src="/AIVALogo.png"
              alt="AIVA Logo"
              width={140}
              height={32}
              style={{ width: "auto", height: "auto" }}
              className="h-7 object-contain mb-1"
              priority
            />
            <h2 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-on-glass)" }}>
              Tải App AIVA Companion
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
              Đồng hành cùng con khám phá thế giới thực.
            </p>
          </div>
          <div className="w-16 h-16 shrink-0 relative animate-float">
            <Image
              src="/mascots/frog-waving.webp"
              alt="AIva chào bạn"
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-4">
          {/* Main Direct Download APK Button */}
          <button
            onClick={handleDirectDownload}
            disabled={downloading}
            className="w-full relative overflow-hidden group flex items-center justify-between p-3.5 rounded-2xl font-semibold shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "var(--gradient-ocean)",
              color: "var(--text-on-accent)",
              boxShadow: "var(--shadow-glow)"
            }}
          >
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">
                  {downloading ? "sync" : downloadSuccess ? "check_circle" : "download"}
                </span>
              </div>
              <div>
                <div className="text-sm font-bold">
                  {downloading
                    ? "Đang tải xuống..."
                    : downloadSuccess
                    ? "Đã tải file APK thành công!"
                    : "Tải Trực Tiếp (Bản APK)"}
                </div>
                <div className="text-[11px] opacity-80 font-normal">
                  Cài đặt Android • v1.0.0 (48MB)
                </div>
              </div>
            </div>
            <span className="material-symbols-outlined text-lg opacity-80 group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>

          {/* Platform Stores */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Android / Google Play */}
            <button
              onClick={handleDirectDownload}
              className="flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-left group"
              style={{
                backgroundColor: "var(--bg-subtle)",
                borderColor: "var(--border-subtle)"
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--ocean-alpha)", color: "var(--ocean)" }}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997 0-.551.4482-.9993.9993-.9993.5511 0 .9993.4483.9993.9993 0 .5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997 0-.551.4482-.9993.9993-.9993.5511 0 .9993.4483.9993.9993 0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1523-.5676.416.416 0 00-.5676.1523l-2.0223 3.5025C15.5862 8.3597 13.854 7.98 12 7.98c-1.854 0-3.5862.3797-5.1349.9694L4.8428 5.4469a.416.416 0 00-.5676-.1523.416.416 0 00-.1523.5676l1.9973 3.4592C2.688 11.0336.3262 14.3051.01 18.156h23.98c-.3162-3.8509-2.678-7.1224-6.1082-8.8346z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-semibold" style={{ color: "var(--text-dim)" }}>Android</div>
                <div className="text-xs font-bold truncate" style={{ color: "var(--text-on-glass)" }}>Google Play</div>
              </div>
            </button>

            {/* Apple iOS (Coming Soon) */}
            <div
              className="flex items-center gap-2.5 p-3 rounded-2xl border opacity-60 cursor-not-allowed text-left select-none"
              style={{
                backgroundColor: "var(--bg-subtle)",
                borderColor: "var(--border-subtle)"
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--bg-card)", color: "var(--text-dim)" }}
              >
                {/* Clean SVG Apple Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.49-6.08-3.32-2.65-7.23-7.24-11.74-13.78-6.19-9.03-11.05-19.14-14.57-30.33-3.52-11.19-5.28-22.18-5.28-32.97 0-14.15 3.52-25.96 10.56-35.43 7.04-9.47 15.93-14.34 26.67-14.61 4.58 0 9.8 1.18 15.66 3.54 5.86 2.36 9.8 3.54 11.83 3.54 1.76 0 5.82-1.24 12.18-3.72 6.36-2.48 11.45-3.54 15.26-3.18 11.33.93 20.31 5.39 26.94 13.38-10.05 6.09-14.96 14.58-14.74 25.48.22 8.44 3.48 15.61 9.77 21.51 6.29 5.9 13.82 9.24 22.59 10.02-2.3 6.77-5.26 13.78-8.88 21.03zM119.22 31.85c0-6.62 2.4-12.82 7.2-18.6 4.8-5.78 10.84-9.3 18.12-10.56.27 1.06.41 2.05.41 2.97 0 6.64-2.48 12.92-7.44 18.84-4.96 5.92-11.05 9.45-18.29 10.59-.27-1.07-.4-2.15-.4-3.24z"/>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase font-semibold" style={{ color: "var(--ocean)" }}>Coming Soon</div>
                <div className="text-xs font-bold truncate" style={{ color: "var(--text-dim)" }}>App Store (iOS)</div>
              </div>
            </div>
          </div>

          {/* Real Scannable QR Code Section */}
          <div
            className="p-3.5 rounded-2xl border flex items-center gap-3.5"
            style={{
              backgroundColor: "var(--bg-subtle)",
              borderColor: "var(--border-subtle)"
            }}
          >
            <div className="p-1.5 bg-white rounded-xl shadow-md shrink-0 border border-slate-200">
              <Image
                src={qrImageUrl}
                alt="QR Code Tải App AIVA"
                width={80}
                height={80}
                className="w-20 h-20 object-contain rounded"
                unoptimized
              />
            </div>
            <div>
              <div className="text-xs font-bold mb-0.5 flex items-center gap-1" style={{ color: "var(--text-on-glass)" }}>
                <span className="material-symbols-outlined text-sm" style={{ color: "var(--ocean)" }}>qr_code_scanner</span>
                Quét mã QR bằng điện thoại
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-dim)" }}>
                Dùng camera quét mã để tải xuống trực tiếp file cài đặt trên điện thoại.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
