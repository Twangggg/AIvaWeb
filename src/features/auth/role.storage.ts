import type { UserRole } from "./auth.types";

const KEY = "aiva_user_roles";

type RoleMap = Record<string, UserRole>;

function readMap(): RoleMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as RoleMap;
  } catch {
    return {};
  }
}

function writeMap(map: RoleMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
}

export function saveUserRole(userId: string, role: UserRole): void {
  if (!userId) return;
  const map = readMap();
  map[userId] = role;
  writeMap(map);
}

export function loadUserRole(userId: string): UserRole | undefined {
  if (!userId) return undefined;
  return readMap()[userId];
}
