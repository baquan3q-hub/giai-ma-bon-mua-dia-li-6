# Bộ prompt ảnh v1.3 — “Giải mã bốn mùa”

Ngày viết: 11/11/2026. Trạng thái: **chưa tạo ảnh** — Quân tạo rồi gửi lại. Tổng 25 ảnh, chia 5 nhóm.

## Cách dùng

1. Dán nội dung `system-prompt-anh-ai.txt` làm chỉ dẫn chung (phong cách, bảng màu, quy tắc nền trong suốt).
2. Với nhóm A (Sao Mai): đính kèm ảnh `anh-goc/nhan-vat/A01` làm tham chiếu nhân vật. Với nhóm B: đính kèm B03 làm tham chiếu phong cách.
3. Dán prompt tiếng Anh của từng mã. Mỗi lần tạo một ảnh.
4. Lưu PNG đúng tên mã vào thư mục ghi ở cột “Lưu vào”, rồi báo tôi. Tôi chạy `npm run images`, kiểm tra nền trong suốt và gắn vào trang.

Thứ tự ưu tiên nếu chỉ làm được một phần: **H01–H02 → A07 → B06–B08 → I01–I04 → A08–A10 → J01–J12**. Thiếu ảnh nào thì trang vẫn chạy bằng ảnh tạm hiện có.

## Quy tắc kiến thức (áp dụng cho mọi ảnh)

- Ảnh chỉ là minh hoạ. Không vẽ sơ đồ khoa học, quỹ đạo, trục nghiêng, góc, tia sáng có số đo — những thứ đó do mã vẽ từ dữ liệu.
- Không có chữ, số, nhãn, logo, chữ kí trong ảnh. Nhiệt độ, tên thành phố, ngày tháng do HTML hiển thị.
- **Sydney tháng 7 là mùa đông dịu (khoảng 8–17°C): không có tuyết, không băng, cây vẫn xanh.** Ảnh nào ra tuyết phải tạo lại.
- **Hà Nội tháng 7 là mùa hè nóng ẩm (khoảng 26–33°C):** nắng gắt, cây xanh đậm, có thể có mây dông xa.
- Không vẽ Mặt Trời to/nhỏ khác nhau giữa hai cảnh (tránh củng cố quan niệm sai “gần Mặt Trời thì nóng”).

---

## Nhóm H — Hai thành phố cùng tháng 7 (trang 6)

Thay G01/G02 đang bị cắt mất nhân vật. Hai ảnh phải cùng góc máy, cùng cỡ nhân vật, để đặt cạnh nhau là so sánh được ngay.

| Mã | Trang | Tỉ lệ | Nền | Lưu vào |
|---|---|---|---|---|
| H01 | 6 (thẻ trái) | 3:4 dọc | Không trong suốt | `anh-goc/tranh-doi/` |
| H02 | 6 (thẻ phải) | 3:4 dọc | Không trong suốt | `anh-goc/tranh-doi/` |

### H01 · Hà Nội tháng 7

```text
Vertical 3:4 stylized 3D educational illustration. A Vietnamese student aged 11–12 standing in the exact center of the frame, full body visible from head to shoes, facing the viewer, on a Hanoi street beside a lake in midsummer. The student wears a short-sleeved t-shirt, shorts, sandals and a sun hat, holds a paper fan and a water bottle, looks hot but cheerful. Strong bright midday sunlight, short shadows, deep green leafy trees, a flame tree with red blossoms, a traditional small pavilion and a red wooden bridge softly in the background, humid summer haze. Eye-level camera, character occupies the middle 60 percent of the height. Keep the top 15 percent as plain sky and the bottom 20 percent as plain pavement with no important details. Palette: warm gold, deep green, ivory, navy accents. Matte materials, rounded forms.
```

Cần tránh: chữ, biển hiệu có chữ, cờ, số, nhiệt kế, Mặt Trời vẽ thành đĩa lớn, nhân vật bị cắt chân/đầu, nhân vật lệch khỏi giữa, đám đông, xe cộ che nhân vật.

### H02 · Sydney tháng 7

```text
Vertical 3:4 stylized 3D educational illustration, matching composition to a paired summer image. A student aged 11–12 standing in the exact center of the frame, full body visible from head to shoes, facing the viewer, on a harbour-side promenade in Sydney in mid-winter. The student wears a warm padded jacket, long trousers, closed shoes, a knitted beanie and a scarf, hands in pockets, a small visible breath of cool air, cheerful. Low soft winter sunlight, long gentle shadows, clear pale-blue sky, green trees and lawn still green, calm harbour water and a softly simplified white sail-shaped waterfront building far in the background. Eye-level camera, character occupies the middle 60 percent of the height. Keep the top 15 percent as plain sky and the bottom 20 percent as plain pavement with no important details. Palette: cool blue, soft teal, ivory, navy accents. Matte materials, rounded forms.
```

Cần tránh: **tuyết, băng, người tuyết, cây trụi lá phủ tuyết**, chữ, biển hiệu, cờ, số, nhiệt kế, Mặt Trời vẽ nhỏ hoặc xa, nhân vật bị cắt, nhân vật lệch khỏi giữa.

---

## Nhóm B — Tranh nền nối hai trang

Một ảnh 3:2 phủ cả cặp trang. Chữ và tương tác nằm ở 2/3 trên, nên **cảnh chính phải nằm ở 1/3 dưới**; 2/3 trên là vùng yên (bầu trời/tường nhạt, ít chi tiết). 10% ở giữa theo chiều ngang là gáy sách: không đặt mặt nhân vật hay chi tiết quan trọng. Trên điện thoại mỗi trang lấy đúng nửa trái hoặc nửa phải, nên mỗi nửa phải tự đẹp.

| Mã | Dùng cho | Tỉ lệ | Nền | Lưu vào |
|---|---|---|---|---|
| B06 | Trạm 1 · trang 8–9, 10–11 | 3:2 ngang | Không trong suốt | `anh-goc/tranh-doi/` |
| B07 | Trạm 2 · trang 12–13 | 3:2 ngang | Không trong suốt | `anh-goc/tranh-doi/` |
| B08 | Trạm 3 · trang 14–15, 16–17 | 3:2 ngang | Không trong suốt | `anh-goc/tranh-doi/` |

### B06 · Đài quan sát

```text
Wide 3:2 landscape background, one continuous composition, stylized 3D illustration, style matching the reference. Interior of a round astronomical observatory at night seen from inside. The upper two thirds are a calm, softly lit ivory dome wall fading into a deep navy opening with a few faint stars — very low detail and low contrast, suitable as a quiet area behind text. The lower third holds the scene: on the left a brass and navy telescope on a wooden platform; on the right a curved desk with rolled star charts, a small lamp and a blank globe stand; brass railings connecting both sides. Keep the central 10 percent of the width free of important objects. Warm gold lamp light below, cool navy above.
```

Cần tránh: chữ, số, hành tinh có vành, sơ đồ quỹ đạo, mũi tên, nhân vật, khung sách, nếp gấp giữa, vùng trên nhiều chi tiết.

### B07 · Bốn mùa

```text
Wide 3:2 landscape background, one continuous composition, stylized 3D illustration, style matching the reference. A gentle rolling countryside panorama whose lower third changes smoothly from left to right through four seasons: far left spring with pink blossom trees and fresh grass, centre-left summer with deep green trees and golden light, centre-right autumn with orange and amber leaves, far right winter with bare branches and cool pale light. The upper two thirds are a calm, nearly empty ivory-to-pale-blue sky with only a few soft clouds, very low detail, suitable as a quiet area behind text. Keep the central 10 percent of the width free of important objects. Same horizon height across the whole width.
```

Cần tránh: chữ, số, Mặt Trời, Trái Đất, mũi tên, nhân vật, lịch, bốn ô tách rời có viền (phải là một cảnh liền), khung sách, nếp gấp giữa.

### B08 · Bầu trời ngày và đêm

```text
Wide 3:2 landscape background, one continuous composition, stylized 3D illustration, style matching the reference. A quiet lakeside horizon with low hills and a few small houses occupying only the lower third. The sky blends smoothly from warm golden daylight on the left half to deep navy starry night on the right half, with a soft dawn-like gradient in the middle. The upper two thirds are sky only, very low detail and low contrast, suitable as a quiet area behind text. Small house windows are dark on the left and softly lit on the right. Keep the central 10 percent of the width free of important objects.
```

Cần tránh: chữ, số, đồng hồ, đĩa Mặt Trời hoặc Mặt Trăng lớn, đường cong chuyển động của Mặt Trời, mũi tên, nhân vật, đường chia đôi cứng giữa ngày và đêm, khung sách.

---

## Nhóm I — Icon bốn mùa (trang 12, 13, 18, 23)

Chỉ dẫn chung: một vật thể 3D độc lập, nền alpha thật, vuông 1:1, có khoảng đệm quanh vật, nhìn rõ ở cỡ 48px, vật liệu mờ, cùng góc nhìn và cùng độ lớn giữa bốn icon.

| Mã | Mùa | Tỉ lệ | Nền | Lưu vào |
|---|---|---|---|---|
| I01 | Xuân | 1:1 | Trong suốt | `anh-goc/icons/` |
| I02 | Hạ | 1:1 | Trong suốt | `anh-goc/icons/` |
| I03 | Thu | 1:1 | Trong suốt | `anh-goc/icons/` |
| I04 | Đông | 1:1 | Trong suốt | `anh-goc/icons/` |

```text
I01: A single stylized 3D icon of a small branch with pink peach blossoms and two fresh green leaves, isolated, genuine transparent background, square 1:1, generous padding, matte materials, clear silhouette.

I02: A single stylized 3D icon of a bright green leafy tree crown with a small golden straw sun hat resting on it, isolated, genuine transparent background, square 1:1, generous padding, matte materials, clear silhouette.

I03: A single stylized 3D icon of two autumn leaves, one orange and one amber, gently overlapping, isolated, genuine transparent background, square 1:1, generous padding, matte materials, clear silhouette.

I04: A single stylized 3D icon of a knitted navy and teal scarf wrapped around a bare small branch, isolated, genuine transparent background, square 1:1, generous padding, matte materials, clear silhouette.
```

Cần tránh: chữ, số, nền caro, nền trắng, bóng đổ hình chữ nhật, nhân vật, Mặt Trời (dễ gợi “hè vì gần Mặt Trời”), bông tuyết làm biểu tượng chính của mùa đông (Hà Nội và Sydney đều không có tuyết).

---

## Nhóm A — Sao Mai, tư thế mới

Đính kèm A01 làm tham chiếu. Mỗi ảnh một tư thế, toàn thân, nền alpha thật, dọc 3:4.

| Mã | Dùng ở | Tỉ lệ | Nền | Lưu vào |
|---|---|---|---|---|
| A07 | Bong bóng lời dẫn (mọi trang) | 3:4 dọc | Trong suốt | `anh-goc/nhan-vat/` |
| A08 | Trang quan sát mô hình (8, 9, 14, 17) | 3:4 dọc | Trong suốt | `anh-goc/nhan-vat/` |
| A09 | Trang phiếu ghi, hồ sơ (19, 20, 22) | 3:4 dọc | Trong suốt | `anh-goc/nhan-vat/` |
| A10 | Trang 6, 7 (Sydney) | 3:4 dọc | Trong suốt | `anh-goc/nhan-vat/` |

```text
A07: Use reference as character identity. Create ONE isolated pose of the exact same Sao Mai golden star explorer, same face, five-point body, hat with goggles, navy vest, scarf, materials and palette. Leaning slightly forward and pointing clearly with one hand toward the lower right of the frame, as if saying "tap here", friendly smile, eyes looking at the viewer. Full body with ample padding, premium polished stylized 3D illustration, genuine transparent background. No text, watermark, floor or checkerboard.

A08: Use reference as character identity. Create ONE isolated pose of the exact same Sao Mai golden star explorer, same face, five-point body, hat with goggles, navy vest, scarf, materials and palette. Holding a large brass magnifying glass up with one hand and looking through it toward the viewer's right, curious focused expression. Full body with ample padding, premium polished stylized 3D illustration, genuine transparent background. No text, watermark, floor or checkerboard.

A09: Use reference as character identity. Create ONE isolated pose of the exact same Sao Mai golden star explorer, same face, five-point body, hat with goggles, navy vest, scarf, materials and palette. Holding an open blank notebook in one hand and a pencil in the other, writing a note, pleased concentrated expression. The notebook pages are completely blank. Full body with ample padding, premium polished stylized 3D illustration, genuine transparent background. No text, watermark, floor or checkerboard.

A10: Use reference as character identity. Create ONE isolated pose of the exact same Sao Mai golden star explorer, same face, five-point body, hat with goggles, navy vest, materials and palette. Wearing an extra thick knitted winter scarf and small mittens, hugging itself lightly as if feeling chilly, surprised amused expression, a tiny puff of cool breath. Full body with ample padding, premium polished stylized 3D illustration, genuine transparent background. No text, watermark, floor or checkerboard.
```

Cần tránh: đổi khuôn mặt hoặc tỉ lệ so với A01, mất mũ/kính, chữ trên sổ, nền trắng, bóng đổ dưới chân, bông tuyết quanh A10.

---

## Nhóm J — Icon giao diện 3D

Thay các icon nét SVG tạm trong `src/pages/frames.ts`. Chỉ dẫn chung (dán trước mỗi dòng): 

```text
A single stylized 3D interface icon, isolated, genuine transparent background, square 1:1, generous padding, matte materials, navy #0F1B33 with gold #F5A623 accents, front-facing, bold simple silhouette that stays readable at 24 pixels. No text, letters, numbers, watermark, checkerboard or character.
```

| Mã | Chức năng | Vị trí dùng | Prompt (nối sau chỉ dẫn chung) |
|---|---|---|---|
| J01 | Mục lục | Đầu trang | `Subject: three short rounded horizontal bars stacked, the top one gold.` |
| J02 | Âm thanh | Đầu trang | `Subject: a rounded loudspeaker with two curved gold sound waves.` |
| J03 | Toàn màn hình | Đầu trang, trang 8 | `Subject: four rounded corner brackets pointing outward, forming an expanding frame.` |
| J04 | Nghe đọc | Đầu trang | `Subject: a pair of rounded headphones with gold ear cushions.` |
| J05 | Tuỳ chọn | Đầu trang | `Subject: two horizontal slider tracks, each with one round gold knob at different positions.` |
| J06 | Infographic | Thanh hành động | `Subject: three rounded vertical bars of different heights on a small base, the tallest gold.` |
| J07 | Xem 360° | Trang 10, 16 | `Subject: a small globe-like sphere encircled by one flat gold ring with a small arrowhead, suggesting look-around.` |
| J08 | Phiếu ghi | Trang 19–22 | `Subject: a clipboard with a blank ivory sheet and a small gold pencil leaning on it.` |
| J09 | Kiểm tra | Trang 20, 21 | `Subject: a round badge with a thick gold check mark.` |
| J10 | Nhiệt kế nóng | Trang 6 | `Subject: a rounded thermometer filled almost to the top with warm orange-red liquid, no scale marks.` |
| J11 | Nhiệt kế lạnh | Trang 6 | `Subject: a rounded thermometer filled only near the bottom with cool blue liquid, no scale marks.` |
| J12 | Lịch tháng 7 | Trang 6 | `Subject: a desk calendar block with a blank ivory page and two gold rings on top.` |

Cần tránh: chữ số trên nhiệt kế hoặc lịch (số “7” sẽ do HTML đặt lên), vạch chia độ, nhân vật, nền trắng, nhiều vật trong một icon.

---

## Kiểm tra trước khi gửi lại

- [ ] Tên file đúng mã (ví dụ `H01.png`), đúng thư mục.
- [ ] Nhóm I, A, J: nền thật sự trong suốt (mở trên nền tối không thấy viền trắng hay ô caro).
- [ ] H01, H02: nhân vật đủ đầu đến chân, đứng giữa, hai ảnh cùng cỡ nhân vật; H02 không có tuyết.
- [ ] B06–B08: cảnh chính ở 1/3 dưới, 2/3 trên yên, không có chi tiết quan trọng ở gáy giữa.
- [ ] Không ảnh nào có chữ, số, logo.
