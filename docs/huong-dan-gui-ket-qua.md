# Cấu hình gửi kết quả

Hiện chưa có Google Form của GV. App cung cấp xuất hồ sơ JSON và chỉ mở Form khi đã cấu hình. Không báo gửi thành công chỉ vì đã mở một tab.

1. GV tạo Google Form, chọn ba câu trả lời đoạn ngắn/đoạn văn: Họ tên, Lớp, Hồ sơ kết quả.
2. Chọn menu lấy liên kết điền sẵn, nhập dữ liệu mẫu vào ba trường, lấy URL có `entry.123...`.
3. Mở `giai-ma-bon-mua/public/data/config.json`, đặt `googleForm.url` là URL HTTPS `.../viewform` và ba mã trong `googleForm.entries.name/className/result`.
4. Chạy build, mở sách, trang 23 → Gửi kết quả → nhập tên/lớp → Mở Google Form. App không lưu tên/lớp vào tiến độ.
5. Người học kiểm tra rồi bấm Gửi ở Form. GV xác nhận hồ sơ có trong Responses/Sheets trước khi đánh dấu nghiệm thu M5.

Hồ sơ JSON gồm dự đoán, câu hỏi, bài làm, các lần kiểm tra, phản tư và rubric. Tiến độ chỉ lưu tại trình duyệt đang dùng; dùng chung thiết bị thì cần xuất trước khi học lại. Kết quả phía client là minh chứng học tập, không phải kỳ thi có xác thực danh tính.

