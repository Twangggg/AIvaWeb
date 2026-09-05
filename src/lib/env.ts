function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback ?? "";
  return value.replace(/\/$/, "");
}

export const ENV = {
  API_URL: required("NEXT_PUBLIC_API_URL", "http://127.0.0.1:8080"),
  IOT_BOT_URL: required("NEXT_PUBLIC_IOT_BOT_URL", "http://127.0.0.1:8040"),
  SITE_URL: required("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  /** Companion app download / store landing (BLE Wi‑Fi setup). Empty = hide store CTAs. */
  MOBILE_APP_URL: required("NEXT_PUBLIC_MOBILE_APP_URL", ""),
  MOBILE_APP_IOS_URL: required("NEXT_PUBLIC_MOBILE_APP_IOS_URL", ""),
  MOBILE_APP_ANDROID_URL: required("NEXT_PUBLIC_MOBILE_APP_ANDROID_URL", ""),
};
