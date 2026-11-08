import {pages,spreads,stations} from '../src/content/book.ts';
import {writeFile,mkdir} from 'node:fs/promises';
const actions=['Mở/Tiếp tục','Nhận nhiệm vụ','Thử chú thích','Mở ví dụ mục tiêu','Chọn trạm','Đọc bản tin/video','Dự đoán ba câu + hộp câu hỏi','Kéo ngày/chạy/dừng/mở rộng','Phiếu số 1','Mở đài quan sát 360°','Nhật ký ba câu','Ghép 8 thẻ mùa','Kiểm chứng + Đúng/Sai','Đổi vĩ độ/ngày + biểu đồ','Bảng theo Hình 4 + mở rộng','Cảnh trời 360°','Điểm mọc/cao nhất/lặn','Sáu câu giải mã','Chọn đồ + giải thích + rubric','Bài kiểm tra 10 câu','Kết quả + xem lời giải','Đối chiếu dự đoán + phản tư','Huy hiệu + tự đánh giá + gửi/xuất','Nguồn + học lại'];
const header='# Storyboard 24 trang\n\nBìa trước/sau đứng riêng. 11 cặp trang dùng tranh nền chung; không đặt nội dung quan trọng ở gáy. Chữ và mô hình là lớp web riêng, không vẽ chữ trong ảnh.\n\n';
const table='|Trang|Nội dung|Lời dẫn|Hoạt động chính|Tranh nền|\n|---|---|---|---|---|\n'+pages.map((p,i)=>`|${p.number}|${p.title}|${p.intro}|${actions[i]}|${p.image}|`).join('\n');
const mapping='\n\n## Phân bố cặp trang\n\n'+spreads.map(s=>`- ${s.length===1?'Bìa':'Cặp'} ${s.join('–')}: ${s.map(p=>pages[p-1].title).join(' / ')}.`).join('\n')+'\n\n## Năm trạm\n\n'+stations.map((s,i)=>`- Trạm ${i}: ${s.name}, từ trang ${s.page}, ${s.time}.`).join('\n')+'\n';
await mkdir('../tai-lieu',{recursive:true});await writeFile('../tai-lieu/storyboard-24-trang.md',header+table+mapping);
console.log('Đã ghi storyboard từ dữ liệu sách.');
