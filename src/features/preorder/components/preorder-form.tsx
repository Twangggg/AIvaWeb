"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { preorderSchema, type PreorderInput } from "@/features/preorder/schema/preorder-schema";
import { submitPreorder } from "@/features/preorder/services/preorder-service";

export function PreorderForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PreorderInput>({
    resolver: zodResolver(preorderSchema),
    defaultValues: { fullName: "", email: "", phone: "", note: "" }
  });

  const preorderMutation = useMutation({
    mutationFn: submitPreorder,
    onSuccess: () => {
      reset();
      window.alert("Dang ky pre-order thanh cong.");
    },
    onError: () => {
      window.alert("Dang ky that bai. Thu lai sau.");
    }
  });

  return (
    <form
      onSubmit={handleSubmit((values) => preorderMutation.mutate(values))}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold text-slate-900">Dat truoc AIva Smart Glasses</h2>
      <FieldError message={errors.fullName?.message}>
        <input
          {...register("fullName")}
          placeholder="Ho va ten"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-brand-300 focus:ring"
        />
      </FieldError>
      <FieldError message={errors.email?.message}>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-brand-300 focus:ring"
        />
      </FieldError>
      <FieldError message={errors.phone?.message}>
        <input
          {...register("phone")}
          placeholder="So dien thoai"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-brand-300 focus:ring"
        />
      </FieldError>
      <FieldError message={errors.note?.message}>
        <textarea
          {...register("note")}
          placeholder="Nhu cau su dung (tuy chon)"
          rows={3}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-brand-300 focus:ring"
        />
      </FieldError>
      <Button fullWidth type="submit" disabled={preorderMutation.isPending}>
        {preorderMutation.isPending ? "Dang gui..." : "Gui dang ky"}
      </Button>
    </form>
  );
}

function FieldError({ message, children }: { message?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      {children}
      {message ? <p className="text-sm text-red-600">{message}</p> : null}
    </div>
  );
}
