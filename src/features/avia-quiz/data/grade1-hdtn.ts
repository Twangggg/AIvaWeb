import { QuizBook } from "../types";

export const GRADE_1_HDTN_BOOK: QuizBook = {
  "id": "g1-hdtn",
  "grade": 1,
  "subjectKey": "hdtn",
  "title": "Hoạt động trải nghiệm lớp 1",
  "color": "#10B981",
  "coverImage": "/mascots/bia-sach-mon-hoc.png",
  "chapters": [
    {
      "id": "c1-chao-nam-hoc-moi",
      "chapterNumber": 1,
      "title": "Chủ đề 1: Chào năm học mới",
      "lessons": [
        {
          "id": "l1-lam-quen-voi-ban-moi",
          "lessonNumber": 1,
          "title": "Bài 1: Làm quen với bạn mới",
          "description": "Kỹ năng chào hỏi và kết bạn thân thiện",
          "questions": [
            {
              "id": "g1-hdtn-c1-l1-q1",
              "type": "scenario",
              "prompt": "Ngày đầu vào lớp 1, Nam ngồi cạnh bạn mới chưa quen. Nam nên làm gì trước tiên để bắt đầu làm quen?",
              "options": [
                "Ngồi im không nói gì và quay mặt đi",
                "Mỉm cười, vẫy tay và vui vẻ nói \"Chào bạn!\"",
                "Giật lấy hộp bút của bạn",
                "Hét to vào tai bạn"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c1-l1-q2",
              "type": "scenario",
              "prompt": "Sau khi chào hỏi bạn mới, bước tiếp theo đúng nhất để hai bạn hiểu nhau hơn là gì?",
              "options": [
                "Đòi bạn cho mượn đồ chơi ngay",
                "Giới thiệu tên mình và lịch sự hỏi tên, sở thích của bạn",
                "Bỏ đi chơi với bạn khác",
                "Khoe nhà mình có nhiều tiền"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c1-l1-q3",
              "type": "scenario",
              "prompt": "Thấy bạn đang cầm cuốn sách thích xem ở thư viện, bé nên ứng xử thế nào để làm quen?",
              "options": [
                "Giật cuốn sách trên tay bạn",
                "Lại gần mỉm cười nói: \"Chào bạn, chúng mình cùng đọc nhé!\"",
                "Đứng bên cạnh chê cuốn sách dở",
                "Chen ngang vào mặt bạn để lấy sách khác"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c1-l1-q4",
              "type": "scenario",
              "prompt": "Thấy một bạn ngồi một mình rụt rè dưới gốc cây sân trường, bé nên làm gì để chủ động làm quen?",
              "options": [
                "Tiến lại gần chào hỏi, giới thiệu tên mình và rủ bạn cùng chơi",
                "Rủ các bạn khác lại trêu chọc bạn",
                "Chạy qua thật nhanh và làm rớt đồ của bạn",
                "Ngó lơ và không quan tâm"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c1-l1-q5",
              "type": "scenario",
              "prompt": "Có bạn nhỏ mới chuyển đến khu phố đứng nói: \"Nhà mình mới chuyển về đây\", em nên đáp lại thế nào?",
              "options": [
                "Đóng chặt cửa lại không tiếp chuyện",
                "Mỉm cười chào lại: \"Chào bạn, mình tên là... Chúng mình cùng chơi nhé!\"",
                "Lấy đất đá ném sang nhà bạn",
                "Nói bạn đi chỗ khác chơi"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c1-l1-q6",
              "type": "scenario",
              "prompt": "Gặp một bạn nhỏ phải ngồi trên xe lăn ở công viên, cách ứng xử thân thiện nhất là gì?",
              "options": [
                "Lại gần chào hỏi, tự giới thiệu và hỏi bạn có muốn cùng trò chuyện, chơi cùng không",
                "Chỉ tay vào xe lăn của bạn rồi cười nhạo",
                "Tự ý đẩy xe lăn của bạn đi lung tung",
                "Bỏ chạy vì thấy bạn khác biệt"
              ],
              "correctIndex": 0
            }
          ]
        },
        {
          "id": "l2-nhung-viec-nen-lam-trong-gio-hoc-gio-choi",
          "lessonNumber": 2,
          "title": "Bài 2: Những việc nên làm trong giờ học, giờ chơi",
          "description": "Nề nếp trong giờ học và vui chơi an toàn",
          "questions": [
            {
              "id": "g1-hdtn-c1-l2-q1",
              "type": "scenario",
              "prompt": "Trong giờ học, khi biết câu trả lời, em nên làm gì?",
              "options": [
                "Tự ý nói to, chen ngang khi cô đang giảng",
                "Giơ tay trật tự và chờ cô giáo gọi tên",
                "Cúi gục xuống bàn ngủ gật",
                "Quay sang nói chuyện riêng với bạn"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c1-l2-q2",
              "type": "scenario",
              "prompt": "Đến giờ ra chơi, trò chơi nào dưới đây là an toàn và nên tham gia?",
              "options": [
                "Nhảy dây, đá cầu hoặc trò chuyện vui vẻ cùng bạn",
                "Xô đẩy, đuổi bắt nhau trên cầu thang",
                "Leo trèo lên cành cây cao ở sân trường",
                "Trêu chọc, xô ngã các bạn nhỏ hơn"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c1-l2-q3",
              "type": "scenario",
              "prompt": "Bạn ngồi cạnh quay sang rủ em nói chuyện riêng trong giờ học, em nên ứng xử thế nào?",
              "options": [
                "Vui vẻ nói chuyện cùng bạn cho hết giờ",
                "Hét to giữa lớp để cô giáo phạt bạn",
                "Nói khẽ: \"Đang giờ học, tụi mình tập trung nghe cô giảng, ra chơi nói chuyện nhé!\"",
                "Bật khóc ăn vạ tại chỗ"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c1-l2-q4",
              "type": "scenario",
              "prompt": "Trong giờ ra chơi, bạn rủ em trèo lên cây hái quả, em nên làm gì?",
              "options": [
                "Trèo lên ngay cùng bạn để lấy quả",
                "Từ chối và khuyên bạn: \"Trèo cây nguy hiểm lắm, tụi mình không nên trèo nhé!\"",
                "Đứng dưới cổ vũ bạn trèo lên cao hơn",
                "Thách thức xem bạn có dám trèo không"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c1-l2-q5",
              "type": "scenario",
              "prompt": "Để không bị buồn ngủ và gục xuống bàn trong giờ học, bạn Minh nên làm gì?",
              "options": [
                "Tiếp tục ngủ vì mệt",
                "Buổi tối đi ngủ sớm, chuẩn bị bài đầy đủ và tập trung nghe giảng",
                "Mang đồ chơi vào lớp để chơi cho đỡ buồn ngủ",
                "Xin cô giáo cho nghỉ học luôn"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c1-l2-q6",
              "type": "scenario",
              "prompt": "Khi nghe tiếng chuông báo kết thúc giờ ra chơi, em nên làm gì?",
              "options": [
                "Tiếp tục ở lại sân trường đá bóng thêm một lúc",
                "Nhanh chóng vào lớp, ngồi ngay ngắn vào chỗ để học bài",
                "Đứng ngoài hành lang trêu chọc các lớp khác",
                "Chạy nhảy khắp hành lang gào tháo"
              ],
              "correctIndex": 1
            }
          ]
        }
      ]
    },
    {
      "id": "c2-em-biet-yeu-thuong",
      "chapterNumber": 2,
      "title": "Chủ đề 2: Em biết yêu thương",
      "lessons": [
        {
          "id": "l3-cam-xuc-cua-em",
          "lessonNumber": 3,
          "title": "Bài 3: Cảm xúc của em",
          "description": "Nhận biết và thể hiện cảm xúc tích cực",
          "questions": [
            {
              "id": "g1-hdtn-c2-l3-q1",
              "type": "scenario",
              "prompt": "Đạt điểm tốt và được bố mẹ khen \"Con giỏi lắm!\", em cảm thấy thế nào?",
              "options": [
                "Tức giận và khó chịu",
                "Vui mừng, hạnh phúc và tự hào",
                "Lo sợ và bật khóc",
                "Buồn bã và thất vọng"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c2-l3-q2",
              "type": "scenario",
              "prompt": "Muốn chơi cùng nhưng bạn lại nói \"Tớ không chơi với cậu!\", em cảm thấy thế nào?",
              "options": [
                "Buồn bã và hụt hẫng",
                "Vui vẻ và thích thú",
                "Ngạc nhiên và buồn cười",
                "Hãnh hãnh và tự tin"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c2-l3-q3",
              "type": "scenario",
              "prompt": "Được tặng món quà dễ thương nhân ngày sinh nhật, em nên thể hiện cảm xúc thế nào?",
              "options": [
                "Nhận bằng hai tay, mỉm cười và nói lời cảm ơn",
                "Vứt món quà xuống đất vì không thích",
                "Tỏ thái độ nhăn nhó, khó chịu",
                "Lặng lẽ cầm lấy quà rồi quay lưng đi ngay"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c2-l3-q4",
              "type": "scenario",
              "prompt": "Được cô giáo khen trước lớp vì học tập tiến bộ, em nên làm gì?",
              "options": [
                "Hét to giữa lớp để khoe khoang",
                "Mỉm cười lễ phép, cảm ơn cô và hứa tiếp tục cố gắng",
                "Cúi gục mặt xuống bàn vì bực bội",
                "Tỏ ra coi thường các bạn khác"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c2-l3-q5",
              "type": "scenario",
              "prompt": "Chạy ra reo lên \"A! Bố mẹ đã về!\" khi thấy bố mẹ đi làm về thể hiện cảm xúc gì?",
              "options": [
                "Sợ hãi vì bị mắng",
                "Vui mừng, yêu thương và háo hức đón chào người thân",
                "Tức giận vì bố mẹ về muộn",
                "Thờ ơ, không quan tâm"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c2-l3-q6",
              "type": "scenario",
              "prompt": "Khi trao quà quyên góp ủng hộ các bạn nhỏ khó khăn, em cảm thấy thế nào?",
              "options": [
                "Tiếc nuối và ấm ức",
                "Vui vẻ và hạnh phúc vì biết chia sẻ, giúp đỡ người khác",
                "Thấy mình xui xẻo",
                "Bắt buộc làm nên thấy khó chịu"
              ],
              "correctIndex": 1
            }
          ]
        },
        {
          "id": "l4-yeu-thuong-con-nguoi",
          "lessonNumber": 4,
          "title": "Bài 4: Yêu thương con người",
          "description": "Quan tâm và giúp đỡ những người xung quanh",
          "questions": [
            {
              "id": "g1-hdtn-c2-l4-q1",
              "type": "scenario",
              "prompt": "Thấy một bạn nhỏ bị ngã đau ngồi khóc ở sân trường, em nên làm gì?",
              "options": [
                "Đứng nhìn và cười nhạo bạn",
                "Đỡ bạn đứng dậy và ân cần hỏi: \"Em có đau không?\"",
                "Bỏ đi chơi tiếp như không có gì",
                "Trêu chọc làm bạn khóc to hơn"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c2-l4-q2",
              "type": "scenario",
              "prompt": "Thấy ông bà mệt mỏi, em nên làm gì để thể hiện sự quan tâm?",
              "options": [
                "Rót ly nước ấm mời ông bà và đấm lưng, bóp vai",
                "Mở tivi thật to để chơi game",
                "Cãi nhau, gào tháo gây ồn ào",
                "Đòi ông bà dắt đi chơi ngay"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c2-l4-q3",
              "type": "scenario",
              "prompt": "Thấy bác bán hàng rong vô tình làm đổ sọt trái cây ra đường, em nên làm gì?",
              "options": [
                "Chạy lại nhặt giúp bác và xếp lại trái cây",
                "Đứng chỉ tay và chế giễu bác",
                "Lấy một quả rồi chạy mất",
                "Ngó lơ và thản nhiên bước qua"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c2-l4-q4",
              "type": "scenario",
              "prompt": "Nhân ngày 20-10, em nên làm gì để thể hiện tình cảm với bà, mẹ và cô giáo?",
              "options": [
                "Đòi mẹ mua quà đắt tiền cho mình",
                "Tự tay làm tấm thiệp nhỏ, múa hát hoặc chúc những lời yêu thương",
                "Giận dỗi không chịu đi học",
                "Không quan tâm vì cho rằng mình còn nhỏ"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c2-l4-q5",
              "type": "scenario",
              "prompt": "Bạn trong lớp bị đau chân phải bó bột đi lại khó khăn, em nên làm gì?",
              "options": [
                "Giấu chiếc nạng của bạn đi để chọc phá",
                "Bỏ mặc bạn ngồi một mình trong lớp",
                "Hỏi thăm \"Bạn đau lắm không?\" và giúp bạn lấy sách vở, di chuyển",
                "Rủ bạn chạy nhảy thi đua"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c2-l4-q6",
              "type": "scenario",
              "prompt": "Thấy người đi xe lăn đánh rơi chiếc mũ xuống đất, em nên làm gì?",
              "options": [
                "Nhặt giúp chiếc mũ lên và vui vẻ đưa lại cho người đó",
                "Đá chiếc mũ đi xa hơn",
                "Cười to rồi bỏ chạy",
                "Không quan tâm vì không phải người quen"
              ],
              "correctIndex": 0
            }
          ]
        }
      ]
    },
    {
      "id": "c3-truyen-thong-truong-em",
      "chapterNumber": 3,
      "title": "Chủ đề 3: Truyền thống trường em",
      "lessons": [
        {
          "id": "l5-than-thien-voi-ban-be",
          "lessonNumber": 5,
          "title": "Bài 5: Thân thiện với bạn bè",
          "description": "Gắn kết và sẻ chia cùng bạn bè",
          "questions": [
            {
              "id": "g1-hdtn-c3-l5-q1",
              "type": "scenario",
              "prompt": "Thấy bạn ngồi đọc sách một mình ở góc thư viện, hành động nào thể hiện sự thân thiện?",
              "options": [
                "Giật lấy cuốn sách bạn đang đọc",
                "Lại gần, vui vẻ ngồi cùng và cùng bạn đọc sách",
                "Cản không cho bạn đọc sách",
                "Cãi nhau để giành vị trí ngồi"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l5-q2",
              "type": "scenario",
              "prompt": "Thấy bạn lỡ làm rơi hộp bút hoặc đang ngồi khóc, em KHÔNG NÊN làm điều nào?",
              "options": [
                "Đứng xung quanh chỉ tay trêu chọc: \"Ê, khóc nhè!\"",
                "Lại gần ân cần hỏi thăm xem bạn có chuyện gì",
                "Giúp bạn nhặt lại bút rơi gọn gàng",
                "Rủ bạn cùng chơi cho bớt buồn"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c3-l5-q3",
              "type": "scenario",
              "prompt": "Bước vào lớp thấy bạn gục đầu xuống bàn khóc nức nở, em nên làm gì?",
              "options": [
                "Cười to và gọi các bạn khác lại xem",
                "Lại gần động viên, hỏi thăm lý do và an ủi bạn",
                "Thản nhiên đi chỗ khác chơi",
                "Lấy cặp sách của bạn giấu đi"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l5-q4",
              "type": "scenario",
              "prompt": "Thấy bạn bị trượt chân ngã đau ngoài sân trường, sách vở rơi vãi, em nên làm gì?",
              "options": [
                "Nhanh chóng đỡ bạn dậy, hỏi thăm và nhặt sách vở giúp bạn",
                "Bỏ chạy thật nhanh vì sợ bị liên lụy",
                "Đứng chỉ tay cười nhạo bạn bị ngã",
                "Đẩy bạn ngã thêm lần nữa"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c3-l5-q5",
              "type": "scenario",
              "prompt": "Bạn ngồi cùng bàn bị ốm phải nghỉ học mấy ngày, em nên làm gì để thể hiện sự quan tâm?",
              "options": [
                "Vui mừng vì được ngồi một mình rộng rãi",
                "Hỏi thăm sức khỏe và giúp bạn chép bài đầy đủ",
                "Quên luôn bạn và không quan tâm",
                "Nói xấu bạn với các bạn khác trong lớp"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l5-q6",
              "type": "scenario",
              "prompt": "Đến ngày sinh nhật của bạn trong lớp, em nên làm gì để thể hiện tình bạn thân thiết?",
              "options": [
                "Tự tay làm tấm thiệp nhỏ ghi lời chúc mừng gửi tặng bạn",
                "Giận dỗi vì bạn không chia kẹo cho mình",
                "Đòi bạn phải tặng quà ngược lại cho mình",
                "Bĩu môi chê bai sinh nhật của bạn"
              ],
              "correctIndex": 0
            }
          ]
        },
        {
          "id": "l6-thuc-hien-nam-dieu-bac-ho-day",
          "lessonNumber": 6,
          "title": "Bài 6: Thực hiện Năm điều Bác Hồ dạy",
          "description": "Rèn luyện phẩm chất thiếu niên nhi đồng",
          "questions": [
            {
              "id": "g1-hdtn-c3-l6-q1",
              "type": "scenario",
              "prompt": "Học xong bài, Mai lau bàn học và giúp mẹ quét nhà. Mai đã thực hiện đúng điều nào Bác Hồ dạy?",
              "options": [
                "Yêu Tổ quốc, yêu đồng bào",
                "Học tập tốt, lao động tốt",
                "Khiêm tốn, thật thà, dũng cảm",
                "Giữ gìn vệ sinh thật tốt"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l6-q2",
              "type": "scenario",
              "prompt": "Vô tình làm vỡ đĩa hoa quả của mẹ, Nam nên làm gì để thể hiện sự thật thà và dũng cảm?",
              "options": [
                "Trốn vào phòng và đổ lỗi cho con mèo",
                "Chủ động xin lỗi mẹ và nhận lỗi do mình vô ý",
                "Quét mảnh vỡ giấu dưới gầm giường",
                "Bật khóc ăn vạ và mắng mẹ"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l6-q3",
              "type": "scenario",
              "prompt": "Nhặt được tờ tiền ai đó đánh rơi ở hành lang, em nên làm gì cho đúng lời Bác dạy?",
              "options": [
                "Nhặt lấy bỏ vào cặp làm của riêng",
                "Nhặt lên mang nộp cho thầy cô giáo hoặc bảo vệ để trả lại người mất",
                "Lấy tiền mua kẹo chia cho các bạn",
                "Lấy chân giẫm lên giấu đi"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l6-q4",
              "type": "scenario",
              "prompt": "Buổi sáng mùa đông trời lạnh, mẹ bảo rửa mặt và vệ sinh cá nhân, em nên làm gì?",
              "options": [
                "Nhăn nhó: \"Trời lạnh lắm, con không rửa đâu!\"",
                "Vui vẻ làm theo lời mẹ, tự giác rửa mặt, đánh răng sạch sẽ",
                "Giả vờ vào nhà tắm rồi đi ra không rửa",
                "Bật khóc giận dỗi mẹ"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l6-q5",
              "type": "scenario",
              "prompt": "Đi tham quan công viên, hành động nào thể hiện \"Giữ gìn vệ sinh thật tốt\"?",
              "options": [
                "Nhặt rác xung quanh bỏ vào thùng rác quy định",
                "Thản nhiên vứt vỏ bánh kẹo ra thảm cỏ",
                "Ngắt hoa, bẻ cành cây cảnh",
                "Khắc tên mình lên tường di tích"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c3-l6-q6",
              "type": "scenario",
              "prompt": "Trong giờ thảo luận nhóm, em nên làm gì để thể hiện \"Đoàn kết tốt, kỷ luật tốt\"?",
              "options": [
                "Lắng nghe ý kiến của bạn và cùng hợp tác hoàn thành nhiệm vụ",
                "Cãi nhau và tranh giành đồ dùng với bạn",
                "Không tham gia và quay sang trêu nhóm khác",
                "Bắt các bạn phải làm theo ý mình"
              ],
              "correctIndex": 0
            }
          ]
        },
        {
          "id": "l7-kinh-yeu-thay-co",
          "lessonNumber": 7,
          "title": "Bài 7: Kính yêu thầy cô",
          "description": "Biết ơn và lễ phép với thầy cô giáo",
          "questions": [
            {
              "id": "g1-hdtn-c3-l7-q1",
              "type": "scenario",
              "prompt": "Hằng ngày thầy cô dạy em học, hướng dẫn múa hát và động viên em vì mục đích gì?",
              "options": [
                "Vì muốn phạt em",
                "Vì yêu thương, chăm sóc và mong muốn em tiến bộ từng ngày",
                "Vì bị bắt buộc",
                "Vì thầy cô muốn em ngồi yên một chỗ"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l7-q2",
              "type": "scenario",
              "prompt": "Khi được thầy cô an ủi và tận tình giảng lại bài khó, em nên làm gì?",
              "options": [
                "Giận dỗi và không học nữa",
                "Bật khóc ăn vạ tại chỗ",
                "Cảm ơn thầy cô và chú ý lắng nghe để làm tốt hơn",
                "Quay mặt đi chỗ khác"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c3-l7-q3",
              "type": "scenario",
              "prompt": "Nhìn thấy cô giáo chủ nhiệm đi từ xa tới ở sân trường, em nên chào hỏi thế nào?",
              "options": [
                "Giả vờ không thấy và chạy đi chơi tiếp",
                "Dừng lại, đứng ngay ngắn, mỉm cười và khoanh tay chào: \"Em chào cô ạ!\"",
                "Chỉ tay về phía cô rồi gọi to tên cô",
                "Chờ cô giáo chào mình trước rồi mới đáp lại"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l7-q4",
              "type": "scenario",
              "prompt": "Thấy cô giáo đang bê một chồng sách vở rất dày và nặng, em nên làm gì?",
              "options": [
                "Chủ động lại gần lễ phép hỏi: \"Cô ơi, để em bê giúp cô ạ!\"",
                "Đứng nhìn rồi bàn tán với bạn",
                "Chạy qua thật nhanh làm đụng trúng cô",
                "Bỏ đi chỗ khác vì không phải việc của mình"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c3-l7-q5",
              "type": "scenario",
              "prompt": "Nhân ngày 20-11, hành động nào ý nghĩa nhất để thể hiện tình cảm với thầy cô?",
              "options": [
                "Đòi bố mẹ mua quà đắt tiền đem tặng",
                "Tự tay vẽ tranh, làm thiệp chúc mừng hoặc dán báo tường tri ân",
                "Không quan tâm vì cho rằng đó là ngày nghỉ",
                "Giận dỗi không chịu đến trường"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c3-l7-q6",
              "type": "scenario",
              "prompt": "Cách tốt nhất để thể hiện lòng kính yêu và biết ơn thầy cô hằng ngày là gì?",
              "options": [
                "Chăm chỉ học tập, ngoan ngoãn chấp hành nội quy và làm theo lời thầy cô dạy",
                "Chỉ ngoan khi có mặt thầy cô, khi thầy cô đi khỏi thì quậy phá",
                "Mang đồ chơi vào lớp trong giờ học",
                "Cãi lời thầy cô khi bị nhắc nhở"
              ],
              "correctIndex": 0
            }
          ]
        }
      ]
    },
    {
      "id": "c4-an-toan-cho-em",
      "chapterNumber": 4,
      "title": "Chủ đề 4: An toàn cho em",
      "lessons": [
        {
          "id": "l8-an-toan-khi-vui-choi",
          "lessonNumber": 8,
          "title": "Bài 8: An toàn khi vui chơi",
          "description": "Phòng tránh tai nạn thương tích khi vui chơi",
          "questions": [
            {
              "id": "g1-hdtn-c4-l8-q1",
              "type": "scenario",
              "prompt": "Trong giờ ra chơi ở trường, em và các bạn nên chọn trò chơi nào để vừa vui vừa an toàn?",
              "options": [
                "Đá cầu, nhảy dây hoặc xô đẩy nhau ở cầu thang",
                "Nhảy dây, kéo co hoặc đá bóng đúng nơi quy định",
                "Trèo lên cây cao hái quả",
                "Leo trèo lên cửa sổ lớp học"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c4-l8-q2",
              "type": "scenario",
              "prompt": "Hành vi nào khi vui chơi tại trường hoặc ở nhà là KHÔNG an toàn, dễ gây chấn thương?",
              "options": [
                "Chơi trốn tìm ở sân trường bằng phẳng",
                "Chơi kéo co trên bãi cỏ",
                "Đuổi bắt, xô đẩy nhau ở hành lang hẹp hoặc trèo cây cao",
                "Ngồi đọc truyện tranh cùng bạn ở ghế đá"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c4-l8-q3",
              "type": "scenario",
              "prompt": "Bạn rủ \"Chúng mình chơi đốt lửa đi!\" hoặc \"Trèo cây hái quả đi!\", em nên khuyên bạn thế nào?",
              "options": [
                "Đồng ý ngay vì thấy trò chơi thú vị",
                "Khuyên bạn: \"Đốt lửa dễ gây cháy, trèo cây dễ ngã đau lắm, tụi mình không chơi đâu!\"",
                "Đứng ngoài xem và cổ vũ bạn trèo cao hơn",
                "Đi tìm thêm củi cho bạn đốt lửa"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c4-l8-q4",
              "type": "scenario",
              "prompt": "Bạn rủ \"Chúng mình ra ao lội nước đi!\" hoặc định trêu chó lạ, em nên làm gì?",
              "options": [
                "Ngăn bạn lại: \"Ra ao dễ bị đuối nước, trêu chó bị cắn nguy hiểm lắm!\"",
                "Nhảy xuống ao lội nước cùng bạn",
                "Cầm gậy trêu con chó cùng bạn",
                "Thách thức xem bạn có dám nhảy xuống nước không"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c4-l8-q5",
              "type": "scenario",
              "prompt": "Thấy bạn rủ chơi ném đá, dùng súng đạn nhựa hoặc chạy qua đường, em nên ứng xử thế nào?",
              "options": [
                "Tham gia chơi cùng vì sợ bạn nghỉ chơi",
                "Từ chối tham gia, khuyên bạn dừng lại và báo người lớn",
                "Đứng xem và quay video",
                "Mua thêm đạn nhựa cho các bạn chơi"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c4-l8-q6",
              "type": "scenario",
              "prompt": "Để bảo vệ bản thân và các bạn luôn vui chơi an toàn ở trường, em nên làm gì?",
              "options": [
                "Chọn trò chơi lành mạnh, tuân thủ quy định và từ chối trò chơi nguy hiểm",
                "Mang dao kéo hoặc vật sắc nhọn vào trường làm đồ chơi",
                "Xô ngã bạn khi chơi trò chơi dân gian",
                "Chạy thật nhanh trong hành lang lớp học"
              ],
              "correctIndex": 0
            }
          ]
        },
        {
          "id": "l9-phong-tranh-bi-bat-nat",
          "lessonNumber": 9,
          "title": "Bài 9: Phòng tránh bị bắt nạt",
          "description": "Kỹ năng tự vệ và tìm kiếm sự trợ giúp",
          "questions": [
            {
              "id": "g1-hdtn-c4-l9-q1",
              "type": "scenario",
              "prompt": "Hành vi nào dưới đây được coi là hành động bắt nạt?",
              "options": [
                "Cùng bạn đọc sách và trò chuyện vui vẻ",
                "Tự ý cướp giật hộp bút, gọi bạn bằng tên xấu hoặc xô đẩy bạn",
                "Giúp bạn nhặt lại cặp sách bị rơi",
                "Mời bạn cùng chơi trò chơi dân gian"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c4-l9-q2",
              "type": "scenario",
              "prompt": "Khi bị trêu chọc, giật đồ dùng hoặc bị cô lập, bạn đó thường cảm thấy thế nào?",
              "options": [
                "Vui vẻ và thích thú",
                "Tự hào và hãnh diện",
                "Sợ hãi, buồn bã và tổn thương",
                "Bình tĩnh và không quan tâm"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c4-l9-q3",
              "type": "scenario",
              "prompt": "Khi bị bạn lớn hơn dọa nạt hoặc định đánh, thái độ nào dưới đây là đúng đắn nhất?",
              "options": [
                "Đứng yên chịu đựng và gục đầu khóc",
                "Nhìn thẳng vào mắt bạn, nói to: \"Dừng lại!\" hoặc \"Bỏ tay ra!\"",
                "Hùa theo và mắng chửi lại bạn",
                "Thách thức bạn đánh mình"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c4-l9-q4",
              "type": "scenario",
              "prompt": "Nếu bạn xấu vẫn tiếp tục đe dọa, đòi lấy đồ hoặc đánh em, em nên làm gì?",
              "options": [
                "Báo ngay cho thầy cô, bảo vệ hoặc hô to: \"Giúp cháu với!\"",
                "Giấu giếm không dám kể với ai vì sợ trả thù",
                "Bỏ học không đi học nữa",
                "Mua đồ chơi đắt tiền cho bạn để xin hòa"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c4-l9-q5",
              "type": "scenario",
              "prompt": "Thấy một bạn trong lớp đang bị nhóm bạn khác vây quanh trêu chọc và giật hộp bút, em nên làm gì?",
              "options": [
                "Đứng xem và cổ vũ nhóm bạn bắt nạt",
                "Nói: \"Các cậu dừng lại!\" và nhanh chóng đi báo thầy cô",
                "Bỏ chạy đi chỗ khác coi như không biết",
                "Cười nhạo bạn bị bắt nạt"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c4-l9-q6",
              "type": "scenario",
              "prompt": "Để phòng tránh bị bắt nạt và tạo môi trường học tập an toàn, em nên làm gì?",
              "options": [
                "Cư xử thân thiện, đoàn kết, di chuyển cùng nhóm bạn và tìm sự trợ giúp khi cần",
                "Thường xuyên đi một mình ở nơi vắng vẻ",
                "Đi bắt nạt các bạn nhỏ hơn để tỏ ra mạnh mẽ",
                "Im lặng khi thấy hành vi bạo lực xảy ra"
              ],
              "correctIndex": 0
            }
          ]
        },
        {
          "id": "l10-su-dung-an-toan-do-dung-trong-gia-dinh",
          "lessonNumber": 10,
          "title": "Bài 10: Sử dụng an toàn đồ dùng trong gia đình",
          "description": "Phòng ngừa bỏng, giật điện và tai nạn tại nhà",
          "questions": [
            {
              "id": "g1-hdtn-c4-l10-q1",
              "type": "scenario",
              "prompt": "Khi tay đang ướt, em KHÔNG NÊN làm hành động nào để tránh bị điện giật?",
              "options": [
                "Lau khô tay bằng khăn sạch rồi mới chạm vào đồ dùng",
                "Trực tiếp cắm phích cắm hoặc bấm bật/tắt ổ cắm điện",
                "Nhờ người lớn trong nhà bật giúp thiết bị điện",
                "Đứng xa ổ cắm điện"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c4-l10-q2",
              "type": "scenario",
              "prompt": "Khi giúp bố mẹ cất dọn bếp, đối với dao, kéo sắc nhọn, em nên làm gì để an toàn?",
              "options": [
                "Cầm kéo chạy nhảy đùa giỡn trong nhà",
                "Cầm vào lưỡi dao sắc nhọn để chuyền cho người khác",
                "Cầm vào cán cẩn thận, dùng xong cất vào giá/hộp đựng theo hướng dẫn của người lớn",
                "Vứt dao kéo lung tung trên sàn nhà"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c4-l10-q3",
              "type": "scenario",
              "prompt": "Thấy ấm nước trên bếp đang sôi hoặc phích nước nóng, hành động nào nguy hiểm cần tránh?",
              "options": [
                "Tránh xa khu vực bếp nấu và phích nước nóng",
                "Tự ý thò tay vặn nắp ấm nước sôi hoặc với lấy phích nước",
                "Báo cho người lớn đến rót nước giúp",
                "Không chạm vào các đồ vật đang nóng"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c4-l10-q4",
              "type": "scenario",
              "prompt": "Thò ngón tay vào bên trong lồng quạt khi quạt đang quay có thể dẫn đến hậu quả gì?",
              "options": [
                "Làm quạt quay nhanh hơn",
                "Bị cánh quạt chém trúng làm bị thương và đau tay",
                "Giúp phòng mát hơn",
                "Không gây ảnh hưởng gì"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c4-l10-q5",
              "type": "scenario",
              "prompt": "Muốn giúp bố mẹ dọn dẹp, em nên chọn dụng cụ nào phù hợp với lớp 1?",
              "options": [
                "Dùng chổi nhỏ, khăn lau mềm nhẹ nhàng dọn dẹp vừa sức",
                "Bê các vật nặng bằng thủy tinh dễ vỡ",
                "Tự ý bật cắm máy hút bụi lớn khi không có người lớn",
                "Dùng dao to để gọt hoa quả"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c4-l10-q6",
              "type": "scenario",
              "prompt": "Dùng xong đồ chơi, sách vở hay dụng cụ học tập, em nên làm gì để nhà cửa ngăn nắp, an toàn?",
              "options": [
                "Vứt lung tung ra sàn nhà làm người khác dễ vấp ngã",
                "Sắp xếp và cất gọn gàng vào đúng nơi quy định",
                "Cất hết đồ lên vị trí quá cao tầm với",
                "Đẩy hết đồ xuống gầm giường"
              ],
              "correctIndex": 1
            }
          ]
        }
      ]
    },
    {
      "id": "c5-em-quy-trong-ban-than",
      "chapterNumber": 5,
      "title": "Chủ đề 5: Em quý trọng bản thân",
      "lessons": [
        {
          "id": "l11-chan-dung-cua-em",
          "lessonNumber": 11,
          "title": "Bài 11: Chân dung của em",
          "description": "Yêu quý nét riêng và tôn trọng sự khác biệt",
          "questions": [
            {
              "id": "g1-hdtn-c5-l11-q1",
              "type": "scenario",
              "prompt": "Thấy mình có mái tóc xoăn tự nhiên hoặc nụ cười rất tươi, thái độ đúng đắn nhất của em là gì?",
              "options": [
                "Cảm thấy xấu hổ và tự ti",
                "Yêu quý, tự hào về đặc điểm riêng của mình và vui vẻ với bạn",
                "Giận dỗi bố mẹ vì không giống các bạn khác",
                "Tìm cách che giấu khuôn mặt mình"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l11-q2",
              "type": "scenario",
              "prompt": "Mỗi bạn trong lớp đều có vẻ ngoài khác nhau, em nên có thái độ như thế nào?",
              "options": [
                "Tôn trọng sự khác biệt và luôn tìm ra những nét đáng yêu của bạn",
                "Đặt biệt danh xấu để trêu chọc bạn",
                "Chỉ chơi với những bạn có vẻ ngoài giống mình",
                "Bĩu môi chê bai làn da hoặc chiều cao của bạn"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c5-l11-q3",
              "type": "scenario",
              "prompt": "Bạn Lan buồn bã nói: \"Da mình không trắng, xấu quá!\", em nên nói lời động viên nào?",
              "options": [
                "\"Đúng rồi, da cậu đen thật đấy!\"",
                "\"Cậu đừng buồn, làn da khỏe xắn và nụ cười của cậu rất đáng yêu mà!\"",
                "\"Cậu đi chỗ khác chơi đi.\"",
                "\"Tớ cũng thấy cậu xấu.\""
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l11-q4",
              "type": "scenario",
              "prompt": "Bạn Nam buồn vì phải đeo máy trợ thính do bị nặng tai, em sẽ ứng xử thế nào?",
              "options": [
                "Cười nhạo và trêu chọc bạn",
                "Lại gần động viên: \"Cậu đừng buồn, nhờ có máy tụi mình lại trò chuyện vui vẻ nè!\"",
                "Bỏ đi không chơi với bạn nữa",
                "Cố tình nói thật nhỏ để bạn không nghe thấy rồi cười"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l11-q5",
              "type": "scenario",
              "prompt": "Để bản thân luôn sạch sẽ, đáng yêu khi đến trường, em nên thực hiện thói quen nào?",
              "options": [
                "Rửa mặt, chải tóc gọn gàng, mặc quần áo sạch sẽ trước khi đi học",
                "Để mặt mũi lem luốc, tóc tai bù xù đi học",
                "Mặc quần áo bẩn đã mặc từ nhiều ngày trước",
                "Không chịu tắm rửa vì sợ tốn nước"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c5-l11-q6",
              "type": "scenario",
              "prompt": "Thể hiện tình cảm thế nào đối với nét đẹp của người thân để đem lại niềm vui cho gia đình?",
              "options": [
                "Ngượng ngùng không bao giờ khen ai",
                "Khen ngợi tích cực như: \"Em thích nụ cười của chị!\" hoặc \"Bố có bàn tay ấm áp!\"",
                "Chỉ tập trung chê bai điểm chưa đẹp của mọi người",
                "Thờ ơ không quan tâm đến người thân"
              ],
              "correctIndex": 1
            }
          ]
        },
        {
          "id": "l12-giu-ve-sinh-ca-nhan",
          "lessonNumber": 12,
          "title": "Bài 12: Giữ vệ sinh cá nhân",
          "description": "Thói quen rửa mặt, đánh răng và giữ thân thể sạch sẽ",
          "questions": [
            {
              "id": "g1-hdtn-c5-l12-q1",
              "type": "scenario",
              "prompt": "Sau khi hứng nước sạch và làm ướt khăn, bước tiếp theo để rửa mặt đúng cách là gì?",
              "options": [
                "Vắt khô khăn ngay mà không lau mặt",
                "Dùng khăn lau nhẹ hai mắt, rồi lau sống mũi, miệng và mặt",
                "Cọ xát khăn thật mạnh vào mắt",
                "Vứt khăn xuống sàn nhà"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l12-q2",
              "type": "scenario",
              "prompt": "Để bảo vệ răng miệng không bị sâu, em nên duy trì thói quen đánh răng khi nào?",
              "options": [
                "Chỉ đánh răng khi bị đau răng",
                "Ăn kẹo ngọt ban đêm rồi đi ngủ ngay",
                "Đánh răng ít nhất 2 lần/ngày: Buổi sáng sau khi ngủ dậy và buổi tối trước khi đi ngủ",
                "Một tuần mới đánh răng một lần"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c5-l12-q3",
              "type": "scenario",
              "prompt": "Hành vi nào thể hiện em đã biết tự giác giữ vệ sinh cá nhân?",
              "options": [
                "Đợi bố mẹ nhắc nhở nhiều lần mới chịu rửa tay, rửa mặt",
                "Chủ động tắm gội, cắt móng tay móng chân và giữ chân tay sạch sẽ",
                "Ngủ dậy không chải tóc, để nguyên mặt bẩn đi học",
                "Dùng tay bẩn để bốc đồ ăn"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l12-q4",
              "type": "scenario",
              "prompt": "Thấy bạn đá bóng xong định ăn bánh khi tay dính đầy đất cát, em nên khuyên bạn thế nào?",
              "options": [
                "\"Cậu cứ ăn đi không sao đâu!\"",
                "\"Tay cậu đang bẩn đấy, tụi mình đi rửa tay bằng xà phòng rồi hãy ăn nhé!\"",
                "Giật lấy cái bánh ăn mất",
                "Đứng nhìn bạn ăn rồi cười"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l12-q5",
              "type": "scenario",
              "prompt": "Quần áo bị bẩn và bám đầy mồ hôi sau giờ thể dục, em nên làm gì?",
              "options": [
                "Tiếp tục mặc bộ quần áo bẩn đó đi ngủ",
                "Thay quần áo sạch mới và để quần áo bẩn vào giỏ đồ giặt gọn gàng",
                "Cất quần áo bẩn vào tủ chung với quần áo sạch",
                "Vứt quần áo bẩn ra giữa sàn phòng khách"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l12-q6",
              "type": "scenario",
              "prompt": "Móng tay dài và bám vệt đen bẩn, em nên làm gì để giữ vệ sinh an toàn?",
              "options": [
                "Dùng răng cắn móng tay cho ngắn bớt",
                "Nhờ bố mẹ hoặc người lớn cắt tỉa móng tay và rửa sạch tay bằng xà phòng",
                "Dùng dao nhọn tự gọt móng tay một mình",
                "Mặc kệ móng tay bẩn để tiếp tục bốc đồ ăn"
              ],
              "correctIndex": 1
            }
          ]
        },
        {
          "id": "l13-an-uong-hop-li",
          "lessonNumber": 13,
          "title": "Bài 13: Ăn uống hợp lí",
          "description": "Chế độ dinh dưỡng và thói quen ăn uống lành mạnh",
          "questions": [
            {
              "id": "g1-hdtn-c5-l13-q1",
              "type": "scenario",
              "prompt": "Thói quen ăn uống nào dưới đây là ăn uống hợp lý?",
              "options": [
                "Ăn đúng bữa, ăn đủ chất (rau, thịt, cá, cơm) và không ăn quá no",
                "Bỏ bữa sáng, đợi đến trưa mới ăn thật nhiều",
                "Chỉ ăn thịt, đồ chiên rán, không chịu ăn rau xanh",
                "Vừa ăn cơm vừa xem tivi hoặc chơi điện thoại"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c5-l13-q2",
              "type": "scenario",
              "prompt": "Để đảm bảo an toàn và tốt cho sức khỏe, em nên ưu tiên chọn loại nước uống nào?",
              "options": [
                "Nước ngọt có gas đóng chai",
                "Nước đun sôi để nguội hoặc nước lọc an toàn",
                "Nước đá lạnh lề đường không rõ nguồn gốc",
                "Nước lã lấy trực tiếp từ vòi chưa đun"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l13-q3",
              "type": "scenario",
              "prompt": "Bạn Nam chỉ thích uống nước ngọt, ăn đồ chiên rán và không ăn rau quả. Thói quen này dẫn đến hậu quả gì?",
              "options": [
                "Giúp Nam thông minh hơn",
                "Dễ gây béo phì, đau bụng, táo bón và thiếu chất dinh dưỡng",
                "Giúp răng Nam chắc khỏe hơn",
                "Không ảnh hưởng gì đến sức khỏe"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l13-q4",
              "type": "scenario",
              "prompt": "Ăn quá no vào bữa tối trước khi đi ngủ sẽ làm em thế nào?",
              "options": [
                "Cảm thấy đầy bụng, khó chịu và khó ngủ",
                "Ngủ ngon hơn",
                "Chạy nhanh hơn vào ngày hôm sau",
                "Giúp cơ thể tiêu hóa tốt hơn"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c5-l13-q5",
              "type": "scenario",
              "prompt": "Khi cùng bố mẹ đi chợ/siêu thị, em nên giúp bố mẹ chọn loại thực phẩm nào?",
              "options": [
                "Thực phẩm tươi sống, rau củ tươi xanh và quả chín đảm bảo vệ sinh",
                "Đồ ăn đã ôi thiu, dập nát vì giá rẻ",
                "Chỉ mua bánh kẹo và bim bim về ăn thay cơm",
                "Thực phẩm cất giữ lâu ngày đã biến màu"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c5-l13-q6",
              "type": "scenario",
              "prompt": "Để bữa ăn vừa ngon miệng vừa đảm bảo vệ sinh, hành động nào dưới đây là đúng?",
              "options": [
                "Rửa tay sạch sẽ bằng xà phòng trước khi ăn",
                "Cầm nguyên tay bẩn để bốc thức ăn",
                "Vừa ăn vừa ngấu nghiến, nhai không kỹ",
                "Dùng tay bẩn bốc thức ăn vào bát người khác"
              ],
              "correctIndex": 0
            }
          ]
        },
        {
          "id": "l14-su-dung-trang-phuc-hang-ngay",
          "lessonNumber": 14,
          "title": "Bài 14: Sử dụng trang phục hằng ngày",
          "description": "Lựa chọn và giữ gìn trang phục phù hợp hoàn cảnh",
          "questions": [
            {
              "id": "g1-hdtn-c5-l14-q1",
              "type": "scenario",
              "prompt": "Buổi sáng mùa hè đi học, em nên chọn trang phục nào đúng quy định và thoải mái?",
              "options": [
                "Bộ quần áo ngủ ở nhà",
                "Đồng phục trường sạch sẽ, gọn gàng, đi giày hoặc dép có quai",
                "Áo len dày và găng tay ấm",
                "Bộ đồ bơi thể thao"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l14-q2",
              "type": "scenario",
              "prompt": "Khi đá bóng hoặc chạy nhảy ngoài sân trường, em nên mặc trang phục thế nào?",
              "options": [
                "Váy xòe dài rườm rà",
                "Áo khoác dạ dày trùm kín",
                "Quần áo thể thao co giãn, thấm mồ hôi tốt và đi giày thể thao",
                "Mặc áo mưa đi đá bóng"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c5-l14-q3",
              "type": "scenario",
              "prompt": "Mùa đông trời rét đậm, em nên chọn trang phục nào đến trường để giữ ấm?",
              "options": [
                "Áo phông ngắn tay và quần đùi",
                "Đồng phục kết hợp áo khoác ấm, khăn quàng, đi tất và giày kín chân",
                "Đi chân đất và mặc áo cộc tay",
                "Chỉ mặc một chiếc áo mỏng"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l14-q4",
              "type": "scenario",
              "prompt": "Chuẩn bị đi ngủ buổi tối, em nên thay trang phục nào để ngủ ngon?",
              "options": [
                "Bộ đồ ngủ bằng vải mềm mại, rộng rãi và thoải mái",
                "Nguyên bộ đồng phục chật chội đi học ban ngày",
                "Bộ đồ thể thao chật nịt",
                "Mặc áo khoác mùa đông thật dày"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c5-l14-q5",
              "type": "scenario",
              "prompt": "Khi ở nhà giúp bố mẹ dọn dẹp, tưới cây, em nên chọn trang phục nào?",
              "options": [
                "Mặc bộ đầm/áo đẹp nhất mới mua",
                "Trang phục gọn gàng, thoải mái, dễ vận động",
                "Mặc áo mưa trong nhà",
                "Mặc trang phục diễn thời trang cầu kỳ"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c5-l14-q6",
              "type": "scenario",
              "prompt": "Đi học về hoặc thay quần áo ra, em nên có thói quen ứng xử nào?",
              "options": [
                "Vứt quần áo bẩn lung tung dưới sàn nhà",
                "Treo/gấp gọn gàng quần áo sạch vào tủ, để quần áo bẩn vào chậu giặt",
                "Vo tròn quần áo nhét xuống gầm giường",
                "Nhảy lên giẫm đạp lên quần áo"
              ],
              "correctIndex": 1
            }
          ]
        }
      ]
    },
    {
      "id": "c6-vui-don-mua-xuan",
      "chapterNumber": 6,
      "title": "Chủ đề 6: Vui đón mùa xuân",
      "lessons": [
        {
          "id": "l15-sap-xep-nha-cua-gon-gang-de-don-tet",
          "lessonNumber": 15,
          "title": "Bài 15: Sắp xếp nhà cửa gọn gàng để đón Tết",
          "description": "Phụ giúp gia đình dọn dẹp và trang hoàng ngày Tết",
          "questions": [
            {
              "id": "g1-hdtn-c6-l15-q1",
              "type": "scenario",
              "prompt": "Thấy sách vở, đồ chơi vứt lung tung trong phòng, thái độ đúng đắn của em là gì?",
              "options": [
                "Cảm thấy thích thú vì được bày đồ thoải mái",
                "Cảm thấy phòng bừa bộn và muốn bắt tay vào dọn dẹp gọn gàng",
                "Bày thêm đồ chơi ra sàn cho vui",
                "Bỏ đi chỗ khác và mặc kệ"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c6-l15-q2",
              "type": "scenario",
              "prompt": "Để giữ nhà cửa sạch sẽ đón Tết, em nên làm việc gì vừa sức?",
              "options": [
                "Xếp gọn chăn mền sau khi ngủ dậy, cất đồ chơi đúng nơi quy định",
                "Trèo lên mái nhà lau chùi",
                "Bê các chậu cây cảnh nặng ngoài sân",
                "Để bố mẹ tự làm hết vì mình còn nhỏ"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c6-l15-q3",
              "type": "scenario",
              "prompt": "Bố mẹ bận rộn dọn dẹp dọn nhà đón Tết, em nên giúp đỡ bằng hành động nào?",
              "options": [
                "Vừa ăn bánh kẹo vừa xả vỏ ra sàn nhà",
                "Dùng khăn mềm giúp bố mẹ lau bụi bàn ghế, kệ sách vừa tầm với",
                "Đòi bố mẹ dắt đi chơi ngay lập tức",
                "Nằm xem tivi cả ngày không phụ giúp"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c6-l15-q4",
              "type": "scenario",
              "prompt": "Bàn học xáo trộn sách vở và hộp màu sau khi học, em nên làm gì?",
              "options": [
                "Xếp sách vở gọn gàng vào kệ, cất bút màu vào hộp",
                "Nhét tất cả sách vở xuống gầm bàn",
                "Đẩy bớt sách vở rơi xuống đất",
                "Để nguyên trên bàn vì ra Tết học tiếp"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c6-l15-q5",
              "type": "scenario",
              "prompt": "Tham gia gian hàng Hội chợ Xuân ở trường, em nên làm gì để gian hàng sạch đẹp?",
              "options": [
                "Vứt vỏ hộp, giấy gói quà bừa bãi xung quanh gian hàng",
                "Sắp xếp hàng hóa gọn gàng, bỏ rác đúng nơi quy định",
                "Tranh giành chỗ ngồi với các lớp bên cạnh",
                "Làm đổ vỡ đồ đạc trưng bày của lớp"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c6-l15-q6",
              "type": "scenario",
              "prompt": "Sau khi dọn dẹp xong, em nên duy trì thói quen nào trong suốt ngày Tết?",
              "options": [
                "Lấy đồ dùng ra chơi xong nhớ cất lại đúng vị trí ban đầu",
                "Vứt vỏ lì xì và bánh kẹo ngay dưới gầm bàn",
                "Đi chân bẩn leo lên ghế sofa",
                "Bày thêm đồ chơi ra khắp lối đi"
              ],
              "correctIndex": 0
            }
          ]
        },
        {
          "id": "l16-ung-xu-khi-duoc-nhan-qua-ngay-tet",
          "lessonNumber": 16,
          "title": "Bài 16: Ứng xử khi được nhận quà ngày Tết",
          "description": "Lễ phép và trân trọng tình cảm người tặng",
          "questions": [
            {
              "id": "g1-hdtn-c6-l16-q1",
              "type": "scenario",
              "prompt": "Được ông bà, người lớn trao lì xì hoặc quà Tết, em nên làm gì để thể hiện sự lễ phép?",
              "options": [
                "Đứng ngả ngốn, thò một tay ra giật lấy",
                "Bật khóc vì không thích màu bao lì xì",
                "Đứng ngay ngắn, nhận quà bằng hai tay, mỉm cười và cảm ơn",
                "Cầm lấy quà rồi quay lưng chạy đi chơi ngay"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c6-l16-q2",
              "type": "scenario",
              "prompt": "Ngay sau khi nhận lì xì từ tay người lớn, hành vi nào KHÔNG LỊCH SỰ cần tránh?",
              "options": [
                "Cầm bằng hai tay và cất cẩn thận vào túi",
                "Bóc ngay phong bao lì xì trước mặt người tặng để đếm tiền",
                "Mỉm cười lễ phép và chúc Tết lại người tặng",
                "Nói lời cảm ơn chân thành"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c6-l16-q3",
              "type": "scenario",
              "prompt": "Món quà hoặc lì xì nhận được không đúng món đồ em thích, em nên ứng xử thế nào?",
              "options": [
                "Nhăn nhó, bĩu môi chê quà xấu trước mặt mọi người",
                "Vứt món quà xuống đất và giận dỗi đòi đổi quà khác",
                "Trân trọng tấm lòng người tặng, vui vẻ nhận quà và giữ thái độ lịch sự",
                "Trả lại quà và chê bai"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c6-l16-q4",
              "type": "scenario",
              "prompt": "Khi ông bà trao lì xì và chúc em chăm ngoan, học giỏi, em nên đáp lại thế nào?",
              "options": [
                "Im lặng cầm lấy tiền lì xì rồi đi chỗ khác",
                "Khoanh tay lễ phép: \"Cháu cảm ơn ông bà! Cháu chúc ông bà luôn mạnh khỏe ạ!\"",
                "Nói: \"Có thế thôi hả ông bà?\"",
                "Đòi ông bà phải cho thêm bao lì xì nữa"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c6-l16-q5",
              "type": "scenario",
              "prompt": "Sau khi nhận tiền lì xì ngày Tết, em nên làm gì để giữ gìn cẩn thận?",
              "options": [
                "Cầm tiền chạy nhảy ngoài đường làm rơi mất",
                "Nhờ bố mẹ giữ giúp hoặc bỏ vào heo đất tiết kiệm",
                "Tự ý mang đi mua thật nhiều bánh kẹo và đồ chơi đắt tiền",
                "Chia cho các bạn khác vì không cần dùng"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c6-l16-q6",
              "type": "scenario",
              "prompt": "Sử dụng tiền lì xì tiết kiệm được vào việc nào dưới đây là ý nghĩa nhất?",
              "options": [
                "Dùng mua sách vở, dụng cụ học tập hoặc nuôi heo đất tiết kiệm",
                "Dùng toàn bộ tiền để chơi game online",
                "Mua bim bim và nước ngọt uống cả ngày",
                "Dùng tiền mua đồ trêu chọc các bạn trong lớp"
              ],
              "correctIndex": 0
            }
          ]
        }
      ]
    },
    {
      "id": "c7-tham-gia-hoat-dong-cong-dong",
      "chapterNumber": 7,
      "title": "Chủ đề 7: Tham gia hoạt động cộng đồng",
      "lessons": [
        {
          "id": "l17-hang-xom-nha-em",
          "lessonNumber": 17,
          "title": "Bài 17: Hàng xóm nhà em",
          "description": "Tình làng nghĩa xóm và ứng xử chan hòa",
          "questions": [
            {
              "id": "g1-hdtn-c7-l17-q1",
              "type": "scenario",
              "prompt": "Đi học về gặp bác hàng xóm lớn tuổi ngoài sân, em nên làm gì để thể hiện sự lễ phép?",
              "options": [
                "Cúi đầu chào lễ phép: \"Cháu chào bác ạ!\" và mỉm cười thân thiện",
                "Đi thẳng vào nhà và không nói gì",
                "Giả vờ không thấy và quay đi chỗ khác",
                "Gọi to tên bác rồi bỏ chạy"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c7-l17-q2",
              "type": "scenario",
              "prompt": "Em bé hàng xóm sang chơi và muốn xếp hình cùng, em nên ứng xử thế nào?",
              "options": [
                "Giật lại đồ chơi và đuổi em bé về",
                "Hát hò và xô ngã em bé",
                "Vui vẻ đón tiếp, nhường đồ chơi và chơi cùng em bé cẩn thận",
                "Đóng chặt cửa không cho em bé vào nhà"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c7-l17-q3",
              "type": "scenario",
              "prompt": "Cô hàng xóm nhờ trông giúp em bé vài phút, em nên ứng xử thế nào?",
              "options": [
                "Từ chối và gắt gỏng với cô",
                "Vui vẻ nhận lời giúp, chơi cùng và giữ an toàn cho em bé",
                "Bỏ em bé ngồi một mình rồi chạy đi chơi điện tử",
                "Bắt em bé phải dọn dẹp nhà giúp mình"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c7-l17-q4",
              "type": "scenario",
              "prompt": "Có gia đình chú hàng xóm mới chuyển đến ở cạnh nhà, em nên làm gì để thể hiện sự thân thiện?",
              "options": [
                "Tò mò chỉ tay chê bai đồ đạc của chú",
                "Đóng cửa thật mạnh để làm chú giật mình",
                "Mỉm cười chào hỏi chú và cùng bố mẹ giới thiệu bản thân",
                "Nói chú đi chỗ khác sống"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c7-l17-q5",
              "type": "scenario",
              "prompt": "Lỡ làm bóng nảy trúng cửa nhà bác hàng xóm gây tiếng động lớn và bị nhắc nhở, em nên đáp lại thế nào?",
              "options": [
                "Cãi lại bác và cho rằng mình không có lỗi",
                "Lễ phép khoanh tay: \"Cháu xin lỗi bác, lần sau cháu sẽ cẩn thận hơn ạ!\"",
                "Bỏ chạy thật nhanh và lén ném đá vào nhà bác",
                "Giận dỗi và khóc ăn vạ tại chỗ"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c7-l17-q6",
              "type": "scenario",
              "prompt": "Gặp em bé hàng xóm đứng khóc ở ngã ba vì quên đường về nhà, em nên làm gì?",
              "options": [
                "Bỏ đi mặc kệ em bé",
                "Trêu chọc làm em bé khóc to hơn",
                "Lại gần dỗ dành, hỏi thăm và nhờ người lớn hoặc đưa em bé về tận nhà",
                "Đòi em bé phải cho tiền mới dẫn về"
              ],
              "correctIndex": 2
            }
          ]
        },
        {
          "id": "l18-em-tham-gia-cac-hoat-dong-xa-hoi",
          "lessonNumber": 18,
          "title": "Bài 18: Em tham gia các hoạt động xã hội",
          "description": "Tinh thần thiện nguyện và trách nhiệm cộng đồng",
          "questions": [
            {
              "id": "g1-hdtn-c7-l18-q1",
              "type": "scenario",
              "prompt": "Quyên góp sách vở, quần áo cũ ủng hộ các bạn nhỏ vùng cao là ví dụ của hoạt động nào?",
              "options": [
                "Hoạt động thể thao cá nhân",
                "Hoạt động xã hội thể hiện tinh thần yêu thương, chia sẻ với cộng đồng",
                "Hoạt động vui chơi giải trí đơn thuần",
                "Việc làm riêng của cá nhân em"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c7-l18-q2",
              "type": "scenario",
              "prompt": "Học sinh lớp 1 nên chọn tham gia việc làm nào phù hợp với lứa tuổi?",
              "options": [
                "Trồng, chăm sóc cây xanh và giữ vệ sinh đường phố, sân trường",
                "Tự ý lái xe máy tham gia giao thông",
                "Đi làm việc nặng nhọc ở công trường",
                "Mua bán hàng hóa giá trị lớn ngoài chợ"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c7-l18-q3",
              "type": "scenario",
              "prompt": "Khi cô giáo phát động phong trào giúp đỡ các bạn khó khăn, em nên ứng xử thế nào?",
              "options": [
                "Giận dỗi không muốn tham gia",
                "Vui vẻ hưởng ứng, chuẩn bị sách vở, đồ dùng mang đến ủng hộ",
                "Thản nhiên ngồi chơi, không quan tâm",
                "Khuyên các bạn khác không nên quyên góp"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c7-l18-q4",
              "type": "scenario",
              "prompt": "Khu phố phát động Ngày Chủ nhật xanh dọn vệ sinh ngõ xóm, em nên tham gia ra sao?",
              "options": [
                "Ở trong nhà xem tivi vì cho là việc của người lớn",
                "Hăng hái tham gia quét dọn, gom rác vừa sức cùng mọi người",
                "Vứt thêm rác ra ngõ cho mọi người dọn",
                "Đứng trêu chọc những người đang dọn dẹp"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c7-l18-q5",
              "type": "scenario",
              "prompt": "Tích cực tham gia các hoạt động xã hội mang lại lợi ích gì cho em?",
              "options": [
                "Giúp em biết yêu thương, chia sẻ, sống trách nhiệm và được mọi người quý mến",
                "Làm em tốn thời gian không thể chơi game",
                "Khiến em bị mệt mỏi và không có tác dụng gì",
                "Chỉ làm cho cô giáo vui lòng"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c7-l18-q6",
              "type": "scenario",
              "prompt": "Thấy bạn trong lớp chưa biết đến chương trình quyên góp ủng hộ lũ lụt, em nên làm gì?",
              "options": [
                "Mặc kệ bạn, không cần giải thích",
                "Vui vẻ chia sẻ ý nghĩa và rủ bạn cùng tham gia góp sức",
                "Chê bai bạn là người không biết quan tâm",
                "Bắt bạn phải đưa hết tiền tiết kiệm cho mình nộp"
              ],
              "correctIndex": 1
            }
          ]
        }
      ]
    },
    {
      "id": "c8-que-huong-tuoi-dep",
      "chapterNumber": 8,
      "title": "Chủ đề 8: Quê hương tươi đẹp",
      "lessons": [
        {
          "id": "l19-thien-nhien-tuoi-dep-que-em",
          "lessonNumber": 19,
          "title": "Bài 19: Thiên nhiên tươi đẹp quê em",
          "description": "Khám phá và tự hào về cảnh sắc quê hương",
          "questions": [
            {
              "id": "g1-hdtn-c8-l19-q1",
              "type": "scenario",
              "prompt": "Trong giờ ngoại khóa, hành động nào giúp em nhận biết và kể đúng tên các loại cây?",
              "options": [
                "Ngồi trong lớp và tưởng tượng ra các loại cây lạ",
                "Quan sát các cây xung quanh (phượng, nhãn, bàng...) và hỏi người lớn tên của chúng",
                "Bẻ cành cây mang về nhà rồi mới hỏi tên",
                "Không quan tâm vì loại cây nào cũng giống nhau"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c8-l19-q2",
              "type": "scenario",
              "prompt": "Đi ngắm cảnh đẹp thiên nhiên như cánh đồng lúa chín, dòng sông quê hương, em nên có cảm xúc gì?",
              "options": [
                "Hào hứng, thích thú, biết trân trọng và thêm yêu quý thiên nhiên quê hương",
                "Cảm thấy chán nản và đòi đi chơi game",
                "Bực bội vì phải di chuyển ra ngoài trời",
                "Thờ ơ, ngó lơ không quan tâm đến cảnh đẹp"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c8-l19-q3",
              "type": "scenario",
              "prompt": "Thảo luận về cảnh đẹp quê hương, em nên nêu hoạt động tích cực nào của người dân tại đó?",
              "options": [
                "Người dân vứt rác thải bừa bãi xuống nguồn nước",
                "Mọi người tập thể dục, dạo mát, ngắm cảnh và giữ gìn cảnh quan sạch đẹp",
                "Mọi người đến chặt phá cây cối mang về làm củi",
                "Mọi người tranh giành chỗ ngồi gây mất trật tự"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c8-l19-q4",
              "type": "scenario",
              "prompt": "Sắm vai \"Hướng dẫn viên du lịch nhí\" giới thiệu cảnh đẹp quê hương cho du khách, em nên làm gì?",
              "options": [
                "Ngượng ngùng, quay lưng lại và không chịu nói gì",
                "Tự tin, mỉm cười chào du khách và hào hứng giới thiệu về quê hương",
                "Nói thật nhanh rồi bỏ chạy đi chỗ khác",
                "Chê bai quê hương mình không có gì đẹp"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c8-l19-q5",
              "type": "scenario",
              "prompt": "Để chuẩn bị triển lãm chủ đề \"Thiên nhiên tươi đẹp quê em\", em nên làm gì?",
              "options": [
                "Nhờ người khác vẽ hộ rồi nhận là của mình",
                "Tự tay vẽ tranh, làm thiệp thể hiện cảnh đẹp quê hương và giới thiệu với các bạn",
                "Xé bài vẽ của bạn bên cạnh",
                "Giấu không cho cô giáo và các bạn xem sản phẩm"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c8-l19-q6",
              "type": "scenario",
              "prompt": "Để thể hiện tình yêu thiên nhiên bằng việc làm cụ thể ở trường và ở nhà, em nên làm gì?",
              "options": [
                "Thường xuyên tưới nước, nhổ cỏ, không bẻ cành ngắt hoa để cây luôn tươi tốt",
                "Giẫm lên cỏ xanh ngoài sân trường",
                "Bắt sạch các loài chim nhỏ trong vườn",
                "Ngắt sạch lá cây trên bồn hoa của lớp"
              ],
              "correctIndex": 0
            }
          ]
        },
        {
          "id": "l20-em-bao-ve-canh-quan-thien-nhien",
          "lessonNumber": 20,
          "title": "Bài 20: Em bảo vệ cảnh quan thiên nhiên",
          "description": "Hành động thiết thực bảo vệ môi trường tự nhiên",
          "questions": [
            {
              "id": "g1-hdtn-c8-l20-q1",
              "type": "scenario",
              "prompt": "Thấy các bạn nhặt rác xung quanh bồn hoa và tưới nước cho cây, việc làm đó có lợi ích gì?",
              "options": [
                "Giúp cảnh quan thiên nhiên sạch đẹp và cây cối phát triển xanh tươi",
                "Làm cho sân trường bị bẩn thêm",
                "Làm lãng phí thời gian vui chơi",
                "Không mang lại lợi ích gì"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c8-l20-q2",
              "type": "scenario",
              "prompt": "Hành động nào nên làm để góp phần giữ gìn và bảo vệ cảnh quan thiên nhiên?",
              "options": [
                "Hái hoa, bẻ cành ngoài công viên mang về nhà",
                "Trồng thêm cây xanh, làm hàng rào bảo vệ cây non và không xả rác bừa bãi",
                "Khắc tên, vẽ bẩn lên thân cây cổ thụ",
                "Bắt và trêu chọc các loài động vật nhỏ"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c8-l20-q3",
              "type": "scenario",
              "prompt": "Phát hiện chậu cây nhỏ bị khô đất và héo rũ, em nên xử lý thế nào?",
              "options": [
                "Bỏ đi chỗ khác và mặc kệ cây héo",
                "Nhổ luôn cây bỏ vào thùng rác",
                "Cẩn thận lấy ca nước tưới nhẹ nhàng vào gốc cây",
                "Ngắt hết lá héo rồi đi chơi tiếp"
              ],
              "correctIndex": 2
            },
            {
              "id": "g1-hdtn-c8-l20-q4",
              "type": "scenario",
              "prompt": "Thấy bạn dùng vật sắc nhọn khắc tên lên vỏ cây xanh trong công viên, em nên làm gì?",
              "options": [
                "Khuyên bạn: \"Cậu đừng khắc lên cây, làm thế cây sẽ bị tổn thương đấy!\"",
                "Đứng hò reo và mượn đồ để khắc cùng bạn",
                "Bỏ chạy đi giấu đồ đạc của bạn",
                "Thách thức xem bạn có dám khắc lên cây khác không"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c8-l20-q5",
              "type": "scenario",
              "prompt": "Để bảo vệ cây non mới trồng khỏi bị dẫm đạp, em nên làm việc gì vừa sức?",
              "options": [
                "Cùng nhau làm cọc rào hoặc hàng rào nhỏ bao quanh để bảo vệ cây non",
                "Nhổ cây non lên mang vào lớp trồng",
                "Nhảy dây xung quanh gốc cây non",
                "Đổ nước xà phòng bẩn vào gốc cây"
              ],
              "correctIndex": 0
            },
            {
              "id": "g1-hdtn-c8-l20-q6",
              "type": "scenario",
              "prompt": "Đọc được cuốn sách hay về thiên nhiên, em nên có thói quen ứng xử nào?",
              "options": [
                "Giữ bí mật không kể cho ai",
                "Hào hứng chia sẻ với các bạn về những việc tốt bảo vệ thiên nhiên và cùng thực hiện",
                "Xé các trang sách có hình cây cối mang về",
                "Vứt sách xuống sàn nhà sau khi đọc xong"
              ],
              "correctIndex": 1
            }
          ]
        }
      ]
    },
    {
      "id": "c9-em-bao-ve-moi-truong",
      "chapterNumber": 9,
      "title": "Chủ đề 9: Em bảo vệ môi trường",
      "lessons": [
        {
          "id": "l21-giu-gin-moi-truong-sach-dep",
          "lessonNumber": 21,
          "title": "Bài 21: Giữ gìn môi trường sạch, đẹp",
          "description": "Giữ sạch trường lớp, nhà ở và nơi công cộng",
          "questions": [
            {
              "id": "g1-hdtn-c9-l21-q1",
              "type": "scenario",
              "prompt": "Thấy công viên không khí trong lành, cây xanh tươi tốt và không có rác, cảm xúc của em là gì?",
              "options": [
                "Cảm thấy khó chịu và muốn bỏ về ngay",
                "Cảm thấy rất dễ chịu, vui vẻ vì môi trường sạch, đẹp và cần giữ gìn",
                "Cảm thấy bực bội vì không có rác để chơi",
                "Không quan tâm đến không gian xung quanh"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c9-l21-q2",
              "type": "scenario",
              "prompt": "Vứt rác bừa bãi ra đường phố, dòng sông hoặc sân trường gây ra tác hại gì?",
              "options": [
                "Làm cho môi trường xung quanh thêm đẹp đẽ",
                "Gây ô nhiễm nguồn nước, không khí, bốc mùi hôi và phát sinh bệnh tật",
                "Giúp cây cối lớn nhanh hơn",
                "Giúp các bạn nhỏ có thêm đồ chơi trên đường"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c9-l21-q3",
              "type": "scenario",
              "prompt": "Phát hiện góc sân trường hoặc bãi cỏ có nhiều rác vứt bừa bãi, em nên làm gì?",
              "options": [
                "Thản nhiên vứt thêm rác của mình vào đó",
                "Báo thầy cô/người lớn và cùng các bạn thu gom rác bỏ vào thùng rác",
                "Đổ thêm nước bẩn vào đống rác",
                "Ngó lơ và rủ bạn chạy qua chỗ khác chơi"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c9-l21-q4",
              "type": "scenario",
              "prompt": "Thấy một bạn nhặt vỏ bánh kẹo bỏ vào thùng rác, một bạn giẫm lên bồn hoa, em nhận xét thế nào?",
              "options": [
                "Cả hai bạn đều làm đúng",
                "Bạn nhặt rác có hành vi đúng đắn, bạn giẫm lên hoa có hành vi chưa tốt",
                "Bạn giẫm lên hoa làm đúng, bạn nhặt rác làm sai",
                "Cả hai bạn đều làm sai"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c9-l21-q5",
              "type": "scenario",
              "prompt": "Đi chợ thấy người bán dùng quá nhiều túi nilon, em nên ứng xử thế nào để bảo vệ môi trường?",
              "options": [
                "Đòi cho thêm thật nhiều túi nilon để chơi",
                "Lễ phép gợi ý: \"Chúng mình nên hạn chế dùng túi nilon hoặc dùng túi vải ạ!\"",
                "Vứt túi nilon ngay tại chỗ bán hàng",
                "Im lặng không nói gì"
              ],
              "correctIndex": 1
            },
            {
              "id": "g1-hdtn-c9-l21-q6",
              "type": "scenario",
              "prompt": "Để giữ môi trường luôn sạch đẹp hằng ngày, em nên thực hiện thói quen nào?",
              "options": [
                "Bỏ rác đúng nơi quy định, tiết kiệm nước khi rửa tay và bảo vệ cây xanh",
                "Mở vòi nước chảy tự do không khóa lại",
                "Bẻ cành cây làm đồ chơi",
                "Xả nước thải bẩn ra sân nhà"
              ],
              "correctIndex": 0
            }
          ]
        }
      ]
    }
  ]
};
