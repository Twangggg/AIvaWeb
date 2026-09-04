import { ENV } from "@/lib/env";
import { ApiError } from "@/lib/api/errors";
import {
  getAccessToken,
  logoutAuthSession,
  refreshAuthSession,
} from "@/features/auth/auth.bridge";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  skipAuth?: boolean;
  _retried?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, _retried, headers: extraHeaders, ...rest } = options;
  const headers = new Headers(extraHeaders);

  if (body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${ENV.API_URL}${path}`, {
    ...rest,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 401 && !skipAuth && !_retried) {
    const refreshed = await refreshAuthSession();
    if (refreshed) {
      return apiRequest<T>(path, { ...options, _retried: true });
    }
    await logoutAuthSession();
  }

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const data = (await res.json()) as { message?: string };
      if (data.message) message = data.message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
