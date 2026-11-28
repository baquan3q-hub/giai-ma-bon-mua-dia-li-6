# Bộ prompt ảnh v2.0 — "Giải mã bốn mùa" (bản học sinh)

> Dùng cùng `storyboard-v2-hoc-sinh.md`. Gửi cho ChatGPT (tạo ảnh) **từng ảnh một**.
> Ảnh đã có và **dùng lại** (không tạo lại): A01–A06, B01–B05, C01–C02, D01–D06, E01–E05, G03–G05, bản đồ NASA.
> File này gồm **13 ảnh** = 8 ảnh trang + 5 ảnh trang trí infographic.
> **Icon 3D (27 icon, gồm cả J03, J04) nằm ở file riêng: `prompt-icons-v2.md`.**

## 0. Cách dùng

1. Mở cuộc trò chuyện mới, dán **Lời dặn chung** (mục 1) làm tin nhắn đầu.
2. Với ảnh có Sao Mai (A07, A08): **đính kèm A01** (`anh-goc/nhan-vat/A01*.png`) rồi mới dán prompt.
3. Icon: làm theo `prompt-icons-v2.md`.
4. Tải PNG, đặt tên đúng mã (ví dụ `K01.png`), bỏ vào thư mục ghi ở mục 5. Báo mình, mình chạy `npm run images` và lắp vào trang.
5. Ảnh lỗi (có chữ, sai kiến thức, méo) → gửi lại kèm câu "Fix: …" ở mục 6.

## 1. Lời dặn chung (dán đầu cuộc trò chuyện)

```text
You are illustrating an interactive Vietnamese geography e-book for students aged 11–12 ("Decoding the Four Seasons", Grade 6).
Style: polished stylized 3D educational illustration, soft rounded shapes, refined matte materials (soft clay / satin plastic), gentle studio lighting with soft ambient occlusion, clean silhouettes, calm and friendly, never cartoonish-noisy.
Palette: midnight navy #0F1B33, solar gold #F5A623, Earth blue #2E86DE, warm ivory #FFF6E5, teal accent #2BB3A3, soft violet night #8C6BD1. Use the palette as the dominant colors.
Hard rules for every image:
- NO text, letters, numbers, labels, logos, watermarks, signatures, charts or arrows with words.
- Do NOT draw scientific diagrams (orbits with labels, axis angles, sun-ray geometry): those are drawn in code.
- Sydney in July = mild winter, cool and windy, green trees, NO snow. Hanoi in July = hot, humid, bright summer.
- When the Sun appears in paired images, it must be the same size.
- Isolated assets: transparent background (real alpha), centered, ample padding, no shadow floor unless asked.
- Child-safe, culturally neutral clothing, diverse but natural skin tones.
Answer only with the image.
```

## 2. Ảnh minh hoạ trang (8 ảnh)

Mỗi ảnh có: **Trang · Mục đích · Tỉ lệ · Nền · Thành phần · Thuộc tính · Vùng trống · Tránh**, sau đó là prompt để dán.

### H01 — Hà Nội ngày 15/7 (ưu tiên 1)
- **Trang:** 3 (thẻ lật trái) · **Mục đích:** gây tò mò bằng tương phản mùa · **Tỉ lệ:** 3:4 dọc · **Nền:** có cảnh
- **Thành phần:** một bạn HS Việt Nam 11–12 tuổi, **thấy trọn người**, áo thun ngắn tay, quần short, mũ lưỡi trai, cầm quạt giấy, lau mồ hôi; phố Hà Nội: hàng cây xanh, nhà ống, Hồ Gươm xa xa; Mặt Trời cao chói, trời xanh trong.
- **Thuộc tính:** góc ngang tầm mắt, ánh nắng gắt buổi trưa, bóng đổ ngắn, tông ấm vàng cam.
- **Vùng trống:** 20% trên cùng trống (trời) để đặt nhiệt độ bằng HTML.
- **Tránh:** chữ trên biển hiệu, cắt mất chân/đầu nhân vật, quá đông người.

```text
Vertical 3:4 scene. A Vietnamese student aged 11–12, full body visible with padding on all sides, standing on a leafy Hanoi street in mid-July: short-sleeve T-shirt, shorts, cap, fanning with a paper fan and wiping sweat, friendly expression. Background: tube houses, green trees, a glimpse of Hoan Kiem Lake far away. High bright midday Sun, clear blue sky, short shadows, warm gold-orange light. Keep the top 20% as empty sky. Shop signs are blank shapes. Same character scale and framing as the paired Sydney image.
```

### H02 — Sydney ngày 15/7 (ưu tiên 1)
- **Trang:** 3 (thẻ lật phải) · **Tỉ lệ:** 3:4 · **Nền:** có cảnh · **Cặp với H01:** cùng khung, cùng cỡ nhân vật, cùng cỡ Mặt Trời.
- **Thành phần:** một bạn HS Úc 11–12 tuổi, thấy trọn người, áo khoác, khăn quàng, quần dài, giày; bến cảng Sydney, Nhà hát Opera nhìn mờ xa, cây vẫn xanh; Mặt Trời thấp, trời xanh nhạt, gió thổi lá.
- **Thuộc tính:** ánh sáng buổi trưa mùa đông xiên, bóng đổ dài, tông lạnh xanh – xám.
- **Vùng trống:** 20% trên cùng · **Tránh:** tuyết, băng, hơi thở khói trắng quá đậm.

```text
Vertical 3:4 scene, same framing and character scale as the Hanoi image. An Australian student aged 11–12, full body visible with padding, at Sydney Harbour on a mid-July noon: warm jacket, scarf, long trousers, sneakers, hands in pockets, wind moving the scarf. Background: the harbour, a soft distant silhouette of the Opera House, green trees, pale blue winter sky. The Sun is LOW in the sky and the same size as in the Hanoi image; long shadows; cool blue-grey light. Mild winter: absolutely no snow or ice. Keep the top 20% as empty sky.
```

### K01 — Bản đồ hành trình (ưu tiên 1)
- **Trang:** 2 · **Mục đích:** cho HS thấy lộ trình 4 chương, tạo cảm giác phiêu lưu · **Tỉ lệ:** 16:9 · **Nền:** có cảnh
- **Thành phần:** bản đồ phiêu lưu nhìn từ trên xuống, nghiêng nhẹ; đường mòn ánh sao uốn lượn nối **5 ô tròn trống** (bệ đá tròn phát sáng nhẹ) từ trái dưới lên phải trên; quanh mỗi ô có vật gợi ý: (1) vali nhỏ, (2) Mặt Trời nhỏ + vòng quỹ đạo mờ, (3) bốn cây theo mùa, (4) nửa ngày nửa đêm (Mặt Trăng và Mặt Trời nhỏ), (5) lá cờ vàng trên đỉnh đồi.
- **Thuộc tính:** nền xanh đêm #0F1B33 với chấm sao; đường mòn vàng #F5A623; ánh sáng mềm.
- **Vùng trống:** 5 ô tròn **trống hoàn toàn**, đường kính ≈ 9% chiều rộng; mép trái 25% thoáng để đặt chữ.
- **Tránh:** số, chữ, mũi tên có chữ, la bàn có chữ cái.

```text
16:9 illustrated adventure map seen from slightly above, on a deep midnight navy background with tiny stars. A glowing golden star-dust trail winds from bottom-left to top-right and connects FIVE empty round stone platforms (each about 9% of image width, softly glowing, completely blank on top). Small 3D props beside each platform: 1) a little travel suitcase, 2) a small glowing Sun with a faint ring, 3) four tiny trees in spring, summer, autumn and winter colors, 4) a half-day half-night islet with a tiny Sun and Moon, 5) a golden flag on a small hill. Keep the left 25% calm and uncluttered. No letters, no numbers, no compass letters.
```

### M01 — Khung thẻ thành tích (ưu tiên 2)
- **Trang:** 21 · **Tỉ lệ:** 4:5 dọc · **Nền:** trong suốt ngoài khung
- **Thành phần:** khung thẻ như tấm thẻ nhà thám hiểm: viền vàng bo tròn dày, góc trên trang trí Mặt Trời nhỏ và quỹ đạo, góc dưới là chòm sao; **lòng thẻ xanh đêm trơn, trống 75%**.
- **Tránh:** chữ, số, ô kẻ, hình người.

```text
Vertical 4:5 decorative card frame on a transparent background. A thick rounded golden frame like an explorer's achievement card, satin metallic gold #F5A623 with soft bevel. Top edge ornament: a small glowing Sun with a thin orbit ring; bottom corners: tiny constellations and stars. The inner area is a smooth plain midnight navy #0F1B33 panel, completely empty, about 75% of the card. No text, no numbers, no lines or boxes inside.
```

### M02 — Bìa sau: ngắm hoàng hôn (ưu tiên 2)
- **Trang:** 22 · **Tỉ lệ:** 3:2 · **Nền:** có cảnh
- **Thành phần:** một bạn nhỏ Việt Nam ngồi trên sân thượng nhà ở Hà Nội, quay lưng 3/4, cầm sổ tay và bút, nhìn hoàng hôn về **hướng tây**; Mặt Trời sát chân trời; dây phơi, chậu cây; vài ngôi sao đầu tiên.
- **Thuộc tính:** chuyển màu cam → tím → xanh đêm; ánh viền ấm trên nhân vật.
- **Vùng trống:** 1/3 phải trống (trời) để đặt chữ · **Tránh:** bạn nhỏ nhìn thẳng vào Mặt Trời (nên nhìn xuống sổ hoặc nhìn bầu trời bên cạnh), chữ trong sổ.

```text
3:2 scene. A Vietnamese child aged 11–12 sits on a Hanoi rooftop at sunset, seen from behind at three-quarter angle, holding a small notebook and pencil (blank pages), looking at the colorful sky next to the setting Sun, not staring directly into it. The Sun touches the western horizon over city rooftops; potted plants and a clothesline nearby; first stars appear. Gradient sky orange to violet #8C6BD1 to midnight navy. Warm rim light on the child. Keep the right third as open sky.
```

### A07 — Sao Mai cầm kính thiên văn (ưu tiên 2)
- **Trang:** 9 (Điểm dừng 1), hộp thông báo huy hiệu · **Tỉ lệ:** 1:1 · **Nền:** trong suốt · **Đính kèm A01**

```text
Use reference as character identity. Create ONE isolated pose of the exact same Sao Mai golden star explorer, same face, five-point body, hat with goggles, navy vest, scarf, materials and palette. Pose: standing beside a small brass-and-navy telescope on a tripod, one eye near the eyepiece, the other hand giving a cheerful thumbs-up toward the viewer. Full body with ample padding, transparent background, no text.
```

### A08 — Sao Mai cầm đèn pin (ưu tiên 2)
- **Trang:** 11 (thí nghiệm chùm sáng) · **Tỉ lệ:** 1:1 · **Nền:** trong suốt · **Đính kèm A01**

```text
Use reference as character identity. Create ONE isolated pose of the exact same Sao Mai golden star explorer, same face, five-point body, hat with goggles, navy vest, scarf, materials and palette. Pose: holding a chunky navy flashlight with both hands, pointing it diagonally down to the right, curious focused expression; only a short soft glow at the lens, no long beam. Full body with ample padding, transparent background, no text.
```

### L01 — Đèn pin cho thí nghiệm (ưu tiên 2)
- **Trang:** 11 · **Mục đích:** vật thật để HS liên hệ thí nghiệm ở nhà; vệt sáng và lưới ô do code vẽ · **Tỉ lệ:** 1:1 · **Nền:** trong suốt
- **Tránh:** vẽ chùm sáng, vẽ mặt bàn có lưới.

```text
Isolated 3D object, transparent background, 1:1. A chunky friendly flashlight, navy body #0F1B33 with gold #F5A623 ring and switch, lens facing straight DOWN, slight three-quarter view from the side. Only a soft glow on the lens, no light beam, no surface below. Refined matte materials, soft studio light, ample padding, no text.
```

## 3. Icon 3D giao diện

Đã tách sang **`prompt-icons-v2.md`**: 27 icon (J01–J06 từ khoá và chương, N01–N21 giao diện), mỗi icon một prompt đầy đủ, lưu vào `anh-goc/icons-3d/`.

## 4. Infographic "Bốn mùa trên Trái Đất trong một trang"

**Cách làm:** sơ đồ, mũi tên, chữ, số **mình vẽ bằng SVG** (đúng khoa học, tiếng Việt không lỗi). Bạn chỉ tạo 5 ảnh trang trí dưới đây. Ảnh dùng ở trang 21 và Sổ tay; khi tải về, sách ghép thành một file PNG khổ A4 ngang.

**Bố cục (để bạn hình dung):**

```
┌──────────────────────────────────────────────────────────┐
│  BỐN MÙA TRÊN TRÁI ĐẤT                      [Sao Mai A05]│
│        I03 (22/6)                                         │
│  I02 (21/3)      ☀ I01 (giữa)      I04 (23/9)             │
│        I05 (22/12)                                        │
│  Mỗi vị trí: thẻ "Bắc: … / Nam: …" + giờ ban ngày Hà Nội  │
├──────────────────────────────────────────────────────────┤
│ ① Trục nghiêng, không đổi hướng → ② Hai nửa cầu trái mùa  │
│ → ③ Ngày đêm dài ngắn khác nhau                           │
└──────────────────────────────────────────────────────────┘
```

| Mã | Chủ thể | Prompt |
|---|---|---|
| I01 | Mặt Trời | `Isolated 3D glowing Sun, transparent background, 1:1. Soft spherical gold-orange #F5A623 body with gentle swirling surface texture and a smooth warm halo fading to transparent. No face, no rays as spikes, no text. Refined, calm, stylized.` |
| I02 | Quả cầu mùa xuân | `Isolated small stylized Earth globe, transparent background, 1:1, viewed from the side, NO axis rod, NO lines. Around its upper half, tiny pink blossoms and fresh green leaves float gently like a halo. Blue oceans #2E86DE, soft land. Clay-like, soft light, no text.` |
| I03 | Quả cầu mùa hè | (như I02) `…tiny warm sun sparkles and green palm leaves float around its upper half, warm golden rim light…` |
| I04 | Quả cầu mùa thu | (như I02) `…tiny orange and golden falling leaves float around its upper half…` |
| I05 | Quả cầu mùa đông | (như I02) `…tiny soft snowflakes float only around the far top (polar region), cool blue rim light…` |

Bốn quả I02–I05 phải **cùng kích thước, cùng góc nhìn, cùng ánh sáng** (tạo liên tiếp trong cùng cuộc trò chuyện, nói thêm "same size and angle as the previous globe"). Hiệu ứng mùa chỉ là trang trí, quả cầu **không** có trục để tránh sai lệch với sơ đồ vẽ bằng code.

## 5. Sơ đồ tư duy "Bí mật bốn mùa"

**Không cần ảnh mới.** Vẽ bằng SVG/HTML, dùng icon J01 (nhánh Đặc điểm chuyển động), J05 (nhánh Mùa), J06 (nhánh Ngày đêm), J02–J04 và N21 (gốc) trong `prompt-icons-v2.md`.

## 6. Bảng tổng hợp và thư mục lưu

| Mã | Trang | Tỉ lệ | Nền | Lưu vào `anh-goc/…` | Ưu tiên |
|---|---|---|---|---|---|
| H01 | 3 | 3:4 | cảnh | `tranh-doi/` | 1 |
| H02 | 3 | 3:4 | cảnh | `tranh-doi/` | 1 |
| K01 | 2 | 16:9 | cảnh | `tranh-doi/` | 1 |
| M01 | 21 | 4:5 | trong suốt | `vat-pham/` | 2 |
| M02 | 22 | 3:2 | cảnh | `tranh-doi/` | 2 |
| A07 | 9 | 1:1 | trong suốt | `nhan-vat/` | 2 |
| A08 | 11 | 1:1 | trong suốt | `nhan-vat/` | 2 |
| L01 | 11 | 1:1 | trong suốt | `vat-pham/` | 2 |
| J01–J06, N01–N21 | toàn sách | 1:1 | trong suốt | `icons-3d/` (xem `prompt-icons-v2.md`) | 2 |
| I01–I05 | 21, Sổ tay | 1:1 | trong suốt | `infographic/` | 3 |

Thiếu ảnh nào, trang vẫn chạy bằng ảnh tạm (G01/G02 cho H01/H02, B01 cho K01, icon nét SVG cho J, N).

## 7. Câu sửa nhanh khi ảnh lỗi

| Lỗi | Gửi lại |
|---|---|
| Có chữ/số | `Fix: remove every letter, number and sign text; keep everything else identical.` |
| Nền không trong suốt | `Fix: same image on a truly transparent background (alpha), no white or checkerboard pattern baked in.` |
| Sydney có tuyết | `Fix: Sydney in July is a mild winter with no snow or ice; keep trees green.` |
| Nhân vật bị cắt | `Fix: zoom out so the whole body fits with 10% padding on every side.` |
| Sao Mai khác mẫu | `Fix: match the attached reference exactly: face, five points, hat with goggles, navy vest, blue scarf.` |
| Mặt Trời khác cỡ giữa H01 và H02 | `Fix: make the Sun the same size as in the previous image; only its height in the sky differs.` |
