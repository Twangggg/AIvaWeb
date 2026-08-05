"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { ChatMascotButton } from "./chat-mascot-button";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = {
  vi: ["AIva phù hợp trẻ mấy tuổi?", "Làm sao đặt trước?", "Pin dùng được bao lâu?"],
  en: ["What age is AIva for?", "How to pre-order?", "How long does the battery last?"]
} as const;

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatbotWidget() {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => {
    if (!open && messages.length === 0) {
      setMessages([{ id: uid(), role: "assistant", content: t.chatWelcome }]);
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmed };
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, locale, history })
        });

        const data = (await res.json()) as { reply?: string; error?: string };
        const reply = data.reply ?? t.chatError;

        setMessages((prev) => [...prev, { id: uid(), role: "assistant", content: reply }]);
      } catch {
        setMessages((prev) => [...prev, { id: uid(), role: "assistant", content: t.chatError }]);
      } finally {
        setLoading(false);
      }
    },
    [loading, locale, messages, t.chatError]
  );

  const suggestions = SUGGESTIONS[locale];

  return (
    <>
      {/* Chat panel */}
      <div
        className="fixed z-50 flex flex-col overflow-hidden transition-all duration-300 ease-out shadow-2xl"
        style={{
          bottom: "11rem",
          right: "1.25rem",
          width: "min(400px, calc(100vw - 2.5rem))",
          height: open ? "min(520px, calc(100vh - 7rem))" : "0px",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          borderRadius: "1rem",
          border: "1px solid var(--glass-border)",
          backgroundColor: "var(--modal-bg)",
          boxShadow: "var(--shadow-modal)"
        }}
        role="dialog"
        aria-label={t.chatTitle}
        aria-hidden={!open}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b shrink-0"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "var(--gradient-ocean)" }}
            >
              <span className="material-symbols-outlined text-lg" style={{ color: "var(--text-on-accent)" }}>
                smart_toy
              </span>
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--text-on-glass)" }}>
                {t.chatTitle}
              </p>
              <p className="text-xs" style={{ color: "var(--text-dim)" }}>
                {t.chatSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
            aria-label={t.chatClose}
          >
            <span className="material-symbols-outlined text-xl" style={{ color: "var(--text-dim)" }}>
              close
            </span>
          </button>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? { background: "var(--gradient-ocean)", color: "var(--text-on-accent)" }
                    : {
                        backgroundColor: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: "var(--text-on-glass)"
                      }
                }
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 rounded-2xl text-sm flex gap-1"
                style={{ backgroundColor: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
              >
                <span className="chat-dot animate-bounce" style={{ animationDelay: "0ms" }}>·</span>
                <span className="chat-dot animate-bounce" style={{ animationDelay: "150ms" }}>·</span>
                <span className="chat-dot animate-bounce" style={{ animationDelay: "300ms" }}>·</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
                style={{
                  backgroundColor: "var(--ocean-alpha)",
                  color: "var(--ocean-glow)",
                  border: "1px solid rgba(234, 179, 8, 0.2)"
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          className="px-4 py-3 border-t shrink-0 flex gap-2"
          style={{ borderColor: "var(--border-subtle)" }}
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.chatPlaceholder}
            maxLength={500}
            disabled={loading}
            className="flex-1 text-sm px-3 py-2.5 rounded-xl outline-none transition-colors"
            style={{
              backgroundColor: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              color: "var(--text-on-glass)"
            }}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-opacity disabled:opacity-40"
            style={{ background: "var(--gradient-ocean)" }}
            aria-label={t.chatSend}
          >
            <span className="material-symbols-outlined text-lg" style={{ color: "var(--text-on-accent)" }}>
              send
            </span>
          </button>
        </form>
      </div>

      <ChatMascotButton
        open={open}
        onClick={toggleOpen}
        ariaLabel={open ? t.chatClose : t.chatOpen}
      />
    </>
  );
}
