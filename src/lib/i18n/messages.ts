import { vi } from "@/lib/i18n/vi";
import { en } from "@/lib/i18n/en";

export const messages = { vi, en } as const;

export type Locale = keyof typeof messages;
export type Message = (typeof messages)[Locale];
