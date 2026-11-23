// v1.4 · 18 trang theo tiến trình dạy học Trước – Trong – Sau – Mọi lúc (docs/storyboard-18-trang.md).
export type Phase=''|'A'|'B'|'C'|'D';
export interface BookPage{number:number;title:string;phase:Phase;image:string;say:string}
export const phases:Record<Exclude<Phase,''>,{name:string;hint:string}>={
 A:{name:'Trước giờ',hint:'Ở nhà, khoảng 15 phút'},
 B:{name:'Trên lớp',hint:'Cùng thầy cô, hoặc xem lại ở nhà'},
 C:{name:'Sau giờ',hint:'Ở nhà, khoảng 20 phút'},
 D:{name:'Mọi lúc',hint:'Ôn 3 phút mỗi ngày'}
};
// [tiêu đề, phần, ảnh nền, lời Sao Mai (≤ 15 chữ)]
const rows:[string,Phase,string,string][]=[
['Giải mã bốn mùa','','B01',''],
['Nhiệm vụ của nhà giải mã','A','B01','Chào em, mình là Sao Mai!'],
['Bản tin hai bán cầu','A','B02','Cùng ngày 15 tháng 7, hai nơi khác nhau thế nào?'],
['Dự đoán của em','A','B02','Chưa cần đúng. Hãy chọn điều em đang nghĩ.'],
['Nhắc lại Bài 7','A','B01','Một phút ôn lại trước khi lên lớp nhé.'],
['Trái Đất đi quanh Mặt Trời','B','B03','Em thử bấm Chạy: đầu trục chỉ về đâu?'],
['Trục nghiêng không đổi hướng','B','B03','Đây là chìa khoá của bốn mùa!'],
['Mùa ở hai nửa cầu','B','B03','Nửa cầu nào ngả về phía Mặt Trời?'],
['Gần hay xa?','B','B03','Mùa có phải do gần hay xa Mặt Trời?'],
['Ngày – đêm dài ngắn','B','B04','Càng đi về phía cực, điều gì thay đổi?'],
['Bầu trời Hà Nội – Sydney','B','B04','Kéo để nhìn quanh bầu trời.'],
['Ô chữ chìa khoá','B','B02','Trả lời 6 câu để mở từ khoá.'],
['Vali đi Sydney','B','B02','Giúp Nam chuẩn bị đồ nhé!'],
['Thử thách về đích','C','B05','Mỗi lần một câu, có lời giải ngay.'],
['Nhìn lại dự đoán','C','B01','Bây giờ em nghĩ gì?'],
['Hồ sơ nhà giải mã','C','B01','Em đã giải mã xong bốn mùa!'],
['Sổ tay ôn tập','D','B05','Ôn 3 phút mỗi ngày trước bài kiểm tra.'],
['Hẹn gặp ở hành trình mới','','B05','Cảm ơn nhà giải mã!']];
export const pages:BookPage[]=rows.map((r,i)=>({number:i+1,title:r[0],phase:r[1],image:r[2],say:r[3]}));
export const PAGE_COUNT=pages.length;
// Màn hình rộng: bìa riêng, 8 cặp trang, bìa sau riêng.
export const spreads=[[1],...Array.from({length:8},(_,i)=>[i*2+2,i*2+3]),[PAGE_COUNT]];
// Năm trạm của KHBD, ghi theo số trang mới.
export const stations=[
 {name:'Trước giờ học',page:2,pages:[2,3,4,5],badge:'Người đặt câu hỏi',time:'Ở nhà'},
 {name:'Quỹ đạo và trục',page:6,pages:[6,7],badge:'Nhà khám phá quỹ đạo',time:'Tiết 1'},
 {name:'Mùa ở hai nửa cầu',page:8,pages:[8,9],badge:'Người giải mã mùa',time:'Tiết 1'},
 {name:'Ngày đêm và vận dụng',page:10,pages:[10,11,12,13],badge:'Người đọc ngày đêm',time:'Tiết 2'},
 {name:'Về đích',page:14,pages:[14,15,16],badge:'Nhà giải mã',time:'Sau giờ học'}];
export const goals=['Mô tả chuyển động của Trái Đất quanh Mặt Trời','Giải thích vì sao hai nửa cầu trái mùa','So sánh độ dài ngày và đêm theo mùa, theo vĩ độ','Dùng hình vẽ, mô hình để trình bày','Vận dụng: chuẩn bị đồ đi Sydney tháng 7'];
