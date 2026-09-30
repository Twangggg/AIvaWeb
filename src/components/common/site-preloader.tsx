"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function SitePreloader() {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Wait for document ready & short aesthetic entrance delay
    const handleLoad = () => {
      setTimeout(() => setLoading(false), 450);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Safety timeout in case load event already fired
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => {
      window.removeEventListener("load", handleLoad);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      const removeTimer = setTimeout(() => {
        setMounted(false);
      }, 550);
      return () => clearTimeout(removeTimer);
    }
  }, [loading]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 pointer-events-none ${
        loading ? "opacity-100 scale-100" : "opacity-0 scale-105"
      }`}
      style={{
        backgroundColor: "var(--modal-bg)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)"
      }}
      aria-hidden={!loading}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Ambient Glow */}
        <div
          className="absolute -inset-10 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none"
          style={{ background: "var(--gradient-ocean)" }}
        />

        {/* Brand Logo */}
        <div className="relative z-10 flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-400">
          <Image
            src="/AIVALogo.png"
            alt="AIVA"
            width={140}
            height={32}
            className="object-contain drop-shadow-md"
            priority
          />

          {/* Minimal Elegant Loader Bar */}
          <div className="w-28 h-[2.5px] rounded-full overflow-hidden bg-[var(--border-subtle)] relative mt-2">
            <div
              className="absolute inset-0 rounded-full animate-[preloader-slide_1.2s_ease-in-out_infinite]"
              style={{ background: "var(--gradient-ocean)" }}
            />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes preloader-slide {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
