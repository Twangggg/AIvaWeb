import { getSupabaseClient } from "@/lib/supabase/client";
import { ENV } from "@/lib/env";

import { mapSessionToTokens, mapSupabaseUser, enrichTokensFromProfile } from "./auth.map";
import type { LoginPayload, RegisterPayload, RegisterResult, Tokens, UserRole } from "./auth.types";
import { saveUserRole } from "./role.storage";

function authErrorMessage(error: { message?: string } | null, fallback: string): string {
  const message = error?.message?.trim();
  return message || fallback;
}

function emailRedirectTo(path = "/console/auth/callback"): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`;
  }
  return `${ENV.SITE_URL}${path}`;
}

export type OAuthProvider = "google" | "facebook";

export const authService = {
  async signInWithOAuth(provider: OAuthProvider): Promise<void> {
    const supabase = getSupabaseClient();
    const redirectTo = emailRedirectTo("/console/auth/callback");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams:
          provider === "google" ? { prompt: "select_account" } : {},
      },
    });
    if (error) {
      throw new Error(authErrorMessage(error, "Social login failed"));
    }
  },

  async login(payload: LoginPayload): Promise<Tokens> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    });

    if (error) {
      throw new Error(authErrorMessage(error, "Invalid email or password"));
    }

    const tokens = mapSessionToTokens(data.session);
    if (!tokens) {
      throw new Error("No session returned from Supabase");
    }
    return (await enrichTokensFromProfile(tokens))!;
  },

  async register(payload: RegisterPayload): Promise<RegisterResult> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      options: {
        emailRedirectTo: emailRedirectTo(),
        data: {
          display_name: payload.displayName.trim(),
        },
      },
    });

    if (error) {
      throw new Error(authErrorMessage(error, "Registration failed"));
    }

    const tokens = mapSessionToTokens(data.session);
    const user =
      tokens?.user ??
      (data.user
        ? {
            ...mapSupabaseUser(data.user)!,
            displayName: payload.displayName.trim(),
            emailConfirmed: Boolean(data.user.email_confirmed_at),
          }
        : undefined);

    if (user?.id && user.role) {
      saveUserRole(user.id, user.role);
    }

    return {
      accessToken: tokens?.accessToken ?? "",
      refreshToken: tokens?.refreshToken ?? "",
      user: (tokens ? (await enrichTokensFromProfile(tokens))?.user : user) ?? user,
      needsEmailConfirmation: !data.session || !user?.emailConfirmed,
    };
  },

  async refresh(): Promise<Tokens> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      throw new Error(authErrorMessage(error, "Session refresh failed"));
    }
    const tokens = mapSessionToTokens(data.session);
    if (!tokens) {
      throw new Error("No session after refresh");
    }
    return (await enrichTokensFromProfile(tokens))!;
  },

  async logout(): Promise<void> {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
  },

  async getSessionTokens(): Promise<Tokens | null> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(authErrorMessage(error, "Failed to read session"));
    }
    return enrichTokensFromProfile(mapSessionToTokens(data.session));
  },

  async resendVerification(email: string) {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: { emailRedirectTo: emailRedirectTo() },
    });
    if (error) {
      throw new Error(authErrorMessage(error, "Failed to resend verification email"));
    }
  },

  async exchangeCode(code: string): Promise<Tokens> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      throw new Error(authErrorMessage(error, "Email confirmation failed"));
    }
    const tokens = mapSessionToTokens(data.session);
    if (!tokens) {
      throw new Error("No session after confirmation");
    }
    return (await enrichTokensFromProfile(tokens))!;
  },

  async verifyEmailOtp(tokenHash: string, type: "signup" | "email" | "recovery" = "signup"): Promise<Tokens> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });
    if (error) {
      throw new Error(authErrorMessage(error, "Email confirmation failed"));
    }
    const tokens = mapSessionToTokens(data.session);
    if (!tokens) {
      throw new Error("No session after confirmation");
    }
    return (await enrichTokensFromProfile(tokens))!;
  },

  async requestPasswordReset(email: string): Promise<void> {
    const supabase = getSupabaseClient();
    const redirectTo = `${emailRedirectTo("/console/auth/callback")}?next=${encodeURIComponent("/console/reset-password")}`;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo,
    });
    if (error) {
      throw new Error(authErrorMessage(error, "Failed to send reset email"));
    }
  },

  async updatePassword(password: string): Promise<void> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      throw new Error(authErrorMessage(error, "Failed to update password"));
    }
  },

  /** Persist the role the user chose during post-signup onboarding. */
  async chooseRole(role: UserRole): Promise<void> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.updateUser({
      data: { role },
    });
    if (error) {
      throw new Error(authErrorMessage(error, "Failed to save role"));
    }
    const user = mapSupabaseUser(data.user);
    if (user?.id) {
      saveUserRole(user.id, role);
    }
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", data.user?.id ?? "");
    if (profileError) {
      // Metadata role is authoritative in this app; profiles is best-effort.
    }
  },
};
