export type StationId=0|1|2|3|4;
// layout: 18 = bố cục v1.4. Tiến độ v1.3 (24 trang) không có trường này và được đổi trang khi đọc.
export interface ProgressV1 {version:1;layout?:18;page:number;answers:Record<string,number>;predictions:number[]|null;question:string;reflection:string;revised:number[];self:number[];suitcase:string[];reason:string;rubric:number[];seen:string[];scene:{day:number;lat:number;time:number};attempts:{answers:number[];score:number;passed:boolean}[];reducedMotion:boolean;quality:'high'|'low';obs?:string[]}
export const KEY='giai-ma-bon-mua:progress:v1';
export const fresh=():ProgressV1=>({version:1,layout:18,page:1,answers:{},predictions:null,question:'',reflection:'',revised:[],self:[],suitcase:[],reason:'',rubric:[],seen:[],scene:{day:173,lat:21,time:12},attempts:[],reducedMotion:false,quality:'high'});
// Trang v1.3 (chỉ số 0–23) → trang v1.4. Xem docs/storyboard-18-trang.md, mục “Đổi tiến độ cũ”.
export const OLD_TO_NEW=[1,2,2,2,2,3,4,6,7,6,7,8,9,10,10,11,11,12,13,14,14,15,16,18] as const;
export const migratePage=(old:number)=>OLD_TO_NEW[old-1];
const nums=(x:unknown):x is number[]=>Array.isArray(x)&&x.every(v=>Number.isInteger(v)&&v>=0&&v<100);
export function decode(raw:string|null):ProgressV1{
 if(!raw)return fresh();const x=JSON.parse(raw);
 const v14=x?.layout===18,maxPage=v14?18:24;
 if(!x||x.version!==1||(x.layout!==undefined&&!v14)||!Number.isInteger(x.page)||x.page<1||x.page>maxPage||typeof x.answers!=='object'||!x.answers||Array.isArray(x.answers)||!Object.entries(x.answers).every(([k,v])=>/^[a-z0-9-]+$/.test(k)&&Number.isInteger(v)&&Number(v)>=0&&Number(v)<10)||!(x.predictions===null||(nums(x.predictions)&&x.predictions.length===3&&x.predictions.every((v:number)=>v<3)))||!['question','reflection','reason'].every(k=>typeof x[k]==='string')||!['revised','self','rubric'].every(k=>Array.isArray(x[k])&&x[k].every((v:unknown)=>Number.isInteger(v)&&Number(v)>=-1&&Number(v)<=3))||!['suitcase','seen'].every(k=>Array.isArray(x[k])&&x[k].every((v:unknown)=>typeof v==='string'))||!(x.obs===undefined||(Array.isArray(x.obs)&&x.obs.length<=3&&x.obs.every((v:unknown)=>typeof v==='string'&&v.length<=300)))||!x.scene||!Number.isFinite(x.scene.day)||x.scene.day<1||x.scene.day>365||!Number.isFinite(x.scene.lat)||Math.abs(x.scene.lat)>90||!Number.isFinite(x.scene.time)||x.scene.time<0||x.scene.time>24||!Array.isArray(x.attempts)||!x.attempts.every((a:any)=>a&&nums(a.answers)&&a.answers.length===10&&a.answers.every((v:number)=>v<4)&&Number.isInteger(a.score)&&a.score>=0&&a.score<=10&&typeof a.passed==='boolean')||typeof x.reducedMotion!=='boolean'||!['high','low'].includes(x.quality))throw Error('Dữ liệu lưu không hợp lệ');
 if(!v14){x.page=migratePage(x.page);x.layout=18;}
 return x as ProgressV1;
}
export function load(storage:Pick<Storage,'getItem'>):{state:ProgressV1;warning:string}{try{return {state:decode(storage.getItem(KEY)),warning:''};}catch{return {state:fresh(),warning:'Không đọc được tiến độ cũ. Sách vẫn hoạt động trong phiên này.'};}}
export function save(storage:Pick<Storage,'setItem'>,state:ProgressV1){try{storage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}

const ok=(s:ProgressV1,...ids:string[])=>ids.every(k=>s.answers[k]===0);
export const SHEET1=['orbit-1','orbit-2','orbit-3','journal-1'];
export const CODE=Array.from({length:6},(_,i)=>`code-${i}`);
export const SEASONS=Array.from({length:8},(_,i)=>`season-${i}`);
// Phiếu số 3: 5 địa điểm × 2 ngày. Mỗi ô đã xem được ghi vào seen dạng “dl:<vĩ độ>:<ngày>”.
export const PLACES:[number,string][]=[[0,'Xích đạo'],[10,'TP. Hồ Chí Minh'],[21,'Hà Nội'],[-34,'Sydney'],[66,'Gần vòng cực Bắc']];
export const SHEET3_DAYS=[173,356];
export const sheet3Seen=(s:ProgressV1)=>PLACES.flatMap(([lat])=>SHEET3_DAYS.filter(d=>s.seen.includes(`dl:${lat}:${d}`))).length;
export const warm=(s:ProgressV1)=>s.suitcase.includes('jacket')||s.suitcase.includes('scarf');
// Một trang được tính là xong khi đã làm xong việc chính của trang. Trang không có việc phải làm trả về undefined.
export function pageDone(s:ProgressV1,p:number):boolean|undefined{
 switch(p){
 case 3:return s.seen.includes('news');
 case 4:return !!s.predictions;
 case 6:return s.seen.includes('orbit-year');
 case 7:return ok(s,...SHEET1);
 case 8:return ok(s,...SEASONS);
 case 9:return s.answers['distance']!==undefined;
 // v1.3 ghi bảng so sánh table-0..3; v1.4 ghi câu nhận xét “poles” của Phiếu số 3.
 case 10:return ok(s,'poles')||ok(s,'table-0','table-1','table-2','table-3');
 case 11:return s.seen.includes('sky-21')&&s.seen.includes('sky--34');
 case 12:return ok(s,...CODE);
 case 13:return warm(s)&&s.reason.trim().length>=15;
 case 14:return s.attempts.some(a=>a.passed);
 case 15:return s.reflection.trim().length>=10;
 default:return undefined;
 }
}
// Huy hiệu trạm: Trạm 0 = dự đoán; 1 = Phiếu số 1; 2 = 8 thẻ mùa + câu “vì sao có mùa” + đã trả lời câu gần–xa (câu thăm dò, chỉ trả lời một lần nên đúng hay sai đều tính); 3 = Phiếu số 3 + ô chữ + vali; 4 = đạt bài kiểm tra + nhìn lại.
export function completed(s:ProgressV1):StationId[]{const out:StationId[]=[];
 if(pageDone(s,4))out.push(0);
 if(pageDone(s,7))out.push(1);
 if(pageDone(s,8)&&ok(s,'why')&&pageDone(s,9))out.push(2);
 if(pageDone(s,10)&&pageDone(s,12)&&pageDone(s,13))out.push(3);
 if(pageDone(s,14)&&pageDone(s,15))out.push(4);
 return out;
}
