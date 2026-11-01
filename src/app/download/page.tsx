import Image from "next/image";
import Link from "next/link";
import { APP_DOWNLOAD } from "@/lib/app-download";

export default function DownloadPage() {
  return (
    <main className="min-h-[100svh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md text-center">
        <Image src="/AIVALogo.png" alt="AIVA" width={160} height={40} className="mx-auto mb-6" />
        <Image src="/mascots/frog-parent-app.webp" alt="AIVA Companion" width={140} height={140} className="mx-auto mb-3" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Tải ứng dụng AIVA Companion</h1>
        <p className="mb-5 text-sm" style={{ color: "var(--brand-muted)" }}>
          Cùng đồng hành với bé qua ứng dụng AIVA dành cho ba mẹ.
        </p>

        {/* Real Scannable QR Code Card */}
        <div className="mb-6 p-4 bg-white rounded-3xl shadow-lg border border-slate-200 inline-block">
          <Image
            src="/app/aiva-companion-qr.png"
            alt="Mã QR tải ứng dụng AIVA"
            width={180}
            height={180}
            className="w-40 h-40 sm:w-48 sm:h-48 object-contain mx-auto"
            unoptimized
          />
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700">
            <span className="material-symbols-outlined text-base text-sky-600">qr_code_scanner</span>
            <span>Quét mã QR bằng điện thoại</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center">
          <a
            href={APP_DOWNLOAD.path}
            download={APP_DOWNLOAD.filename}
            className="inline-flex min-h-12 w-full max-w-xs items-center justify-center rounded-full px-8 py-3 font-bold shadow-md hover:brightness-105 transition-all text-white"
            style={{ backgroundColor: "var(--brand-blue, #0284c7)" }}
          >
            Tải trực tiếp cho Android (APK) ↓
          </a>
          <p className="text-xs" style={{ color: "var(--brand-muted)" }}>
            Phiên bản {APP_DOWNLOAD.version} · {(APP_DOWNLOAD.sizeBytes / 1_000_000).toFixed(1)} MB
          </p>
        </div>

        <p className="mt-6 text-sm leading-relaxed">
          Sau khi tải xong, mở file APK trên điện thoại Android để cài đặt. Nếu đang dùng ứng dụng quét QR, hãy mở trang này bằng Chrome hoặc trình duyệt của điện thoại.
        </p>
        <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--brand-muted)" }}>
          Bản iOS (iPhone/iPad) đang được phát triển.
        </p>
        <Link href="/" className="inline-block mt-8 text-sm font-semibold" style={{ color: "var(--brand-blue, #0284c7)" }}>
          ← Về trang chủ AIVA
        </Link>
      </div>
    </main>
  );
}
