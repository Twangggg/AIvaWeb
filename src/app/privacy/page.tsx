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

      <LegalSection title="1. Giới thiệu">
        <p>
          Chào mừng bạn đến với AIva, sản phẩm kính thông minh dành cho trẻ em do OPTIC ELITE phát triển.
          Chính sách bảo mật này mô tả chi tiết cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông
          tin cá nhân của bạn khi bạn truy cập trang web <b>aiva.id.vn</b>, đăng ký tài khoản, sử dụng
          ứng dụng đồng hành (companion app) hoặc tương tác với các dịch vụ của chúng tôi (gọi chung là
          &quot;Dịch vụ&quot;).
        </p>
        <p>
          Bằng việc sử dụng Dịch vụ, bạn xác nhận đã đọc và đồng ý với các hoạt động xử lý dữ liệu được
          mô tả trong chính sách này. Nếu bạn là phụ huynh hoặc người giám hộ, việc cho trẻ sử dụng Dịch vụ
          đồng nghĩa với việc bạn đồng ý thay mặt trẻ với các nội dung dưới đây.
        </p>
      </LegalSection>

      <LegalSection title="2. Chúng tôi là ai">
        <p>
          Công ty phát triển và vận hành Dịch vụ là <b>OPTIC ELITE</b> — đơn vị tạo ra AIva, kính thông minh
          không màn hình giúp trẻ khám phá thế giới thật bằng giọng nói và thị giác. Thông tin liên hệ của
          chúng tôi được nêu tại mục cuối của chính sách này.
        </p>
      </LegalSection>

      <LegalSection title="3. Dữ liệu chúng tôi thu thập">
        <p>Chúng tôi thu thập các loại thông tin sau khi bạn sử dụng Dịch vụ:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><b>Thông tin tài khoản:</b> tên hiển thị, địa chỉ email, mật khẩu (luôn được mã hóa), vai trò tài khoản (phụ huynh / giáo viên).</li>
          <li><b>Thông tin đăng nhập:</b> khi bạn đăng nhập bằng Google hoặc Facebook, chúng tôi nhận các thông tin bạn đã đồng ý chia sẻ (tên và email).</li>
          <li><b>Thông tin sử dụng:</b> thời điểm đăng nhập, thao tác trong tài khoản, câu hỏi và tương tác của trẻ với thiết bị AIva, nhật ký khám phá.</li>
          <li><b>Thông tin thiết bị:</b> loại thiết bị, trạng thái pin, phiên bản phần mềm khi thiết bị AIva đồng bộ với ứng dụng.</li>
          <li><b>Thông tin kỹ thuật:</b> địa chỉ IP, loại trình duyệt, trang tham chiếu, nhật ký lỗi khi bạn truy cập trang web.</li>
          <li><b>Thông tin bạn tự cung cấp:</b> nội dung gửi qua biểu mẫu đặt trước, khảo sát hoặc liên hệ hỗ trợ.</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Mục đích sử dụng dữ liệu">
        <p>Chúng tôi chỉ sử dụng dữ liệu của bạn cho các mục đích rõ ràng và hợp pháp, bao gồm:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Tạo, xác thực và quản lý tài khoản của bạn.</li>
          <li>Cung cấp, vận hành và cải thiện Dịch vụ (bao gồm tính năng trợ lý giọng nói cho trẻ).</li>
          <li>Cá nhân hóa trải nghiệm và nội dung theo độ tuổi, theo vai trò của bạn.</li>
          <li>Gửi thông báo quan trọng về tài khoản, bảo mật hoặc thay đổi dịch vụ.</li>
          <li>Gửi thông tin ưu đãi đặt trước, chương trình mắt bán — chỉ khi bạn đăng ký nhận thông tin.</li>
          <li>Phân tích, đo lường, bảo trì hệ thống và bảo vệ Dịch vụ khỏi gian lận hoặc rủi ro bảo mật.</li>
          <li>Thực hiện nghĩa vụ pháp lý khi pháp luật yêu cầu.</li>
        </ul>
        <p>
          Chúng tôi <b>không bao giờ bán</b> dữ liệu cá nhân của bạn cho bên thứ ba và không sử dụng dữ liệu
          của trẻ em cho mục đích quảng cáo hành vi.
        </p>
      </LegalSection>

      <LegalSection title="5. Căn cứ xử lý dữ liệu">
        <p>Chúng tôi xử lý dữ liệu dựa trên các căn cứ sau (theo GDPR và luật bảo vệ dữ liệu hiện hành):</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><b>Thực hiện hợp đồng:</b> cung cấp Dịch vụ bạn đã đăng ký.</li>
          <li><b>Sự đồng ý:</b> các hoạt động bạn chủ động lựa chọn, có thể rút lại bất cứ lúc nào.</li>
          <li><b>Nghĩa vụ pháp lý:</b> tuân thủ quy định của pháp luật.</li>
          <li><b>Lợi ích hợp pháp:</b> bảo mật hệ thống, phòng chống gian lận, cải thiện chất lượng Dịch vụ.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Đăng nhập qua Google và Facebook">
        <p>
          Nếu bạn đăng nhập bằng tài khoản Google hoặc Facebook (&quot;Đăng nhập mạng xã hội&quot;), chúng tôi sử dụng
          dịch vụ xác thực an toàn của từng nền tảng. Chúng tôi chỉ nhận các thông tin cơ bản bạn đã đồng ý
          chia sẻ (tên và email) và không thể xem lịch sử, danh bạ hay nội dung khác trên tài khoản mạng xã
          hội của bạn. Bạn có thể ngừng liên kết tài khoản mạng xã hội bất cứ lúc nào từ các trang cài đặt
          của từng nền tảng.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookie và công nghệ theo dõi">
        <p>
          Trang web của chúng tôi sử dụng cookie và bộ nhớ trình duyệt để lưu phiên đăng nhập, tùy chọn ngôn
          ngữ và ghi nhớ trạng thái đăng nhập. Chúng tôi có thể sử dụng các công cụ phân tích để hiểu cách
          người dùng tương tác với trang web nhằm cải thiện trải nghiệm. Bạn có thể tắt cookie qua cài đặt
          trình duyệt, tuy nhiên một số tính năng có thể không hoạt động đầy đủ.
        </p>
      </LegalSection>

      <LegalSection title="8. Chia sẻ dữ liệu với bên thứ ba">
        <p>
          Chúng tôi chỉ chia sẻ dữ liệu với các nhà cung cấp dịch vụ hỗ trợ vận hành Dịch vụ — ví dụ nhà cung
          cấp hạ tầng máy chủ, dịch vụ xác thực, dịch vụ gửi email — trong phạm vi cần thiết để cung cấp Dịch
          vụ cho bạn. Các bên này bị ràng buộc về bảo mật và chỉ được xử lý dữ liệu theo chỉ dẫn của chúng
          tôi. Chúng tôi không bán, không cho thuê và không trao đổi dữ liệu cá nhân với bên nào khác.
        </p>
      </LegalSection>

      <LegalSection title="9. Lưu trữ và bảo mật dữ liệu">
        <p>
          Dữ liệu được lưu trữ trên máy chủ có kiểm soát truy cập, mã hóa trong quá trình truyền tải (TLS) và
          mã hóa khi lưu trữ. Mật khẩu được băm và không bao giờ được lưu dạng văn bản gốc. Chúng tôi áp dụng
          các biện pháp kỹ thuật và tổ chức hợp lý nhằm bảo vệ dữ liệu khỏi truy cập trái phép, mất mát hoặc
          rò rỉ. Dù vậy, không phương thức truyền tải nào qua Internet là an toàn tuyệt đối — chúng tôi khuyến
          nghị bạn bảo vệ mật khẩu và thông báo ngay nếu nghi ngờ tài khoản bị sử dụng trái phép.
        </p>
      </LegalSection>

      <LegalSection title="10. Thời gian lưu giữ dữ liệu">
        <p>
          Chúng tôi chỉ lưu giữ dữ liệu trong thời gian cần thiết cho mục đích đã nêu hoặc theo yêu cầu pháp
          luật. Dữ liệu tài khoản được lưu tới khi bạn yêu cầu xóa hoặc đóng tài khoản; sau đó một phần dữ liệu
          có thể được lưu thêm theo nghĩa vụ kế toán, thuế hoặc pháp lý trước khi bị xóa hoặc ẩn danh hóa.
        </p>
      </LegalSection>

      <LegalSection title="11. Quyền riêng tư của trẻ em">
        <p>
          Sản phẩm AIva được thiết kế cho trẻ em từ 4–12 tuổi và dữ liệu của trẻ luôn được xử lý theo nguyên
          tắc bảo vệ tốt nhất cho trẻ. Chúng tôi không thu thập thông tin nhận dạng trực tiếp của trẻ theo cách
          không cần thiết, không hiển thị quảng cáo hành vi cho trẻ và không chia sẻ dữ liệu của trẻ cho bên
          thứ ba vì mục đích quảng cáo. Tài khoản cho trẻ phải do phụ huynh hoặc người giám hộ hợp pháp tạo và
          quản lý. Nếu bạn tin rằng chúng tôi đã vô tình thu thập dữ liệu của trẻ mà không có sự đồng ý của phụ
          huynh, hãy liên hệ ngay để chúng tôi xóa dữ liệu đó.
        </p>
      </LegalSection>

      <LegalSection title="12. Quyền của bạn">
        <p>Tùy theo pháp luật áp dụng, bạn có các quyền sau đối với dữ liệu cá nhân của mình:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Quyền truy cập: yêu cầu bản sao dữ liệu chúng tôi đang lưu giữ về bạn.</li>
          <li>Quyền chỉnh sửa: cập nhật thông tin sai hoặc thiếu.</li>
          <li>Quyền xóa: yêu cầu xóa dữ liệu khi không còn cần thiết.</li>
          <li>Quyền hạn chế và phản đối xử lý trong một số trường hợp.</li>
          <li>Quyền di chuyển dữ liệu: nhận dữ liệu ở định dạng có cấu trúc.</li>
          <li>Quyền rút lại sự đồng ý bất cứ lúc nào.</li>
          <li>Quyền khiếu nại với cơ quan giám sát về bảo vệ dữ liệu.</li>
        </ul>
        <p>
          Để thực hiện các quyền này hoặc đóng tài khoản, vui lòng liên hệ chúng tôi qua email hỗ trợ. Chúng
          tôi sẽ phản hồi trong thời gian hợp lý và theo quy định pháp luật.
        </p>
      </LegalSection>

      <LegalSection title="13. Chuyển dữ liệu quốc tế">
        <p>
          Dữ liệu của bạn có thể được lưu trữ và xử lý tại các máy chủ đặt ngoài quốc gia bạn đang sinh sống.
          Trong mọi trường hợp, chúng tôi áp dụng các cơ chế chuyển dữ liệu hợp pháp (như điều khoản hợp đồng
          tiêu chuẩn) và biện pháp bảo vệ phù hợp cho các luồng dữ liệu xuyên biên giới.
        </p>
      </LegalSection>

      <LegalSection title="14. Thay đổi chính sách">
        <p>
          Chúng tôi có thể cập nhật chính sách này theo thời gian để phản ánh thay đổi về dịch vụ hoặc pháp
          luật. Ngày cập nhật mới nhất được ghi ở đầu trang. Những thay đổi quan trọng sẽ được thông báo cho
          bạn qua email hoặc hiển thị rõ trên trang này. Việc tiếp tục sử dụng Dịch vụ sau khi thay đổi đồng
          nghĩa với việc bạn chấp nhận bản chính sách mới.
        </p>
      </LegalSection>

      <LegalSection title="15. Liên hệ">
        <p>
          Mọi thắc mắc, yêu cầu về quyền riêng tư hoặc khiếu nại, vui lòng liên hệ:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Email hỗ trợ: <span>support</span>
            <span>@</span>
            <span>aiva.id.vn</span>
          </li>
          <li>Đơn vị phát triển: OPTIC ELITE (AIva)</li>
          <li>Trang web: https://aiva.id.vn</li>
        </ul>
        <p>
          Chúng tôi sẽ xác minh danh tính của bạn trước khi xử lý yêu cầu và phản hồi trong thời gian sớm nhất.
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
        <div className="mx-auto max-w-3xl relative z-10 mb-12 rounded-2xl border border-[var(--text-on-glass)]/15 bg-[var(--glass-bg)]/60 p-6 text-sm leading-relaxed">
          <h2 className="mb-3 text-lg font-bold text-[var(--text-on-glass)]">
            Privacy Policy Summary (English)
          </h2>
          <div className="space-y-3" style={{ color: "var(--text-dim)" }}>
            <p>
              <b>AIva</b> is a screen-free smart glasses product for children,
              developed and operated by <b>OPTIC ELITE</b>. This privacy policy
              describes the data this app and our website collect and how we
              use it.
            </p>
            <p>
              <b>What we collect:</b> account information (display name, email,
              hashed password, role), login information shared by Google or
              Facebook (name and email), usage information, device information
              (device type, battery, software version), technical information
              (IP address, browser, error logs), and information you provide
              through pre-order forms, surveys, or support requests.
            </p>
            <p>
              <b>How we use your data:</b> to create and manage your account,
              operate and improve the service, personalize your experience,
              send important account or security notices, send marketing only
              with your consent, and to analyze, maintain, and protect the
              service. We never sell personal data and never use children&apos;s
              data for behavioral advertising.
            </p>
            <p>
              <b>Data sharing:</b> we share data only with service providers
              necessary to operate our service, who are bound by
              confidentiality. <b>Data retention:</b> we keep data only as long
              as necessary or as required by law. <b>Your rights:</b> access,
              rectification, erasure, restriction, objection, data portability,
              withdrawal of consent, and the right to complain to a
              supervisory authority.
            </p>
            <p>
              <b>Children:</b> AIva is designed for children aged 4–12.
              Accounts are created and managed by parents or guardians, and we
              do not show behavioral advertising or share children&apos;s data for
              advertising purposes.
            </p>
            <p>
              <b>Contact:</b>{" "}
              <span className="inline">support</span>@<span className="inline">aiva.id.vn</span>{" "}
              | OPTIC ELITE (AIva) | https://aiva.id.vn
            </p>
          </div>
        </div>
        <PrivacyContent />
      </main>
      <Footer />
      <PreorderModal open={preorderOpen} onClose={() => setPreorderOpen(false)} />
    </>
  );
}