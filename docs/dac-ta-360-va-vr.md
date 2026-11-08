# Đặc tả khám phá 360 độ

## Đài quan sát

Cảnh 3D gồm mô hình Trái Đất–Mặt Trời, quỹ đạo, lưới tham chiếu; bản đài quan sát thêm sàn và khung phòng. Chế độ nhìn quanh quay camera tại chỗ, chế độ khám phá mô hình dùng OrbitControls. Năm annotation: Mặt Trời, quỹ đạo, trục, giữ hướng, năm. Trục giữ vector cố định; vị trí quỹ đạo chỉ thay đổi translation, tự quay là lớp riêng.

## Bầu trời

Hà Nội 21°B và Sydney 34°Nam (hiển thị tiếng Việt: 34°N), cảnh dựng ảo không phải panorama thực địa. Trục X hướng Đông, Y lên, Z hướng Bắc. Công thức hướng Mặt Trời dùng cùng declination với đồng hồ ngày đêm. Thời gian là giờ Mặt Trời địa phương; không giả làm giờ dân dụng.

Nút điểm mọc/cao nhất/điểm lặn đưa camera đến đúng hướng. Kéo tay và bàn phím để nhìn quanh; cảm biến là tuỳ chọn có xin quyền, từ chối vẫn dùng kéo tay.

## VR

Có nhánh WebXR feature detection, VRButton và ray controller. Không đặt yêu cầu kính cho nhiệm vụ bắt buộc. Chưa kiểm thử kính thật, do đó không công bố VR đã nghiệm thu. Cần HTTPS cho cảm biến/WebXR; LAN HTTP chỉ kiểm tra luồng web thông thường.

## Mô hình gần đúng

Không mô phỏng thời tiết, khúc xạ khí quyển hoặc địa hình. Quỹ đạo và vị trí ngày là mô hình giảng dạy, không phải lịch thiên văn chính xác. Các ngày quy ước 21/3, 22/6, 23/9, 22/12 theo SGK. Công thức declination dạng sin không cho đúng tuyệt đối mọi mốc phân/chí; có thể lệch vài phút và một vài ngày. Không ép số liệu rồi quảng cáo là số đo thực.

