import { DevicePanel } from "@/features/iot/components/device-panel";

export default function ConsoleDevicePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Thiết bị</h1>
        <p className="mt-2 text-[#6b7280]">Gắn IoT bot qua HTTP/WebSocket và thử lệnh speak.</p>
      </div>
      <DevicePanel />
    </div>
  );
}
