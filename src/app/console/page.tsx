"use client";

import { useAuthStore } from "@/features/auth/auth.store";
import { ParentHome } from "@/features/console/components/parent-home";
import { TeacherHome } from "@/features/console/components/teacher-home";
import { resolveConsoleRole } from "@/features/console/role-access";

export default function ConsoleHomePage() {
  const role = resolveConsoleRole(useAuthStore((s) => s.tokens?.user?.role));

  if (role === "parent") return <ParentHome />;
  // Admin is redirected to /console/admin by RoleRouteGuard.
  return <TeacherHome />;
}
