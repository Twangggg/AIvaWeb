import type { Metadata } from "next";

import { AuthBootstrap } from "@/features/auth/components/auth-bootstrap";
import { ConsoleShell } from "@/features/console/components/console-shell";

export const metadata: Metadata = {
  title: "AIva Console",
  description: "Bảng điều khiển giáo viên AIva",
  robots: { index: false, follow: false },
};

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthBootstrap>
      <ConsoleShell>{children}</ConsoleShell>
    </AuthBootstrap>
  );
}
