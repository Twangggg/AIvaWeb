import { AdminGate } from "@/features/admin/components/admin-gate";
import { AdminShell } from "@/features/admin/components/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}
