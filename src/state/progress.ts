export type StationId=0|1|2|3|4;
export interface ProgressV1 {version:1;page:number;answers:Record<string,number>;predictions:number[]|null;question:string;reflection:string;revised:number[];self:number[];suitcase:string[];reason:string;rubric:number[];seen:string[];scene:{day:number;lat:number;time:number};attempts:{answers:number[];score:number;passed:boolean}[];reducedMotion:boolean;quality:'high'|'low'}
export const KEY='giai-ma-bon-mua:progress:v1';
export const fresh=():ProgressV1=>({version:1,page:1,answers:{},predictions:null,question:'',reflection:'',revised:[],self:[],suitcase:[],reason:'',rubric:[],seen:[],scene:{day:173,lat:21,time:12},attempts:[],reducedMotion:false,quality:'high'});
const nums=(x:unknown):x is number[]=>Array.isArray(x)&&x.every(v=>Number.isInteger(v)&&v>=0&&v<100);
export function decode(raw:string|null):ProgressV1{
 if(!raw)return fresh();const x=JSON.parse(raw);
 if(!x||x.version!==1||!Number.isInteger(x.page)||x.page<1||x.page>24||typeof x.answers!=='object'||!x.answers||Array.isArray(x.answers)||!Object.entries(x.answers).every(([k,v])=>/^[a-z0-9-]+$/.test(k)&&Number.isInteger(v)&&Number(v)>=0&&Number(v)<10)||!(x.predictions===null||(nums(x.predictions)&&x.predictions.length===3&&x.predictions.every((v:number)=>v<3)))||!['question','reflection','reason'].every(k=>typeof x[k]==='string')||!['revised','self','rubric'].every(k=>Array.isArray(x[k])&&x[k].every((v:unknown)=>Number.isInteger(v)&&Number(v)>=-1&&Number(v)<=3))||!['suitcase','seen'].every(k=>Array.isArray(x[k])&&x[k].every((v:unknown)=>typeof v==='string'))||!x.scene||!Number.isFinite(x.scene.day)||x.scene.day<1||x.scene.day>365||!Number.isFinite(x.scene.lat)||Math.abs(x.scene.lat)>90||!Number.isFinite(x.scene.time)||x.scene.time<0||x.scene.time>24||!Array.isArray(x.attempts)||!x.attempts.every((a:any)=>a&&nums(a.answers)&&a.answers.length===10&&a.answers.every((v:number)=>v<4)&&Number.isInteger(a.score)&&a.score>=0&&a.score<=10&&typeof a.passed==='boolean')||typeof x.reducedMotion!=='boolean'||!['high','low'].includes(x.quality))throw Error('Dữ liệu lưu không hợp lệ');
 return x as ProgressV1;
}
export function load(storage:Pick<Storage,'getItem'>):{state:ProgressV1;warning:string}{try{return {state:decode(storage.getItem(KEY)),warning:''};}catch{return {state:fresh(),warning:'Không đọc được tiến độ cũ. Sách vẫn hoạt động trong phiên này.'};}}
export function save(storage:Pick<Storage,'setItem'>,state:ProgressV1){try{storage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
export function completed(s:ProgressV1):StationId[]{const out:StationId[]=[];
 if(s.predictions)out.push(0);
 if(['orbit-1','orbit-2','orbit-3','journal-1','journal-2','journal-3'].every(k=>s.answers[k]===0))out.push(1);
 if(Array.from({length:8},(_,i)=>s.answers[`season-${i}`]===0).every(Boolean)&&s.answers['distance']===0)out.push(2);
 if(['table-0','table-1','table-2','table-3',...Array.from({length:6},(_,i)=>`code-${i}`)].every(k=>s.answers[k]===0)&&s.suitcase.includes('jacket')&&s.reason.trim().length>=15&&s.rubric.length===3&&s.rubric.every(v=>v>=1&&v<=3))out.push(3);
 if(s.attempts.some(a=>a.passed)&&s.reflection.trim().length>=10&&s.revised.length===3&&s.revised.every(v=>v>=0&&v<=2))out.push(4);
 return out;
}
