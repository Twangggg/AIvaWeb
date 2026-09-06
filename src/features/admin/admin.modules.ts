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
  {
    id: "study",
    href: "/console/admin/study",
    title: "Nghiên cứu",
    titleEn: "Study",
    desc: "Dashboard đo lường thí nghiệm tò mò (H1–H3, Goldilocks)",
    descEn: "Curiosity measurement dashboard (H1–H3, Goldilocks)",
    ready: true,
  },
] as const;

export type AdminModuleId = (typeof ADMIN_MODULES)[number]["id"];

export async function fetchAdminUsers(
  accessToken: string,
  role?: string,
  opts?: { refresh?: boolean }
) {
  const params = new URLSearchParams();
  if (role) params.set("role", role);
  if (opts?.refresh) params.set("refresh", "1");
  const qs = params.toString() ? `?${params}` : "";
  const res = await fetch(`/api/admin/users${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
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
    const body = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
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

export async function fetchAdminOverview(
  accessToken: string,
  opts?: { refresh?: boolean }
) {
  const qs = opts?.refresh ? "?refresh=1" : "";
  const res = await fetch(`/api/admin/overview${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message || `Overview API ${res.status}`);
  }
  return res.json() as Promise<{
    preorders: Awaited<ReturnType<typeof fetchAdminPreorders>>;
    users: Awaited<ReturnType<typeof fetchAdminUsers>>;
  }>;
}

export type StudyConditionStats = {
  nSessions: number;
  chainDepthMean: number;
  chainDepthMedian: number;
  oracleRatio: number;
  deepQuestionRate: number;
  exploreStartRate: number;
  verifyCountMean: number;
  learningGainMean: number | null;
  learningGainSessionCount: number;
  escapeUsed: number;
  frustrationSignalsTotal: number;
  boredomRate: number;
};

export type StudyMetrics = {
  summary: {
    enrollments: {
      total: number;
      byCondition: { C0: number; C1: number; C2: number };
      byAgeBand: Record<string, number>;
    };
    totalSessions: number;
    totalEvents: number;
  };
  metrics: {
    c0: StudyConditionStats;
    c2: StudyConditionStats;
    delta: {
      chainDepthMean: number;
      oracleRatio: number;
      deepQuestionRate: number;
      exploreStartRate: number;
      learningGainMean: number | null;
    };
  };
  sessions: {
    participant_code: string;
    condition: string;
    chainDepth: number;
    exploreCompleted: number;
    verifyCount: number;
    learningGain: number | null;
  }[];
};

export async function fetchAdminStudy(
  accessToken: string
): Promise<StudyMetrics> {
  const res = await fetch("/api/admin/study", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
      detail?: string;
    } | null;
    const msg = body?.message || `Study API ${res.status}`;
    if (body?.detail) throw new Error(`${msg} — ${body.detail}`);
    throw new Error(msg);
  }
  return res.json() as Promise<StudyMetrics>;
}

export type StudyChatTurn = {
  session_id: string;
  participant_code: string;
  state: {
    condition: string;
    turnCount: number;
    chainDepth: number;
    shallowStreak: number;
    depthGuess: string;
    exploreStatus: string;
    scaffoldsSinceAnswer: number;
    escapeUsed: boolean;
    oneShotUnansweredReached: boolean;
    curiositySeededSinceLastAnswer: boolean;
    frustrated: boolean;
    oracleRisk: number;
    lastAction?: string;
  };
  actions: string[];
  reason: string | null;
  reply: string | null;
  consolidation_done: boolean;
  seed_i_type_offered: boolean;
  session_ended: string | null;
};

export type StudyChatIntent =
  | "question"
  | "dont_know"
  | "request_answer_now"
  | "explore_done"
  | "explore_failed"
  | "end";

export async function postAdminStudyChat(
  accessToken: string,
  payload: {
    participant_code?: string;
    condition: "C0" | "C2";
    session_id?: string | null;
    text?: string;
    intent?: StudyChatIntent;
  }
): Promise<StudyChatTurn> {
  const res = await fetch("/api/admin/study/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message || `Study chat API ${res.status}`);
  }
  return res.json() as Promise<StudyChatTurn>;
}
