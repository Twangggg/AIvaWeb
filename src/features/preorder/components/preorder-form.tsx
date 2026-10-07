"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { getPreorderSchema, type PreorderInput } from "@/features/preorder/schema/preorder-schema";
import { submitPreorder } from "@/features/preorder/services/preorder-service";
import { useI18n } from "@/lib/i18n/provider";
import Image from "next/image";
import { motion } from "motion/react";
import confetti from "canvas-confetti";

interface PreorderFormProps {
  onClose: () => void;
}

export function PreorderForm({ onClose }: PreorderFormProps) {
  const { t, locale } = useI18n();
  const schema = useMemo(() => getPreorderSchema(t.validation), [t.validation]);
  const [submittedData, setSubmittedData] = useState<PreorderInput | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PreorderInput>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", phone: "", note: "" }
  });

  const preorderMutation = useMutation({
    mutationFn: (data: PreorderInput) => submitPreorder(data, locale),
    onSuccess: (_data, variables) => {
      reset();
      setSubmittedData(variables);
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.55 },
          colors: ["#38bdf8", "#34d399", "#fbbf24", "#f43f5e", "#a855f7"],
        });
      } catch {}
    },
    onError: () => {}
  });

  if (submittedData) {
    return (
      <div className="flex flex-col items-center gap-5 py-3 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -6 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="relative w-36 h-36 flex items-center justify-center animate-bounce-short"
        >
          <Image
            src="/mascots/frog-success.webp"
            alt="AIva chúc mừng thành công"
            width={144}
            height={144}
            className="w-full h-full object-contain drop-shadow-md"
            priority
          />
        </motion.div>

        <div className="space-y-1">
          <p className="text-2xl font-bold" style={{ color: "var(--text-on-glass)" }}>{t.successTitle}</p>
          <p className="text-sm" style={{ color: "var(--text-dim)" }}>{t.successDesc}</p>
        </div>

        <div className="w-full space-y-3 rounded-xl p-5 text-left"
          style={{ border: "1px solid", borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-subtle)" }}
        >
          <InfoRow label={t.fullName} value={submittedData.fullName} />
          <div style={{ height: 1, backgroundColor: "var(--border-subtle)" }} />
          <InfoRow label={t.email} value={submittedData.email} />
          <div style={{ height: 1, backgroundColor: "var(--border-subtle)" }} />
          <InfoRow label={t.phone} value={submittedData.phone} />
          {submittedData.note && (
            <>
              <div style={{ height: 1, backgroundColor: "var(--border-subtle)" }} />
              <InfoRow label={t.note} value={submittedData.note} />
            </>
          )}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[#fbbf24]/20 bg-[#fbbf24]/5 px-4 py-3 text-xs text-[#fbbf24]/80">
          <span className="material-symbols-outlined text-base">mail</span>
          {t.notifySent}
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose}>{t.close}</Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => preorderMutation.mutate(values))}
      className="space-y-4"
    >
      {/* Friendly Mascot Companion Banner */}
      <div
        className="flex items-center gap-3 p-3 rounded-2xl border"
        style={{
          backgroundColor: "var(--bg-subtle)",
          borderColor: "var(--border-subtle)"
        }}
      >
        <div className="w-16 h-16 shrink-0 relative">
          <Image
            src="/mascots/frog-shopping.webp"
            alt="AIva bạn đồng hành"
            width={64}
            height={64}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="text-xs leading-relaxed" style={{ color: "var(--text-dim)" }}>
          <p className="font-semibold text-sm mb-0.5" style={{ color: "var(--text-on-glass)" }}>
            {locale === "vi" ? "Người bạn AIva đã sẵn sàng!" : "AIva is ready to join you!"}
          </p>
          <p>
            {locale === "vi"
              ? "Điền thông tin bên dưới để nhận suất đặt trước kính AIva cùng quà tặng độc quyền cho bé."
              : "Leave your details to reserve your AIva glasses and special early perks for your child."}
          </p>
        </div>
      </div>
      {preorderMutation.isError && (
        <div className="rounded-xl border border-[#ff8f8f]/30 bg-[#ff8f8f]/10 px-4 py-3 text-sm text-[#ff8f8f]">
          {t.error}
        </div>
      )}
      <FieldError message={errors.fullName?.message}>
        <input
          {...register("fullName")}
          disabled={preorderMutation.isPending}
          placeholder={t.fullName}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[var(--text-dim)] disabled:opacity-50 focus-visible:border-brand-gold/40 focus-visible:ring-1 focus-visible:ring-brand-gold/20"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-subtle)", color: "var(--text-on-glass)" }}
        />
      </FieldError>
      <FieldError message={errors.email?.message}>
        <input
          {...register("email")}
          disabled={preorderMutation.isPending}
          placeholder={t.email}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[var(--text-dim)] disabled:opacity-50 focus-visible:border-brand-gold/40 focus-visible:ring-1 focus-visible:ring-brand-gold/20"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-subtle)", color: "var(--text-on-glass)" }}
        />
      </FieldError>
      <FieldError message={errors.phone?.message}>
        <input
          {...register("phone")}
          disabled={preorderMutation.isPending}
          placeholder={t.phone}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[var(--text-dim)] disabled:opacity-50 focus-visible:border-brand-gold/40 focus-visible:ring-1 focus-visible:ring-brand-gold/20"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-subtle)", color: "var(--text-on-glass)" }}
        />
      </FieldError>
      <FieldError message={errors.note?.message}>
        <textarea
          {...register("note")}
          disabled={preorderMutation.isPending}
          placeholder={t.note}
          rows={3}
          className="w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none transition-all placeholder:text-[var(--text-dim)] disabled:opacity-50 focus-visible:border-brand-gold/40 focus-visible:ring-1 focus-visible:ring-brand-gold/20"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-subtle)", color: "var(--text-on-glass)" }}
        />
      </FieldError>
      <Button fullWidth type="submit" disabled={preorderMutation.isPending}>
        {preorderMutation.isPending ? t.submitting : t.submit}
      </Button>
    </form>
  );
}

function FieldError({ message, children }: { message?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      {children}
      {message ? <p className="text-sm text-[#ff8f8f]">{message}</p> : null}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs uppercase tracking-wider" style={{ color: "var(--text-dim)" }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: "var(--text-on-glass)" }}>{value}</span>
    </div>
  );
}
