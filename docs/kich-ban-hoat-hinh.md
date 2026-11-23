# Kịch bản hoạt hình V1–V3 — “Giải mã bốn mùa” v1.4

> Mốc 0. **Quân duyệt lời trước khi dựng.**
> Không dùng tệp video. Hoạt hình được dựng ngay trong app bằng SVG, vẽ từ hàm khoa học có sẵn (`orbitPoint`, `orbitAxis2D`, `tiltAngles`, `parallelSplit`, `dayLength`). Vì vậy số liệu luôn khớp mô phỏng, tệp nhẹ và chạy không cần mạng.

## Quy ước chung

| Mục | Quy ước |
|---|---|
| Độ dài | Mỗi đoạn ≤ 90 giây; chia **chương** để giáo viên dừng trước phần kết luận (POE) |
| Giọng | Web Speech, tiếng Việt (vi-VN), tốc độ 0,9 nếu máy có giọng Việt. Không có giọng thì vẫn chạy theo thời gian của cảnh. |
| Phụ đề | **Luôn hiện**, ≤ 2 dòng, mỗi dòng ≤ 12 chữ, chữ ≥ 18 px (≥ 32 px khi trình chiếu) |
| Tốc độ đọc | ≈ 3 chữ/giây, chậm hơn người lớn. Thời lượng mỗi cảnh = số chữ ÷ 3 + 1–2 giây nghỉ. |
| Màu | Vàng là phần được chiếu sáng · tím than là đêm · đỏ cam là tia sáng · đỏ nhạt là nửa cầu mùa nóng · xanh lam nhạt là nửa cầu mùa lạnh · trục là vạch đỏ đậm |
| Nhìn vào đây | Mỗi cảnh có tối đa **một** vòng sáng nhấp nháy nhẹ chỉ vào điều lời đang nói |
| Điều khiển | Phát/Dừng · thanh tua (nhảy theo cảnh) · Chậm 0,75× |
| Trình chiếu | Space để phát/dừng, ← → để lùi/tới một cảnh. Hết chương thì tự dừng. |
| Nhân vật | Sao Mai: ngôi sao nhỏ có mặt cười, góc dưới trái, chỉ mấp máy khi nói. Không vẽ người thật. |

---

## V1 — “Bản tin hai bán cầu” (≈ 75″, trang 3, Trước giờ)

**Mục tiêu:** cho học sinh *thấy* hiện tượng trái mùa và *tự đặt câu hỏi*. **Không giải thích nguyên nhân**, vì phần giải thích để dành cho lúc lên lớp.

| # | Thời gian | Hình | Lời đọc = phụ đề | Nhìn vào đây |
|---|---|---|---|---|
| 1 | 0–8″ | Khung bản tin “BẢN TIN HAI BÁN CẦU · 15/7”; Sao Mai cầm micro | Xin chào các nhà giải mã! Đây là bản tin hai bán cầu, ngày 15 tháng 7. | Dòng ngày 15/7 |
| 2 | 8–22″ | Nửa trái: Hà Nội, nắng gắt, nhiệt kế 36 °C, bạn nhỏ đội mũ, cầm quạt | Ở Hà Nội, trời nắng chang chang, nhiệt độ lên tới 36 độ. Các bạn nhỏ rủ nhau đi bơi. | Nhiệt kế 36 °C |
| 3 | 22–36″ | Nửa phải: Sydney, trời se lạnh, nhiệt kế 12 °C, người mặc áo khoác, quàng khăn | Cùng ngày hôm đó, ở Sydney, nước Ô-xtrây-li-a, trời chỉ khoảng 12 độ. Mọi người mặc áo khoác, quàng khăn. | Nhiệt kế 12 °C |
| 4 | 36–50″ | Thu về quả Địa Cầu: đường Xích đạo; chấm Hà Nội ở nửa trên, Sydney ở nửa dưới | Hà Nội ở nửa cầu Bắc. Sydney ở nửa cầu Nam. Cùng một Trái Đất, cùng một ngày, mà hai nơi lại trái mùa nhau. | Đường Xích đạo |
| 5 | 50–63″ | Hai đồng hồ nhỏ: Hà Nội mọc 5:25 · lặn 18:35; Sydney mọc 7:00 · lặn 17:00 *(làm tròn, chỉ để so sánh)* | Không chỉ nóng lạnh khác nhau. Hôm nay, Mặt Trời ở Hà Nội mọc sớm, lặn muộn. Ở Sydney thì ngược lại. | Hai giờ lặn |
| 6 | 63–75″ | Dấu hỏi lớn trên quả Địa Cầu; Sao Mai chỉ tay sang phải | Vì sao lại như vậy? Có phải nơi nào gần Mặt Trời hơn thì nóng hơn? Hãy ghi dự đoán của em ở trang sau nhé! | Dấu hỏi |

- **Số chữ lời đọc:** 130 chữ, khoảng 45″ đọc. Phần còn lại là nghỉ và chuyển cảnh, tổng ≈ 75″.
- **Kiểm tra số liệu:**
  - Giờ mọc/lặn ở cảnh 5 phải khớp độ dài ngày trong `earth.ts` ngày 15/7 (ngày 196): Hà Nội 13 giờ 09, Sydney 9 giờ 58.
  - Giờ cụ thể chỉ minh hoạ, vì giờ địa phương còn phụ thuộc kinh độ. Khi dựng sẽ lấy `daylightPath()` rồi làm tròn 5 phút.
- **Nhiệt độ:** lấy mức tiêu biểu tháng 7 (Hà Nội ≈ 30–36 °C; Sydney ≈ 8–17 °C). Dùng 12 °C cho Sydney là trung bình ban ngày, hợp lí.

---

## V2 — “Một năm của Trái Đất” (≈ 85″, trang 6, Tiết 1)

**Mục tiêu:** YC1 (chương 1) và YC2 (chương 2). Hình vẽ theo góc nhìn Hình 1 SGK: quỹ đạo nhìn chếch, Mặt Trời ở giữa, 4 vị trí 21/3, 22/6, 23/9, 22/12.

### Chương 1 — Chuyển động và trục (≈ 40″, dùng ở Hoạt động 2.1)

| # | Thời gian | Hình | Lời đọc = phụ đề | Nhìn vào đây |
|---|---|---|---|---|
| 1 | 0–10″ | Mặt Trời ở giữa; quỹ đạo vẽ dần thành elip gần tròn | Trái Đất chuyển động quanh Mặt Trời trên một quỹ đạo hình elip gần tròn. | Đường quỹ đạo |
| 2 | 10–24″ | Trái Đất chạy dọc quỹ đạo, mũi tên “tây → đông”; bộ đếm ngày chạy lên “365 ngày 6 giờ” | Trái Đất chuyển động theo hướng từ tây sang đông. Đi hết một vòng mất 365 ngày 6 giờ. | Bộ đếm ngày |
| 3 | 24–40″ | Phóng to: trục đỏ đậm, cung góc 66°33′ với mặt phẳng quỹ đạo. Trái Đất tiếp tục chạy, để lại 4 “bóng” ở 4 vị trí, 4 trục song song | Trong khi chuyển động, trục Trái Đất luôn nghiêng 66 độ 33 phút, và không đổi hướng. Em thấy không: bốn trục song song với nhau! | 4 trục song song |

> **Tự dừng ở đây.** Giáo viên hỏi: “Khi Trái Đất đi hết một vòng, đầu trục luôn chỉ về đâu?”, rồi bấm → để sang chương 2.

### Chương 2 — Hai nửa cầu lần lượt ngả về Mặt Trời (≈ 45″, dùng ở Hoạt động 2.2)

| # | Thời gian | Hình | Lời đọc = phụ đề | Nhìn vào đây |
|---|---|---|---|---|
| 4 | 40–56″ | Dừng ở 22/6, phóng to Trái Đất; tia sáng đỏ cam; nửa cầu Bắc tô đỏ nhạt, nửa Nam xanh lam nhạt (giống Hình 2 SGK) | Ngày 22 tháng 6, nửa cầu Bắc ngả về phía Mặt Trời, nhận nhiều ánh sáng và nhiệt. Đó là mùa nóng. Nửa cầu Nam chếch xa: mùa lạnh. | Nửa cầu Bắc |
| 5 | 56–70″ | Trái Đất chạy nửa vòng sang 22/12; trục vẫn song song; màu hai nửa cầu đổi chỗ | Sáu tháng sau, ngày 22 tháng 12, trục vẫn giữ hướng cũ, nhưng Trái Đất đã sang phía bên kia. Lúc này nửa cầu Nam ngả về Mặt Trời. | Nửa cầu Nam |
| 6 | 70–85″ | Lướt qua 21/3 và 23/9: tia sáng chiếu thẳng góc Xích đạo. Thẻ chốt hiện ra: “Trục nghiêng + không đổi hướng → hai nửa cầu lần lượt ngả về Mặt Trời → có mùa” | Ngày 21 tháng 3 và 23 tháng 9, Mặt Trời chiếu thẳng góc Xích đạo. Vậy chìa khoá của mùa là gì? Là trục nghiêng, và không đổi hướng. | Thẻ chốt |

- **Số chữ lời đọc:** 147 chữ, khoảng 50″ đọc. Phần còn lại là chuyển động quỹ đạo và nghỉ, tổng ≈ 85″.
- **Kiểm tra số liệu:** 66°33′ = 90° − 23°27′; `EPSILON = 23,44` trong `earth.ts`. Vị trí 4 ngày lấy từ `dates` (ngày 80, 173, 266, 356).

---

## V3 — “Ngày dài, đêm ngắn” (≈ 88″, trang 10, Tiết 2)

**Mục tiêu:** YC3. Hình vẽ theo góc nhìn Hình 4 SGK: Trái Đất nhìn ngang, tia sáng từ trái sang, đường sáng–tối nghiêng; vĩ tuyến 66°33′B, 23°27′B, 0°, 23°27′N, 66°33′N.

### Chương 1 — Ngày 22/6 (≈ 60″)

| # | Thời gian | Hình | Lời đọc = phụ đề | Nhìn vào đây |
|---|---|---|---|---|
| 1 | 0–12″ | Trái Đất ngày 22/6; nửa trái vàng là ngày, nửa phải tím than là đêm; đường sáng–tối nghiêng | Đây là Trái Đất ngày 22 tháng 6. Nửa được Mặt Trời chiếu sáng là ban ngày, nửa còn lại là ban đêm. | Đường sáng–tối |
| 2 | 12–28″ | Chấm Hà Nội chạy dọc vĩ tuyến 21°B; đoạn trong phần sáng tô đậm; thanh dưới hiện “Ngày 13 giờ 17 · Đêm 10 giờ 43” | Khi Trái Đất tự quay, Hà Nội đi qua phần sáng dài hơn phần tối. Ban ngày khoảng 13 giờ 17 phút, ban đêm 10 giờ 43 phút. | Đoạn sáng của vĩ tuyến Hà Nội |
| 3 | 28–40″ | Chấm chạy trên Xích đạo; đường sáng–tối chia đôi; thanh “12 giờ · 12 giờ” | Ở Xích đạo, đường sáng tối chia đôi vòng tròn. Ngày và đêm đều khoảng 12 giờ, quanh năm. | Điểm giao ở Xích đạo |
| 4 | 40–52″ | Chấm Sydney (34°N); thanh “Ngày 9 giờ 45 · Đêm 14 giờ 15” | Còn Sydney ở nửa cầu Nam đang mùa lạnh. Ban ngày chỉ khoảng 9 giờ 45 phút, đêm dài hơn 14 giờ. | Đoạn tối của vĩ tuyến Sydney |
| 5 | 52–64″ | Chấm ở 70°B nằm trọn trong phần sáng; nhãn “24 giờ”; vùng từ vòng cực Bắc đến cực tô vàng đậm | Càng về phía cực, chênh lệch càng lớn. Từ vòng cực Bắc đến cực Bắc, Mặt Trời không lặn suốt 24 giờ. | Vùng quanh cực Bắc |

> **Tự dừng ở đây.** Giáo viên hỏi: “Ngày 22/12 sẽ thế nào?”, để học sinh dự đoán trước khi xem chương 2.

### Chương 2 — Ngày 22/12 (≈ 24″)

| # | Thời gian | Hình | Lời đọc = phụ đề | Nhìn vào đây |
|---|---|---|---|---|
| 6 | 64–78″ | Hình lật sang 22/12: đường sáng–tối nghiêng ngược; Hà Nội “10 giờ 43”, Sydney “14 giờ 15” | Ngày 22 tháng 12 thì ngược lại. Nửa cầu Nam có ngày dài, nửa cầu Bắc có đêm dài. Hà Nội chỉ còn 10 giờ 43 phút ban ngày. | Thanh Hà Nội |
| 7 | 78–88″ | Thẻ chốt 3 dòng | Nhớ nhé: mùa nóng thì ngày dài hơn đêm. Xích đạo ngày bằng đêm. Càng về cực, chênh lệch càng lớn. | Thẻ chốt |

- **Số chữ lời đọc:** 164 chữ, khoảng 55″ đọc. Phần còn lại là chấm chạy trên vĩ tuyến và nghỉ, tổng ≈ 88″.
- **Kiểm tra số liệu:** chạy `dayLength(173 | 356, lat)`:
  - Hà Nội 21,03° → 13 giờ 17 / 10 giờ 43;
  - Sydney −33,87° → 9 giờ 45 / 14 giờ 15;
  - Xích đạo → 12 giờ 00;
  - 70°B → 24 giờ.
- **Lưu ý về vòng cực:** đúng tại 66°33′, mô hình ra 23 giờ 40 vì dùng 23,44°. Vì vậy lời đọc nói “**từ vòng cực đến cực**” và hình minh hoạ ở 70°B để khớp SGK.

---

## Kiểm thử khi dựng (Mốc 3)

- [ ] Mỗi đoạn ≤ 90″; cảnh nào cũng có phụ đề (test tự động).
- [ ] Mọi con số trong phụ đề được sinh từ `earth.ts`, không gõ tay (test so khớp).
- [ ] Hết chương 1 của V2 và V3 thì tự dừng.
- [ ] Không có giọng tiếng Việt vẫn chạy đúng nhịp, phụ đề vẫn hiện.
- [ ] Phát/Dừng, tua, Chậm hoạt động; Space, ← và → hoạt động trong chế độ trình chiếu.
- [ ] Không gọi mạng ngoài.

## Cần Quân duyệt

1. Lời đọc của 18 cảnh (V1: 6 · V2: 6 · V3: 7). Có câu nào khó hiểu với học sinh lớp 6 không?
2. V1 dùng hình nhân vật hoạt hình đơn giản, không dùng người thật: có ổn không?
3. Nhiệt độ minh hoạ: Hà Nội 36 °C, Sydney 12 °C.
4. Sao Mai là nhân vật dẫn chuyện cho cả ba đoạn.
