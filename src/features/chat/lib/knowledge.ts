export type ChatLocale = "vi" | "en";

export const AIVA_KNOWLEDGE: Record<ChatLocale, string> = {
  vi: `
## Về AIva
AIva (AIVA) là kính thông minh dành cho trẻ em 4–12 tuổi, giúp trẻ học hỏi từ thế giới thực qua giọng nói AI. Không có màn hình điện tử.

## Tính năng chính
- Không màn hình: thông tin truyền qua loa, bảo vệ thị lực trẻ
- Camera hướng ra ngoài nhận diện vật thể + microphone thu âm
- Chip ESP32-S3 tích hợp Wi-Fi và Bluetooth
- Pin LiPo 800 mAh, trọng lượng ~100g, dùng cả ngày
- Sạc đầy mất khoảng 1 giờ
- Ứng dụng đi kèm cho phụ huynh: theo dõi hoạt động, từ vựng đã học, giới hạn thời gian sử dụng

## Đặt trước (Pre-order)
- Nhấn nút "Đặt trước ngay" trên website aiva.id.vn
- Điền họ tên, email, số điện thoại
- Nhận email xác nhận; thông báo khi mở bán chính thức

## Liên hệ & Hỗ trợ
- Email: aivisionassistance@gmail.com
- Facebook: https://www.facebook.com/AIVAGlass/
- Website: https://aiva.id.vn

## Câu hỏi thường gặp
- Độ tuổi phù hợp: 4–12 tuổi
- Có màn hình không: Không
- Phụ huynh kiểm soát được: Có, qua app đi kèm
- Pin: 800 mAh, dùng cả ngày, sạc ~1 giờ
`.trim(),

  en: `
## About AIva
AIva (AIVA) are smart glasses for children aged 4–12, helping kids learn from the real world through AI voice guidance. No electronic display.

## Key features
- Screen-free: information via speakers, protects children's eyesight
- Outward-facing camera for object recognition + microphone
- ESP32-S3 chip with Wi-Fi and Bluetooth
- 800 mAh LiPo battery, ~100g weight, all-day use
- Full charge takes about 1 hour
- Companion app for parents: activity tracking, learned vocabulary, usage time limits

## Pre-order
- Click "Pre-order Now" on aiva.id.vn
- Fill in name, email, phone number
- Receive confirmation email; notified when official sales open

## Contact & Support
- Email: aivisionassistance@gmail.com
- Facebook: https://www.facebook.com/AIVAGlass/
- Website: https://aiva.id.vn

## FAQ
- Suitable age: 4–12 years old
- Has a screen: No
- Parental control: Yes, via companion app
- Battery: 800 mAh, all-day use, ~1 hour to charge
`.trim()
};

export const FAQ_PAIRS: Record<ChatLocale, { q: string; a: string }[]> = {
  vi: [
    { q: "độ tuổi", a: "AIva phù hợp với trẻ từ 4–12 tuổi." },
    { q: "màn hình", a: "AIva không có màn hình điện tử. Thông tin truyền qua loa an toàn." },
    { q: "phụ huynh", a: "Phụ huynh có thể kiểm soát qua ứng dụng đi kèm: theo dõi hoạt động, từ vựng và giới hạn thời gian." },
    { q: "pin", a: "Pin LiPo 800 mAh, dùng liên tục cả ngày. Sạc đầy mất khoảng 1 giờ." },
    { q: "đặt trước", a: 'Nhấn "Đặt trước ngay" trên website, điền thông tin liên hệ. Chúng tôi sẽ email khi mở bán.' },
    { q: "giá", a: "Giá chính thức đang được cập nhật. Vui lòng đăng ký pre-order để nhận thông báo." },
    { q: "liên hệ", a: "Email: aivisionassistance@gmail.com | Facebook: facebook.com/AIVAGlass" }
  ],
  en: [
    { q: "age", a: "AIva is designed for children aged 4–12." },
    { q: "screen", a: "AIva has no electronic display. Information is delivered through safe speakers." },
    { q: "parent", a: "Parents can control usage via the companion app: activity, vocabulary, and time limits." },
    { q: "battery", a: "800 mAh LiPo battery for all-day use. Full charge takes about 1 hour." },
    { q: "pre-order", a: 'Click "Pre-order Now" on the website and fill in your contact details.' },
    { q: "price", a: "Official pricing is being updated. Please register for pre-order to get notified." },
    { q: "contact", a: "Email: aivisionassistance@gmail.com | Facebook: facebook.com/AIVAGlass" }
  ]
};
