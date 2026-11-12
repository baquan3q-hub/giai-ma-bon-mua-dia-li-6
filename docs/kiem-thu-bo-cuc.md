# Kiểm thử bố cục v1.3 (Mốc 1–4)

Ngày đo: 11/11/2026 · nhánh `v1.3-layout` · bản chạy local `http://localhost:5173` · chưa commit, chưa phát hành.

## Thang đo

| Tiêu chí | Ngưỡng đạt |
|---|---|
| Chữ nội dung | ≥ 16px |
| Nhãn, chú thích, chân trang | ≥ 12px |
| Vùng chạm (nút, liên kết, thanh kéo) | ≥ 44 × 44px |
| Tràn khỏi trang / cuộn dọc / tràn ngang | 0 |
| Chia “Bước x/y” do tự cắt | không còn ở trang đã chuyển khung |

## Cách đo

1. `npm run dev -- --port 5173 --strictPort`, mở `http://localhost:5173`.
2. Mở DevTools → Console, dán hàm `__measure` bên dưới.
3. Chạy `await __measure(360, 800, [2,5,6,8,10])` (đổi kích thước và danh sách trang tuỳ ý).

Hàm nạp từng trang vào một iframe ẩn đúng kích thước cần đo, rồi báo: phần trăm thân trang còn trống, cỡ chữ nhỏ nhất (kèm phần tử), số vùng chạm nhỏ hơn 44px, số phần tử tràn khỏi trang, trang có bị cắt/chia bước không, ảnh hỏng, tràn ngang.

```js
window.__measure = async (w, h, list) => {
  document.querySelector('#__lab')?.remove();
  const d = document.createElement('div');
  d.id = '__lab';
  d.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;opacity:.01;pointer-events:none';
  document.body.append(d);
  const f = document.createElement('iframe');
  f.style.cssText = `width:${w}px;height:${h}px;border:0`;
  d.append(f);
  const out = [];
  for (const p of list) {
    await new Promise(r => { f.onload = r; f.src = `/?m=${p}-${Math.random()}#trang-${p}`; });
    await new Promise(r => setTimeout(r, p === 8 ? 1800 : 700));
    const doc = f.contentDocument, win = f.contentWindow;
    const page = doc.querySelector(`.page[data-page="${p}"]`);
    if (!page) { out.push(p + ': no page'); continue; }
    const body = page.querySelector('.page-body');
    const br = body.getBoundingClientRect();
    const vis = e => {
      const r = e.getBoundingClientRect(), c = win.getComputedStyle(e);
      return r.width > 0 && r.height > 0 && c.visibility !== 'hidden' && c.display !== 'none' && !e.closest('[hidden]');
    };
    let maxB = br.top;
    for (const c of body.children) {
      if (!vis(c) || c.classList.contains('within-page')) continue;
      maxB = Math.max(maxB, Math.min(br.bottom, c.getBoundingClientRect().bottom));
    }
    const empty = p === 1 ? 0 : Math.round((br.bottom - maxB) / br.height * 100);
    let minF = 99, minEl = '';
    const scope = [page, doc.querySelector('.app-header'), doc.querySelector('.book-topline'), doc.querySelector('.book-navigation')];
    for (const s of scope) for (const e of s.querySelectorAll('*')) {
      if (!vis(e)) continue;
      if (![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
      const fs = parseFloat(win.getComputedStyle(e).fontSize);
      if (fs < minF) { minF = fs; minEl = e.className || e.tagName; }
    }
    const small = [];
    for (const s of scope) for (const e of s.querySelectorAll('button,a,input,select,textarea')) {
      if (!vis(e)) continue;
      const r = e.getBoundingClientRect();
      if (r.width < 43.5 || r.height < 43.5) small.push((e.className || e.tagName).toString().split(' ')[0] + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
    }
    const pr = page.getBoundingClientRect();
    let spill = 0;
    for (const e of page.querySelectorAll('.page-body *,.fr-actions,.page-tools,.page-footer')) {
      if (!vis(e) || e.closest('.inline-simulation')) continue;
      const r = e.getBoundingClientRect();
      if (r.bottom > pr.bottom + 1 || r.right > pr.right + 1 || r.left < pr.left - 1) spill++;
    }
    const clip = body.scrollHeight > body.clientHeight + 2 && win.getComputedStyle(body).overflow !== 'visible';
    const steps = !!page.querySelector('.within-page');
    const broken = [...page.querySelectorAll('img')].filter(i => i.complete && !i.naturalWidth).length;
    out.push(`${p}: trống ${empty}% · chữ nhỏ nhất ${minF}px (${String(minEl).slice(0, 18)}) · chạm<44: ${small.length}${small.length ? ' [' + [...new Set(small)].slice(0, 4).join(', ') + ']' : ''} · tràn ${spill}${clip ? ' cắt' : ''}${steps ? ' · BƯỚC' : ''}${broken ? ' · ảnh hỏng ' + broken : ''} · ngang ${doc.documentElement.scrollWidth > w ? 'TRÀN' : 'ok'}`);
  }
  d.remove();
  return out.join('\n');
};
```

Giới hạn của phép đo: với trang đã chuyển khung, sân khấu co giãn lấp đầy thân trang nên “% trống” luôn bằng 0 — chỉ số này không phản ánh khoảng trống bên trong sân khấu, phần đó phải xem bằng mắt.

## Kết quả 5 trang mẫu (2, 5, 6, 8, 10)

| Kích thước | Chữ nhỏ nhất | Vùng chạm < 44px | Tràn | Tràn ngang | Chia bước |
|---|---|---|---|---|---|
| 1366 × 900 (máy tính, hai trang) | 12px | 0 | 0 | không | không |
| 768 × 1024 (máy tính bảng) | 12px | 0 | 0 | không | không |
| 390 × 844 (điện thoại) | 12px | 0 | 0 | không | không |
| 360 × 800 (điện thoại nhỏ) | 12px | 0 | 0 | không | không |

Mô hình quỹ đạo trang 8: 316 × 278px ở 360 × 800 (bản 1.2: cao khoảng 185px); 581 × 366px ở 1366 × 900.
Đầu trang ở 768px: logo kết thúc tại x = 200, năm nút 44 × 44 bắt đầu từ x = 504, không đè nhau.

## Kiểm tra thao tác (1366 × 900)

| Thao tác | Kết quả |
|---|---|
| Bìa → trang 2–3 → lật ngược → trang 22–23 → bìa sau → quay lại | Khung sách giữ 1250 × 736 ở mọi bước (bìa sau bản 1.2: rộng 680) |
| Trang 8: chọn 22/12 | Ngày, thanh kéo, trạng thái đổi; mô hình không bị dựng lại |
| Trang 8: nút Nhãn | Ẩn/hiện chú thích trên mô hình |
| Trang 8: Chạy ↔ Dừng | Đổi nhãn và trạng thái đúng |
| Nút âm thanh | Giữ biểu tượng, cập nhật `aria-pressed` |
| Chạm bong bóng Sao Mai | Mở lời hướng dẫn |
| `npm test` | 12/12 đạt |
| `npm run build` | Đạt (cảnh báo sẵn có: gói `world` 633 kB, tải động) |

Chưa kiểm tra: âm thanh lật trang bằng tai (đường mã `playSound('page')` không đổi so với 1.2); điện thoại thật.

## Hiện trạng cả 24 trang ở 360 × 800

Trang đã chuyển khung: 2, 5, 6, 8, 10. Các trang còn lại vẫn là bố cục 1.2 (chỉ được vá cỡ chạm và phần khung ứng dụng) — đây là danh sách việc của Mốc 2.

| Trang | Trống | Chữ nhỏ nhất | Chạm < 44 | Ghi chú |
|---|---|---|---|---|
| 1 | – | 6px (chân bìa) | 0 | 1 phần tử tràn |
| 2 | 0% | 12px | 0 | đã chuyển khung |
| 3 | 16% | 12px | 0 | |
| 4 | 33% | 12px | 0 | |
| 5 | 0% | 12px | 0 | đã chuyển khung |
| 6 | 0% | 12px | 0 | đã chuyển khung |
| 7 | 22% | 12px | 0 | |
| 8 | 0% | 12px | 0 | đã chuyển khung |
| 9 | 23% | 12px | 0 | |
| 10 | 0% | 12px | 0 | đã chuyển khung |
| 11 | 61% | 10px | 0 | |
| 12 | 17% | 10px | 0 | còn chia bước |
| 13 | 16% | 10px | 0 | còn chia bước |
| 14 | 0% | 9px | 0 | nội dung bị cắt |
| 15 | 5% | 12px | 0 | |
| 16 | 27% | 12px | 0 | |
| 17 | 1% | 10px | 0 | nội dung bị cắt |
| 18 | 25% | 10px | 0 | |
| 19 | 28% | 12px | 0 | |
| 20 | 24% | 12px | 0 | |
| 21 | 17% | 12px | 0 | |
| 22 | 31% | 12px | 0 | |
| 23 | 14% | 9px | 0 | |
| 24 | 58% | 12px | 0 | còn chia bước |

---

# Mốc 2 — áp khung cho 24 trang

Ngày đo: 12/11/2026 · nhánh `v1.3-layout` · local, chưa commit.

## Thay đổi chính

- Tách nội dung trang ra `src/pages/content.ts` (24 trang) và mảnh HTML dùng chung ra `src/pages/ui.ts`; `src/main.ts` giảm từ ~61 nghìn xuống ~44 nghìn ký tự.
- Trang 2–24 đều dùng khung mới (tiêu đề gọn → lời Sao Mai → sân khấu → thanh hành động). Gỡ cơ chế tự cắt `fitPages()` và các nút “Bước x/y”.
- Biểu đồ năm (tr. 14) và cung đường Mặt Trời (tr. 17) vẽ từ `earth.ts`; hình trục nghiêng (tr. 9) tính từ `EPSILON`, xích đạo vuông góc với trục (bản 1.2 xoay ngược dấu).
- Nút chọn ngày có `aria-pressed`; nhãn mô hình 3D ẩn cho tới khi được định vị ở khung hình đầu.

## Hàm đo bản 2

Bản `__measure` dùng ở Mốc 2 bổ sung: quy đổi cỡ chữ trong SVG theo tỉ lệ hiển thị (`cỡ chữ × bề rộng hiển thị ÷ bề rộng viewBox`), đếm phần tử tràn khỏi sân khấu, chiều cao sân khấu, số nút chính trong thanh hành động, đánh dấu `✗` cho trang không đạt.

## Kết quả 24 trang

| Kích thước | Trang đạt | Chữ nhỏ nhất | Chạm < 44px | Tràn trang / sân khấu | Nút chính | Chia bước | Sân khấu (cao) |
|---|---|---|---|---|---|---|---|
| 1366 × 900 | 24/24 | 12px | 0 | 0 / 0 | 1 mỗi trang | không | 368–493px |
| 768 × 1024 | 24/24 | 12px | 0 | 0 / 0 | 1 mỗi trang | không | 500–626px |
| 390 × 844 | 24/24 | 12px | 0 | 0 / 0 | 1 mỗi trang | không | — |
| 360 × 800 | 24/24 | 12px | 0 | 0 / 0 | 1 mỗi trang | không | 215–404px |

Ghi chú đo:
- Lần đo đầu ở 360 × 800 phát hiện chữ SVG tr. 14 (6,4px), tr. 17 (11,1px), tr. 9 (11,7px) và chữ bìa 8px → đã nâng cỡ chữ SVG, xếp dọc đồng hồ ngày–đêm trên điện thoại, chữ bìa 12px.
- Ở 768 và 1366, hàm đo báo bìa “tràn 1” (vòng quỹ đạo trang trí xoay lệch, đã bị cắt bởi `overflow:hidden`, không nhìn thấy) và tr. 8 “tràn sân khấu 5” (khung trình duyệt bị ẩn nên `requestAnimationFrame` không chạy, 5 nhãn 3D chưa được định vị). Cả hai không phải lỗi hiển thị; nhãn tr. 8 nay được ẩn cho tới khi định vị.

## Kiểm tra thao tác

| Thao tác | Kết quả |
|---|---|
| Tr. 12: chọn ngày | Hai thẻ bán cầu đổi mùa; nút ngày đổi trạng thái |
| Tr. 14: đổi vĩ độ | `#clock-metrics` và `#year-chart` cập nhật; Hà Nội 22/12 = 10 giờ 43 phút |
| Tr. 17: 21/3 → 22/6 | 21/3: hai nơi 12 giờ 00; 22/6: Hà Nội 13 giờ 17 phút, Sydney 9 giờ 44 phút |
| Tr. 18: nút “Mở mảnh 1” | Mở hộp câu hỏi đúng mảnh |
| Lật bìa → 2–3 → 4–5 → lùi; 22–23 → bìa sau → lùi (1366 × 900) | Khung sách giữ 1250 × 736; nút “Trang sau” khoá ở tr. 24; 0 lỗi JS |
| `npx tsc --noEmit` | Đạt |
| `npm test` | 12/12 đạt |
| `npm run build` | Đạt (cảnh báo sẵn có: gói `world` > 500 kB, tải động) |

Chưa kiểm tra: nhìn tận mắt cặp trang ở 1366 × 900 sau Mốc 2 (khung trình duyệt bị ẩn trong lúc đo), điện thoại thật, âm thanh lật trang. Hành vi sẵn có từ 1.2: đổi `#trang-n` khi app đang mở không chuyển trang (chỉ đọc khi tải trang).

## Hiện trạng
Trang 1–24 đều đạt thang đo ở 4 kích thước. Danh sách “trống / chia bước” ở bảng Mốc 1 phía trên đã được giải quyết.

# Mốc 3 — tương tác theo mục tiêu học tập

## Thay đổi chính

| Trang | Tương tác | Số liệu lấy từ |
|---|---|---|
| 6 | Chạm hai thẻ cảnh Hà Nội / Sydney để hiện nhiệt kế + trang phục; quả cầu nhỏ ghim hai thành phố, “CÙNG THÁNG 7”. Mở đủ hai thẻ thì hiện câu hỏi giữ cho Trạm 1–3 (chưa giải thích). | — |
| 9 | Thanh kéo góc trục 0° → 23°27′ (phút cung), hình SVG tính toán; hiện góc với phương vuông góc, với mặt phẳng quỹ đạo và giờ ban ngày Hà Nội ngày 22/6. Nút “Thực tế” trả về 23°27′. | `tiltAngles()` |
| 12 | Sơ đồ quỹ đạo 4 vị trí chạm được (21/3, 22/6, 23/9, 22/12); nửa tối quay lưng về Mặt Trời, trục vẽ song song, chấm đỏ = đầu Bắc. Hàng mùa hai bán cầu cập nhật theo vị trí chọn. | `orbitPoint()`, `orbitAxis2D()` |
| 14 | Trái Đất nhìn ngang cạnh vòng giờ: vĩ tuyến đang chọn chia phần sáng (cam) / tối (xanh) theo ngày và vĩ độ. Biểu đồ năm thu gọn, chữ 20. | `parallelSplit()` |
| 19 | Xếp vali ngay trên trang (5 món), phản hồi tức thì, đồng bộ với hộp thoại tự đánh giá. | `packItems` |

Các hình đều là SVG 2D (không cần WebGL), nên cũng là phương án dự phòng khi cảnh 3D lỗi.

## Kết quả đo

- 24 trang × 4 kích thước (1366×900, 768×1024, 390×844, 360×800): 23 trang nội dung đạt (chữ ≥ 12px, chạm ≥ 44px, không tràn, đúng 1 nút chính). Bìa giữ 2 ghi chú như Mốc 2 (không có nút chính theo thiết kế; quỹ đạo trang trí bị `overflow:hidden` cắt).
- Đã sửa chữ SVG < 12px trên điện thoại: chú thích tr. 12 (15 → 16), chữ NGÀY/ĐÊM tr. 14 (16 → 21), biểu đồ năm tr. 14 (viewBox 400×140, chữ 17 → 20).

## Kiểm tra thao tác (iframe 360 × 800)

| Trang | Thao tác | Kết quả |
|---|---|---|
| 6 | Chạm thẻ 1, rồi thẻ 2 | `aria-expanded` true; câu hỏi “Cùng tháng 7, vì sao một nơi nóng, một nơi lạnh?” hiện khi mở đủ hai thẻ |
| 9 | Kéo về 0 → nút Thực tế | 0°00′ / 90°00′ / 12 giờ 00 phút → 23°27′ / 66°33′ / 13 giờ 17 phút |
| 12 | Chạm 22/12, rồi 22/6 | Bắc: mùa đông · Nam: mùa hạ → Bắc: mùa hạ · Nam: mùa đông |
| 14 | 22/6 → 22/12; vĩ độ −34 | Hà Nội 13h17 → 10h43; Sydney 22/12: 14h16 |
| 19 | Chạm Áo khoác hai lần | pressed true, “Vali: 1 món · đã có đồ giữ ấm” → pressed false, “Đã bỏ ra khỏi vali.” |

## Test

`tests/figures.test.ts` (3 test mới): góc SGK 23°27′ + 66°33′, trục thẳng đứng → 12 giờ; Hà Nội 13h17/10h43; trục 2D không đổi ở 4 vị trí, Bắc ngả về Mặt Trời ngày 22/6 và quay xa ngày 22/12; cung ngày của vĩ tuyến khớp `dayLength()`, Xích đạo luôn 90°. Tổng 15/15 test đạt, `tsc` và `build` đạt.

# Mốc 4 — Tài nguyên nguồn mở

## Tài nguyên đã thêm (ghi đủ trong `public/data/asset-sources.json` → `openAssets`)

| Tệp (web) | Nguồn | Giấy phép | Chỉnh sửa | Dung lượng |
|---|---|---|---|---|
| `assets/textures/horizon-band.webp` | Poly Haven “Round Platform” HDRI (polyhaven.com/a/round_platform) | CC0 | Cắt dải chân trời từ +30° xuống, làm trong suốt phần trời (giữ ngọn cây), 4096×2048 → WebP q72 | 434 KB |
| `assets/textures/nasa-tair-2024-01.webp`, `…-07.webp`, `nasa-tair-scale.webp` | NASA GIBS WMS, lớp AIRS nhiệt độ không khí bề mặt theo tháng (NASA/JPL AIRS Project; NASA GIBS, ESDIS) | Dữ liệu mở NASA (ghi công theo hướng dẫn sử dụng dữ liệu của NASA) | Tải 1 lần, đổi WebP 1024×512; cắt thang màu từ legend | 59 KB |

- Bản gốc lưu ở `../anh-goc/textures/` và `../anh-goc/nasa/` (có md5), xử lý lại bằng `node scripts/open-assets.mjs`.
- Tổng thêm ≈ 0,49 MB (giới hạn 3 MB). Không hotlink: mọi tệp nằm trong `public/assets/`, tải động khi mở cảnh/hộp thoại.
- Đã cân nhắc nhưng chưa dùng: NASA 3D Resources, Kenney/Quaternius (chưa có mô hình nào giúp thêm cho mục tiêu học tập; quả địa cầu hiện có đã đủ).

## Thay đổi nội dung

- **Tr. 13 — “Bằng chứng từ vệ tinh NASA”** (nút Vệ tinh): hai bản đồ nhiệt độ tháng 1 / tháng 7/2024 có ghim Hà Nội và Sydney, thang °C. Tháng 1 Trái Đất gần Mặt Trời nhất nhưng Bắc bán cầu lạnh → học sinh tự bác bỏ “mùa do khoảng cách”.
- **Tr. 16 — cảnh bầu trời 360°**: dải chân trời ảnh thật (CC0) thay khối hộp; màu trời, đường đi và vị trí Mặt Trời vẫn do ứng dụng tính. Mặt Trời và cung đường vẽ đè lên cây (`depthTest=false`) để không bị che khi thấp. Lỗi tải ảnh → quay về nền đơn giản (`data-horizon="simple"`).
- **Sửa lỗi lật gương có từ v1.2**: cảnh trời đặt hướng Bắc ở +z trong hệ toạ độ tay phải nên toàn bộ bầu trời bị lật trái–phải (Mặt Trời mọc sai phía khi nhìn về hướng Nam). Đã thêm `skyVector()` (đổi dấu trục Bắc), đổi nhãn la bàn, góc nhìn mặc định hướng Nam. Kiểm tra bằng mắt: nhìn hướng Nam thì “Lặn” ở bên phải (Tây); Hà Nội 22/6 Mặt Trời lặn lệch về phía Bắc của hướng Tây.
- Trang Nguồn (hộp thoại Nguồn) thêm 2 liên kết: NASA GIBS/AIRS (tr. 13), Poly Haven Round Platform CC0 (tr. 16).

## Test

- `tests/assets.test.ts`: mọi tệp trong `public/assets/models|textures` có mục nguồn và ngược lại; mỗi mục `openAssets` đủ `credit/source/license/licenseURL/changes`, không hotlink; tổng ≤ 3 MB.
- `tests/figures.test.ts`: thêm test chống lật gương tr. 16 (buổi sáng Mặt Trời ở phía Đông, `skyVector` Bắc = −z).
- Tổng 18/18 test đạt; `tsc --noEmit` và `npm run build` đạt.

## Đo

- Tr. 13 và 16 đạt thang đo ở 4 kích thước; hộp thoại vệ tinh: ảnh tải được, chữ nhỏ nhất 12px, cuộn dọc trên điện thoại.

## Còn lại

- Ảnh xem trước cổng 360° (tr. 10, 16) chụp từ cảnh thật: chưa chụp (cần ô trình duyệt hiển thị để WebGL vẽ).
- Ảnh H/B/I/A/J của Quân: chưa nhận, vẫn dùng ảnh tạm.
- Kiểm tra kéo/chạm cảnh 360° trên 360×800 và đo lại đủ 24 trang sau Mốc 4.
