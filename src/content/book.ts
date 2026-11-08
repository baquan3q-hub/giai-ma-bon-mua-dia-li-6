export interface BookPage{number:number;title:string;eyebrow:string;intro:string;station?:number;image:string}
const rows:[string,string,string,number|undefined,string][]=[
['Giải mã bốn mùa','HỒ SƠ KHÁM PHÁ · ĐỊA LÍ 6','Vì sao Hà Nội và Sydney trái mùa?',undefined,'B01'],
['Chào nhà giải mã!','BẮT ĐẦU HÀNH TRÌNH','Mình là Sao Mai. Cùng tìm lời giải cho bí mật bốn mùa nhé!',undefined,'B01'],
['Cuốn sách trong tay em','HƯỚNG DẪN SỬ DỤNG','Chạm để khám phá. Kéo để nhìn quanh. Mỗi phát hiện đưa em đến gần lời giải.',undefined,'B01'],
['Em sẽ học được gì?','BỐN MỤC TIÊU','Sau hành trình, em có thể…',undefined,'B01'],
['Bản đồ hành trình','MỤC LỤC TƯƠNG TÁC','Năm trạm, một bí mật. Em muốn bắt đầu từ đâu?',undefined,'B01'],
['Bản tin hai bán cầu','TRẠM 0 · TRƯỚC GIỜ HỌC','Cùng tháng 7: Hà Nội nóng, Sydney cần áo ấm. Có điều gì đang diễn ra?',0,'B02'],
['Dự đoán của em','TRẠM 0 · KHÔNG CHẤM ĐIỂM','Chưa cần đúng. Hãy giữ lại suy nghĩ ban đầu để đối chiếu sau hành trình.',0,'B02'],
['Một năm của Trái Đất','TRẠM 1 · TIẾT 1','Trái Đất đi quanh Mặt Trời như thế nào?',1,'B03'],
['Bí mật của trục nghiêng','TRẠM 1 · QUAN SÁT & GHI CHÉP','Một vòng quỹ đạo, hướng nghiêng vẫn giữ nguyên.',1,'B03'],
['Bước vào đài quan sát','TRẠM 1 · KHÔNG GIAN 360°','Tìm ba bằng chứng về chuyển động của Trái Đất.',1,'B03'],
['Nhật ký quan sát','TRẠM 1 · PHIẾU SỐ 1','Biến điều em thấy thành lời giải thích.',1,'B03'],
['Bốn ngày đặc biệt','TRẠM 2 · TIẾT 1','Hai nửa cầu đón những mùa khác nhau.',2,'B03'],
['Mùa hè có phải do ở gần?','TRẠM 2 · KIỂM CHỨNG','Đừng đoán bằng hình vẽ. Hãy đối chiếu khoảng cách và hai bán cầu.',2,'B03'],
['Đồng hồ ngày đêm','TRẠM 3 · TIẾT 2','Mỗi nơi có bao nhiêu giờ ban ngày?',3,'B04'],
['Em đọc được quy luật gì?','TRẠM 3 · THEO HÌNH 4 SGK','So sánh hai bán cầu trước, rồi khám phá thêm các vĩ độ.',3,'B04'],
['Bầu trời Hà Nội–Sydney','TRẠM 3 · KHÁM PHÁ 360°','Cùng một ngày, Mặt Trời ở trên chân trời bao lâu?',3,'B04'],
['Theo dấu Mặt Trời','TRẠM 3 · QUAN SÁT','Tìm điểm mọc, vị trí cao nhất và điểm lặn.',3,'B04'],
['Giải mã từ khoá','TRẠM 3 · SÁU MẢNH GHÉP','Mỗi câu trả lời mở một phần của chìa khoá.',3,'B02'],
['Vali đi Ô-xtrây-li-a','TRẠM 3 · VẬN DỤNG','Tháng 7, Nam đến Sydney. Em sẽ chuẩn bị gì?',3,'B02'],
['Thử thách về đích','TRẠM 4 · SAU GIỜ HỌC','Mười câu hỏi để kiểm tra lời giải của em.',4,'B05'],
['Kết quả & lời giải','TRẠM 4 · NHÌN LẠI','Một câu sai cũng có thể dẫn đến một phát hiện mới.',4,'B05'],
['Em đã thay đổi điều gì?','TRẠM 4 · TRƯỚC & SAU','Đối chiếu dự đoán ban đầu với những điều vừa khám phá.',4,'B01'],
['Hồ sơ nhà giải mã','TRẠM 4 · HÀNH TRÌNH CỦA EM','Mang theo kiến thức, không chỉ huy hiệu.',4,'B01'],
['Hẹn gặp ở hành trình mới','GIẢI MÃ BỐN MÙA · PHIÊN BẢN 1.0','Quan sát bầu trời hôm nay. Em sẽ nhìn thấy điều gì khác?',undefined,'B05']];
export const pages:BookPage[]=rows.map((r,i)=>({number:i+1,title:r[0],eyebrow:r[1],intro:r[2],station:r[3],image:r[4]}));
export const spreads=[[1],...Array.from({length:11},(_,i)=>[i*2+2,i*2+3]),[24]];
export const stations=[{name:'Bản tin hai bán cầu',page:6,badge:'Người đặt câu hỏi',time:'Trước giờ học'},{name:'Quỹ đạo',page:8,badge:'Nhà khám phá quỹ đạo',time:'Tiết 1'},{name:'Bốn ngày đặc biệt',page:12,badge:'Người giải mã mùa',time:'Tiết 1'},{name:'Đồng hồ ngày đêm',page:14,badge:'Người đọc ngày đêm',time:'Tiết 2'},{name:'Về đích',page:20,badge:'Nhà giải mã',time:'Sau giờ học'}];
export const goals=['Mô tả chuyển động quanh Mặt Trời','Giải thích nguyên nhân sinh ra mùa','So sánh độ dài ngày và đêm','Chuẩn bị trang phục phù hợp với mùa'];
