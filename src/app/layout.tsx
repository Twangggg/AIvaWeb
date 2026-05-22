import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/lib/providers/app-providers";

export const metadata: Metadata = {
  title: "AIva Smart Glasses | Pre-order",
  description: "Kinh thong minh AIva - mo pre-order som cho nguoi dung dau tien."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
