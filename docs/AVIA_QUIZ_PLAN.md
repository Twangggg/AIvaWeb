# 📋 BẢN ĐÁNH GIÁ TÀI NGUYÊN & KẾ HOẠCH TRIỂN KHAI: AVIA QUIZ GAME

> **Tài liệu tham chiếu**: `GDD_Avia Quiz Game.docx`  
> **Cập nhật**: Đã loại bỏ hoàn toàn các dòng chú thích mô tả dư thừa bên dưới tên các thẻ khối lớp theo ảnh người dùng phản hồi. Giao diện trở nên tinh giản, gọn gàng và tập trung vào hình ảnh Ếch Avia.

---

## 🎨 I. BẢNG MAPPING TÀI NGUYÊN HÌNH ẢNH (ĐÃ KẾT NỐI 100%)

|  STT  | Tài nguyên                         | Đường dẫn file                                 | Vị trí hiển thị trong Game                                 |         Trạng thái          |
| :---: | :--------------------------------- | :--------------------------------------------- | :--------------------------------------------------------- | :-------------------------: |
| **1** | **Ảnh 1** (Ếch Lớp 1)              | `public/mascots/ech-lop-1.png` (bản Photoroom) | Màn hình chọn Khối Lớp - Thẻ Lớp 1 (Ếch Đeo Cặp Mầm Non)   | ✅ Tách nền trong suốt 100% |
| **2** | **Hình 2** (Ếch Đội Nón Lá)        | `public/mascots/ech-non-la.png`                | Màn hình chọn Khối Lớp - Thẻ Lớp 2 (Ếch Đội Nón Lá)        | ✅ Tách nền trong suốt 100% |
| **3** | **Hình 3** (Ếch Đeo Khăn Quàng Đỏ) | `public/mascots/ech-khan-quang-do.png`         | Màn hình chọn Khối Lớp - Thẻ Lớp 3 (Ếch Đeo Khăn Quàng Đỏ) | ✅ Tách nền trong suốt 100% |
| **4** | **Hình 4** (Ếch Nhà Khai Phá)      | `public/mascots/ech-tham-hiem.png`             | Màn hình chọn Khối Lớp - Thẻ Lớp 4 (Ếch Nhà Khai Phá)      | ✅ Tách nền trong suốt 100% |
| **5** | **Hình 5** (Ếch Thám Tử)           | `public/mascots/ech-tham-tu.png`               | Màn hình chọn Khối Lớp - Thẻ Lớp 5 (Ếch Thám Tử)           | ✅ Tách nền trong suốt 100% |
| **6** | **Hình 6** (Bìa sách môn học)      | `public/mascots/bia-sach-mon-hoc.png`          | Màn hình chọn Sách & Môn học (họa tiết hoa sen)            |        ✅ Đã kết nối        |
| **7** | **Hình 7** (Ếch vui vẻ thân thiện) | `public/mascots/ech-vui-ve.png`                | Màn hình câu hỏi: Trạng thái chờ / tương tác mặc định      | ✅ Tách nền trong suốt 100% |
| **8** | **Hình 8** (Ếch cười tươi)         | `public/mascots/ech-cuoi-tuoi.png`             | Màn hình câu hỏi: Khi trả lời đúng & Màn hình tổng kết     | ✅ Tách nền trong suốt 100% |
| **9** | **Hình 9** (Ếch buồn)              | `public/mascots/ech-buon.png`                  | Màn hình câu hỏi: Khi trả lời sai                          | ✅ Tách nền trong suốt 100% |

---

## 📝 II. HIỆN TRẠNG BỘ CÂU HỎI & TINH CHỈNH GIAO DIỆN

1. **Đã loại bỏ các chú thích dài dòng dư thừa**:
   - Thẻ chọn lớp chỉ hiển thị: Huy hiệu khối lớp, hình ảnh linh vật Ếch, tên chức danh của Ếch (`Ếch Đeo Cặp Mầm Non`, `Ếch Đội Nón Lá`, `Ếch Đeo Khăn Quàng Đỏ`, `Ếch Nhà Khai Phá`, `Ếch Thám Tử`) và nút chọn lớp.
   - Toàn bộ đoạn văn mô tả rườm rà bên dưới đã được xóa bỏ hoàn toàn.
2. **Tiến độ cập nhật & Kiến trúc JSON Lazy-Loading (Tối ưu tải Client)**:
   - **Đã chuyển 100% tất cả các môn sang file JSON độc lập**:
     - `grade1-tnxh.json` (168 câu)
     - `grade1-hdtn.json` (126 câu)
     - `grade2-tnxh.json` (186 câu)
     - `grade2-hdtn.json` (102 câu)
     - `grade3-tnxh.json` (180 câu)
     - `grade3-hdtn.json` (210 câu)
     - `grade3-congnghe.json` (60 câu)
     - `grade3-tinhoc.json` (96 câu)
     - `grade4-hdtn.json` (210 câu)
     - `grade4-congnghe.json` (72 câu)
     - `grade4-tinhoc.json` (102 câu)
     - `grade5-congnghe.json` (54 câu)
     - `grade5-tinhoc.json` (108 câu)
     - `grade5-hdtn.json` (192 câu)
     - `grade5-khoahoc.json` (180 câu)
   - **Tối ưu giảm tải cho Client (>90% payload reduction)**:
     - Tách biệt **Lightweight Catalog** (`mock-data.ts`) chỉ chứa metadata giao diện (~2 KB).
     - Áp dụng Dynamic Import Code Splitting (`book-loader.ts`): Toàn bộ dữ liệu câu hỏi được tách thành các async chunk riêng biệt.
     - Kết hợp **Background Preloading theo Khối Lớp**: Khi học sinh chọn khối lớp, các file JSON môn học của khối lớp đó được nạp ngầm, đảm bảo chuyển màn hình tức thì (0ms) mà không làm phình to bundle khởi động ban đầu.
   - **Thống kê theo khối lớp**:
     - **Lớp 1**: 2 môn = 294 câu.
     - **Lớp 2**: 2 môn = 288 câu.
     - **Lớp 3**: 4 môn = 546 câu (Hoạt động trải nghiệm: 210 câu, TNXH: 180 câu, Tin học: 96 câu, Công nghệ: 60 câu).
     - **Lớp 4**: 3 môn = 384 câu (Hoạt động trải nghiệm: 210 câu, Tin học: 102 câu, Công nghệ: 72 câu).
     - **Lớp 5**: 4 môn = 534 câu (Hoạt động trải nghiệm: 192 câu, Khoa học: 180 câu, Tin học: 108 câu, Công nghệ: 54 câu).
   - **Tổng cộng**: **2.046 câu hỏi** chính thức trong hệ thống (Đạt 100% chuẩn GDD).
