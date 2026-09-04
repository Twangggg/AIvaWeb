export const ADMIN_MODULES = [
  {
    id: "preorders",
    href: "/console/admin/preorders",
    title: "Đặt trước",
    titleEn: "Pre-orders",
    desc: "Khách hàng đăng ký pre-order trên landing",
    descEn: "Customers who pre-ordered on the landing site",
    ready: true,
  },
  {
    id: "users",
    href: "/console/admin/users",
    title: "Tài khoản",
    titleEn: "Accounts",
    desc: "Giáo viên, phụ huynh và admin trên Console",
    descEn: "Teachers, parents, and admins on Console",
    ready: true,
  },
  {
    id: "devices",
    href: "/console/admin/devices",
    title: "Thiết bị (sắp có)",
    titleEn: "Devices (soon)",
    desc: "Roster thiết bị toàn hệ thống — mở rộng sau",
    descEn: "Fleet-wide device roster — coming later",
    ready: false,
  },
  {
    id: "analytics",
    href: "/console/admin/analytics",
    title: "Phân tích (sắp có)",
    titleEn: "Analytics (soon)",
    desc: "Thống kê phiên chơi / sử dụng — mở rộng sau",
    descEn: "Play session / usage stats — coming later",
    ready: false,
  },
] as const;

export type AdminModuleId = (typeof ADMIN_MODULES)[number]["id"];

export async function fetchAdminUsers(accessToken: string, role?: string, opts?: { refresh?: boolean }) {
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (opts?.refresh) params.set("refresh", "1");
  const qs = params.toString() ? `?${params}` : "";
  const res = await fetch(`/api/admin/users${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || `Users API ${res.status}`);
  }
  return res.json() as Promise<{
    items: {
      id: string;
      email: string;
      displayName: string;
      role: string;
      emailConfirmed: boolean;
      createdAt: string;
      updatedAt?: string | null;
    }[];
    total: number;
  }>;
}

export async function fetchAdminPreorders(accessToken: string) {
  const res = await fetch("/api/admin/preorders", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || `Preorders API ${res.status}`);
  }
  return res.json() as Promise<{
    items: {
      id: number;
      full_name: string;
      email: string;
      phone: string;
      note: string | null;
      created_at: string;
    }[];
    total: number;
  }>;
}

export async function fetchAdminOverview(accessToken: string, opts?: { refresh?: boolean }) {
  const qs = opts?.refresh ? "?refresh=1" : "";
  const res = await fetch(`/api/admin/overview${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || `Overview API ${res.status}`);
  }
  return res.json() as Promise<{
    preorders: Awaited<ReturnType<typeof fetchAdminPreorders>>;
    users: Awaited<ReturnType<typeof fetchAdminUsers>>;
  }>;
}
