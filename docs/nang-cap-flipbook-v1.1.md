# Nâng cấp flipbook và hướng dẫn học sinh phiên bản 1.1

## Phân tích từ yêu cầu và ebook Hạt Cơm Dẻo

Đã xem trực tiếp https://hanh-trinh-hat-com-deo.netlify.app/ và đọc mã nguồn sách mẫu trong workspace. Các đặc điểm được kế thừa: công cụ âm thanh/toàn màn hình, nhân vật hướng dẫn, gợi ý khi dừng lâu, tài nguyên mở từ trong trang và hình minh hoạ làm trọng tâm.

Bản 1.0 có điều hướng nhưng chưa có một mặt giấy lật đủ rõ; lời dẫn chưa đều giữa các trang; mô hình cầu trơn khiến khó nhận biết Trái Đất; giải thích khoa học tách xa thao tác. Bản 1.1 cải tiến cùng cấu trúc 24 trang để giữ tiến độ đã lưu.

## Thiết kế đã thực hiện

1. **Lật sách:** mặt trước/sau, xoay 3D 900ms, bóng giấy, nút góc trang, vuốt và phím trước/sau. Chỉ lớp trình bày lật, dữ liệu bài làm không bị sao chép hoặc ghi lại. Có khoá chống lật chồng và phương án CSS nếu thiếu Web Animations API.
2. **Âm thanh:** tiếng giấy tổng hợp bằng Web Audio, tiếng chạm/đúng/sai ngắn, bật/tắt có lưu. Không dùng nhạc nền tự phát. Nghe trang/Nghe hướng dẫn dùng giọng Việt của thiết bị, có thông báo khi không có giọng phù hợp.
3. **Hook:** đủ 24 bản hướng dẫn gồm câu hỏi, việc cần làm, ý cần hiểu và nút thực hiện. Bìa dùng chính câu hỏi trung tâm. Từ trang 2 có thẻ dẫn đường riêng. Sau 12 giây dừng, Sao Mai nhắc một lần trên trang, không chen khi đang làm bài trong dialog. Có thể tắt lời nhắc.
4. **Infographic:** bảy phiếu trực quan: quỹ đạo, góc nghiêng, mùa, phản biện gần–xa, ngày–đêm, vĩ độ và vali. Chữ/số liệu là HTML/SVG để không sai chữ tiếng Việt và có thể chỉnh. Bổ sung hình tóm tắt trực tiếp ở trang mùa, nguyên nhân và nhật ký.
5. **Icon 3D:** thêm F01–F06 (quỹ đạo, trục, mùa, ngày đêm, kính thiên văn, video), tăng bộ ảnh từ 24 lên 30. Icon trang trí và ảnh AI không thay thế sơ đồ khoa học.
6. **3D chân thực:** dùng Earth with Clouds của NASA VTAD, tối ưu ảnh xuống 2048 và WebP, từ 18.928.336 còn 575.016 byte. Cận cảnh bề mặt, mây dịch chuyển, khí quyển minh hoạ, bật/tắt lưới, dừng/bật tự quay. Trục vẫn là một đối tượng độc lập trong hệ tọa độ thế giới.
7. **Mô hình + giải thích:** trong cửa sổ mô hình có hộp giải thích, câu hỏi quan sát và nút infographic. Kích thước/tốc độ hiển thị không theo tỉ lệ thực, không làm người học suy diễn thời gian từ hiệu ứng.
8. **Tài nguyên:** thư viện theo trang, xem tất cả, YouTube nhúng chỉ tải khi bấm; nguồn, ngôn ngữ và câu hỏi khi xem được ghi rõ. Có link mở ngoài khi trường chặn iframe. Link tài liệu/bài luyện thêm bổ sung qua resources.json. Không tái sử dụng bài kiểm tra Sinh học lớp 3 cho Địa lí 6.

## Lựa chọn kỹ thuật sau nghiên cứu

Đã đối chiếu StPageFlip (https://nodlik.github.io/StPageFlip/). Chọn lớp lật giấy riêng cho app hiện tại để giữ điều khiển Three.js, thanh trượt và kéo thả; không đưa canvas đang hoạt động vào nhiều trang cùng lúc. Ảnh chụp trình bày trong lúc lật là lớp inert, không có nút hoạt động trùng.

Thiết lập mặc định tôn trọng giảm chuyển động của thiết bị. Nếu muốn xem hiệu ứng trong môi trường đang giảm chuyển động, chọn **Tuỳ chọn → Hiệu ứng lật sách → Lật trang có hiệu ứng**. Việc giảm chuyển động không làm mất chức năng điều hướng.

## Nguồn và quyền sử dụng

- Mô hình: https://science.nasa.gov/resource/earth-with-clouds-3d-model/ — NASA Visualization Technology Applications and Development (VTAD). Tối ưu texture, giữ mesh và hình học.
- Chính sách NASA: https://www.nasa.gov/nasa-brand-center/images-and-media/ — dùng cho giáo dục/thông tin theo hướng dẫn, có ghi nguồn; không ngụ ý NASA bảo trợ.
- Bề mặt ngày/đêm/mây và Mặt Trời: https://www.solarsystemscope.com/textures/ — CC BY 4.0; trang nguồn cho biết dựa trên dữ liệu NASA, có hiệu chỉnh màu. Tài nguyên đóng gói cục bộ, không hotlink lúc học.
- Video: NASA Video, “NASA Now: Reasons for the Seasons”, https://www.youtube.com/watch?v=M4BbW8AwJ0o — nhúng bằng player, không tải lại/đăng lại video. Tiếng Anh, có câu hỏi và phần chốt tiếng Việt trong sách.
- Nhúng YouTube: https://developers.google.com/youtube/player_parameters — dùng iframe, có thao tác chủ động phát, không autoplay âm thanh.

## Kiểm thử và phần cần nghiệm thu thật

- 12 kiểm thử tự động: dữ liệu câu hỏi, chấm điểm, lưu tiến độ, 365 hướng trục, ngày đêm, link nhúng và mô hình GLB.
- Trình duyệt: đã mở mô hình NASA và cận cảnh, infographic mùa, thư viện và player YouTube; đã thấy lớp lật hướng forward khi bật hiệu ứng.
- Duyệt đủ 24 trang ở 360×800: không tràn ngang, không phát hiện ảnh hỏng trong lượt kiểm tra. Không có lỗi console ở các luồng đã duyệt.
- Thử nghiệm responsive trên máy tính không thay thế Android/iPhone thật. Chưa đo FPS/độ nghe rõ trên thiết bị lớp học, chưa thử kính VR; giọng đọc phụ thuộc máy.
- Google Form GV, video riêng Trạm 0 và Bước 0 vẫn giữ trạng thái cần xác nhận; không ghi đè bằng video NASA hậu bài học để lộ đáp án dự đoán.

## Cách tự thử bản nâng cấp

- [ ] Lật tiến/lùi bằng mũi tên, góc trang, vuốt ngoài mô hình; không lật khi kéo ngày/thẻ mùa.
- [ ] Bật/tắt âm thanh, tải lại kiểm tra giữ lựa chọn.
- [ ] Mở Hook, đọc “Em làm/Để hiểu”, thử nút dẫn đến hoạt động.
- [ ] Ở Trạm 1: chọn Cận cảnh, Ẩn/Hiện lưới, dừng/bật tự quay; kiểm tra trục ở 22/6 và 22/12.
- [ ] Mở từng infographic và kiểm tra chữ trên điện thoại.
- [ ] Học liệu trang 9 → video NASA → Phát video trong sách; thử link mở ngoài.
- [ ] Kiểm tra dự đoán, điểm cũ và phản tư vẫn còn sau nâng cấp.
