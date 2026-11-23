# Báo cáo triển khai và kiểm thử

Ngày thực hiện: 08/11/2026. Bản chạy: https://baquan3q-hub.github.io/giai-ma-bon-mua-dia-li-6/

## Đã thực hiện

- 24 trang, hai bìa riêng, 11 cặp trang; đọc một trang trên màn hình hẹp.
- 24 ảnh minh hoạ AI chính thức, gồm 19 element có alpha thật và 5 nền; tổng WebP khoảng 1,40 MB (1,34 MiB). PNG nguồn giữ nguyên riêng; D03 được tạo lại sau khi kiểm tra hình ảnh.
- Tách công thức, trạng thái và lớp cảnh. Trục giữ hướng trong hệ tọa độ thế giới; tự quay là lớp riêng.
- Đài quan sát, bầu trời dựng ảo và chú thích tương tác; điều khiển chạm/kéo, đặt lại và danh sách chú thích.
- Câu hỏi JSON, ghép mùa bằng Pointer Events hoặc chạm chọn, phiếu, bảng, sáu câu giải mã, vali/rubric, bài kiểm tra và phản tư.
- Xuất hồ sơ JSON, cấu hình Google Form điền sẵn, tạo QR.

## Kiểm thử tự động

`npm test`: **9/9 đạt**. Kiểm tra cấu trúc trang, dữ liệu câu hỏi, điều kiện ≥7/10 và đúng câu nguyên nhân, bài thiếu câu, lưu dở tự đánh giá, storage lỗi, công thức ngày đêm, điểm mọc/lặn và hướng trục trên hierarchy Three.js đủ 365 vị trí.

`npm run build`: đạt, TypeScript strict. Cảnh Three.js tải động; cảnh khoảng 543 kB trước gzip, khoảng 142 kB gzip, không nằm trong gói JS khởi động (~48 kB trước gzip).

`npm audit`: không phát hiện lỗ hổng ở thời điểm chạy sau khi cập nhật sharp.

## Kiểm tra bằng trình duyệt

- Duyệt đủ 24 trang tại viewport desktop 1366×1000 và mobile 360×800; không phát hiện tràn ngang.
- Tải lại URL gốc khôi phục trang 6 và dự đoán đã lưu.
- Làm đủ 10 câu trên UI: 10/10, cả 10 câu hiện phản hồi đúng và giải thích; trang kết quả báo đạt.
- Chạm ghép đủ tám thẻ mùa: 8/8 ô đúng.
- Mở mô hình, mở rộng và chạm chú thích trục nghiêng thành công.
- Mở cảnh trời, sửa lỗi camera nhìn xuống đất, kiểm tra lại đúng chân trời; đổi Sydney cho số liệu 9h44 ngày 22/6.
- Có ảnh minh chứng ở `minh-chung/`; JSON bố cục được ghi từ lượt duyệt (một số lượt trước lần tăng cỡ chú thích cuối cùng).
- Trong các luồng đã duyệt không ghi nhận lỗi console.

## Chưa nghiệm thu

- Chưa có Google Form do GV cung cấp nên chưa xác nhận GV nhận hồ sơ. Không giả lập thành công.
- Chưa thử Android và iPhone/iPad thật, cảm biến bị từ chối và hiệu năng trên thiết bị lớp học.
- Chưa thử kính VR thật. Nhánh WebXR chỉ có kiểm tra khả năng thiết bị, chưa có chứng cứ nghiệm thu kính.
- Bước 0 và nguồn video vẫn cần xác nhận.
- Chưa đo FPS trên điện thoại tham chiếu; không công bố đạt mục tiêu 30 FPS trên điện thoại.

Vì các điều kiện trên, chưa đánh dấu toàn bộ M1–M5 là nghiệm thu hoàn tất. Bản bàn giao là ứng dụng đã triển khai, kèm checklist phần cần kiểm chứng trên thiết bị và tài khoản của nhóm.

## Xác minh phát hành

GitHub Actions chạy test/build/deploy thành công. Đã mở link HTTPS công khai, kiểm tra không có ảnh thiếu/tràn ngang ở bìa và cảnh 3D được dựng thành canvas với trạng thái 22/6. QR công khai nằm cạnh tài liệu.

# Bản 1.3.0 (12/11/2026, nhánh `v1.3-layout`, chạy local — chưa phát hành)

## Đã thực hiện

- Dựng lại khung ứng dụng và 5 khung trang cho cả 24 trang (giữ nhận diện navy–vàng–giấy ngà, Sao Mai và tiến độ đã lưu).
- Tương tác theo mục tiêu: tr. 6 (khơi gợi hai thẻ cảnh), 8 (mô hình), 9 (góc trục), 12 (quỹ đạo 4 vị trí), 13 (khoảng cách + bằng chứng vệ tinh NASA), 14 (sáng–tối theo vĩ độ), 17 (cung Mặt Trời), 19 (xếp vali).
- Cảnh trời 360°: chân trời ảnh thật CC0; sửa lỗi lật gương Đông–Tây có từ v1.2.
- Bộ prompt ảnh v1.3 (`prompt-anh-v1.3.md`); số phiên bản 1.3.0 ở `package.json` và `config.json` (tr. 24 đọc từ cấu hình).

## Kiểm thử tự động

`npm test`: **18/18 đạt** (thêm test hình tính toán, chống lật gương, nguồn tài nguyên). `tsc --noEmit` và `npm run build` đạt.

## Đi trọn luồng học sinh (trình duyệt, tiến độ trống)

| Bước | Kết quả |
|---|---|
| Bìa → hướng dẫn → tr. 7 | Lật trang bằng nút Tiếp, không lỗi console |
| Trạm 0 · dự đoán 3 câu + câu hỏi | Lưu `[0,1,2]` và câu hỏi |
| Đi tr. 7 → 20 | Đủ 14 trang, không lỗi |
| Trạm 1–3 · quỹ đạo, phiếu, khoảng cách, bảng, 6 câu giải mã, ghép 8 thẻ mùa (thử 1 lần sai), vali + lý do + rubric | Phản hồi đúng/sai hiện ngay; các trạm hoàn thành |
| Kiểm tra 10 câu | 6/10 → chưa đạt · 7/10 đúng câu 7 → **đạt** · 8/10 sai câu 7 → chưa đạt; tự chuyển tr. 21 |
| Đối chiếu dự đoán (tr. 22) | Lưu lựa chọn mới và câu phản tư |
| Hồ sơ (tr. 23) | 5/5 huy hiệu; xuất JSON có `completed:[0,1,2,3,4]` |
| Tải lại giữa chừng với tiến độ cùng định dạng v1.2 (trang 13, mới xong Trạm 0–1) | Mở lại đúng tr. 13, giữ dự đoán và câu trả lời |

Định dạng lưu tiến độ (`giai-ma-bon-mua:progress:v1`) không đổi so với v1.2, nên học sinh đang học dở không mất dữ liệu.

## Còn chờ

- Ảnh H/B/I/A/J (prompt v1.3) chưa nhận — đang dùng ảnh tạm.
- Ảnh xem trước cổng 360° tr. 10/16 chụp từ cảnh thật — chưa chụp.
- Thử trên Android/iPhone thật; các mục chờ GV xác nhận (số trang SGK, số tiết, mã năng lực số, video Trạm 0, Google Form).

## Đo bố cục sau Mốc 4–5 (24 trang × 1366×900, 768×1024, 390×844, 360×800)

- 23 trang nội dung đạt ở cả 4 kích thước: chữ nhỏ nhất 12px (nhãn), không vùng chạm < 44px, không tràn, đúng 1 nút chính.
- Bìa giữ 2 ghi chú đã biết: không có nút chính (theo thiết kế); quỹ đạo trang trí bị cắt ở khổ ngang.
- Cảnh 360° ở 375×812: kéo xoay được góc nhìn (`touch-action:none`, Pointer Events), ảnh chân trời tải được.
- Tr. 24 hiện “Phiên bản 1.3.0” (đọc từ `config.json`), không còn dòng phiên bản cũ.

# Bản 1.4.0 (23/11/2026, chạy local)

- Rút còn 18 trang theo `storyboard-18-trang.md`; `resources.json` đã đánh lại số trang.
- Ẩn chữ “sẽ có ở bản sau” (tab Hoạt hình tr. 17, hộp thoại GV); chặn lỗi khi thiếu câu hỏi hoặc cấu hình Form.
- Hiệu năng: chất lượng 3D mặc định theo thiết bị; mức cao chỉ tải mô hình NASA (ảnh bề mặt chỉ tải khi mô hình lỗi); mức thấp dùng chân trời 2048px và Mặt Trời 1024px; cảnh ngừng vẽ khi khuất màn hình.
- Đối chiếu KHBD và đề xuất: `../reports/Rà soát ebook Giải mã bốn mùa.md`.

## v1.5 (P1 – khôi phục tương tác KHBD)

- Tr.6: thanh ngày 1–365, mũi tên vàng hướng tây → đông, Sao Mai hỏi gợi mở ở 4 mốc; xong khi kéo qua đủ 4 mùa.
- Tr.8: kéo thả 8 thẻ mùa (Pointer Events; chạm thẻ rồi chạm ô làm dự phòng), thẻ sai bật về kèm gợi ý; thêm hàng "Ngả về Mặt Trời".
- Tr.9: bật/tắt giả thuyết "gần – xa" so với thực tế; hình chùm sáng loang 22/6 Hà Nội – Sydney (≈1,9 lần); trò Đúng hay Sai 30 giây.
- Tr.10: HS tự nhập số giờ đọc được (chấp nhận ±10 phút), ghi chú "số liệu gần đúng"; mục gập "Thử ngày bất kì" có biểu đồ cả năm 5 địa điểm.
- Kiểm: `tsc`, `npm test` (25/25), `npm run build`; xem trước 375×812. Kéo thả thật trên điện thoại chưa kiểm.

## v1.6 (P2 – hỗ trợ học và thầy cô)

- Nút **Gợi ý** trong bong bóng Sao Mai ở tr.3–13 (`public/data/hints.json`): lần 1 câu hỏi gợi mở, lần 2 chỉ chỗ cần nhìn và tô sáng vùng đó, lần 3 ẩn. Lượt dùng gợi ý ghi vào hồ sơ (`hints`).
- Thanh 5 trạm (0–4) trên đầu sách, chấm xanh = đã nhận huy hiệu, bấm để tới trạm; đếm huy hiệu x/5.
- Bảng thầy cô (⋯ → Thầy cô dạy trên lớp → Mở bảng thầy cô): trình chiếu chữ lớn, ẩn/hiện đáp án, đồng hồ 20 giây – 3 phút, điểm 2–6 đội, bình chọn giơ tay cho 3 câu dự đoán (biểu đồ %), xác nhận rubric vali. Lưu riêng ở `gmbm-teacher`, không vào hồ sơ học sinh.
- Vali: áo thun, dép sandal bị đánh dấu là đồ mùa nóng; câu giải thích chấm gợi ý 3 tiêu chí Phụ lục 3 bằng từ khoá (có dấu hoặc không dấu).
- Gửi kết quả: bảng tóm tắt, trường riêng cho Google Form, tuỳ chọn gửi thẳng Apps Script (`docs/huong-dan-gui-ket-qua.md`).
- Kiểm: `tsc`, `npm test` (27/27), `npm run build`; xem trước 375×812 và 1024 px. Chưa thử Form/Apps Script thật (chưa có URL của thầy cô).

## v1.7 (P3 – chất lượng và tiếp cận)

- Đọc ít: test mới đếm chữ nhìn thấy trên mỗi trang (mới và đã xong) ≤ 80; rút gọn tr.2, 6, 9, 10, 15, 16; tr.9 thu khung chùm sáng vào mục gập.
- Tương phản (đo trong trình duyệt trên cả 18 trang, so nền thật): nhãn phần, chân trang, ô trống bảng mùa, chấm tiến độ, chữ cái đáp án đúng đều ≥ 4,5:1. Viền focus của cảnh bấm được đổi sang viền tối + quầng vàng.
- Vùng chạm ≥ 44 px: chấm trạm, nút Gợi ý, nút ngày và ô bảng mùa (tr.8).
- Thống nhất "nửa cầu" (SGK KNTT) thay cho "bán cầu" trong câu hỏi, tài nguyên, mã.
- Lời giải thích 10 câu kiểm tra theo Phụ lục 2 KHBD (giữ chú thích mặt phẳng quỹ đạo, ngày quy ước).
- Đọc to: chờ danh sách giọng (`voiceschanged`, tối đa 1,5 giây), chia câu ≤ 160 kí tự để Chrome không ngắt; dự phòng tệp thu sẵn `public/audio/trang-N.mp3` khai báo ở `config.json → readAloud.mp3`.
- Infographic "4 ngày đặc biệt" (Sổ tay ôn tập, thẻ "4 ngày"): 21/3, 22/6, 23/9, 22/12 — nơi Mặt Trời chiếu thẳng góc, mùa hai nửa cầu, độ dài ngày Hà Nội/Sydney tính từ công thức; nút **Tải ảnh PNG** (1360×1612).
- Tr.5 thành "Nhắc lại Bài 6, 7" theo KHBD.
- Học offline (PWA): `manifest.webmanifest`, biểu tượng 192/512, `sw.js` lưu sẵn khung sách + dữ liệu, lưu dần ảnh và 3D khi mở tới; trang chính và `data/*.json` lấy mạng trước. Đã thử: mở bản build một lần, tắt máy chủ, tải lại tr.8 vẫn chạy.
- Sửa lỗi cũ: ảnh nền sách (`--scene-bg`) ở bản build trỏ nhầm `/assets/assets/…`; nay dùng đường dẫn tuyệt đối.
- Kiểm: `tsc`, `npm test` (30/30), `npm run build`; xem trước 375×812. Chưa thử cài PWA và giọng đọc trên điện thoại thật.
