# Bộ icon 3D đồng nhất v2.0 — "Giải mã bốn mùa"

> **27 icon** cùng một phong cách, dùng làm thành phần giao diện của sách.
> Lưu PNG vào **`anh-goc/icons-3d/`** (thư mục đã tạo sẵn), đặt tên đúng mã: `N03.png`, `J01.png`…
> Mình chạy `npm run images` để nén thành WebP rồi thay vào code.

## 1. Quy trình để bộ icon đồng nhất

1. Mở **một** cuộc trò chuyện mới với ChatGPT, dùng cho cả bộ.
2. Tạo **N03 (bóng đèn gợi ý)** trước. Đây là **icon mẫu**. Tạo 3–4 lần, chọn bản đẹp nhất.
3. Với 26 icon còn lại: **đính kèm N03 đã chọn**, rồi dán prompt. Mỗi prompt đã ghi sẵn "match the attached master icon".
4. Mỗi lần nhận ảnh, kiểm tra nhanh 5 điểm:
   - nền trong suốt thật (không có ô caro vẽ sẵn, không nền trắng);
   - không có chữ, số;
   - cùng góc nhìn 3/4 từ trên, cùng hướng sáng (trên-trái);
   - vật chiếm khoảng 70% khung, chừa lề đều;
   - đặt lên nền xanh đêm vẫn nhìn rõ viền.
5. Lưu PNG vuông 1024×1024 vào `anh-goc/icons-3d/`.

**Vì sao phải nhìn rõ trên nền tối:** sách dùng giao diện "đài quan sát" nền xanh đêm `#101A33`. Icon có mảng navy lớn sẽ chìm mất, nên prompt yêu cầu viền sáng mềm và hạn chế màu navy.

## 2. Phong cách chung (đã có sẵn trong từng prompt)

```text
Style: soft clay-like 3D icon, satin matte finish, chunky rounded forms, three-quarter view from slightly above, soft top-left key light, gentle ambient occlusion, no ground shadow, transparent background (real alpha), square 1:1, object fills about 70% of the canvas with even padding, readable at 48 px. Palette: gold #F5A623, Earth blue #2E86DE, ivory #FFF6E5, teal #2BB3A3, warm orange #FF8A3D, navy #0F1B33 only as small accents. It will sit on a dark navy background, so give every object a soft light rim and avoid large dark areas. No text, letters, numbers, logos, outline strokes or background shapes.
```

## 3. Nhóm J: từ khoá và chương (6 icon)

Dùng to (64–96 px) ở thẻ từ khoá trang 5, nhãn chương, sơ đồ tư duy trang 20, infographic. Nhóm này **thay F01–F04 cũ** để cả sách cùng một phong cách.

### J01 · Quỹ đạo — tr. 5, nhãn Chương 1, sơ đồ tư duy
```text
Match the attached master icon exactly in material, lighting, angle and padding. Icon "orbit": a small glowing gold Sun in the center, a thin golden nearly circular ring around it, and a tiny blue Earth sitting on the ring at the front right. Simple, no arrows, no labels.
Style: soft clay-like 3D icon, satin matte finish, chunky rounded forms, three-quarter view from slightly above, soft top-left key light, gentle ambient occlusion, no ground shadow, transparent background (real alpha), square 1:1, object fills about 70% of the canvas with even padding, readable at 48 px. Palette: gold #F5A623, Earth blue #2E86DE, ivory #FFF6E5, teal #2BB3A3, warm orange #FF8A3D, navy #0F1B33 only as small accents. It will sit on a dark navy background, so give every object a soft light rim and avoid large dark areas. No text, letters, numbers, logos, outline strokes or background shapes.
```

### J02 · Trục Trái Đất — tr. 5, sơ đồ tư duy
```text
Match the attached master icon exactly in material, lighting, angle and padding. Icon "Earth's axis": a blue Earth globe with soft green land, a slim glowing gold rod passing through the North and South poles, the whole globe and rod clearly tilted to the right. No angle marks, no numbers, no arrows.
Style: soft clay-like 3D icon, satin matte finish, chunky rounded forms, three-quarter view from slightly above, soft top-left key light, gentle ambient occlusion, no ground shadow, transparent background (real alpha), square 1:1, object fills about 70% of the canvas with even padding, readable at 48 px. Palette: gold #F5A623, Earth blue #2E86DE, ivory #FFF6E5, teal #2BB3A3, warm orange #FF8A3D, navy #0F1B33 only as small accents. It will sit on a dark navy background, so give every object a soft light rim and avoid large dark areas. No text, letters, numbers, logos, outline strokes or background shapes.
```

### J03 · Xích đạo — tr. 5, sơ đồ tư duy
```text
Match the attached master icon exactly in material, lighting, angle and padding. Icon "equator": an upright blue Earth globe with soft green land and a glowing gold band wrapped exactly around its middle. No axis rod, no other lines.
Style: soft clay-like 3D icon, satin matte finish, chunky rounded forms, three-quarter view from slightly above, soft top-left key light, gentle ambient occlusion, no ground shadow, transparent background (real alpha), square 1:1, object fills about 70% of the canvas with even padding, readable at 48 px. Palette: gold #F5A623, Earth blue #2E86DE, ivory #FFF6E5, teal #2BB3A3, warm orange #FF8A3D, navy #0F1B33 only as small accents. It will sit on a dark navy background, so give every object a soft light rim and avoid large dark areas. No text, letters, numbers, logos, outline strokes or background shapes.
```

### J04 · Nửa cầu — tr. 5, sơ đồ tư duy
```text
Match the attached master icon exactly in material, lighting, angle and padding. Icon "hemispheres": an Earth globe gently split into two halves along the equator with a thin gap, the upper half tinted warm gold-orange, the lower half tinted cool teal-blue, both still showing soft continents. No arrows.
Style: soft clay-like 3D icon, satin matte finish, chunky rounded forms, three-quarter view from slightly above, soft top-left key light, gentle ambient occlusion, no ground shadow, transparent background (real alpha), square 1:1, object fills about 70% of the canvas with even padding, readable at 48 px. Palette: gold #F5A623, Earth blue #2E86DE, ivory #FFF6E5, teal #2BB3A3, warm orange #FF8A3D, navy #0F1B33 only as small accents. It will sit on a dark navy background, so give every object a soft light rim and avoid large dark areas. No text, letters, numbers, logos, outline strokes or background shapes.
```

### J05 · Bốn mùa — nhãn Chương 2, sơ đồ tư duy
```text
Match the attached master icon exactly in material, lighting, angle and padding. Icon "four seasons": a thick round medallion divided into four equal quarters: pink spring blossom, golden summer sun, orange autumn leaf, pale blue winter snowflake, each quarter a raised soft shape.
Style: soft clay-like 3D icon, satin matte finish, chunky rounded forms, three-quarter view from slightly above, soft top-left key light, gentle ambient occlusion, no ground shadow, transparent background (real alpha), square 1:1, object fills about 70% of the canvas with even padding, readable at 48 px. Palette: gold #F5A623, Earth blue #2E86DE, ivory #FFF6E5, teal #2BB3A3, warm orange #FF8A3D, navy #0F1B33 only as small accents. It will sit on a dark navy background, so give every object a soft light rim and avoid large dark areas. No text, letters, numbers, logos, outline strokes or background shapes.
```

### J06 · Ngày và đêm — nhãn Chương 3, sơ đồ tư duy
```text
Match the attached master icon exactly in material, lighting, angle and padding. Icon "day and night": a thick round disc split vertically, the left half bright gold with a small sun shape without a face, the right half soft violet #8C6BD1 with a small crescent moon and two tiny stars. Light rim around the whole disc.
Style: soft clay-like 3D icon, satin matte finish, chunky rounded forms, three-quarter view from slightly above, soft top-left key light, gentle ambient occlusion, no ground shadow, transparent background (real alpha), square 1:1, object fills about 70% of the canvas with even padding, readable at 48 px. Palette: gold #F5A623, Earth blue #2E86DE, ivory #FFF6E5, teal #2BB3A3, warm orange #FF8A3D, navy #0F1B33 only as small accents. It will sit on a dark navy background, so give every object a soft light rim and avoid large dark areas. No text, letters, numbers, logos, outline strokes or background shapes.
```

## 4. Nhóm N: icon giao diện (21 icon)

Dùng ở nút có chữ, tiêu đề thẻ, hộp phản hồi (40–64 px).

### N03 · Gợi ý ★ ICON MẪU, tạo đầu tiên, không cần đính kèm
```text
Icon "hint": a round light bulb glowing softly from inside in warm gold, with a short twisted ivory base. Friendly and calm, no sharp light rays.
Style: soft clay-like 3D icon, satin matte finish, chunky rounded forms, three-quarter view from slightly above, soft top-left key light, gentle ambient occlusion, no ground shadow, transparent background (real alpha), square 1:1, object fills about 70% of the canvas with even padding, readable at 48 px. Palette: gold #F5A623, Earth blue #2E86DE, ivory #FFF6E5, teal #2BB3A3, warm orange #FF8A3D, navy #0F1B33 only as small accents. It will sit on a dark navy background, so give every object a soft light rim and avoid large dark areas. No text, letters, numbers, logos, outline strokes or background shapes.
```

Các icon còn lại: **đính kèm N03**, dán khung prompt tương ứng. Phần "Style" giống hệt nhau nên chỉ khác dòng đầu.

| Mã | Tên | Dùng ở đâu | Dòng đầu của prompt (dán kèm phần Style ở mục 2) |
|---|---|---|---|
| N01 | Bản đồ hành trình | Mục lục, tr. 2, nhãn Khởi hành | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "journey map": a half-unrolled ivory map scroll with a dotted golden trail and one small gold star on it. No writing on the map.` |
| N02 | Video | Thẻ video tr. 3, 6, 10, 16 | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "video": a small rounded screen in Earth blue with a big raised gold play triangle in the middle.` |
| N04 | Đọc to | Nút "Đọc to trang này" | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "read aloud": a small rounded ivory speaker with two soft teal sound-wave arcs coming out to the right. No music notes.` |
| N05 | Điểm dừng | Tr. 9, 13, 17, thanh hành trình | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "checkpoint": a small round green-teal hill with a golden flag on a short pole at the top. Blank flag.` |
| N06 | Đúng | Hộp phản hồi khi đúng | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "correct": a thick round teal badge with a raised ivory check mark. Cheerful, no red.` |
| N07 | Thử lại | Hộp phản hồi khi chưa đúng | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "try again": a thick three-quarter circular arrow curving back to its start, warm orange-gold. Encouraging, no X mark, no red, no sad face.` |
| N08 | Thí nghiệm | Tr. 11, ô "Thử ở nhà" | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "experiment": a small rounded teal glass flask standing next to a chunky gold mini flashlight. No smoke, no boiling liquid.` |
| N09 | Chốt kiến thức | Thẻ chốt cuối mỗi trang | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "key idea": a chunky golden key whose handle is a five-point star. No lock.` |
| N10 | Thẻ ghi nhớ | Sổ tay ôn tập tr. 22 | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "flashcards": a stack of three slightly fanned rounded cards, ivory and Earth blue, the top one with a small gold star. No writing.` |
| N11 | Tải về | Tải thẻ, tải infographic, tải sơ đồ | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "download": a rounded ivory tray with a thick gold arrow pointing down into it. No cloud.` |
| N12 | Em có biết | Ô gấp kiến thức thêm | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "did you know": a gold magnifying glass tilted in front of a small blue Earth globe, the globe slightly enlarged through the lens. No question mark.` |
| N13 | Dự đoán | Tr. 4, tr. 20 | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "prediction": a soft ivory thought cloud with a small glowing gold star inside it. No question mark, no text.` |
| N14 | Phiếu, nhật ký | Nhật ký 1, Phiếu 2, Phiếu 3 | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "worksheet": an open notebook with blank ivory pages and a gold pencil lying across it. No writing, no lines of text.` |
| N15 | Nóng | Thẻ Hà Nội tr. 3, Phiếu 2 | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "hot": a rounded thermometer filled high with warm orange, a small gold sun sparkle beside it. No numbers or scale marks.` |
| N16 | Lạnh | Thẻ Sydney tr. 3, Phiếu 2 | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "cold": a rounded thermometer filled low with cool Earth blue, a soft teal wind swirl beside it. No snowflake, no numbers or scale marks.` |
| N17 | Vali | Tr. 18 | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "suitcase": a small rounded travel suitcase in Earth blue with gold corners and handle, and a tiny folded ivory scarf peeking out. No stickers with text.` |
| N18 | Hẹn giờ | Đúng/Sai 30 giây tr. 13 | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "timer": a round chunky stopwatch, ivory face with a gold rim and button, one gold hand, a teal arc showing remaining time. No numbers.` |
| N19 | Thành tích | Tr. 21, nhãn Về đích | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "achievement": a small gold trophy cup with a five-point star on its front, on a short Earth-blue base. No text.` |
| N20 | Ô chữ | Tr. 17 | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "puzzle": two chunky jigsaw puzzle pieces clicking together, one gold and one Earth blue. No letters.` |
| N21 | Sơ đồ tư duy | Tr. 20, Sổ tay | `Match the attached master icon exactly in material, lighting, angle and padding. Icon "mind map": a gold round node in the center linked by short curved teal branches to three smaller ivory nodes. No text.` |

**Mẹo dán nhanh:** copy dòng đầu trong bảng, xuống dòng, dán phần "Style" ở mục 2, gửi kèm ảnh N03.

## 5. Icon nào vẫn giữ dạng nét phẳng

Các nút nhỏ 20–24 px ở thanh trên và dưới sách (☰ mục lục, ⋯, toàn màn hình, cài đặt, mũi tên lật trang, âm thanh bật/tắt) **giữ icon nét SVG** như hiện tại. Icon 3D thu nhỏ cỡ đó sẽ bị nhoè và rối. Icon 3D dùng ở chỗ to hơn: nút có chữ, tiêu đề thẻ, phản hồi, thanh hành trình, nhãn chương.

## 6. Bảng tổng hợp: mã → chỗ dùng trong code

| Mã | File | Thay cho icon cũ | Cỡ hiển thị |
|---|---|---|---|
| J01 | `J01.png` | F01 | 64–96 px |
| J02 | `J02.png` | F02 | 64–96 px |
| J03 | `J03.png` | `globe` (SVG) | 64–96 px |
| J04 | `J04.png` | — | 64–96 px |
| J05 | `J05.png` | F03 | 64–96 px |
| J06 | `J06.png` | F04 | 64–96 px |
| N01 | `N01.png` | — | 48–64 px |
| N02 | `N02.png` | F06, `play`, `film` | 48–64 px |
| N03 | `N03.png` | — | 40–48 px |
| N04 | `N04.png` | `listen` | 40–48 px |
| N05 | `N05.png` | — | 40–64 px |
| N06 | `N06.png` | `check` | 40–48 px |
| N07 | `N07.png` | `reset` | 40–48 px |
| N08 | `N08.png` | — | 48–64 px |
| N09 | `N09.png` | — | 40–48 px |
| N10 | `N10.png` | — | 48–64 px |
| N11 | `N11.png` | `download` | 40–48 px |
| N12 | `N12.png` | `search` | 40–48 px |
| N13 | `N13.png` | — | 48–64 px |
| N14 | `N14.png` | `tag` | 40–48 px |
| N15 | `N15.png` | `hot` | 40–48 px |
| N16 | `N16.png` | `cold` | 40–48 px |
| N17 | `N17.png` | — | 48–64 px |
| N18 | `N18.png` | — | 48–64 px |
| N19 | `N19.png` | `chart` | 48–64 px |
| N20 | `N20.png` | — | 48–64 px |
| N21 | `N21.png` | — | 48–64 px |

Thứ tự ưu tiên nếu không kịp làm hết: **N03 → N09, N05, N06, N07, N02 → J01–J06 → còn lại**. Icon nào chưa có thì sách vẫn dùng icon nét SVG hiện tại.

## 7. Câu sửa nhanh

| Lỗi | Gửi lại |
|---|---|
| Lệch phong cách so với N03 | `Fix: match the attached N03 exactly: same clay material, same top-left light, same 3/4 angle, same 70% fill and padding.` |
| Nền caro hoặc trắng | `Fix: same icon on a truly transparent background (alpha channel), no checkerboard or white baked in.` |
| Có chữ, số, vạch chia | `Fix: remove every letter, number and scale mark; keep everything else identical.` |
| Chìm trên nền tối | `Fix: add a soft light rim around the silhouette and lighten the dark areas so it reads on a dark navy background.` |
| Quá chi tiết, nhỏ nhìn rối | `Fix: simplify to fewer, chunkier shapes so it stays clear at 48 px.` |
