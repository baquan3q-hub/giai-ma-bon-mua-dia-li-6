import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {content,freshUI,type UI} from '../src/pages/content';
import {pages,PAGE_COUNT} from '../src/content/book';
import {fresh,decode,migratePage,OLD_TO_NEW,completed,pageDone,PLACES,SHEET3_DAYS,SEASON_N,SEASON_S,readsDayLength,packRubric,unsuitable,type ProgressV1} from '../src/state/progress';
import {declination} from '../src/science/earth';
const data=JSON.parse(readFileSync(new URL('../public/data/questions.json',import.meta.url),'utf8'));
const config=JSON.parse(readFileSync(new URL('../public/data/config.json',import.meta.url),'utf8'));

// Trạng thái “đã làm hết”: mọi câu đúng, đủ dự đoán, đạt bài kiểm tra, đã xem đủ.
function doneState():ProgressV1{const s=fresh();for(const g of Object.values(data) as any[])for(const q of g)if(q?.id)s.answers[q.id]=0;for(let i=0;i<8;i++)s.answers[`season-${i}`]=0;for(let i=0;i<6;i++)s.answers[`code-${i}`]=0;
 s.predictions=[0,1,2];s.question='Vì sao?';s.reflection='Trước đây em nghĩ do gần xa, giờ em hiểu do trục nghiêng.';s.suitcase=['jacket','scarf'];s.reason='Tháng 7 Sydney đang mùa lạnh.';
 s.seen=['news','orbit-year','sky-21','sky--34',...PLACES.flatMap(([l])=>SHEET3_DAYS.map(d=>`dl:${l}:${d}`))];s.attempts=[{answers:data.quiz.map((q:any)=>q.correct),score:10,passed:true}];return s;}
const strip=(h:string)=>h.replace(/<[^>]+>/g,' ').replace(/&[a-z#0-9]+;/g,' ');
const words=(t:string)=>t.split(/\s+/).filter(w=>/[\p{L}\p{N}]/u.test(w)).length;
// Một lần dựng trang: nút chính (.primary), điều khiển = tên data-action khác nhau ngoài nút chính + ô nhập, số chữ = lời Sao Mai + .fr-text.
function measure(p:number,s:ProgressV1,ui:UI){const html=content(p,{state:s,data,config,ui,badges:completed(s),resumePage:1});
 const tags=[...html.matchAll(/<(button|a|textarea|input|select)\b[^>]*>/g)].map(m=>m[0]);
 const isPrimary=(t:string)=>/class="[^"]*\bprimary\b/.test(t);
 const controls=new Set<string>();for(const t of tags){if(isPrimary(t))continue;const a=t.match(/data-action="([^":]+)/)?.[1];if(a)controls.add(a);const f=t.match(/data-save="([^"]+)/)?.[1];if(f)controls.add('input:'+f);}
 const text=[...html.matchAll(/<div class="fr-text">([\s\S]*?)<\/div>/g)].map(m=>strip(m[1])).join(' ');
 return {primary:tags.filter(isPrimary).length,controls:[...controls],words:words(text)+words(pages[p-1].say)};}
function variants(p:number):[string,ProgressV1,UI][]{const out:[string,ProgressV1,UI][]=[['mới',fresh(),freshUI()],['đã xong',doneState(),freshUI()]];
 const u=()=>freshUI();
 if(p===4){const x=u();x.pred={i:3,draft:[0,1,2]};out.push(['ô câu hỏi',fresh(),x]);}
 if(p===7){const x=u();x.steps.sheet1={i:0,chosen:1,result:'bad'};out.push(['chọn sai',fresh(),x]);}
 if(p===8){const s=fresh();const x=u();x.card=1;x.bounce=1;x.seasonMsg='Chưa đúng, thẻ đã quay về.';s.answers['season-2']=0;out.push(['đang ghép',s,x]);const d=doneState();delete d.answers.why;out.push(['câu vì sao',d,u()]);}
 if(p===10){const d=doneState();delete d.answers.poles;out.push(['đủ 10 ô',d,u()]);}
 if(p===10){const x=u();x.dl={h:'13',m:'1'};x.sheetMsg='Chưa khớp.';x.free=true;out.push(['đang ghi phiếu',fresh(),x]);}
 if(p===9){const x=u();x.hypo=true;out.push(['bật giả thuyết',fresh(),x]);}
 if(p===14){const x=u();x.quiz={order:[0,1,2,3,4,5,6,7,8,9],pos:2,chosen:1,shown:true,answers:[0,0]};out.push(['đang làm',fresh(),x]);const s=fresh();s.attempts=[{answers:[0,0,0,0,0,0,0,0,0,0],score:2,passed:false}];out.push(['chưa đạt',s,u()]);}
 if(p===17){for(const tab of ['practice'] as const){const x=u();x.deck.tab=tab;x.deck.pool=['orbit-1','q1','truth-1','table-1','journal-1'];x.deck.chosen=tab==='practice'?0:null;out.push([tab,fresh(),x]);}}
 return out;}

test('Mỗi màn hình: ≤ 1 nút chính, ≤ 3 điều khiển, ≤ 60 chữ',()=>{
 for(let p=1;p<=PAGE_COUNT;p++)for(const [name,s,ui] of variants(p)){const m=measure(p,s,ui);
  assert.ok(m.primary<=1,`Trang ${p} (${name}): ${m.primary} nút chính`);
  assert.ok(m.controls.length<=3,`Trang ${p} (${name}): ${m.controls.length} điều khiển ${m.controls.join(', ')}`);
  assert.ok(m.words<=60,`Trang ${p} (${name}): ${m.words} chữ`);}
});
test('Trang có việc phải làm thì có đường đi tiếp sau khi xong',()=>{const s=doneState();for(const p of [2,3,4,5,6,7,8,9,10,11,12,13,14,16])assert.match(content(p,{state:s,data,config,ui:p===13?{...freshUI(),packMsg:'Chuẩn rồi!'}:freshUI(),badges:completed(s),resumePage:1}),/data-action="go:\d+"/,`Trang ${p}`);});
test('Làm hết thì đủ 5 huy hiệu và mọi trang có việc đều xong',()=>{const s=doneState();assert.deepEqual(completed(s),[0,1,2,3,4]);for(let p=1;p<=PAGE_COUNT;p++)assert.notEqual(pageDone(s,p),false,`Trang ${p}`);assert.deepEqual(completed(fresh()),[]);const w=doneState();w.answers.distance=1;assert.ok(completed(w).includes(2),'Sai câu gần–xa vẫn được huy hiệu 2');delete w.answers.why;assert.ok(!completed(w).includes(2),'Chưa đúng câu vì sao thì chưa có huy hiệu 2');});
test('Tiến độ v1.3 (24 trang) mở đúng trang tương ứng của bản 18 trang',()=>{
 assert.equal(OLD_TO_NEW.length,24);assert.ok(OLD_TO_NEW.every(p=>p>=1&&p<=18));
 for(const [old,now] of [[1,1],[7,4],[8,6],[12,8],[13,9],[16,11],[17,11],[18,12],[19,13],[20,14],[22,15],[23,16],[24,18]])assert.equal(migratePage(old),now,`trang cũ ${old}`);
 const old={...fresh(),page:17,answers:{'orbit-1':0}} as any;delete old.layout;const s=decode(JSON.stringify(old));assert.equal(s.page,11);assert.equal(s.layout,18);assert.equal(s.answers['orbit-1'],0);
 assert.equal(decode(JSON.stringify(s)).page,11);
 assert.throws(()=>decode(JSON.stringify({...fresh(),page:19})));
 const v13={...fresh(),page:24} as any;delete v13.layout;assert.equal(decode(JSON.stringify(v13)).page,18);
 assert.throws(()=>decode(JSON.stringify({...fresh(),layout:24})));
});
test('Phiếu 3 do học sinh tự nhập: đúng trong ±10 phút, không tự điền',()=>{
 assert.ok(readsDayLength(21,173,'13','17'));assert.ok(readsDayLength(21,173,'13','10'));assert.ok(!readsDayLength(21,173,'13','40'));assert.ok(!readsDayLength(21,173,'','17'));assert.ok(!readsDayLength(21,173,'13','75'));
 assert.ok(readsDayLength(-34,173,'9','44'));assert.ok(readsDayLength(0,356,'12','7'));
 const s=fresh();s.page=10;const html=content(10,{state:s,data,config,ui:freshUI(),badges:[],resumePage:1});assert.match(html,/data-input="dl-h"/);assert.match(html,/đã ghi 0\/10 ô/);
});
test('Thẻ mùa Phiếu 2 khớp nửa cầu ngả về Mặt Trời',()=>{const days=[80,173,266,356];
 days.forEach((d,i)=>{const decl=declination(d);if(Math.abs(decl)>10){assert.equal(SEASON_N[i],decl>0?1:3,`Bắc ${d}`);assert.equal(SEASON_S[i],decl>0?3:1,`Nam ${d}`);}else assert.equal(Math.abs(SEASON_N[i]-SEASON_S[i]),2);});
});
test('Vali: đồ mùa nóng không đạt; rubric 3 tiêu chí theo từ khoá, có dấu hoặc không dấu',()=>{
 const s=doneState();assert.ok(pageDone(s,13));s.suitcase=['jacket','sandals'];assert.deepEqual(unsuitable(s),['sandals']);assert.ok(!pageDone(s,13));
 assert.deepEqual(packRubric('Vì Sydney ở nửa cầu Nam, trục nghiêng nên chếch xa Mặt Trời, tháng 7 là mùa đông.'),[true,true,true]);
 assert.deepEqual(packRubric('Sydney o nua cau Nam, truc nghieng, troi lanh'),[true,true,true]);
 assert.deepEqual(packRubric('Nam thích mặc áo khoác cho đẹp'),[false,false,false]);
});
test('Gợi ý 2 tầng: trang có gợi ý thì có lời Sao Mai, và vùng tô sáng có trên trang',()=>{
 const hints=JSON.parse(readFileSync(new URL('../public/data/hints.json',import.meta.url),'utf8'));
 for(const [k,h] of Object.entries(hints) as [string,any][]){const p=Number(k);assert.ok(pages[p-1]?.say,`tr.${p} cần lời Sao Mai`);assert.ok(h.ask.length>10&&h.look.length>10);
  const html=content(p,{state:fresh(),data,config,ui:freshUI(),badges:[],resumePage:1}),sel=h.at as string;
  assert.ok(sel.startsWith('#')?html.includes(`id="${sel.slice(1)}"`):[...html.matchAll(/class="([^"]*)"/g)].some(m=>m[1].split(/\s+/).includes(sel.slice(1))),`tr.${p}: thiếu ${sel}`);}
});
// In bảng đo khi cần: BAO_CAO=1 npm test
if(process.env.BAO_CAO)for(let p=1;p<=PAGE_COUNT;p++)for(const [name,s,ui] of variants(p)){const m=measure(p,s,ui);console.log(`tr.${p}\t${name}\tchính ${m.primary}\tđiều khiển ${m.controls.length} [${m.controls.join(' ')}]\t${m.words} chữ`);}
