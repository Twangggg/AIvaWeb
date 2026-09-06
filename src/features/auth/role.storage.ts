import type { UserInfo, UserRole } from "./auth.types";

const KEY = "aiva_user_roles";
const ONBOARDED_KEY = "aiva_user_roles_onboarded";

type RoleMap = Record<string, UserRole>;
type OnboardedMap = Record<string, boolean>;

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

function readOnboardedMap(): OnboardedMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ONBOARDED_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as OnboardedMap;
  } catch {
    return {};
  }
}

function writeOnboardedMap(map: OnboardedMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONBOARDED_KEY, JSON.stringify(map));
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

/** Marks a user as having completed the post-signup role selection. */
export function markRoleOnboarded(userId: string): void {
  if (!userId) return;
  const map = readOnboardedMap();
  map[userId] = true;
  writeOnboardedMap(map);
}

/** True when the user already picked their role in the past on this browser. */
export function isRoleOnboarded(userId: string): boolean {
  if (!userId) return true;
  return readOnboardedMap()[userId] === true;
}

/**
 * True when this session should ask the user which account role they are
 * (parent vs teacher). Only the first time per user on this browser, and never
 * for admins.
 */
export function needsRoleOnboarding(user: UserInfo | undefined): boolean {
  if (!user?.id) return false;
  if (user.role === "admin") return false;
  return !isRoleOnboarded(user.id);
}
