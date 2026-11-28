# Tin nhắn gửi ChatGPT để tạo ảnh và icon

## Bạn chuẩn bị

1. Mở **một cuộc trò chuyện mới** trên ChatGPT (bản có tạo ảnh).
2. Đính kèm 3 file:
   - `prompt-anh-v2-hoc-sinh.md` (8 ảnh trang + 5 ảnh infographic)
   - `prompt-icons-v2.md` (27 icon 3D)
   - `A01.png` (ảnh mẫu Sao Mai, ở `anh-goc/nhan-vat/`)
3. Dán **Tin nhắn 1** bên dưới và gửi.
4. Mỗi khi ChatGPT tạo xong một ảnh: tải về, đổi tên đúng mã, bỏ vào đúng thư mục, rồi gõ một trong các lệnh ngắn ở cuối file này.

---

## Tin nhắn 1 (dán nguyên văn)

```text
Chào bạn. Mình đang làm ebook tương tác "Giải mã bốn mùa" (Địa lí 6, Bài 8) cho học sinh 11–12 tuổi. Mình cần bạn tạo bộ ảnh minh hoạ và icon 3D theo đúng 2 file đính kèm.

FILE ĐÍNH KÈM
1. prompt-anh-v2-hoc-sinh.md: 8 ảnh trang (H01, H02, K01, M01, M02, A07, A08, L01) và 5 ảnh trang trí infographic (I01–I05).
2. prompt-icons-v2.md: 27 icon 3D (J01–J06, N01–N21).
3. A01.png: ảnh mẫu nhân vật Sao Mai. Dùng làm mẫu bắt buộc cho A07 và A08.

CÁCH LÀM
- Đọc kỹ cả hai file trước. Áp dụng "Lời dặn chung" (mục 1 file ảnh) và "Phong cách chung" (mục 2 file icon) cho mọi ảnh.
- Mỗi lượt chỉ tạo MỘT ảnh, dùng đúng prompt tiếng Anh trong file cho mã đó. Không tự thêm chi tiết ngoài prompt.
- Làm theo thứ tự này:
  Đợt 1 – Icon: N03 trước (icon mẫu). Khi mình chốt N03, tạo tiếp N09, N05, N06, N07, N02, rồi J01–J06, rồi các N còn lại. Mọi icon sau N03 phải giống hệt N03 về chất liệu, ánh sáng, góc nhìn 3/4, lề và độ chiếm khung 70%.
  Đợt 2 – Ảnh trang: H01, H02 (cùng khung, cùng cỡ nhân vật, cùng cỡ Mặt Trời), K01, M01, M02, A07, A08, L01.
  Đợt 3 – Infographic: I01, rồi I02–I05 (bốn quả cầu cùng kích thước, cùng góc).
- Sau mỗi ảnh, DỪNG LẠI và chờ mình trả lời. Không tự tạo ảnh tiếp theo.

QUY TẮC BẮT BUỘC (kiểm tra trước khi gửi ảnh)
- Không có chữ, số, chữ cái, logo, hình mờ, vạch chia trong ảnh.
- Icon và ảnh ghi "transparent background": nền trong suốt thật (kênh alpha), không vẽ ô caro, không nền trắng.
- Icon vuông 1:1. Ảnh trang đúng tỉ lệ ghi trong file (3:4, 16:9, 4:5, 3:2, 1:1).
- Sydney tháng 7 là mùa đông ôn hoà: không tuyết, không băng, cây vẫn xanh.
- Không vẽ sơ đồ khoa học (quỹ đạo có nhãn, góc trục, tia sáng hình học).
- Icon sẽ đặt trên nền xanh đêm #101A33: có viền sáng mềm, tránh mảng tối lớn.

SAU MỖI ẢNH, TRẢ LỜI NGẮN THEO MẪU
Mã: N03 · Tên file: N03.png · Lưu vào: anh-goc/icons-3d/
Tự kiểm tra: không chữ ✓ · nền trong suốt ✓ · đúng tỉ lệ ✓ · đúng phong cách N03 ✓
(Nếu có điểm nào chưa đạt, nói rõ và đề nghị tạo lại.)

Thư mục lưu theo mã:
- J01–J06, N01–N21 → anh-goc/icons-3d/
- H01, H02, K01, M02 → anh-goc/tranh-doi/
- M01, L01 → anh-goc/vat-pham/
- A07, A08 → anh-goc/nhan-vat/
- I01–I05 → anh-goc/infographic/

Nếu đã hiểu, hãy tóm tắt lại trong 3 dòng rồi bắt đầu tạo N03.
```

---

## Lệnh ngắn trong lúc làm

| Bạn muốn | Gõ |
|---|---|
| Ảnh đạt, sang ảnh tiếp | `OK, tiếp` |
| Chốt icon mẫu N03 | `Chốt N03 làm icon mẫu. Từ giờ mọi icon phải giống hệt N03. Tiếp N09.` |
| Tạo lại ảnh vừa rồi | `Làm lại [mã]: [lỗi], giữ nguyên phần còn lại.` |
| Nhảy tới mã khác | `Tạo [mã] theo đúng prompt trong file.` |
| ChatGPT bắt đầu lệch phong cách | `Dừng lại. Xem lại N03 mình đã chốt và mục 2 file icon. Tạo lại [mã] cho khớp N03.` |
| Ảnh có chữ hoặc nền không trong suốt | Dùng câu "Fix: …" ở mục 7 của từng file prompt. |

## Mẹo

- Cuộc trò chuyện quá dài (khoảng 15–20 ảnh) thì ChatGPT hay quên phong cách. Khi đó mở cuộc mới, đính kèm lại 2 file + **N03.png** (và A01.png nếu còn ảnh Sao Mai), dán Tin nhắn 1, rồi gõ `Tiếp từ [mã]`.
- Khi tải ảnh về, đổi tên ngay đúng mã (ví dụ `N03.png`) trước khi bỏ vào thư mục.
- Bỏ xong một đợt thì báo mình, mình chạy `npm run images` và lắp vào sách.
