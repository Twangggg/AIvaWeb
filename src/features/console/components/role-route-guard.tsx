"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/auth.store";
import {
  isConsolePathAllowed,
  resolveConsoleRole,
  roleHomePath,
} from "@/features/console/role-access";

const AUTH_PATH_PREFIXES = [
  "/console/login",
  "/console/register",
  "/console/forgot-password",
  "/console/reset-password",
  "/console/verify",
  "/console/verify-pending",
  "/console/role",
  "/console/auth/",
];

function isAuthFlow(pathname: string): boolean {
  return AUTH_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
}

/** Redirects users away from routes their role cannot use. */
export function RoleRouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const status = useAuthStore((s) => s.status);
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = resolveConsoleRole(useAuthStore((s) => s.tokens?.user?.role));

  useEffect(() => {
    if (!hydrated || status !== "authenticated") return;
    if (isAuthFlow(pathname)) return;

    if (role === "admin" && (pathname === "/console" || pathname === "/console/")) {
      router.replace("/console/admin");
      return;
    }

    if (!isConsolePathAllowed(role, pathname)) {
      router.replace(roleHomePath(role));
    }
  }, [hydrated, status, role, pathname, router]);

  return <>{children}</>;
}
