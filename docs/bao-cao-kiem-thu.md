# Báo cáo triển khai và kiểm thử

Ngày thực hiện: 08/11/2026. Bản chạy: https://baquan3q-hub.github.io/giai-ma-bon-mua-dia-li-6/

## Đã thực hiện

- 24 trang, hai bìa riêng, 11 cặp trang; đọc một trang trên màn hình hẹp.
- 24 ảnh minh hoạ AI chính thức, gồm 19 element có alpha thật và 5 nền; tổng WebP khoảng 1,37 MB (1,31 MiB). PNG nguồn giữ nguyên riêng; D03 được tạo lại sau khi kiểm tra hình ảnh.
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
