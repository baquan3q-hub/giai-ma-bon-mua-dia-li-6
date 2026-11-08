# Giải mã bốn mùa

Ebook tương tác 24 trang cho Bài 8, Lịch sử và Địa lí 6, Kết nối tri thức. Có sách một/hai trang, 24 ảnh AI, mô phỏng quỹ đạo, khám phá 360°, đồng hồ ngày đêm, trò chơi và bài kiểm tra. Chạy không đăng nhập; cần kết nối để tải học liệu lần đầu.

## Chạy trên Windows

Cần Node.js 22.12 trở lên hoặc Node 24. Trong PowerShell tại thư mục này:

```powershell
npm ci
npm run dev
```

Mở **http://localhost:5174/**. Trạm 0 bắt đầu trang 6; mục lục trang 5. Bìa đứng riêng; từ 1100px và màn hình ngang hiển thị hai trang. Điện thoại một trang và có thể cuộn dọc để giữ chữ đủ lớn.

## Thử trên điện thoại

1. Máy tính và điện thoại cùng Wi-Fi.
2. Giữ terminal chạy; mở địa chỉ **Network** Vite in ra (ví dụ `http://192.168.1.13:5174/`). Không nhập localhost trên điện thoại.
3. Nếu không mở được, kiểm tra quyền truy cập mạng riêng của Node/Vite và Wi-Fi có cách ly thiết bị hay không. Không tắt toàn bộ tường lửa.
4. Thử trang 7, 8, 12, 14, 16 và bài kiểm tra. Tải lại để kiểm tra lưu tiến độ.
5. Cảm biến và WebXR cần HTTPS. Bản LAN HTTP chỉ dùng kiểm tra chạm, kéo, bố cục và công thức.

## Kiểm tra bản phát hành

```powershell
npm test
npm run build
npm run preview
```

`dist/` là bản phát hành. Ảnh, font, câu hỏi đóng gói cùng app; Three.js chỉ tải khi mở mô hình. Cấu hình đường dẫn tương đối dùng được ở thư mục con GitHub Pages.

## Chỉnh nội dung

- `src/content/book.ts`: tiêu đề, lời dẫn, mục lục 24 trang.
- `public/data/questions.json`: toàn bộ câu hỏi, đáp án và giải thích.
- `public/data/config.json`: thông tin nhóm, video và Google Form.
- `src/science/earth.ts`: công thức gần đúng.
- `src/scenes/world.ts`: cảnh quỹ đạo, đài quan sát và chân trời.
- `src/state/progress.ts`: lưu/đọc và điều kiện huy hiệu.
- `src/styles/`: giao diện sách.

Ảnh nguồn PNG và hồ sơ thiết kế nằm ở thư mục cha trong bản workspace. Repo app có sẵn ảnh WebP để chạy/build độc lập. `npm run images` chỉ cần khi đã có thư mục nguồn `../anh-goc/` và muốn tối ưu lại; lệnh không thay đổi ảnh gốc.

## Google Form

Điền `googleForm.url` bằng URL HTTPS của Form do GV quản lý. `entries` gồm ba mã `entry.123...` lấy từ liên kết điền sẵn của Form: `name`, `className`, `result`. Khi chưa cấu hình, sách chỉ xuất hồ sơ JSON, không giả báo gửi thành công. Người học cần bấm Gửi tại Form; GV xác nhận kết quả trong Responses/Sheets.

## Lưu và tự đánh giá

Tiến độ lưu trên trình duyệt hiện tại; không đồng bộ giữa thiết bị. Họ tên/lớp chỉ dùng khi mở Form và không được ghi vào tiến độ. Dự đoán ban đầu không bị ghi đè khi phản tư. Câu giải thích tự do dùng rubric, không chấm hiểu nghĩa tự động. Kết quả là hoạt động học, không phải bài thi xác thực danh tính.

Chế độ phát triển `?demo=1` tách huy hiệu thử vào sessionStorage, không sửa kết quả học. Bản production vô hiệu hoá chế độ này.

## Phạm vi nghiệm thu

- Công thức kiểm tra: Hà Nội 21°B ~13h17 ngày 22/6, ~10h43 ngày 22/12; Xích đạo 12h.
- Mô hình dạy học dùng kích thước phóng đại và số liệu gần đúng, không dự báo thời tiết hay lịch thiên văn chính xác. Giờ trong cảnh trời là giờ Mặt Trời địa phương.
- Có nhánh WebXR được bật theo hỗ trợ thiết bị; **chưa nghiệm thu kính VR thật**.
- Cần tiếp tục thử Android và iPhone/iPad thật, cảm biến qua HTTPS, FPS và Google Form của GV.
- Nguồn video, bản SGK 2026–2027, số tiết tại trường và mã năng lực số cần nhóm xác nhận. Hiện có bản tin thay video bằng chữ.

## Nguồn

SGK Bài 8, ảnh trang 122–124 do nhóm cung cấp; [NASA về mùa](https://spaceplace.nasa.gov/seasons/en/), [NOAA về vị trí Mặt Trời](https://gml.noaa.gov/grad/solcalc/solareqns.PDF), [Three.js](https://threejs.org/). Hình minh hoạ AI được tạo riêng cho dự án; không phải ảnh chụp thực địa.
