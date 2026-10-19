# 📝 HƯỚNG DẪN & BIỂU MẪU SOẠN BỘ CÂU HỎI AVIA QUIZ

Tài liệu này dùng để hướng dẫn Ban Biên Tập Nội Dung soạn thảo các bộ câu hỏi cho **Avia Quiz Game** theo đúng Game Design Document (GDD).

---

## 📌 1. Quy chuẩn cấu trúc câu hỏi theo GDD

Mỗi cuốn sách bao gồm các **Chương** và các **Bài học**:

1. **Quy mô mỗi Bài học:** Tối thiểu **6 câu hỏi** (hệ thống sẽ tự động bốc ngẫu nhiên 4 câu mỗi lần bé chơi).
2. **Quy mô Mốc Ôn tập Chương:** Hệ thống sẽ tự động trích xuất ngẫu nhiên **2/3 tổng số câu hỏi** của cả chương đó (ví dụ chương có 2 bài = 12 câu -> ôn tập lấy 8 câu).
3. **Định dạng câu hỏi:** Trắc nghiệm 4 lựa chọn (A, B, C, D) với duy nhất 1 đáp án đúng.
4. **3 nhóm nội dung câu hỏi bắt buộc:**
   - **Điền vào chỗ trống (`fill-blank`)**: Điền từ/số còn thiếu vào câu ca dao, tục ngữ, định nghĩa, công thức.
   - **Trả lời câu hỏi (`knowledge`)**: Hỏi đáp kiến thức bài học trong SGK.
   - **Ứng xử tình huống thực tế (`scenario`)**: Tình huống đời sống gần gũi, giáo dục nhân cách hoặc kỹ năng sống.

---

## 📊 2. Biểu mẫu Excel / Google Sheets (Khuyên dùng cho Biên tập viên)

Khi soạn thảo bằng Excel hoặc Google Sheets, hãy đặt các cột theo đúng thứ tự sau:

| Khối Lớp | Mã Môn Học | Tên Sách / Môn | Số Chương | Tên Chương         | Số Bài | Tên Bài Học                          | Dạng Câu Hỏi | Nội Dung Câu Hỏi                                                                 | Đáp Án A                           | Đáp Án B          | Đáp Án C       | Đáp Án D            | Đáp Án Đúng (A/B/C/D) | Giải Thích Ngắn (Lời nhắn của Ếch)    |
| :------: | :--------: | :------------: | :-------: | :----------------- | :----: | :----------------------------------- | :----------: | :------------------------------------------------------------------------------- | :--------------------------------- | :---------------- | :------------- | :------------------ | :-------------------: | :------------------------------------ |
|    2     |   daoduc   | Đạo đức lớp 2  |     1     | Kính trọng thầy cô |   1    | Bài 1: Kính trọng thầy giáo, cô giáo |  fill-blank  | Điền từ còn thiếu: Muốn sang thì bắc cầu kiều / Muốn con hay chữ thì yêu lấy ... | thầy                               | bạn               | sách           | trường              |           A           | Nhắc nhở lòng tôn sư trọng đạo.       |
|    2     |   daoduc   | Đạo đức lớp 2  |     1     | Kính trọng thầy cô |   1    | Bài 1: Kính trọng thầy giáo, cô giáo |   scenario   | Khi gặp cô giáo cũ ở sân trường, bé nên làm gì?                                  | Khoanh tay cúi đầu chào cô lễ phép | Giả vờ không thấy | Chạy trốn      | Đứng nhìn rồi bỏ đi |           A           | Luôn lễ phép chào hỏi thầy cô giáo.   |
|    2     |   daoduc   | Đạo đức lớp 2  |     1     | Kính trọng thầy cô |   1    | Bài 1: Kính trọng thầy giáo, cô giáo |  knowledge   | Ngày Nhà giáo Việt Nam là ngày nào?                                              | Ngày 20 tháng 11                   | Ngày 1 tháng 6    | Ngày 2 tháng 9 | Ngày 8 tháng 3      |           A           | Ngày 20/11 là ngày Nhà giáo Việt Nam. |

---

## 💻 3. Mẫu dữ liệu JSON (Dành cho Developer / Import trực tiếp)

File lưu tại: `src/features/avia-quiz/mock-data.ts` hoặc import từ file `.json`:

```json
{
  "id": "g2-daoduc",
  "grade": 2,
  "subjectKey": "daoduc",
  "title": "Đạo đức lớp 2",
  "color": "#2C5E3B",
  "badge": "Bài học yêu thương",
  "chapters": [
    {
      "id": "c1-yeu-thuong",
      "chapterNumber": 1,
      "title": "Chương 1: Kính trọng thầy cô và yêu quý bạn bè",
      "lessons": [
        {
          "id": "l1-kinh-trong-thay-co",
          "lessonNumber": 1,
          "title": "Bài 1: Kính trọng thầy giáo, cô giáo",
          "description": "Học cách chào hỏi, lắng nghe và bày tỏ lòng biết ơn thầy cô.",
          "questions": [
            {
              "id": "q1-1",
              "type": "fill-blank",
              "typeLabel": "Điền vào chỗ trống",
              "prompt": "Bé hãy điền từ còn thiếu: 'Muốn sang thì bắc cầu kiều / Muốn con hay chữ thì yêu lấy ...'",
              "options": ["thầy", "bạn", "sách", "trường"],
              "correctIndex": 0,
              "explanation": "Câu tục ngữ nhắc nhở chúng ta luôn kính trọng và yêu quý thầy cô giáo."
            }
          ]
        }
      ]
    }
  ]
}
```
