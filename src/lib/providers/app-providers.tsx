"use client";

import { ThemeProvider } from "@/lib/providers/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { I18nProvider } from "@/lib/i18n/provider";
import { ChatbotWidget } from "@/features/chat/components/chatbot-widget";
import { CustomCursor } from "@/components/ui/custom-cursor";

export function AppProviders({ children }: { children: React.ReactNode }) {
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

  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <CustomCursor />
          {children}
          <ChatbotWidget />
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
