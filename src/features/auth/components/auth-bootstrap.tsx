"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/auth.store";

const PUBLIC_PATHS = new Set([
  "/console/login",
  "/console/register",
  "/console/verify",
  "/console/auth/callback",
]);

const PENDING_PATH = "/console/verify-pending";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const hydrated = useAuthStore((s) => s.hydrated);
  const status = useAuthStore((s) => s.status);
  const emailConfirmed = useAuthStore((s) => s.tokens?.user?.emailConfirmed);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!hydrated) return;
    const isPublic = PUBLIC_PATHS.has(pathname);
    const isPending = pathname === PENDING_PATH;

    if (status === "authenticated") {
      if (emailConfirmed === false) {
        if (!isPending && pathname !== "/console/verify") {
          router.replace(PENDING_PATH);
        }
        return;
      }

      if (isPublic || isPending) {
        router.replace("/console");
      }
      return;
    }

    if (status === "unauthenticated" && !isPublic && !isPending) {
      router.replace("/console/login");
    }
  }, [hydrated, status, pathname, router, emailConfirmed]);

  if (!hydrated || status === "idle") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#101214] text-white/70">
        <p className="text-sm tracking-wide">Đang tải phiên…</p>
      </div>
    );
  }

  const isPublic = PUBLIC_PATHS.has(pathname) || pathname === PENDING_PATH;
  if (!isPublic && status !== "authenticated") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#101214] text-white/70">
        <p className="text-sm tracking-wide">Chuyển tới đăng nhập…</p>
      </div>
    );
  }

  if (status === "authenticated" && emailConfirmed === false && pathname !== PENDING_PATH && pathname !== "/console/verify") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#101214] text-white/70">
        <p className="text-sm tracking-wide">Cần xác nhận email…</p>
      </div>
    );
  }

  return <>{children}</>;
}
