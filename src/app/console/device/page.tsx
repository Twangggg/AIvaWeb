import { DevicePanel } from "@/features/iot/components/device-panel";

export default function ConsoleDevicePage() {
  return (
    <div className="flex flex-col gap-6 text-[var(--console-fg)]">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thiết bị</h1>
        <p className="mt-2 text-[var(--console-muted)]">
          Dùng app AIva để gắn Wi‑Fi lần đầu. Trên web chỉ cần đợi Online rồi bấm Kết nối.
        </p>
      </div>
      <DevicePanel />
    </div>
  );
}
