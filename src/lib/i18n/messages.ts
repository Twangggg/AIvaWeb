import { vi } from "@/lib/i18n/vi";
import { en } from "@/lib/i18n/en";

export const messages = { vi, en } as const;

export type Locale = keyof typeof messages;
export type Message = (typeof messages)[Locale];

/** Extend this list when adding a locale (and a matching messages entry). */
export const LOCALES: { code: Locale; label: string; nativeLabel: string }[] = [
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt" },
  { code: "en", label: "English", nativeLabel: "English" },
];
