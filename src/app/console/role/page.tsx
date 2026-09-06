"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/features/auth/auth.store";
import type { UserRole } from "@/features/auth/auth.types";
import { needsRoleOnboarding } from "@/features/auth/role.storage";
import {
  AuthLayout,
  authPrimaryBtnClass,
} from "@/features/auth/components/auth-layout";
import { useI18n } from "@/lib/i18n/provider";

const ROLE_OPTIONS: { role: Exclude<UserRole, "admin">; titleKey: string; descKey: string; icon: string }[] = [
  { role: "teacher", titleKey: "consoleRoleTeacher", descKey: "consoleRoleTeacherDesc", icon: "school" },
  { role: "parent", titleKey: "consoleRoleParent", descKey: "consoleRoleParentDesc", icon: "family_restroom" },
];

export default function RoleOnboardingPage() {
  const router = useRouter();
  const { t } = useI18n();
  const status = useAuthStore((s) => s.status);
  const hydrated = useAuthStore((s) => s.hydrated);
  const user = useAuthStore((s) => s.tokens?.user);
  const chooseRole = useAuthStore((s) => s.chooseRole);
  const [selected, setSelected] = useState<Exclude<UserRole, "admin"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hydrated || status !== "authenticated") return;
    if (!needsRoleOnboarding(user)) {
      router.replace(user?.role === "admin" ? "/console/admin" : "/console");
    }
  }, [hydrated, status, user, router]);

  const submit = async () => {
    if (!selected) {
      setError(t.consoleRoleSelectFirst);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await chooseRole(selected);
      router.replace("/console");
    } catch (e) {
      setError(e instanceof Error ? e.message : t.consoleRoleFailed);
      setSaving(false);
    }
  };

  return (
    <AuthLayout title={t.consoleRoleOnboardTitle}>
      <p className="mb-4 text-sm" style={{ color: "#6b5f4a" }}>
        {t.consoleRoleOnboardSubtitle}
      </p>

      <div className="flex flex-col gap-3">
        {ROLE_OPTIONS.map((opt) => {
          const active = selected === opt.role;
          return (
            <button
              key={opt.role}
              type="button"
              onClick={() => setSelected(opt.role)}
              className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                active
                  ? "border-[#eab308] bg-[#f6ead0] ring-2 ring-[#eab308]/30"
                  : "border-[#c9b896] bg-[#faf6ec] hover:border-[#eab308]/70"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eab308]/15 text-2xl">
                <span className="material-symbols-outlined">{opt.icon}</span>
              </span>
              <span className="flex flex-col">
                <span className="font-semibold text-[#2a241c]">{t[opt.titleKey as keyof typeof t] as string}</span>
                <span className="text-sm text-[#8a7a62]">{t[opt.descKey as keyof typeof t] as string}</span>
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200/80 bg-[#fde8e6] px-3.5 py-2.5 text-sm text-[#b91c1c]" role="alert">
          {error}
        </p>
      )}

      <button type="button" onClick={() => void submit()} disabled={saving || !selected} className={authPrimaryBtnClass}>
        {saving ? t.consoleRoleSaving : t.consoleRoleConfirm}
      </button>
    </AuthLayout>
  );
}