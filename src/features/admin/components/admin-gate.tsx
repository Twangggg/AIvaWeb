"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/auth.store";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const role = useAuthStore((s) => s.tokens?.user?.role);
  const hydrated = useAuthStore((s) => s.hydrated);
  const status = useAuthStore((s) => s.status);
  const router = useRouter();

  useEffect(() => {
    if (!hydrated || status !== "authenticated") return;
    if (role !== "admin") {
      router.replace("/console");
    }
  }, [hydrated, status, role, router]);

  if (!hydrated || status !== "authenticated") {
    return (
      <div className="py-16 text-center text-sm text-[#6b7280]">Đang tải…</div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="py-16 text-center text-sm text-[#6b7280]">Chỉ dành cho admin…</div>
    );
  }

  return <>{children}</>;
}
