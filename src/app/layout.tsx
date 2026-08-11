import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProviders } from "@/lib/providers/app-providers";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
});

const defaultMeta = {
  vi: { title: "AIva | Kỷ Nguyên Tương Lai", description: "Trải nghiệm sự tích hợp liền mạch giữa phần cứng và thực tế. Bước tiến hóa tiếp theo của điện toán không gian đã đến." },
  en: { title: "AIva | A New Era", description: "Experience the seamless integration of hardware and reality. The next evolution of spatial computing has arrived." }
};

export const metadata: Metadata = {
  ...defaultMeta.vi,
  icons: [{ rel: "icon", url: "/favicon.png", type: "image/png" }],
  openGraph: {
    title: defaultMeta.vi.title,
    description: defaultMeta.vi.description,
    url: "https://aiva.id.vn",
    siteName: "AIva",
    locale: "vi_VN",
    type: "website",
    images: [{ url: "/AIVALogo.png", width: 1200, height: 630, alt: "AIva Smart Glasses" }]
  },
  twitter: {
    card: "summary_large_image",
    title: defaultMeta.vi.title,
    description: defaultMeta.vi.description,
    images: ["/AIVALogo.png"]
  },
  metadataBase: new URL("https://aiva.id.vn")
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
        <link
          rel="preload"
          href="/models/glasses.glb"
          as="fetch"
          crossOrigin="anonymous"
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{document.documentElement.classList.add(localStorage.getItem("theme")||"dark");if(window.matchMedia("(pointer: fine)").matches&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("custom-cursor-active");document.documentElement.style.cursor="none"}}catch(e){}`}
        </Script>
      </head>
      <body className={`${beVietnamPro.variable} font-sans antialiased`} suppressHydrationWarning>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
