import Image from "next/image";
import Link from "next/link";
import { APP_DOWNLOAD } from "@/lib/app-download";

export default function DownloadPage() {
  return (
    <main className="min-h-[100svh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <Image src="/AIVALogo.png" alt="AIVA" width={160} height={40} className="mx-auto mb-6" />
        <Image src="/mascots/frog-parent-app.webp" alt="" width={180} height={180} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Tải ứng dụng AIVA</h1>
        <p className="mb-6" style={{ color: "var(--brand-muted)" }}>Cùng đồng hành với bé qua ứng dụng AIVA dành cho ba mẹ.</p>
        <a href={APP_DOWNLOAD.path} className="inline-flex min-h-12 items-center justify-center rounded-full px-8 py-3 font-bold" style={{ backgroundColor: "var(--brand-blue)", color: "#fff" }}>
          Tải cho Android ↓
        </a>
        <p className="mt-3 text-sm" style={{ color: "var(--brand-muted)" }}>Phiên bản {APP_DOWNLOAD.version} · {(APP_DOWNLOAD.sizeBytes / 1_000_000).toFixed(1)} MB</p>
        <p className="mt-6 text-sm leading-relaxed">Sau khi tải xong, mở file APK trên điện thoại Android để cài đặt. Nếu đang dùng ứng dụng quét QR, hãy mở trang này bằng Chrome hoặc trình duyệt của điện thoại.</p>
        <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--brand-muted)" }}>Bản iPhone/iPad chưa có. File APK chỉ cài được trên Android.</p>
        <Link href="/" className="inline-block mt-8 text-sm" style={{ color: "var(--brand-blue)" }}>← Về trang AIVA</Link>
      </div>
    </main>
  );
}
