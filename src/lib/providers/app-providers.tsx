"use client";

import { ThemeProvider } from "@/lib/providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { I18nProvider } from "@/lib/i18n/provider";
import { ChatbotWidget } from "@/features/chat/components/chatbot-widget";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { LenisProvider } from "@/components/providers/lenis-provider";

function restoreNativeCursor() {
  document.documentElement.classList.remove("custom-cursor-active");
  document.body.classList.remove("custom-cursor-active");
  document.documentElement.style.cursor = "";
  document.body.style.cursor = "";
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConsole = pathname?.startsWith("/console");
  const isGamePage = pathname === "/play";
  const isHomePage = pathname === "/";
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30000
          }
        }
      })
  );

  useEffect(() => {
    if (!isConsole) return;
    restoreNativeCursor();
  }, [isConsole]);

  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <LenisProvider enabled={!isGamePage && !isHomePage}>
            {!isConsole && <CustomCursor />}
            {children}
            {!isConsole && !isGamePage && <ChatbotWidget />}
          </LenisProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
