"use client";

import { create } from "zustand";

import { getSupabaseClient } from "@/lib/supabase/client";

import { bindAuthBridge } from "./auth.bridge";
import { enrichTokensFromProfile, mapSessionToTokens } from "./auth.map";
import { authService } from "./auth.service";
import { saveRememberedEmail, setRememberMe } from "./auth.persist";
import { loadTokens, saveTokens } from "./auth.storage";
import { loadUserRole, markRoleOnboarded, saveUserRole } from "./role.storage";
import type {
  AuthStatus,
  LoginPayload,
  RegisterPayload,
  RegisterResult,
  Tokens,
  UserInfo,
  UserRole,
} from "./auth.types";

type AuthState = {
  status: AuthStatus;
  tokens: Tokens | null;
  hydrated: boolean;
  pendingVerificationEmail: string | null;
  bootstrap: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<RegisterResult>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
  markEmailConfirmed: () => void;
  setPendingVerificationEmail: (email: string | null) => void;
  applyTokens: (tokens: Tokens | null) => void;
  chooseRole: (role: UserRole) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
};

let bootstrapped = false;

function withStoredRole(user: UserInfo | undefined): UserInfo | undefined {
  if (!user?.id) return user;
  // Prefer role already on the user (from profiles enrich); only fill gaps from local cache.
  if (user.role) return user;
  const role = loadUserRole(user.id);
  if (!role) return user;
  return { ...user, role };
}

function persistTokens(tokens: Tokens | null): Tokens | null {
  if (!tokens) {
    saveTokens(null);
    return null;
  }
  const merged: Tokens = {
    ...tokens,
    user: withStoredRole(tokens.user),
  };
  saveTokens(merged);
  return merged;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  tokens: null,
  hydrated: false,
  pendingVerificationEmail: null,

  applyTokens: (tokens) => {
    const merged = persistTokens(tokens);
    if (!merged?.accessToken) {
      set({
        tokens: null,
        status: "unauthenticated",
        pendingVerificationEmail: get().pendingVerificationEmail,
      });
      return;
    }
    set({
      tokens: merged,
      status: "authenticated",
      pendingVerificationEmail:
        merged.user?.emailConfirmed === false ? merged.user.email ?? null : null,
    });
  },

  bootstrap: () => {
    if (bootstrapped) return;
    bootstrapped = true;

    const cached = loadTokens();
    if (cached?.accessToken) {
      set({
        hydrated: false,
        status: "authenticated",
        tokens: { ...cached, user: withStoredRole(cached.user) },
      });
    }

    void (async () => {
      try {
        const tokens = await authService.getSessionTokens();
        const merged = persistTokens(tokens);
        set({
          hydrated: true,
          tokens: merged,
          status: merged ? "authenticated" : "unauthenticated",
          pendingVerificationEmail:
            merged?.user?.emailConfirmed === false ? merged.user.email ?? null : get().pendingVerificationEmail,
        });
      } catch {
        set({ hydrated: true, status: "unauthenticated", tokens: null });
      }
    })();

    getSupabaseClient().auth.onAuthStateChange((_event, session) => {
      void (async () => {
        const base = mapSessionToTokens(session);
        const tokens = session ? await enrichTokensFromProfile(base) : null;
        get().applyTokens(tokens);
        if (!get().hydrated) {
          set({ hydrated: true });
        }
      })();
    });
  },

  login: async (payload) => {
    set({ status: "loading" });
    try {
      const remember = payload.rememberMe !== false;
      setRememberMe(remember);
      if (remember) {
        saveRememberedEmail(payload.email);
      } else {
        saveRememberedEmail(null);
      }
      const tokens = persistTokens(await authService.login(payload));
      set({
        tokens,
        status: "authenticated",
        pendingVerificationEmail: null,
      });
    } catch (e) {
      set({ status: "unauthenticated", tokens: null });
      throw e;
    }
  },

  register: async (payload) => {
    set({ status: "loading" });
    try {
      const result = await authService.register(payload);
      if (result.user?.id && result.user.role) {
        saveUserRole(result.user.id, result.user.role);
      }

      if (!result.accessToken || result.needsEmailConfirmation) {
        persistTokens(null);
        set({
          tokens: null,
          status: "unauthenticated",
          pendingVerificationEmail: payload.email,
        });
        return result;
      }

      const merged = persistTokens({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
      set({
        tokens: merged,
        status: "authenticated",
        pendingVerificationEmail: null,
      });
      return result;
    } catch (e) {
      set({ status: "unauthenticated", tokens: null });
      throw e;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      persistTokens(null);
      set({ tokens: null, status: "unauthenticated", pendingVerificationEmail: null });
    }
  },

  refreshSession: async () => {
    try {
      const refreshed = await authService.refresh();
      const tokens = persistTokens({
        ...refreshed,
        user: withStoredRole(refreshed.user ?? get().tokens?.user),
      });
      set({ tokens, status: "authenticated" });
      return Boolean(tokens);
    } catch {
      await get().logout();
      return false;
    }
  },

  markEmailConfirmed: () => {
    const current = get().tokens;
    if (!current?.user) {
      set({ pendingVerificationEmail: null });
      return;
    }
    const tokens = persistTokens({
      ...current,
      user: { ...current.user, emailConfirmed: true },
    });
    set({ tokens, pendingVerificationEmail: null });
  },

  chooseRole: async (role) => {
    set({ status: "loading" });
    try {
      await authService.chooseRole(role);
      const current = get().tokens;
      if (!current?.user?.id) return;
      const user = { ...current.user, role };
      saveUserRole(user.id, role);
      markRoleOnboarded(user.id);
      const tokens = persistTokens({ ...current, user });
      set({ tokens, status: "authenticated", pendingVerificationEmail: null });
    } catch (e) {
      set({ status: "authenticated" });
      throw e;
    }
  },

  setPendingVerificationEmail: (email) => set({ pendingVerificationEmail: email }),

  requestPasswordReset: async (email) => {
    await authService.requestPasswordReset(email);
  },

  updatePassword: async (password) => {
    await authService.updatePassword(password);
  },
}));

bindAuthBridge({
  getAccessToken: () => useAuthStore.getState().tokens?.accessToken,
  refreshSession: () => useAuthStore.getState().refreshSession(),
  logout: () => useAuthStore.getState().logout(),
});
