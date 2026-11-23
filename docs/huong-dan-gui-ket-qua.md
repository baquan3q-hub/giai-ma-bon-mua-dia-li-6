# Cấu hình gửi kết quả

Mặc định sách **không gửi dữ liệu ra ngoài**: học sinh tải hồ sơ JSON. Thầy cô có thể bật một hoặc cả hai cách gửi dưới đây trong `public/data/config.json`. Sách không lưu họ tên, lớp vào tiến độ; chỉ dùng khi bấm gửi.

Hộp “Gửi kết quả” (trang 16) hiện bảng tóm tắt, mỗi mục là một trường riêng:

| Khoá | Nội dung | Ví dụ |
|---|---|---|
| `name`, `className` | Họ tên, lớp do học sinh nhập | Nguyễn An · 6A |
| `score` | Lần kiểm tra gần nhất | `8/10 · đạt` |
| `wrong` | Số thứ tự câu sai | `3, 9` |
| `misconception` | Dự đoán “Vì sao có mùa?” trước giờ và kết quả câu 7 | `Trước giờ đoán: do gần – xa · Câu 7: đúng (đã hiểu do trục nghiêng)` |
| `sheets` | Phiếu học tập 1–3 đã xong | `3/3` |
| `badges` | Huy hiệu trạm | `5/5` |
| `rubric` | Vali: số tiêu chí đạt (chấm gợi ý theo từ khoá) và xác nhận của thầy cô | `3/3 · thầy cô đã xác nhận` |
| `result` | Toàn bộ hồ sơ JSON (không bắt buộc, có thể dài) | |

## Cách 1 · Google Form điền sẵn

1. Tạo Google Form với các câu “Trả lời ngắn” cho những khoá muốn nhận (ít nhất Họ tên, Lớp, Điểm).
2. ⋮ → **Lấy đường liên kết điền sẵn**, gõ dữ liệu mẫu, lấy URL; mỗi trường có dạng `entry.123456789`.
3. Trong `config.json`: `googleForm.url` = URL `.../viewform` (HTTPS); `googleForm.entries.<khoá>` = mã `entry.…` tương ứng. Khoá để trống thì bỏ qua.
4. Học sinh bấm **Mở Google Form điền sẵn**, kiểm tra rồi tự bấm Gửi trong Form.

## Cách 2 · Gửi thẳng vào Google Sheets (Apps Script)

1. Tạo Google Sheet → Tiện ích mở rộng → Apps Script, dán:

```js
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sh.getLastRow() === 0) sh.appendRow(['Thời gian','Họ tên','Lớp','Điểm','Câu sai','Quan niệm','Phiếu','Huy hiệu','Vali','Hồ sơ']);
  sh.appendRow([new Date(), d.name, d.className, d.score, d.wrong, d.misconception, d.sheets, d.badges, d.rubric, JSON.stringify(d.payload)]);
  return ContentService.createTextOutput('ok');
}
```

2. Triển khai → Triển khai mới → Ứng dụng web; Thực thi với tư cách: **Tôi**; Ai có quyền truy cập: **Bất kỳ ai**. Sao chép URL `https://script.google.com/macros/s/…/exec`.
3. Đặt URL đó vào `config.json` → `appsScript.url`, build lại.
4. Học sinh nhập họ tên → **Gửi thẳng cho thầy cô**. Trình duyệt gửi ở chế độ `no-cors` nên sách không đọc được phản hồi: sách chỉ báo “đã gửi đi” và nhắc tải hồ sơ nếu thầy cô chưa nhận. Thầy cô kiểm tra Sheet trước khi ghi nhận.

Tiến độ chỉ lưu tại trình duyệt đang dùng; dùng chung thiết bị thì cần tải hồ sơ trước khi học lại. Kết quả phía client là minh chứng học tập, không phải kỳ thi có xác thực danh tính.
