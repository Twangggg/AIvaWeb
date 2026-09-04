import type { UserRole } from "@/features/auth/auth.types";

export type ConsoleNavLink = {
  href: string;
  labelVi: string;
  labelEn: string;
  icon?: string;
  exact?: boolean;
};

/** Top-level nav entry: direct link or dropdown group. */
export type ConsoleNavEntry =
  | ({ kind: "link" } & ConsoleNavLink)
  | {
      kind: "group";
      id: string;
      labelVi: string;
      labelEn: string;
      icon?: string;
      children: ConsoleNavLink[];
    };

/** @deprecated flat item — kept for helpers that flatten groups */
export type ConsoleNavItem = ConsoleNavLink;

/** Paths (prefix) each role may open under /console. */
const ROLE_ALLOW: Record<UserRole, string[]> = {
  teacher: [
    "/console",
    "/console/play",
    "/console/safety",
    "/console/history",
    "/console/device",
    "/console/account",
  ],
  parent: [
    "/console",
    "/console/safety",
    "/console/history",
    "/console/device",
    "/console/account",
  ],
  admin: [
    "/console",
    "/console/admin",
    "/console/account",
    "/console/play",
    "/console/safety",
    "/console/history",
    "/console/device",
  ],
};

export function resolveConsoleRole(role?: string | null): UserRole {
  if (role === "admin" || role === "parent" || role === "teacher") return role;
  return "teacher";
}

export function roleHomePath(role: UserRole): string {
  return role === "admin" ? "/console/admin" : "/console";
}

export function isConsolePathAllowed(role: UserRole, pathname: string): boolean {
  const allow = ROLE_ALLOW[role];
  return allow.some((prefix) => {
    if (prefix === "/console") {
      return pathname === "/console" || pathname === "/console/";
    }
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

export function teacherNav(): ConsoleNavEntry[] {
  return [
    {
      kind: "link",
      href: "/console",
      labelVi: "Lớp học",
      labelEn: "Classroom",
      icon: "home",
      exact: true,
    },
    {
      kind: "group",
      id: "play",
      labelVi: "Chơi",
      labelEn: "Play",
      icon: "sports_esports",
      children: [
        {
          href: "/console/play",
          labelVi: "Chạy ván",
          labelEn: "Play round",
          icon: "play_circle",
          exact: true,
        },
        {
          href: "/console/play/packs",
          labelVi: "Pack nội dung",
          labelEn: "Content packs",
          icon: "inventory_2",
        },
      ],
    },
    {
      kind: "link",
      href: "/console/device",
      labelVi: "Thiết bị",
      labelEn: "Device",
      icon: "devices",
    },
    {
      kind: "group",
      id: "class",
      labelVi: "Lớp",
      labelEn: "Class",
      icon: "school",
      children: [
        {
          href: "/console/safety",
          labelVi: "An toàn",
          labelEn: "Safety",
          icon: "shield_with_heart",
        },
        {
          href: "/console/history",
          labelVi: "Lịch sử",
          labelEn: "History",
          icon: "history",
        },
      ],
    },
  ];
}

export function parentNav(): ConsoleNavEntry[] {
  return [
    {
      kind: "link",
      href: "/console",
      labelVi: "Gia đình",
      labelEn: "Family",
      icon: "home",
      exact: true,
    },
    {
      kind: "group",
      id: "care",
      labelVi: "Chăm sóc",
      labelEn: "Care",
      icon: "favorite",
      children: [
        {
          href: "/console/safety",
          labelVi: "An toàn",
          labelEn: "Safety",
          icon: "shield_with_heart",
        },
        {
          href: "/console/history",
          labelVi: "Nhật ký",
          labelEn: "History",
          icon: "history",
        },
      ],
    },
    {
      kind: "link",
      href: "/console/device",
      labelVi: "Thiết bị",
      labelEn: "Device",
      icon: "devices",
    },
  ];
}

export function navForRole(role: UserRole): ConsoleNavEntry[] {
  if (role === "parent") return parentNav();
  return teacherNav();
}

export function flattenNavLinks(entries: ConsoleNavEntry[]): ConsoleNavLink[] {
  const out: ConsoleNavLink[] = [];
  for (const e of entries) {
    if (e.kind === "link") out.push(e);
    else out.push(...e.children);
  }
  return out;
}

export function isNavLinkActive(item: ConsoleNavLink, pathname: string, siblings: ConsoleNavLink[]): boolean {
  if (item.exact) {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  const matches = siblings.filter(
    (n) => !n.exact && (pathname === n.href || pathname.startsWith(`${n.href}/`)),
  );
  if (matches.length === 0) {
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }
  const best = [...matches].sort((a, b) => b.href.length - a.href.length)[0];
  return best?.href === item.href;
}

export function isGroupActive(group: Extract<ConsoleNavEntry, { kind: "group" }>, pathname: string): boolean {
  return group.children.some((c) => pathname === c.href || pathname.startsWith(`${c.href}/`));
}
