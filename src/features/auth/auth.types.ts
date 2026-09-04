export type UserRole = "teacher" | "parent" | "admin";

export type UserInfo = {
  id: string;
  email: string;
  displayName: string;
  role?: UserRole;
  emailConfirmed?: boolean;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  user?: UserInfo;
};

export type LoginPayload = {
  email: string;
  password: string;
  /** Persist session across browser restarts (default true). */
  rememberMe?: boolean;
};

export type RegisterPayload = {
  email: string;
  password: string;
  displayName: string;
  /** Ignored — role comes from profiles / email heuristics. Kept optional for call-site compat. */
  role?: UserRole;
};

export type RegisterResult = Tokens & {
  needsEmailConfirmation?: boolean;
};

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";
