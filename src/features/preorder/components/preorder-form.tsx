"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { clsx } from "clsx";
import { getPreorderSchema, type PreorderInput } from "@/features/preorder/schema/preorder-schema";
import { submitPreorder } from "@/features/preorder/services/preorder-service";
import { useI18n } from "@/lib/i18n/provider";

interface PreorderFormProps {
  onClose: () => void;
}

export function PreorderForm({ onClose }: PreorderFormProps) {
  const { t } = useI18n();
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
    mutationFn: submitPreorder,
    onSuccess: (_data, variables) => {
      reset();
      setSubmittedData(variables);
    },
    onError: () => {}
  });

  if (submittedData) {
    return (
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e]/30 to-[#22c55e]/10">
          <span className="material-symbols-outlined text-5xl text-[#22c55e]">check_circle</span>
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-bold text-white">{t.successTitle}</p>
          <p className="text-sm text-white/50">{t.successDesc}</p>
        </div>

        <div className="w-full space-y-3 rounded-xl border border-white/10 bg-white/5 p-5 text-left">
          <InfoRow label={t.fullName} value={submittedData.fullName} />
          <div className="h-px bg-white/5" />
          <InfoRow label={t.email} value={submittedData.email} />
          <div className="h-px bg-white/5" />
          <InfoRow label={t.phone} value={submittedData.phone} />
          {submittedData.note && (
            <>
              <div className="h-px bg-white/5" />
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
      className="space-y-5"
    >
      {preorderMutation.isError && (
        <div className="rounded-xl border border-[#ff8f8f]/30 bg-[#ff8f8f]/10 px-4 py-3 text-sm text-[#ff8f8f]">
          {t.error}
        </div>
      )}
      <FieldError message={errors.fullName?.message}>
        <input
          {...register("fullName")}
          placeholder={t.fullName}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus-visible:border-brand-gold/40 focus-visible:ring-1 focus-visible:ring-brand-gold/20"
        />
      </FieldError>
      <FieldError message={errors.email?.message}>
        <input
          {...register("email")}
          placeholder={t.email}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus-visible:border-brand-gold/40 focus-visible:ring-1 focus-visible:ring-brand-gold/20"
        />
      </FieldError>
      <FieldError message={errors.phone?.message}>
        <input
          {...register("phone")}
          placeholder={t.phone}
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus-visible:border-brand-gold/40 focus-visible:ring-1 focus-visible:ring-brand-gold/20"
        />
      </FieldError>
      <FieldError message={errors.note?.message}>
        <textarea
          {...register("note")}
          placeholder={t.note}
          rows={3}
          className="w-full resize-none rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus-visible:border-brand-gold/40 focus-visible:ring-1 focus-visible:ring-brand-gold/20"
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
      <span className="text-xs uppercase tracking-wider text-white/40">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
