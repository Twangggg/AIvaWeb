import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/lib/providers/app-providers";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap"
});

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  variable: "--font-montserrat",
  display: "swap"
});

const defaultMeta = {
  vi: { title: "AIva | Kỷ Nguyên Tương Lai", description: "Trải nghiệm sự tích hợp liền mạch giữa phần cứng và thực tế. Bước tiến hóa tiếp theo của điện toán không gian đã đến." },
  en: { title: "AIva | A New Era", description: "Experience the seamless integration of hardware and reality. The next evolution of spatial computing has arrived." }
};

export const metadata: Metadata = {
  ...defaultMeta.vi,
  icons: [{ rel: "icon", url: "/favicon.png", type: "image/png" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {`document.documentElement.classList.add(localStorage.getItem("theme")||"dark")`}
        </Script>
      </head>
      <body className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
