"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { getPreorderSchema, type PreorderInput } from "@/features/preorder/schema/preorder-schema";
import { submitPreorder } from "@/features/preorder/services/preorder-service";
import { useI18n } from "@/lib/i18n/provider";

export function PreorderForm() {
  const { t } = useI18n();
  const schema = useMemo(() => getPreorderSchema(t.validation), [t.validation]);

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
    onSuccess: () => {
      reset();
      window.alert(t.success);
    },
    onError: () => {
      window.alert(t.error);
    }
  });

  return (
    <form
      onSubmit={handleSubmit((values) => preorderMutation.mutate(values))}
      className="space-y-5"
    >
      <h2 className="text-lg font-bold uppercase tracking-[0.1em] text-on-surface">{t.preorderTitle}</h2>
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
