// Khung trang v1.3: icon giao diện, lời thoại Sao Mai và các mảnh dựng trang dùng chung.
// Icon SVG là bản tạm; khi có bộ ảnh J01–J12 thì thay trong hàm icon().
const paths:Record<string,string>={
 list:'<path d="M4 6h16M4 12h16M4 18h10"/>',
 sound:'<path d="M4 9v6h4l5 4V5L8 9H4zM16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>',
 mute:'<path d="M4 9v6h4l5 4V5L8 9H4zM16.5 9.5l4.5 5M21 9.5l-4.5 5"/>',
 listen:'<path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1z"/>',
 settings:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
 expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 play:'<path d="M8 5l11 7-11 7z"/>',
 reset:'<path d="M4.5 12a7.5 7.5 0 1 0 2.6-5.7M4 4v5h5"/>',
 tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
 chart:'<path d="M5 20V11M12 20V4M19 20v-6"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
 film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.5v5l4.5-2.5z"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
 hot:'<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0zM12 9v8"/>',
 cold:'<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0zM12 15v2"/>',
 next:'<path d="M5 12h14M13 6l6 6-6 6"/>'
};
export const icon=(name:string)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]??''}</svg>`;

// Trang dùng khung v1.3: mọi trang trừ bìa trước (Mốc 2).
export const framed=new Set(Array.from({length:23},(_,i)=>i+2));
const frames:Record<string,number[]>={k1:[2,7,19,20,21,22,24],k2:[3,4,5,11,18,23],k3:[6,12,13,15],k4:[8,9,14,17],k5:[10,16]};
export const frameOf:Record<number,string>=Object.fromEntries(Object.entries(frames).flatMap(([k,list])=>list.map(p=>[p,k])));

// Lời Sao Mai: câu hỏi dẫn đường + em làm gì, chạm đâu, quan sát gì.
export const say:Record<number,string>={
 2:'<b>Mình là Sao Mai!</b> Chạm “Nhận nhiệm vụ” để cùng tìm lời giải cho bí mật bốn mùa.',
 3:'<b>Chưa biết chạm vào đâu?</b> Đọc bốn cách dùng sách, rồi bấm “Thử mở chú thích”.',
 4:'<b>Cuối chuyến đi, em làm được gì?</b> Chạm một mục tiêu để xem ví dụ. Không cần thuộc trước.',
 5:'<b>Em đang ở chặng nào?</b> Chạm một trạm để đến đó, hoặc đi tiếp trạm chưa xong.',
 6:'<b>Tháng 7 mà phải mang áo ấm?</b> Chạm từng bức tranh để xem thời tiết và quần áo ở hai nơi.',
 7:'<b>Em đang nghĩ gì về nguyên nhân mùa?</b> Trả lời ba câu bằng hiểu biết hiện tại. Không có điểm.',
 8:'<b>Đầu trục có quay theo quỹ đạo không?</b> Chọn 22/6 rồi 22/12 và nhìn đầu trục Trái Đất.',
 9:'<b>Nếu trục không nghiêng thì sao?</b> Kéo thanh về 0°, rồi kéo lại 23°27′. Xem giờ ban ngày ở Hà Nội thay đổi.',
 10:'<b>Tìm ba bằng chứng.</b> Mở đài 360°, chạm các điểm Quỹ đạo, Một năm và Trục nghiêng.',
 11:'<b>Điều em thấy nói lên quy luật gì?</b> Ghi nhật ký theo ba bước: quan sát, bằng chứng, kết luận.',
 12:'<b>Trục có đổi hướng khi Trái Đất đi quanh Mặt Trời?</b> Chạm bốn vị trí, nhìn trục và mùa ở hai bán cầu.',
 13:'<b>Gần Mặt Trời hơn thì nóng hơn?</b> Đặt khoảng cách tháng 1 và tháng 7 cạnh mùa ở hai bán cầu.',
 14:'<b>Mỗi ngày có luôn 12 giờ sáng?</b> Đổi 22/6 sang 22/12, xem đoạn vàng của vĩ tuyến dài ra hay ngắn lại.',
 15:'<b>Số liệu đang nói điều gì?</b> So sánh giờ ban ngày ở Hà Nội và Sydney trong hai ngày.',
 16:'<b>Cùng một ngày, Mặt Trời ở trên trời bao lâu?</b> Bước vào bầu trời và làm lần lượt ba việc.',
 17:'<b>Mặt Trời ở trên chân trời bao lâu?</b> Chọn ngày, so sánh đường đi ở Hà Nội và Sydney.',
 18:'<b>Chìa khoá nào mở được bí mật bốn mùa?</b> Trả lời đúng mỗi câu để mở một mảnh chữ.',
 19:'<b>Mang gì cho chuyến đi tháng 7?</b> Chạm đồ để cho vào vali, rồi viết lý do và tự đánh giá.',
 20:'<b>Em đã giải mã được bao nhiêu?</b> Làm 10 câu; sau mỗi câu đều có lời giải.',
 21:'<b>Một câu sai giúp em học điều gì?</b> Xem lời giải và quay lại trang cần ôn.',
 22:'<b>Bây giờ em còn nghĩ như lúc đầu?</b> Đặt dự đoán cũ cạnh điều em vừa khám phá.',
 23:'<b>Huy hiệu có kể hết điều em hiểu?</b> Tự đánh giá, rồi gửi hồ sơ cho thầy cô.',
 24:'<b>Ngoài cuốn sách, em muốn khám phá gì?</b> Chiều nay hãy để ý: Mặt Trời lặn lúc mấy giờ?'
};
export const tool=(name:string,label:string,action:string,extra='')=>`<button type="button" class="fr-tool" data-action="${action}" ${extra}>${icon(name)}<span>${label}</span></button>`;
