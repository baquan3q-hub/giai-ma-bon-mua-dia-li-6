# Đặc tả giao diện

24 trang, bìa đứng riêng và 11 cặp trang. Từ 1100px, tỉ lệ ngang ≥5/4, hiển thị cặp; màn hình hẹp đọc một trang.

Một ảnh nền dùng chung cho cặp, vùng gáy an toàn 10%; lớp HTML và SVG tách biệt. Điện thoại cắt đúng nửa trái/phải của ảnh. Không thu nhỏ cả trang bằng transform. Nội dung chính 16px trở lên, nút chính ≥44px; nhãn/ghi chú nhỏ hơn. Font đóng gói cùng app: Be Vietnam Pro và Lexend.

Nền ngoài #0F1B33, nền giấy sáng, vàng #F5A623, xanh #2E86DE. Một ý học và một hoạt động chính mỗi trang. Lời dẫn và gợi ý mở theo nhu cầu.

Điều hướng: nút, bàn phím và vuốt ngoài vùng tương tác. Khi mở hoạt động, dialog giữ focus; Esc hoặc nút Đóng trở lại sách. Tắt hiệu ứng qua Tuỳ chọn hoặc thiết lập giảm chuyển động của hệ thống.

Ảnh 3D AI là minh hoạ, không dùng thay cho mô hình khoa học. Canvas Three.js chỉ mở khi cần; chỉ một cảnh hoạt động. Có mức chất lượng thấp/cao, camera đặt lại và bản 2D khi không mở được WebGL.


## Cập nhật v1.3 — khung trang

- **Giải phẫu một trang:** dải tiêu đề gọn (nhãn trạm + tên trang) → bong bóng thoại Sao Mai (một câu: làm gì, chạm đâu, quan sát gì) → sân khấu (hình/mô hình, chiếm phần lớn thân trang) → thanh hành động (1 nút chính + nút học liệu dạng icon) → chân trang.
- **5 khung:** K1 Mở đầu (tr. 2, 7, 11, 19–22, 24) · K2 Lưới thẻ chạm (tr. 3–5, 18, 23) · K3 So sánh đôi (tr. 6, 12, 13, 15) · K4 Mô phỏng (tr. 8, 9, 14, 17) · K5 Cổng 360° (tr. 10, 16). Mã nguồn: `src/pages/frames.ts`, `src/pages/content.ts`, `src/styles/tokens.css`, `src/styles/frames.css`.
- **Thang đo:** chữ nội dung ≥ 16px, nhãn ≥ 12px, vùng chạm ≥ 44×44px, không tràn ngang, mỗi trang đúng 1 nút chính; chia bước khai báo trong nội dung, không tự cắt trang.
- **Hình tính toán (SVG, không cần WebGL):** tr. 9 thanh kéo góc trục, tr. 12 quỹ đạo 4 vị trí, tr. 14 sáng–tối theo vĩ tuyến, tr. 17 cung Mặt Trời theo dữ liệu; số liệu lấy từ `src/science/earth.ts` và `src/science/figures.ts`.
- **Tài nguyên mở:** chân trời ảnh thật CC0 (tr. 16), bản đồ nhiệt độ NASA tháng 1/7 (tr. 13); nguồn ghi trong `public/data/asset-sources.json` và kiểm tra tự động.
