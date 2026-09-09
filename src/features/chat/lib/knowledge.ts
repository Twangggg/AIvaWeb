export type ChatLocale = "vi" | "en";

export interface KnowledgeChunk {
  id: string;
  title: string;
  keywords: string[];
  content: string;
}

export const KNOWLEDGE_CHUNKS: Record<ChatLocale, KnowledgeChunk[]> = {
  vi: [
    {
      id: "about",
      title: "Về AIva",
      keywords: ["aiva", "công ty", "startup", "thương hiệu", "giới thiệu", "sản phẩm", "là gì", "kính"],
      content:
        "AIva (AIVA) là kính thông minh dành cho trẻ em 4–12 tuổi, giúp trẻ học hỏi từ thế giới thực qua giọng nói AI. Sản phẩm không có màn hình điện tử, bảo vệ thị lực và giúp trẻ khám phá thế giới an toàn, tò mò và tự tin hơn."
    },
    {
      id: "age",
      title: "Độ tuổi phù hợp",
      keywords: ["tuổi", "độ tuổi", "age", "trẻ mấy", "phù hợp", "cho trẻ", "4", "5", "6", "7", "8", "12"],
      content: "AIva phù hợp với trẻ em từ 4 đến 12 tuổi. Đến 4 tuổi trẻ đã có thể đeo kính thoải mái; nhóm 4–12 tuổi là giai đoạn tò mò nhất về thế giới xung quanh."
    },
    {
      id: "screen",
      title: "Không màn hình",
      keywords: ["màn hình", "screen", "display", "hình ảnh", "hiển thị", "lọt mắt", "võng mạc"],
      content: "AIva hoàn toàn không có màn hình điện tử. Mọi thông tin được truyền qua loa bằng giọng nói AI, giúp bảo vệ thị lực và giảm thời gian dán mắt vào màn hình."
    },
    {
      id: "voice-ai",
      title: "Giọng nói AI",
      keywords: ["nói", "giọng", "tiếng việt", "tiếng anh", "ngôn ngữ", "trả lời", "voice", "language", "tiếng", "trò chuyện", "hỏi đáp"],
      content: "AIva trò chuyện bằng giọng nói AI, hỗ trợ tiếng Việt và tiếng Anh. Trẻ hỏi về vật thể xung quanh bằng tiếng Việt và AI sẽ trả lời phù hợp, giúp trẻ vừa khám phá vừa làm quen ngoại ngữ."
    },
    {
      id: "camera",
      title: "Camera & nhận diện",
      keywords: ["camera", "chụp", "nhận diện", "nhìn", "vật thể", "quét", "object", "vision", "thị giác", "xem"],
      content: "AIva có camera hướng ra ngoài để nhận diện vật thể xung quanh (cây, con vật, đồ vật...) và microphone thu âm câu hỏi của trẻ. AI phân tích hình ảnh và kể/trả lời bằng loa — không có màn hình."
    },
    {
      id: "esp32",
      title: "Phần cứng & kết nối",
      keywords: ["chip", "esp32", "wifi", "wi-fi", "bluetooth", "kết nối", "phần cứng", "thông số", "spec", "network", "cập nhật", "ota"],
      content: "AIva dùng chip ESP32-S3 tích hợp Wi-Fi và Bluetooth để kết nối với app phụ huynh và cập nhật phần mềm. Kính nặng khoảng 100g, nhẹ và dễ đeo cho trẻ."
    },
    {
      id: "battery",
      title: "Pin & sạc",
      keywords: ["pin", "battery", "sạc", "charge", "dùng bao lâu", "thời lượng", "bao lâu", "đầy pin", "năng lượng"],
      content: "Pin LiPo 800 mAh cho thời lượng dùng liên tục cả ngày. Sạc đầy mất khoảng 1 giờ. Kính nhẹ (~100g) nên trẻ dễ dàng đeo suốt thời gian học tập và vui chơi."
    },
    {
      id: "parent-app",
      title: "Ứng dụng phụ huynh",
      keywords: ["phụ huynh", "app", "ứng dụng", "kiểm soát", "theo dõi", "từ vựng", "giới hạn", "quản lý", "parent", "ba mẹ", "bố mẹ"],
      content: "Phụ huynh điều khiển qua ứng dụng đi kèm: theo dõi hoạt động của trẻ, xem từ vựng đã học, đặt giới hạn thời gian sử dụng và quản lý nội dung từ xa."
    },
    {
      id: "preorder",
      title: "Đặt trước",
      keywords: ["đặt trước", "preorder", "pre-order", "đặt hàng", "mua", "sớm", "đặt", "nhận", "mở bán", "buy", "reserve"],
      content: "Nhấn nút “Đặt trước ngay” trên website aiva.id.vn, điền họ tên, email và số điện thoại. Bạn sẽ nhận email xác nhận và được thông báo khi mở bán chính thức."
    },
    {
      id: "price",
      title: "Giá bán",
      keywords: ["giá", "bao nhiêu tiền", "price", "cost", "đắt", "rẻ", "chi phí", "giá bán"],
      content: "Giá chính thức của AIva đang được cập nhật và thông báo theo đợt mở bán. Đăng ký pre-order để nhận thông báo giá sớm nhất và ưu đãi đặt trước."
    },
    {
      id: "shipping",
      title: "Giao hàng & mở bán",
      keywords: ["giao", "ship", "vận chuyển", "mở bán", "ngày ra mắt", "release", "khi nào", "bao giờ", "shipping", "delivery"],
      content: "AIva mở bán theo từng đợt; người đặt trước sẽ được email thông báo và ưu tiên nhận hàng sớm nhất. Thông tin giao hàng chi tiết sẽ được gửi trực tiếp khi bạn đặt trước."
    },
    {
      id: "safety",
      title: "An toàn cho trẻ",
      keywords: ["an toàn", "bảo mật", "riêng tư", "an ninh", "sức khỏe", "privacy", "an toàn", "arc", "dữ liệu"],
      content: "AIva được thiết kế an toàn cho trẻ: không màn hình, thời lượng pin cả ngày, phụ huynh kiểm soát hoàn toàn qua app. Dữ liệu được bảo mật và chỉ phục vụ trải nghiệm học tập của trẻ."
    },
    {
      id: "contact",
      title: "Liên hệ & hỗ trợ",
      keywords: ["liên hệ", "contact", "email", "hỗ trợ", "support", "facebook", "fanpage", "hotline", "khiếu nại", "hỏi thêm"],
      content: "Liên hệ hỗ trợ: Email aivisionassistance@gmail.com | Facebook facebook.com/AIVAGlass | Website aiva.id.vn. Đội ngũ AIva sẵn sàng hỗ trợ bạn về sản phẩm, đặt trước và chăm sóc khách hàng."
    }
  ],
  en: [
    {
      id: "about",
      title: "About AIva",
      keywords: ["aiva", "company", "startup", "brand", "introduce", "product", "what is", "glasses"],
      content:
        "AIva (AIVA) are smart glasses for children aged 4–12 that help kids learn from the real world through AI voice guidance. There is no electronic display, protecting eyesight while sparking curiosity, confidence, and safe exploration."
    },
    {
      id: "age",
      title: "Suitable age",
      keywords: ["age", "old", "year", "suitable", "for kids", "for children", "3", "4", "5", "6", "12", "13"],
      content: "AIva is designed for children aged 4 to 12. Around age 4 kids can wear the glasses comfortably; ages 4–12 are when children are most curious about the world."
    },
    {
      id: "screen",
      title: "Screen-free",
      keywords: ["screen", "display", "vision", "eye", "eyesight", "image", "monitor"],
      content: "AIva has no electronic display at all. All information is delivered through speakers via AI voice, protecting children's eyesight and reducing screen time."
    },
    {
      id: "voice-ai",
      title: "AI voice",
      keywords: ["speak", "voice", "language", "vietnamese", "english", "talk", "chat", "answer", "say"],
      content: "AIva talks with an AI voice and supports Vietnamese and English. Kids can ask about objects around them in Vietnamese or English, and the AI answers in the matching language."
    },
    {
      id: "camera",
      title: "Camera & recognition",
      keywords: ["camera", "record", "recognize", "object", "scan", "look", "vision", "see"],
      content: "AIva has an outward-facing camera to recognize objects around the child (plants, animals, objects...) and a microphone to capture the child's questions. AI analyzes what it sees and replies through speakers — no display."
    },
    {
      id: "esp32",
      title: "Hardware & connectivity",
      keywords: ["chip", "esp32", "wifi", "wi-fi", "bluetooth", "connect", "hardware", "spec", "specs", "ota", "update"],
      content: "AIva runs on an ESP32-S3 chip with built-in Wi-Fi and Bluetooth to sync with the parent app and receive software updates. The glasses weigh about 100g — light and comfortable for kids."
    },
    {
      id: "battery",
      title: "Battery & charging",
      keywords: ["battery", "charge", "how long", "life", "all day", "full", "power"],
      content: "An 800 mAh LiPo battery lasts a full day of continuous use. A full charge takes about 1 hour. At ~100g the glasses are light enough for kids to wear all day."
    },
    {
      id: "parent-app",
      title: "Parent app",
      keywords: ["parent", "app", "application", "control", "track", "vocabulary", "limit", "manage", "mom", "dad"],
      content: "Parents control AIva through the companion app: track the child's activity, review learned vocabulary, set usage time limits, and manage content remotely."
    },
    {
      id: "preorder",
      title: "Pre-order",
      keywords: ["preorder", "pre-order", "order", "pre-order now", "reserve", "buy now", "purchase"],
      content: "Click 'Pre-order Now' on aiva.id.vn and fill in your name, email, and phone. You'll receive a confirmation email and be notified when official sales open."
    },
    {
      id: "price",
      title: "Pricing",
      keywords: ["price", "cost", "how much", "expensive", "cheap", "fee", "pay"],
      content: "Official pricing is being updated and announced per launch wave. Register for pre-order to get the earliest price notifications and launch offers."
    },
    {
      id: "shipping",
      title: "Shipping & launch",
      keywords: ["ship", "shipping", "delivery", "launch", "release", "when", "arrive", "backorder"],
      content: "AIva launches in waves; pre-order customers get an email notification and priority for the earliest units. Detailed shipping info is sent directly when you pre-order."
    },
    {
      id: "safety",
      title: "Child safety",
      keywords: ["safe", "safety", "secure", "privacy", "private", "data", "health"],
      content: "AIva is built to be safe for kids: no screen, all-day battery, and full parental control via the app. Data is protected and used only for the child's learning experience."
    },
    {
      id: "contact",
      title: "Contact & support",
      keywords: ["contact", "support", "email", "facebook", "hotline", "help", "question", "reach"],
      content: "Contact support: aivisionassistance@gmail.com | Facebook facebook.com/AIVAGlass | Website aiva.id.vn. The AIva team is ready to help with product, pre-order, and customer care."
    }
  ]
};

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
