"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/auth.store";
import { resolveConsoleRole, roleHomePath } from "@/features/console/role-access";

const PUBLIC_PATHS = new Set([
  "/console/login",
  "/console/register",
  "/console/forgot-password",
  "/console/verify",
  "/console/auth/callback",
]);

/** Authenticated users may stay here (e.g. recovery session). */
const AUTH_ALLOWED_WHEN_LOGGED_IN = new Set(["/console/reset-password"]);

const PENDING_PATH = "/console/verify-pending";

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const bootstrap = useAuthStore((s) => s.bootstrap);
  const hydrated = useAuthStore((s) => s.hydrated);
  const status = useAuthStore((s) => s.status);
  const emailConfirmed = useAuthStore((s) => s.tokens?.user?.emailConfirmed);
  const role = resolveConsoleRole(useAuthStore((s) => s.tokens?.user?.role));
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (!hydrated) return;
    const isPublic = PUBLIC_PATHS.has(pathname);
    const isPending = pathname === PENDING_PATH;
    const allowWhileAuthed = AUTH_ALLOWED_WHEN_LOGGED_IN.has(pathname);

    if (status === "authenticated") {
      if (emailConfirmed === false) {
        if (!isPending && pathname !== "/console/verify" && !allowWhileAuthed) {
          router.replace(PENDING_PATH);
        }
        return;
      }

      if (allowWhileAuthed) return;

      if (isPublic || isPending) {
        router.replace(roleHomePath(role));
      }
      return;
    }

    if (status === "unauthenticated" && !isPublic && !isPending && !allowWhileAuthed) {
      router.replace("/console/login");
    }
  }, [hydrated, status, pathname, router, emailConfirmed, role]);

  if (!hydrated || status === "idle") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#101214] text-white/70">
        <p className="text-sm tracking-wide">Đang tải phiên…</p>
      </div>
    );
  }

  const isPublic =
    PUBLIC_PATHS.has(pathname) ||
    pathname === PENDING_PATH ||
    AUTH_ALLOWED_WHEN_LOGGED_IN.has(pathname);

  if (!isPublic && status !== "authenticated") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#101214] text-white/70">
        <p className="text-sm tracking-wide">Chuyển tới đăng nhập…</p>
      </div>
    );
  }

  if (
    status === "authenticated" &&
    emailConfirmed === false &&
    pathname !== PENDING_PATH &&
    pathname !== "/console/verify" &&
    !AUTH_ALLOWED_WHEN_LOGGED_IN.has(pathname)
  ) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#101214] text-white/70">
        <p className="text-sm tracking-wide">Cần xác nhận email…</p>
      </div>
    );
  }

  return <>{children}</>;
}
