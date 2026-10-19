# 📋 BẢN ĐÁNH GIÁ TÀI NGUYÊN & KẾ HOẠCH TRIỂN KHAI: AVIA QUIZ GAME

> **Tài liệu tham chiếu**: `GDD_Avia Quiz Game.docx`  
> **Cập nhật**: Đã loại bỏ hoàn toàn các dòng chú thích mô tả dư thừa bên dưới tên các thẻ khối lớp theo ảnh người dùng phản hồi. Giao diện trở nên tinh giản, gọn gàng và tập trung vào hình ảnh Ếch Avia.

---

## 🎨 I. BẢNG MAPPING TÀI NGUYÊN HÌNH ẢNH (ĐÃ KẾT NỐI 100%)

|  STT  | Tài nguyên                         | Đường dẫn file                         | Vị trí hiển thị trong Game                                 |  Trạng thái   |
| :---: | :--------------------------------- | :------------------------------------- | :--------------------------------------------------------- | :-----------: |
| **1** | **Ảnh 1** (Ếch Lớp 1)              | `public/mascots/trực diện.jpg`         | Màn hình chọn Khối Lớp - Thẻ Lớp 1 (Ếch Đeo Cặp Mầm Non)   | ✅ Đã kết nối |
| **2** | **Hình 2** (Ếch Đội Nón Lá)        | `public/mascots/ech-non-la.png`        | Màn hình chọn Khối Lớp - Thẻ Lớp 2 (Ếch Đội Nón Lá)        | ✅ Đã kết nối |
| **3** | **Hình 3** (Ếch Đeo Khăn Quàng Đỏ) | `public/mascots/ech-khan-quang-do.png` | Màn hình chọn Khối Lớp - Thẻ Lớp 3 (Ếch Đeo Khăn Quàng Đỏ) | ✅ Đã kết nối |
| **4** | **Hình 4** (Ếch Nhà Khai Phá)      | `public/mascots/ech-tham-hiem.png`     | Màn hình chọn Khối Lớp - Thẻ Lớp 4 (Ếch Nhà Khai Phá)      | ✅ Đã kết nối |
| **5** | **Hình 5** (Ếch Thám Tử)           | `public/mascots/ech-tham-tu.png`       | Màn hình chọn Khối Lớp - Thẻ Lớp 5 (Ếch Thám Tử)           | ✅ Đã kết nối |
| **6** | **Hình 6** (Bìa sách môn học)      | `public/mascots/bia-sach-mon-hoc.png`  | Màn hình chọn Sách & Môn học (họa tiết hoa sen)            | ✅ Đã kết nối |
| **7** | **Hình 7** (Ếch vui vẻ thân thiện) | `public/mascots/ech-vui-ve.png`        | Màn hình câu hỏi: Trạng thái chờ / tương tác mặc định      | ✅ Đã kết nối |
| **8** | **Hình 8** (Ếch cười tươi)         | `public/mascots/ech-cuoi-tuoi.png`     | Màn hình câu hỏi: Khi trả lời đúng & Màn hình tổng kết     | ✅ Đã kết nối |
| **9** | **Hình 9** (Ếch buồn)              | `public/mascots/ech-buon.png`          | Màn hình câu hỏi: Khi trả lời sai                          | ✅ Đã kết nối |

---

## 📝 II. HIỆN TRẠNG BỘ CÂU HỎI & TINH CHỈNH GIAO DIỆN

1. **Đã loại bỏ các chú thích dài dòng dư thừa**:
   - Thẻ chọn lớp chỉ hiển thị: Huy hiệu khối lớp, hình ảnh linh vật Ếch, tên chức danh của Ếch (`Ếch Đeo Cặp Mầm Non`, `Ếch Đội Nón Lá`, `Ếch Đeo Khăn Quàng Đỏ`, `Ếch Nhà Khai Phá`, `Ếch Thám Tử`) và nút chọn lớp.
   - Toàn bộ đoạn văn mô tả rườm rà bên dưới đã được xóa bỏ hoàn toàn.
2. **Bộ câu hỏi tiếp tục để trống (`questions: []`)**:
   - Giữ nguyên trạng thái để trống, sẵn sàng nhận file/dữ liệu thật từ người dùng mà không có câu hỏi giả.
