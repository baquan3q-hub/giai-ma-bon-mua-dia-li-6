# Phân tích dạy học — “Giải mã bốn mùa” v1.4

> Mốc 0 của kế hoạch v1.4. Tài liệu này là đầu vào cho storyboard 18 trang (`storyboard-18-trang.md`), kịch bản hoạt hình (`kich-ban-hoat-hinh.md`) và bảng ánh xạ KHBD (`anh-xa-khbd-ebook.md`).
> Nguồn: SGK Lịch sử và Địa lí 6 (KNTT), Bài 8, tr. 122–124; `KHBD_Ebook_Bai8_DiaLi6_KNTT.docx` (phần B, C, Phụ lục 1–2); đo trực tiếp bản v1.3 ngày 14/11/2026.

## 1. Vì sao phải thiết kế lại

Bản v1.3 đúng kiến thức và bố cục ổn, nhưng khi đặt vào một tiết dạy thật thì vướng ba chỗ:

1. **Quá nhiều thứ để bấm.**
   - Khung chung có 13 nút; trang 8 có 21 nút; mỗi cảnh 3D/360° thêm 15–20 nút.
   - Cả cuốn có khoảng 135 nút, chưa kể hộp thoại.
   - Học sinh 11–12 tuổi mất sức chú ý vào việc tìm nút thay vì nhìn hiện tượng.
2. **Hình và video khó hiểu.**
   - Video duy nhất là video NASA tiếng Anh, và 4/5 học liệu đọc thêm cũng là tiếng Anh.
   - Trái Đất trong mô hình 3D chỉ khoảng 20 px.
   - Màu và góc nhìn khác Hình 1–4 SGK, nên học sinh không nối được với hình trong sách.
   - Cùng một ý lại có ba kiểu hình: 3D, SVG và infographic.
3. **Không khớp cách dạy trên lớp.**
   - Trên lớp chỉ giáo viên chiếu, học sinh không cầm máy.
   - Bản v1.3 lại được thiết kế cho từng học sinh tự bấm, và không có chế độ trình chiếu.
   - Không có công cụ thống kê dự đoán của cả lớp, không có phiếu in.

## 2. Nội dung bài học

### 2.1 Yêu cầu cần đạt (Chương trình 2018)

| Mã | Yêu cầu cần đạt | Mức nhận thức |
|---|---|---|
| YC1 | Mô tả được chuyển động của Trái Đất quanh Mặt Trời (quỹ đạo, hướng, thời gian, trục) | Biết – Hiểu |
| YC2 | Trình bày được hiện tượng mùa và giải thích nguyên nhân (trục nghiêng, không đổi hướng) | Hiểu |
| YC3 | Trình bày được hiện tượng ngày đêm dài ngắn theo mùa và theo vĩ độ | Hiểu |
| YC4 | Sử dụng quả Địa Cầu, mô hình, hình vẽ để trình bày | Vận dụng |
| YC5 | Giải thích tình huống thực tế: tháng 7 đi Sydney cần áo ấm | Vận dụng |

### 2.2 Kiến thức chốt, bám theo 4 hình SGK

| Hình SGK | Học sinh phải nhìn thấy gì | Câu chốt (≤ 15 chữ) |
|---|---|---|
| Hình 1 (tr. 122) – quỹ đạo | Elip gần tròn; mũi tên tây → đông; trục ở 4 vị trí song song nhau | Trục nghiêng 66°33′ và không đổi hướng. |
| Hình 2 (tr. 123) – 22/6 và 22/12 | Nửa cầu nào ngả về Mặt Trời thì nhận tia sáng gần thẳng góc | Nửa cầu ngả về Mặt Trời là mùa nóng. |
| Hình 3 (tr. 123) – mùa ở hai nửa cầu | Bắc nóng thì Nam lạnh, và ngược lại | Hai nửa cầu luôn trái mùa nhau. |
| Hình 4 (tr. 124) – ngày đêm dài ngắn | Đường sáng–tối nghiêng; Xích đạo chia đôi; vòng cực sáng suốt ngày | Mùa nóng ngày dài; càng về cực chênh lệch càng lớn. |

**Số liệu dùng trong toàn bộ sách** lấy từ `src/science/earth.ts`, khớp Phiếu số 3 của KHBD:

| Nơi | 22/6: ngày / đêm | 22/12: ngày / đêm |
|---|---|---|
| Xích đạo (0°) | 12 giờ 00 / 12 giờ 00 | 12 giờ 00 / 12 giờ 00 |
| TP. Hồ Chí Minh (≈ 10°B) | 12 giờ 38 / 11 giờ 22 | 11 giờ 22 / 12 giờ 38 |
| Hà Nội (≈ 21°B) | 13 giờ 17 / 10 giờ 43 | 10 giờ 43 / 13 giờ 17 |
| Sydney (≈ 34°N) | 9 giờ 45 / 14 giờ 15 | 14 giờ 15 / 9 giờ 45 |
| Gần vòng cực Bắc (66°B) | 22 giờ 14 / 1 giờ 47 | 1 giờ 47 / 22 giờ 14 |

> Lưu ý số liệu: đúng tại vòng cực (66°33′), mô hình tính 23 giờ 40 vì dùng độ nghiêng 23,44°. SGK dùng 23°27′ nên ra tròn 24 giờ. Hoạt hình V3 và thẻ chốt sẽ nói “**từ vòng cực về cực**: có ngày Mặt Trời không lặn suốt 24 giờ”, minh hoạ ở 70°B, để khớp SGK mà không mâu thuẫn với đồng hồ.

### 2.3 Quan niệm sai cần xử lí

| Quan niệm sai | Cách làm lộ ra | Cách bác bỏ (cho học sinh tự thấy) |
|---|---|---|
| “Mùa hè vì Trái Đất ở gần Mặt Trời” (phổ biến nhất) | Câu dự đoán 1 ở trang 4; bình chọn giơ tay ở Mở đầu Tiết 1 | Trang 9: tháng 1 Trái Đất gần Mặt Trời nhất (≈ 147 triệu km) nhưng Hà Nội đang lạnh; cùng lúc hai nửa cầu trái mùa |
| “Trục Trái Đất luôn chĩa về Mặt Trời” | Câu Đ/S số 1 | Hoạt hình V2: 4 vị trí, trục luôn song song |
| “Ở đâu cũng ngày 12 giờ, đêm 12 giờ” | Câu đố Khởi động Tiết 2 | Đồng hồ ngày đêm 5 địa điểm (trang 10) |
| Nhầm 365 ngày 6 giờ (quanh Mặt Trời) với 24 giờ (tự quay) | Phiếu số 1 | Thẻ ghi nhớ đặt hai chuyển động cạnh nhau |

## 3. Người học: học sinh lớp 6 (11–12 tuổi)

Dựa trên Phần C của KHBD, bổ sung hệ quả cụ thể cho thiết kế v1.4.

| Đặc điểm | Hệ quả thiết kế v1.4 |
|---|---|
| **Tư duy** đang chuyển từ cụ thể sang trừu tượng. Khó hình dung không gian 3D, góc chiếu, đường sáng–tối | Luôn đi theo thứ tự **vật thật** (quả Địa Cầu + đèn pin) → **hình SGK** → **mô hình 3D/360°**. Mô hình là bước kiểm chứng, không phải bước đầu tiên. |
| **Chú ý** tập trung 15–20 phút | Mỗi trang là một việc 3–8 phút. Mỗi hoạt hình ≤ 90 giây, chia chương để giáo viên dừng. |
| **Đọc** dễ bỏ qua đoạn dài | ≤ 60 chữ mỗi trang cho học sinh; ≤ 25 chữ mỗi màn hình chiếu. Câu ngắn, mỗi câu một ý. |
| **Ở nhà** học một mình; phụ huynh ít hỗ trợ được môn này; máy không đều (nhiều em dùng điện thoại cũ) | Phần Trước giờ ≤ 15 phút, tự hiểu được nhờ hoạt hình có lời. Chạy được trên điện thoại 360 px. Cài được như ứng dụng và mở lại không cần mạng. |
| **Ngôn ngữ**: chưa đọc được tài liệu tiếng Anh | Không có gì bắt buộc bằng tiếng Anh. Tài liệu NASA/NOAA chỉ để trong mục “Tài liệu cho thầy cô”. |
| **Cảm xúc**: ngại sai trước bạn; thích thi đua theo đội, thích huy hiệu | Dự đoán không chấm điểm và không hiện tên. Bình chọn trên lớp chỉ đếm số tay giơ. Thi đua theo đội (ô chữ), không theo cá nhân. |
| **Thao tác**: nhanh với điện thoại nhưng dễ bấm lung tung | ≤ 1 nút chính và ≤ 3 điều khiển mỗi màn hình. Nút chính luôn nằm cùng một chỗ. |

**Định nghĩa dùng khi đếm:**
- **Nút chính** là việc tiếp theo em nên làm, ví dụ “Kiểm tra” hoặc “Sang trang dự đoán”.
- **Điều khiển** là một nhóm thao tác cùng loại. Một dãy lựa chọn (4 ngày, 3 phương án, 5 món đồ) tính là 1 điều khiển.
- Các nút lật trang, Mục lục và menu “⋯” của khung chung không tính vào giới hạn của trang.

## 4. Mục tiêu bài học trên ebook (viết cho học sinh đọc được)

Sau bài này, em có thể:
1. **Kể** Trái Đất đi quanh Mặt Trời thế nào: hình quỹ đạo, hướng, bao lâu, trục ra sao. *(YC1)*
2. **Giải thích** vì sao có mùa và vì sao hai nửa cầu trái mùa. *(YC2)*
3. **Đọc** hình để nói nơi nào ngày dài, nơi nào đêm dài. *(YC3, YC4)*
4. **Dùng** điều đã học để chuẩn bị vali đi Sydney tháng 7. *(YC5)*

| Năng lực / phẩm chất | Biểu hiện trong ebook | Minh chứng thu được |
|---|---|---|
| Nhận thức khoa học địa lí | Phiếu 1–3; bài kiểm tra 10 câu | Điểm, câu sai, phiếu |
| Tìm hiểu địa lí: dùng mô hình, hình vẽ | Thao tác mô hình 3D; đọc Hình 4; cảnh trời 360° | Bảng số liệu Phiếu 3 |
| Vận dụng | Vali đi Sydney; quan sát Mặt Trời 3 ngày | Lý do chọn đồ; bảng giờ mọc/lặn |
| Tự chủ và tự học | Phần Trước giờ, Nhìn lại dự đoán, Sổ tay ôn tập | “1 điều em đã thay đổi suy nghĩ” |
| Giao tiếp và hợp tác | Báo cáo nhóm, ô chữ theo đội | Quan sát của giáo viên (rubric KHBD) |
| Trung thực, chăm chỉ | Tự đánh giá; dự đoán không bị chấm | — |
| Năng lực số | Dùng ebook, mô phỏng, gửi kết quả | *(mã theo TT 02/2025: chờ Quân/GV xác nhận)* |

## 5. Phương pháp dạy học và cách ebook phục vụ

| Phương pháp / kĩ thuật | Giai đoạn | Ebook làm gì |
|---|---|---|
| **Lớp học đảo ngược** | Trước giờ | Hoạt hình V1 + 3 câu dự đoán + hộp câu hỏi, làm ở nhà ≤ 15 phút |
| **Dự đoán – Quan sát – Giải thích (POE)** | Xuyên suốt | Dự đoán (tr. 4) → quan sát bằng mô hình (tr. 6–11) → tự sửa (tr. 15) |
| **Dạy học trực quan** bằng mô hình | Trên lớp | Quả Địa Cầu và đèn pin → Hình SGK → 3D → 360° |
| **Dạy học khám phá, giải quyết vấn đề** | Tiết 1 | Vấn đề: “Có phải do gần – xa?” → học sinh tự kiểm chứng (tr. 9) |
| **Dạy học hợp tác** (nhóm 6–8) | Trên lớp | Phiếu 1–3 bản in; mỗi nhóm một địa điểm ở Phiếu 3 |
| **Trò chơi học tập** | Củng cố, Luyện tập | Đúng/Sai 30 giây; ô chữ theo đội; vali |
| **Đánh giá vì sự tiến bộ** | Sau giờ | Bài kiểm tra có lời giải; nhìn lại dự đoán; giáo viên chọn câu sai nhiều để chữa |
| **Ôn tập giãn cách** | Mọi lúc | Sổ tay: 12 thẻ ghi nhớ, luyện 5 câu ngẫu nhiên, xem lại hoạt hình |

## 6. Bốn giai đoạn sử dụng

| Giai đoạn | Ai dùng, dùng ở đâu | Thiết bị | Thời lượng | Trang |
|---|---|---|---|---|
| **A. Trước giờ** | Học sinh ở nhà | Điện thoại / máy tính bảng | ≤ 15′ | 2–5 |
| **B. Trên lớp** | Giáo viên chiếu, cả lớp quan sát, trả lời bằng phiếu, thẻ Đ/S, giơ tay | Máy chiếu + quả Địa Cầu, đèn pin | 2 tiết × 45′ | Chế độ “Thầy cô dạy trên lớp” (dùng hình của tr. 6–13) |
| **B′. Xem lại** | Học sinh xem lại phần trên lớp ở nhà, hoặc làm tiếp phần nhóm chưa xong | Điện thoại | tuỳ ý | 6–13 |
| **C. Sau giờ** | Học sinh ở nhà | Điện thoại | ≤ 20′ | 14–16 |
| **D. Mọi lúc** | Học sinh ôn trước kiểm tra, không cần mạng | Điện thoại (cài ứng dụng) | 3–5′ mỗi lần | 17 |

## 7. Nguyên tắc thiết kế v1.4 (dùng để kiểm tra mọi trang)

1. **Một màn hình một ý, một hình, một việc**:
   - ≤ 1 nút chính và ≤ 3 điều khiển;
   - ≤ 60 chữ (học sinh), ≤ 25 chữ (màn hình chiếu).
2. **Hình bám SGK**:
   - màu thống nhất: vàng là phần được chiếu sáng, tím than là đêm, tia sáng màu đỏ cam, đỏ là nửa cầu mùa nóng, xanh lam là nửa cầu mùa lạnh;
   - nhãn đặt như SGK;
   - mỗi hình có đúng **một** vòng sáng “Nhìn vào đây”.
3. **POE**:
   - dự đoán không chấm điểm;
   - mô hình không “giải thích hộ” trước khi học sinh dự đoán;
   - hoạt hình chia chương để giáo viên dừng trước phần kết luận.
4. **Hai lối vào**:
   - “Em tự học” cho điện thoại;
   - “Thầy cô dạy trên lớp” cho máy chiếu, điều khiển bằng bàn phím hoặc bút trình chiếu.
5. **Không bắt buộc tiếng Anh, không bắt buộc mạng** sau lần mở đầu.
6. **Không mất tiến độ**: tiến độ v1.3 được đổi sang trang tương ứng của v1.4.

## 8. Những gì bỏ hoặc gộp so với v1.3

| Bỏ / gộp | Lí do |
|---|---|
| Tr. 2–5 (chào, hướng dẫn, mục tiêu, bản đồ) → gộp thành tr. 2 “Nhiệm vụ” | 4 trang chưa có kiến thức; học sinh lật qua không đọc |
| Đài quan sát 360° (tr. 10) | Trùng với mô hình quỹ đạo tr. 8 |
| Tr. 16 + 17 (cảnh trời, theo dấu Mặt Trời) → gộp thành tr. 11 | Cùng một cảnh, khác nhiệm vụ |
| Tr. 14 + 15 (đồng hồ, quy luật) → gộp thành tr. 10 | Đồng hồ là công cụ để đọc quy luật |
| Tr. 20 + 21 (kiểm tra, kết quả) → gộp thành tr. 14 | Kết quả hiện ngay sau câu cuối |
| Nút “Sơ đồ / Infographic” rời ở 9 trang | Thay bằng một thẻ “Chốt kiến thức” in sẵn trên trang |
| Video NASA tiếng Anh ở trang chính | Thay bằng 3 hoạt hình có lời tiếng Việt; video NASA đưa vào “Tài liệu cho thầy cô” |
| Nút bật/tắt nhãn, gyro, chú thích trong cảnh 3D/360° | Nhãn hiện cố định; gyro và chú thích chuyển vào menu “⋯” |

## 9. Còn chờ Quân / giáo viên xác nhận

- Số trang SGK bản 2026–2027 (đang dùng tr. 122–124).
- Số tiết của Bài 8 theo phân phối chương trình của trường (đang dự kiến 2 tiết).
- Mã năng lực số theo Thông tư 02/2025.
- Có tạo Google Form thu kết quả hay không. Mặc định không cần máy chủ: học sinh gửi bằng Form có sẵn nếu cấu hình, nếu không thì xuất tệp JSON.
- KHBD hiện viết “nhóm mở Trạm 1, kéo thanh trượt”. Vì lớp chỉ giáo viên chiếu, nên sửa lời KHBD thành “GV điều khiển, nhóm quan sát và ghi phiếu”. **Quân có muốn sửa luôn file KHBD không?**
- Thử trên máy chiếu và điện thoại thật.
