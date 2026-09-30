---
name: mobile-web-design
description: >-
  Comprehensive guide and best practices for Mobile-First Responsive Design,
  mobile scrollytelling, viewport height handling (svh/dvh), fluid spacing,
  preventing excessive white gaps, and optimizing touch UX in AIVAWeb.
---

# Mobile-First Responsive Design & Scrollytelling Architecture

Hệ thống quy chuẩn thiết kế Mobile-First và Scrollytelling thích ứng cho website hiện đại (Next.js, Tailwind CSS, Three.js, Framer Motion).

---

## 1. Nguyên Tắc Cốt Lõi (Core Principles)

### ❌ Sai Lầm Thường Gặp Khi Chuyển Từ Desktop Sang Mobile:

1. **Ép chiều cao Desktop (`min-h-[180vh]`, `sticky h-[100dvh]`) vào Mobile/Tablet**: Tạo ra những "sa mạc cuộn" (scroll deserts) trống trải hàng trăm pixel.
2. **Căn giữa cứng nhắc (`justify-center`) trên màn hình dọc (Portrait 1280px)**: Đẩy khối nội dung 250px vào giữa, tạo ra khoảng trắng khổng lồ 500px ở cả trên và dưới.
3. **Mô hình 3D / Đồ họa không scale theo viewport**: Dẫn đến việc kính 3D hoặc hình ảnh to choán toàn bộ màn hình điện thoại/tablet, đè lên chữ.
4. **Lỗi `100vh` trên trình duyệt di động**: Thanh địa chỉ (URL bar) của Safari/Chrome co giãn làm giật layout.

### Quy Tắc Vàng Thiết Kế Mobile-First:

- **Tách biệt Breakpoint**: Desktop ($\ge 1024\text{px}$) có thể dùng Sticky Pin Scrollytelling đa cảnh; Mobile & Tablet ($< 1024\text{px}$) phải chuyển sang **dòng chảy tự nhiên (Fluid Vertical Flow)** với `min-h-0 py-12 sm:py-16`.
- **Sử dụng đơn vị Viewport Hiện đại**:
  - `100svh`: Cho màn hình đầu tiên (Hero), đảm bảo không bao giờ bị thanh URL che nút.
  - `100dvh`: Cho các container toàn màn hình khi cuộn.
- **Tỷ lệ quang học (Optical Balance)**: Nội dung trên mobile nên nằm ở 50–65% phần trên của màn hình, để mắt người dùng tiếp nhận tự nhiên khi cầm điện thoại bằng 1 tay.

---

## 2. Xử Lý Chiều Cao & Triệt Tiêu Khoảng Trắng Thừa

### A. Hero Section Mobile

```tsx
// Chuẩn responsive cho Hero:
<section className="relative w-full min-h-[100svh] lg:min-h-[100dvh] flex flex-col justify-between items-center pt-20 pb-8 sm:pt-24 sm:pb-12">
  {/* Phần thương hiệu & CTA */}
  <div className="my-auto w-full max-w-4xl px-4 text-center">...</div>
  {/* Nút cuộn xuống nằm gọn ở đáy */}
  <button className="scroll-cue" />
</section>
```

### B. Chuyển Đổi Scrollytelling Đa Cảnh (Multi-scene Track)

Trên Desktop dùng `min-h-[160vh] - 200vh`, nhưng trên Mobile/Tablet chuyển về chiều cao vừa vặn:

```tsx
// Ví dụ: Section Statement / Vision / Feature
<div
  id="statement"
  data-fp-section
  data-fp-scenes="3"
  className="cx-fp-section min-h-0 lg:min-h-[160vh] relative py-12 lg:py-0"
>
  <div className="relative lg:sticky lg:top-0 min-h-0 lg:h-[100dvh] w-full flex items-center justify-center">
    <StatementChapter />
  </div>
</div>
```

---

## 3. Quy Chuẩn Mô Hình 3D & Canvas Trên Mobile

1. **Scale linh hoạt theo 3 nấc**:
   - Mobile ($< 640\text{px}$): `scale = 0.9 - 1.0`
   - Tablet ($640\text{px} - 1023\text{px}$): `scale = 1.1 - 1.2`
   - Desktop ($\ge 1024\text{px}$): `scale = 1.4 - 1.5`
2. **Vị trí trục Y trong không gian 3D**:
   - Trên Mobile/Tablet: Đẩy nhẹ lên phía trên (`y = 0.16 ~ 0.22`), để dành nửa dưới cho các card thông tin nổi (`backdrop-blur`).
   - Trên Desktop: Căn giữa (`y = 0.0`), thẻ thông tin xếp xung quanh 2 bên.
3. **Nội suy Lerp (Smooth Damping)**:
   - Luôn áp dụng lerp interpolation trong `useFrame` (`currentS += (targetS - currentS) * (delta * 9)`) để loại bỏ hoàn toàn hiện tượng xoay giật cục khi cuộn trên màn hình cảm ứng.

---

## 4. Typography & Spacing Scale (Mobile $\rightarrow$ Desktop)

| Cấp độ                   | Mobile (< 640px)                  | Tablet (640px - 1023px)           | Desktop (>= 1024px)           |
| :----------------------- | :-------------------------------- | :-------------------------------- | :---------------------------- |
| **Brand Mega Hero**      | `clamp(3rem, 12vw, 4.5rem)`       | `clamp(4.5rem, 11vw, 6.5rem)`     | `clamp(6rem, 10vw, 8.5rem)`   |
| **Section Heading (H2)** | `text-2xl (1.5rem)`               | `text-3xl (1.875rem)`             | `text-4xl ~ text-5xl`         |
| **Body / Subtitle**      | `text-sm (0.875rem)`              | `text-base (1rem)`                | `text-lg (1.125rem)`          |
| **Section Padding (Y)**  | `py-10 ~ py-14`                   | `py-14 ~ py-20`                   | `min-h-[100dvh]` hoặc `py-24` |
| **Touch Target Size**    | Tối thiểu $44 \times 44\text{px}$ | Tối thiểu $44 \times 44\text{px}$ | $36 \sim 40\text{px}$         |

---

## 5. Thanh Điều Hướng (Floating Pill Navbar) Trên Mobile

- **Độ rộng**: `style={{ width: "min(calc(100% - 2rem), 56rem)" }}`.
- **Căn giữa tuyệt đối**: `fixed top-3.5 sm:top-4 left-1/2 -translate-x-1/2`.
- **Hiệu ứng Kính mờ**: `backdropFilter: "blur(24px) saturate(180%)"`.
- **Tối giản ngoại vi**: Logo + Đăng nhập + Theme/Language + Hamburger Menu ngoài; các danh mục chi tiết nằm trong Dropdown mượt mà.

---

## 6. Kiểm Thử Checklist (Verification Checklist)

- [ ] Không có thanh cuộn ngang (`overflow-x: hidden` trên toàn bộ root).
- [ ] Màn hình tỷ lệ 800x1280 (Galaxy Tab) và 390x844 (iPhone) không bị khoảng trắng lớn trên/dưới.
- [ ] Không bị giật layout khi thanh địa chỉ trình duyệt co giãn (`svh` / `dvh`).
- [ ] Mô hình 3D kính không che lấp chữ hoặc tràn mép màn hình.
- [ ] Thao tác chạm và cuộn (touch momentum) mượt mà 60fps.
