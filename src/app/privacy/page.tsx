"use client";

import { useMemo, useState } from "react";
import { Nav } from "@/components/common/nav";
import { Footer } from "@/components/common/footer";
import { PreorderModal } from "@/features/preorder/components/preorder-modal";

function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-bold text-[var(--text-on-glass)]">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
        {children}
      </div>
    </section>
  );
}

function PrivacyContent() {
  const date = useMemo(() => "Ngày cập nhật: 05/09/2026", []);
  return (
    <div className="relative z-10 max-w-3xl mx-auto">
      <p className="mb-8 text-xs font-medium uppercase tracking-wider text-[var(--ocean-glow)]">{date}</p>

      <LegalSection title="1. Chúng tôi thu thập những gì">
        <p>
          Khi bạn đăng ký hoặc sử dụng dịch vụ của AIva, chúng tôi có thể thu thập: tên hiển thị, email,
          mật khẩu (được mã hóa), thông tin tài khoản đăng nhập, và các thông tin bạn cung cấp khi sử dụng
          tính năng của sản phẩm.
        </p>
      </LegalSection>

      <LegalSection title="2. Cách chúng tôi sử dụng thông tin">
        <p>
          Thông tin của bạn được dùng để xác thực tài khoản, cá nhân hóa trải nghiệm, gửi thông báo quan
          trọng liên quan đến tài khoản, và cải thiện chất lượng dịch vụ. Chúng tôi không bán dữ liệu của
          bạn cho bên thứ ba.
        </p>
      </LegalSection>

      <LegalSection title="3. Đăng nhập qua mạng xã hội">
        <p>
          Nếu bạn đăng nhập bằng tài khoản Google hoặc Facebook, chúng tôi chỉ nhận các thông tin cơ bản
          bạn đã đồng ý chia sẻ (tên, email) và sử dụng chúng với cùng mục đích nêu trên.
        </p>
      </LegalSection>

      <LegalSection title="4. Lưu trữ và bảo mật">
        <p>
          Dữ liệu được lưu trữ trên các máy chủ có bảo mật, mật khẩu được mã hóa và không bao giờ được
          tiết lộ. Chúng tôi áp dụng các biện pháp kỹ thuật hợp lý để bảo vệ thông tin của bạn.
        </p>
      </LegalSection>

      <LegalSection title="5. Quyền của bạn">
        <p>
          Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của mình bất kỳ lúc nào bằng
          cách liên hệ với chúng tôi qua email hỗ trợ bên dưới.
        </p>
      </LegalSection>

      <LegalSection title="6. Liên hệ">
        <p>
          Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ qua email:{" "}
          <span className="text-[var(--ocean-glow)]">support@aiva.id.vn</span>
        </p>
      </LegalSection>
    </div>
  );
}

export default function PrivacyPage() {
  const [preorderOpen, setPreorderOpen] = useState(false);

  return (
    <>
      <Nav onPreorder={() => setPreorderOpen(true)} />
      <main className="min-h-screen px-6 pb-24 pt-28 relative">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 left-1/4 h-[400px] w-[400px] rounded-full bg-[var(--ocean)]/10 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-3xl relative z-10 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Chính Sách Bảo Mật</h1>
          <p className="text-lg" style={{ color: "var(--text-dim)" }}>
            Tìm hiểu cách AIva thu thập, sử dụng và bảo vệ thông tin của bạn.
          </p>
        </div>
        <PrivacyContent />
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}