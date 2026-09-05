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

function TermsContent() {
  const date = useMemo(() => "Ngày cập nhật: 05/09/2026", []);
  return (
    <div className="relative z-10 max-w-3xl mx-auto">
      <p className="mb-8 text-xs font-medium uppercase tracking-wider text-[var(--ocean-glow)]">{date}</p>

      <LegalSection title="1. Chấp nhận điều khoản">
        <p>
          Bằng việc truy cập hoặc sử dụng sản phẩm, dịch vụ của AIva (sau đây gọi là &quot;Dịch vụ&quot;),
          bạn đồng ý tuân thủ các điều khoản này. Nếu không đồng ý, vui lòng ngừng sử dụng Dịch vụ.
        </p>
      </LegalSection>

      <LegalSection title="2. Tài khoản">
        <p>
          Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu của mình. Bạn phải cung cấp thông tin chính
          xác khi đăng ký và thông báo ngay cho chúng tôi nếu phát hiện tài khoản bị sử dụng trái phép.
        </p>
      </LegalSection>

      <LegalSection title="3. Sử dụng hợp lệ">
        <p>
          Bạn đồng ý không sử dụng Dịch vụ cho các mục đích bất hợp pháp, không xâm phạm quyền của người
          khác, và không can thiệp vào hoạt động bình thường của hệ thống.
        </p>
      </LegalSection>

      <LegalSection title="4. Sở hữu trí tuệ">
        <p>
          Nội dung, logo, giao diện và các tài sản trí tuệ thuộc về AIva đều được bảo hộ và không được
          sao chép, sửa đổi hay phân phối khi chưa có sự đồng ý bằng văn bản.
        </p>
      </LegalSection>

      <LegalSection title="5. Giới hạn trách nhiệm">
        <p>
          Dịch vụ được cung cấp ở trạng thái &quot;nguyên trạng&quot;. AIva không chịu trách nhiệm cho mọi
          thiệt hại gián tiếp phát sinh từ việc sử dụng hoặc không thể sử dụng Dịch vụ, trong phạm vi
          pháp luật cho phép.
        </p>
      </LegalSection>

      <LegalSection title="6. Thay đổi điều khoản">
        <p>
          Chúng tôi có thể cập nhật điều khoản này theo thời gian và sẽ đăng thay đổi tại trang này. Tiếp
          tục sử dụng Dịch vụ sau khi thay đổi nghĩa là bạn chấp nhận các điều khoản mới.
        </p>
      </LegalSection>

      <LegalSection title="7. Liên hệ">
        <p>
          Mọi câu hỏi về điều khoản sử dụng, liên hệ qua email:{" "}
          <span className="text-[var(--ocean-glow)]">support@aiva.id.vn</span>
        </p>
      </LegalSection>
    </div>
  );
}

export default function TermsPage() {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Điều Khoản Sử Dụng</h1>
          <p className="text-lg" style={{ color: "var(--text-dim)" }}>
            Các quy định khi bạn sử dụng sản phẩm và dịch vụ của AIva.
          </p>
        </div>
        <TermsContent />
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}