// Nội dung 18 trang v1.4 (docs/storyboard-18-trang.md).
// Mỗi trang: chữ cho học sinh trong .fr-text (≤ 60 chữ kể cả lời Sao Mai), ≤ 1 nút chính (.primary), ≤ 3 điều khiển.
// Điều khiển = một nhóm data-action cùng tên, hoặc một ô nhập (data-save). Vỏ (Mục lục, ⋯, ←, →) do main.ts dựng.
// Mọi góc, độ dài ngày, khoảng cách đều tính từ src/science/earth.ts.
import {img,btn,go,esc,base} from './ui';
import {icon} from './frames';
import {stations,phases} from '../content/book';
import {dayLength,hours,dates,distanceAU} from '../science/earth';
import {orbitSvg,globeSvg} from './figures';
import {pageDone,warm,PLACES,SHEET3_DAYS,sheet3Seen,type ProgressV1} from '../state/progress';

export type Question={id:string;prompt:string;options:string[];correct:number;explanation:string};
export type Step={i:number;chosen:number|null;result:'ok'|'bad'|null};
export interface UI{
 pred:{i:number;draft:number[]};
 steps:Record<string,Step>;
 north:number|null;south:number|null;seasonMsg:string;
 quiz:{order:number[];pos:number;chosen:number|null;shown:boolean;answers:number[]}|null;
 deck:{tab:'cards'|'practice'|'anim';i:number;flip:boolean;pool:string[];pos:number;chosen:number|null};
 packMsg:string;revealed:string[];spin:boolean;near:boolean;saved:string;
}
export const freshUI=():UI=>({pred:{i:0,draft:[]},steps:{},north:null,south:null,seasonMsg:'',quiz:null,deck:{tab:'cards',i:0,flip:false,pool:[],pos:0,chosen:null},packMsg:'',revealed:[],spin:false,near:false,saved:''});
export type Ctx={state:ProgressV1;data:Record<string,any>;config:any;ui:UI;badges:number[];resumePage:number};

const vi=(n:number,d=1)=>n.toFixed(d).replace('.',',');
const actions=(...parts:string[])=>`<div class="fr-actions">${parts.join('')}</div>`;
const text=(...ps:string[])=>`<div class="fr-text">${ps.map(p=>`<p>${p}</p>`).join('')}</div>`;
const note=(t:string)=>`<small class="fr-sim-note">${t}</small>`;
const key=(show:boolean|undefined,t:string)=>show?`<aside class="fr-key" aria-label="Chốt kiến thức">${icon('check')}<span><b>Chốt kiến thức</b>${t}</span></aside>`:'';
const primary=(label:string,action:string,disabled=false)=>btn(label,action,'primary',disabled?'disabled':'');
const feedback=(ok:boolean,t:string)=>`<p class="qc-feedback ${ok?'ok':'bad'}" role="status">${t}</p>`;
// Một nhóm phương án = 1 điều khiển. graded: tô đúng/sai cho phương án đã chọn.
export const options=(action:string,list:string[],chosen:number|null,graded?:number,disabled=false)=>`<div class="qc-options" role="group">${list.map((o,i)=>{const mark=graded!==undefined&&chosen===i?(i===graded?' correct':' incorrect'):'';return `<button type="button" class="qc-opt${chosen===i?' on':''}${mark}" data-action="${action}:${i}" aria-pressed="${chosen===i}" ${disabled?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${esc(o)}</button>`;}).join('')}</div>`;
const chips=(action:string,list:[string|number,string][],on:(v:string|number)=>boolean)=>`<div class="fr-chips-row" role="group">${list.map(([v,t])=>btn(t,`${action}:${v}`,on(v)?'chip active':'chip',`aria-pressed="${on(v)}"`)).join('')}</div>`;
const findQ=(data:Record<string,any>,id:string):Question=>Object.values(data).flat().find((q:any)=>q?.id===id);

export function dayButtonsOf(s:ProgressV1,only?:number[]){return chips('date',dates.filter(d=>!only||only.includes(d.day)).map(d=>[d.day,d.label]),v=>s.scene.day===v);}
export function metricsOf(s:ProgressV1){const h=dayLength(s.scene.day,s.scene.lat);return `<div class="day-ring" style="--day:${h/24*100}%"><div><small>BAN NGÀY</small><strong>${hours(h)}</strong><span>Đêm ${hours(24-h)}</span></div></div>`;}
export const globeOf=(s:ProgressV1)=>globeSvg(s.scene.day,s.scene.lat);

export const packItems=[['jacket','D02','Áo khoác'],['scarf','D03','Khăn quàng'],['shirt','D04','Áo thun'],['trousers','D05','Quần dài'],['sandals','D06','Dép sandal']] as const;

// Phiếu từng ô: chọn → Kiểm tra → Ô tiếp. Sai thì gợi ý và chọn lại, không trừ điểm.
export const firstOpen=(s:ProgressV1,ids:string[])=>Math.max(0,ids.findIndex(id=>s.answers[id]!==0));
function stepper(c:Ctx,name:string,ids:string[],labels:string[],nextLabel:string):{body:string;main:string;done:boolean}{
 const s=c.state,done=ids.every(id=>s.answers[id]===0),st=c.ui.steps[name]??{i:firstOpen(s,ids),chosen:null,result:null};
 const cells=ids.length>1?`<ol class="qc-cells" aria-label="Tiến độ">${ids.map((id,i)=>`<li class="${s.answers[id]===0?'done':''}${i===st.i&&!(done&&st.result!=='ok')?' on':''}"><b>${s.answers[id]===0?'✓':i+1}</b><span>${labels[i]}</span></li>`).join('')}</ol>`:'';
 if(done&&st.result!=='ok')return {body:cells,main:'',done};
 const q=findQ(c.data,ids[st.i]);if(!q)return {body:cells,main:'',done};
 const ok=st.result==='ok';
 const body=`${cells}<div class="qc" aria-live="polite"><h3>${esc(q.prompt)}</h3>${options(`pick`,q.options,st.chosen,ok||st.result==='bad'?q.correct:undefined,ok).replaceAll(`data-action="pick:`,`data-action="pick:${name}.`)}${ok?feedback(true,'Đúng rồi! '+esc(q.explanation)):st.result==='bad'?feedback(false,'Chưa đúng. Nhìn lại hình rồi chọn lại nhé.'):''}</div>`;
 const last=ids.every((id,i)=>i===st.i||s.answers[id]===0);
 return {body,main:ok?primary(last?'Xong phiếu':nextLabel,`step-next:${name}`):primary('Kiểm tra',`check:${name}`,st.chosen===null),done};
}

export function content(p:number,c:Ctx):string{
 const s=c.state,ui=c.ui;
 switch(p){
 case 1:return `<div class="cover-kicker">LỊCH SỬ VÀ ĐỊA LÍ 6 · KẾT NỐI TRI THỨC</div><div class="cover-orbit"></div>${img('C02','cover-sun','')}${img('C01','cover-earth','Trái Đất minh hoạ')}<div class="cover-copy"><span class="edition">ĐỊA LÍ 6 · BÀI 8</span><h1 tabindex="-1">Giải mã<br><em>bốn mùa</em></h1><div class="fr-text"><p>Vì sao tháng 7, Hà Nội nóng mà Sydney lại lạnh?</p></div><div class="cover-entries">${c.resumePage>1?go(`Học tiếp: trang ${c.resumePage}`,c.resumePage):go('Em tự học',2)}${btn('Thầy cô dạy trên lớp','teacher','cover-teacher')}</div></div>${img('A01','cover-sao','Sao Mai chào em')}<div class="cover-bottom">QUÂN · ĐH GIÁO DỤC – ĐHQGHN <span>18 TRANG · 4 PHẦN</span></div>`;

 // A · TRƯỚC GIỜ
 case 2:return `<div class="fr-stage fr-mission2">${img('A01','fr-hero-img','Sao Mai chào em')}<ol class="phase-strip" aria-label="Bốn phần của cuốn sách">${(Object.entries(phases) as [string,{name:string;hint:string}][]).map(([k,v])=>`<li class="${k==='A'?'on':''}"><b>${k}</b><span><strong>${v.name}</strong>${v.hint}</span></li>`).join('')}</ol></div>${text('Nhiệm vụ: tìm lời giải cho câu hỏi <b>“Vì sao Hà Nội và Sydney trái mùa?”</b>','Hôm nay ở nhà, em chỉ cần 15 phút: xem bản tin, đoán thử, ghi một câu hỏi. Đoán sai không sao cả!')}${actions(go('Xem bản tin',3))}`;

 case 3:{const scene=(id:string,cls:string,pic:string,alt:string,place:string,ans:string,tag:string)=>{const open=ui.revealed.includes(id);return `<button type="button" class="fr-scene ${cls}${open?' open':''}" data-action="reveal:${id}" aria-expanded="${open}">${img(pic,'',alt)}<span class="fr-cap"><small>${place}</small><strong><span class="q">Chạm để xem</span><span class="a">${ans}</span></strong><span class="fr-chips"><i>${tag}</i></span></span></button>`;};
  return `<div class="fr-stage fr-pair">${scene('hn','warm','G01','Hà Nội tháng 7: học sinh mặc áo ngắn tay bên hồ Hoàn Kiếm','HÀ NỘI · 15/7','Nắng nóng, 36 °C',`${icon('hot')}Áo ngắn tay`)}<div class="fr-same fr-month"><span>CÙNG<br>NGÀY</span></div>${scene('sy','cold','G02','Sydney tháng 7: học sinh mặc áo khoác bên nhà hát Opera','SYDNEY · 15/7','Gió lạnh, 12 °C',`${icon('cold')}Áo khoác`)}</div>${text('Em để ý: hai nơi khác nhau ở những điểm nào?')}${actions(go('Em đoán thử',4))}`;}

 case 4:{const P=c.data.predictions as {prompt:string;options:string[]}[];
  if(s.predictions)return `<ol class="qc-summary">${P.map((q,i)=>`<li><small>${esc(q.prompt)}</small><b>${esc(q.options[s.predictions![i]])}</b></li>`).join('')}${s.question?`<li><small>Câu hỏi của em</small><b>${esc(s.question)}</b></li>`:''}</ol>${feedback(true,'Đã lưu. Lên lớp mình cùng kiểm chứng nhé!')}${actions(go('Tiếp: nhắc lại Bài 7',5))}`;
  const i=ui.pred.i,dots=`<ol class="qc-dots" aria-label="Câu ${i+1} trên 4">${[0,1,2,3].map(k=>`<li class="${k<i?'done':k===i?'on':''}">${k+1}</li>`).join('')}</ol>`;
  if(i<3)return `${dots}<div class="qc"><h3>${esc(P[i].prompt)}</h3>${options('predict',P[i].options,ui.pred.draft[i]??null)}</div>${actions(primary('Câu tiếp','pred-next',ui.pred.draft[i]===undefined))}`;
  return `${dots}<div class="qc"><label class="qc-write"><span>Em thắc mắc điều gì? <small>(không bắt buộc)</small></span><textarea id="prediction-question" data-save="question" maxlength="600" rows="3">${esc(s.question)}</textarea></label></div>${actions(primary('Lưu dự đoán','save-prediction'))}`;}

 case 5:{const cx=150,cy=112,R=84,yLat=(lat:number)=>(cy-R*Math.sin(lat*Math.PI/180)).toFixed(1);
  const svg=`<svg class="b7-globe${ui.spin?' spinning':''}" viewBox="0 0 330 224" role="img" aria-label="Quả Địa Cầu: trục nối cực Bắc và cực Nam, Xích đạo chia nửa cầu Bắc và nửa cầu Nam; Hà Nội ở nửa cầu Bắc, Sydney ở nửa cầu Nam"><defs><clipPath id="b7c"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs><circle cx="${cx}" cy="${cy}" r="${R}" fill="#7cc3e8"/><g clip-path="url(#b7c)"><g class="b7-lines">${Array.from({length:16},(_,k)=>`<path d="M${cx-R*2+k*24} ${cy-R}V${cy+R}" stroke="#ffffff66" stroke-width="2"/>`).join('')}</g><rect x="${cx}" y="${cy-R}" width="${R}" height="${2*R}" fill="#14294a" opacity=".55"/></g><path d="M${cx-R} ${cy}H${cx+R}" stroke="#c0392b" stroke-width="3"/><path d="M${cx} ${cy-R-16}V${cy+R+16}" stroke="#3b5370" stroke-width="3" stroke-dasharray="6 4"/><circle cx="${cx-30}" cy="${yLat(21)}" r="6" fill="#c97a12" stroke="#fff" stroke-width="2"/><circle cx="${cx+8}" cy="${yLat(-34)}" r="6" fill="#1f6fb8" stroke="#fff" stroke-width="2"/><g font-size="13" fill="#24364d" font-weight="600"><text x="${cx}" y="${cy-R-20}" text-anchor="middle">Cực Bắc</text><text x="${cx}" y="${cy+R+30}" text-anchor="middle">Cực Nam</text><text x="${cx+R+6}" y="${cy+5}" fill="#c0392b">Xích đạo</text><text x="${cx-36}" y="${+yLat(21)-10}" text-anchor="end">Hà Nội</text><text x="${cx+16}" y="${+yLat(-34)+18}" fill="#fff">Sydney</text><text x="8" y="${cy-44}">Nửa cầu Bắc</text><text x="8" y="${cy+56}">Nửa cầu Nam</text></g><g font-size="12" fill="#3b5370"><text x="${cx-R+12}" y="${cy+R+4}">Ngày</text><text x="${cx+R-40}" y="${cy+R+4}">Đêm</text></g></svg>`;
  return `<div class="fr-stage fr-figure">${svg}</div>${text('<b>Xích đạo</b> chia Trái Đất thành nửa cầu Bắc và nửa cầu Nam. Hà Nội ở nửa cầu Bắc, Sydney ở nửa cầu Nam.','Trái Đất tự quay từ tây sang đông, một vòng <b>24 giờ</b>, sinh ra ngày và đêm.')}<div class="fr-controls">${btn(`${icon('play')}<span>Cho Trái Đất tự quay</span>`,'spin','secondary',`aria-pressed="${ui.spin}"`)}</div>${actions(go('Sang phần Trên lớp',6))}`;}

 // B · TRÊN LỚP / XEM LẠI
 case 6:return `<div class="fr-stage fr-sim"><div class="inline-simulation" id="orbit-mount" data-interactive><div class="scene-loading">Đang dựng mô hình…</div></div>${note('Mô hình không theo tỉ lệ thật · đối chiếu Hình 1 SGK tr. 122')}</div>${text('Trái Đất đi quanh Mặt Trời theo quỹ đạo <b>elip gần tròn</b>, từ <b>tây sang đông</b>. Một vòng hết <b>365 ngày 6 giờ</b>.')}<div class="fr-controls">${dayButtonsOf(s)}${btn(`${icon('play')}<span>Chạy một năm</span>`,'play-orbit','secondary','aria-pressed="false"')}${btn(`${icon('search')}<span>${ui.near?'Nhìn cả quỹ đạo':'Nhìn gần Trái Đất'}</span>`,'near','secondary',`aria-pressed="${ui.near}"`)}</div>${key(pageDone(s,6),'Elip gần tròn · Tây → đông · 365 ngày 6 giờ.')}${actions(go('Tiếp: bí mật của trục',7))}`;

 case 7:{const r=stepper(c,'sheet1',['orbit-1','orbit-2','journal-1','orbit-3'],['Hình quỹ đạo','Hướng chuyển động','Thời gian một vòng','Trục nghiêng'],'Ô tiếp');
  const at=c.ui.steps['sheet1']?.i??firstOpen(s,['orbit-1','orbit-2','journal-1','orbit-3']),look=r.done?'':(['ring','dir','year','axes'] as const)[at];
  return `<div class="fr-stage fr-orbit">${orbitSvg(0,false,look)}</div>${text('Nhìn 4 vị trí: trục Trái Đất luôn nghiêng <b>66°33′</b> và chỉ về cùng một hướng. Điền <b>Phiếu số 1</b> nhé.')}${r.body}${key(r.done,'Trục nghiêng 66°33′, không đổi độ nghiêng và hướng nghiêng.')}${actions(r.main||go('Tiếp: mùa ở hai nửa cầu',8))}`;}

 case 8:{const k=dates.findIndex(d=>d.day===s.scene.day),names=['Mùa nóng','Mùa lạnh','Chuyển tiếp'];
  const table=`<table class="qc-table"><caption>Phiếu số 2 · Mùa ở hai nửa cầu</caption><tr><th></th>${dates.map((d,i)=>`<th class="${i===k?'on':''}">${d.label}</th>`).join('')}</tr>${['Bắc','Nam'].map((h,j)=>`<tr><th>${h}</th>${dates.map((_,i)=>{const id=`season-${i*2+j}`,exp=j===0?[2,0,2,1][i]:[2,1,2,0][i];return `<td>${s.answers[id]===0?names[exp]:'…'}</td>`;}).join('')}</tr>`).join('')}</table>`;
  const all=!!pageDone(s,8);
  if(all){const r=stepper(c,'why',['why'],[],'Xong');const solved=s.answers['why']===0;return `<div class="fr-stage fr-orbit">${orbitSvg(s.scene.day)}</div>${text('Nửa cầu ngả về Mặt Trời nhận nhiều ánh sáng và nhiệt hơn: đó là <b>mùa nóng</b>.')}${table}${r.body}${key(solved,'Hai nửa cầu luôn trái mùa. Nguyên nhân là trục nghiêng và không đổi hướng.')}<div class="fr-controls">${dayButtonsOf(s)}</div>${actions(r.main||go('Tiếp: gần hay xa?',9))}`;}
  const pick=(label:string,action:string,v:number|null)=>`<div class="qc-half"><span>${label}</span>${options(action,names,v)}</div>`;
  return `<div class="fr-stage fr-orbit">${orbitSvg(s.scene.day)}</div>${text('Chọn một ngày. Nửa cầu ngả về Mặt Trời nhận nhiều ánh sáng và nhiệt hơn: đó là <b>mùa nóng</b>.')}<div class="fr-controls">${dayButtonsOf(s)}</div>${k<0?'':`<div class="qc qc-pair">${pick('Nửa cầu Bắc','north',ui.north)}${pick('Nửa cầu Nam','south',ui.south)}</div>`}${ui.seasonMsg?`<p class="qc-feedback ${ui.seasonMsg.startsWith('Đúng')?'ok':'bad'}" role="status">${ui.seasonMsg}</p>`:''}${table}${actions(primary('Kiểm tra','check-season',k<0||ui.north===null||ui.south===null))}`;}

 case 9:{const d1=distanceAU(3),d7=distanceAU(185),q=findQ(c.data,'distance'),a=s.answers['distance'],chosen=a===undefined?null:a===0?q.correct:a-1;
  const side=(top:string,d:number,n:string,north:boolean)=>`<div class="fr-card fr-half ${north?'cold':'warm'}"><span class="fr-card-text"><small>${top}</small><strong class="fr-big">${vi(d*149.6,0)} triệu km</strong><span>${n}</span><span class="fr-chips"><i>${icon(north?'cold':'hot')}Bắc: ${north?'mùa lạnh':'mùa nóng'}</i><i>${icon(north?'hot':'cold')}Nam: ${north?'mùa nóng':'mùa lạnh'}</i></span></span></div>`;
  const pins='<circle cx="285.8" cy="69" r="4.5"/><circle cx="331.2" cy="123.9" r="4.5"/><text x="279" y="66" text-anchor="end">Hà Nội</text><text x="325" y="139" text-anchor="end">Sydney</text>';
  const sat=(m:string,label:string)=>`<figure class="sat-map"><div class="sat-img"><img src="${base}assets/textures/nasa-tair-2024-${m}.webp" alt="Bản đồ nhiệt độ không khí sát mặt đất ${label}" loading="lazy"><svg viewBox="0 0 360 180" aria-hidden="true">${pins}</svg></div><figcaption><b>${label}</b></figcaption></figure>`;
  const quiz=`<div class="qc"><h3>Đúng hay sai? “${esc(q.prompt)}”</h3>${options('truth9',q.options,chosen,chosen===null?undefined:q.correct,chosen!==null)}${chosen===null?'':feedback(chosen===q.correct,chosen===q.correct?'Đúng rồi: câu này <b>Sai</b>.':'Chưa đúng: câu này <b>Sai</b>. Xem hai bản đồ.')}</div>`;
  if(chosen!==null)return `<div class="fr-stage fr-sat"><p class="dist-chip">Tháng 1: <b>${vi(d1*149.6,0)}</b> triệu km · Tháng 7: <b>${vi(d7*149.6,0)}</b> triệu km · chênh <b>${vi((d7-d1)/d1*100,1)}%</b></p><div class="sat-maps">${sat('01','Tháng 1 · gần nhất')}${sat('07','Tháng 7 · xa nhất')}</div><p class="sat-credit">Ảnh vệ tinh NASA: đỏ nóng, xanh lạnh.</p></div>${quiz}${key(true,'Tháng 1 gần Mặt Trời nhất mà Hà Nội vẫn lạnh. Khoảng cách không làm hai nửa cầu trái mùa.')}${actions(go('Tiếp: ngày dài, đêm ngắn',10))}`;
  return `<div class="fr-stage fr-pair">${side('ĐẦU THÁNG 1',d1,'Gần Mặt Trời nhất',true)}<div class="fr-same"><b>${vi((d7-d1)/d1*100,1)}%</b><span>CHÊNH<br>LỆCH</span></div>${side('ĐẦU THÁNG 7',d7,'Xa Mặt Trời nhất',false)}</div>${text('Tháng 1, Trái Đất ở <b>gần</b> Mặt Trời nhất, nhưng Hà Nội đang mùa lạnh. Cùng lúc đó, Sydney lại đang mùa nóng.')}${quiz}${actions(go('Tiếp: ngày dài, đêm ngắn',10))}`;}

 case 10:{const seen=sheet3Seen(s),full=seen===PLACES.length*SHEET3_DAYS.length;
  const cell=(lat:number,d:number,night:boolean)=>s.seen.includes(`dl:${lat}:${d}`)?hours(night?24-dayLength(d,lat):dayLength(d,lat)).replace(' giờ ','h').replace(' phút',''):'…';
  const on=(lat:number)=>s.scene.lat===lat;
  const table=`<table class="qc-table sheet3"><caption>Phiếu số 3 · đã ghi ${seen}/10 ô</caption><tr><th rowspan="2">Địa điểm</th><th colspan="2">22/6</th><th colspan="2">22/12</th></tr><tr><th>Ngày</th><th>Đêm</th><th>Ngày</th><th>Đêm</th></tr>${PLACES.map(([lat,n])=>`<tr class="${on(lat)?'on':''}"><th>${n}</th>${SHEET3_DAYS.map(d=>`<td>${cell(lat,d,false)}</td><td>${cell(lat,d,true)}</td>`).join('')}</tr>`).join('')}</table>`;
  const sheet=s.answers['poles']===0?`<details class="qc-fold"><summary>Xem lại Phiếu số 3 (đủ 10/10 ô)</summary>${table}</details>`:table;
  const r=full?stepper(c,'poles',['poles'],[],'Xong'):{body:'',main:primary(`Nộp Phiếu 3 (còn ${10-seen} ô)`,'noop',true),done:false};
  const main=r.main?r.main.replace('>Kiểm tra<','>Nộp Phiếu 3<'):go('Tiếp: bầu trời 360°',11);
  return `<div class="fr-stage fr-clock"><div id="globe-fig">${globeOf(s)}</div><div id="clock-metrics">${metricsOf(s)}</div></div>${s.answers['poles']===0?'':text('Chọn ngày và địa điểm. Đọc số giờ ban ngày, ban đêm rồi ghi vào <b>Phiếu số 3</b>.')}<div class="fr-controls">${dayButtonsOf(s,SHEET3_DAYS)}${chips('lat',PLACES.map(([l,n])=>[l,n.replace('TP. Hồ Chí Minh','TP.HCM').replace('Gần vòng cực Bắc','Vòng cực')] as [number,string]),v=>on(Number(v)))}</div>${sheet}${r.body}${key(s.answers['poles']===0,'Mùa nóng: ngày dài hơn đêm. Xích đạo: ngày ≈ đêm. Càng về cực, chênh lệch càng lớn.')}${actions(main)}`;}

 case 11:{const seen=(lat:number)=>s.seen.includes(`sky-${lat}`);
  return `<div class="fr-stage fr-sim"><div class="inline-simulation sky" id="sky-mount" data-interactive><div class="scene-loading">Đang mở bầu trời…</div></div>${note('Cảnh dựng ảo · giờ Mặt Trời địa phương · giá trị gần đúng')}</div><div class="fr-text"><p>Đứng ở Hà Nội rồi ở Sydney, cùng một ngày. Quan sát:</p><ol class="fr-asks"><li>Mặt Trời mọc ở hướng nào?</li><li>Buổi trưa, Mặt Trời cao hay thấp?</li><li>Mặt Trời ở trên trời bao lâu?</li></ol></div><div class="fr-controls">${chips('city',[[21,`${seen(21)?'✓ ':''}Hà Nội`],[-34,`${seen(-34)?'✓ ':''}Sydney`]],v=>s.scene.lat===Number(v))}${dayButtonsOf(s,SHEET3_DAYS)}${btn(`${icon('play')}<span>Chạy một ngày</span>`,'play-sky','secondary','aria-pressed="false"')}</div>${actions(go('Tiếp: ô chữ',12))}`;}

 case 12:{const parts=['TR','ỤC','NG','HI','Ê','NG'],ids=parts.map((_,i)=>`code-${i}`),r=stepper(c,'code',ids,parts.map((_,i)=>`Hàng ${i+1}`),'Hàng tiếp');
  return `<div class="fr-stage fr-code" role="img" aria-label="Từ khoá: ${parts.map((t,i)=>s.answers[ids[i]]===0?t:'?').join(' ')}">${parts.map((t,i)=>`<span class="${s.answers[ids[i]]===0?'unlocked':''}">${s.answers[ids[i]]===0?t:'?'}<small>Hàng ${i+1}</small></span>`).join('')}</div>${text('Từ khoá chính là <b>“chìa khoá”</b> của bốn mùa!')}${r.done&&!c.ui.steps.code?'':r.body.replace(/<ol class="qc-cells"[\s\S]*?<\/ol>/,'')}${key(r.done,'TRỤC NGHIÊNG là nguyên nhân gốc của mùa và của ngày đêm dài ngắn.')}${actions(r.main||go('Tiếp: vali đi Sydney',13))}`;}

 case 13:return `<div class="fr-stage fr-pack"><div class="fr-pack-grid" role="group" aria-label="Đồ có thể mang">${packItems.map(([id,pic,name])=>`<button type="button" data-action="pack:${id}" aria-pressed="${s.suitcase.includes(id)}" class="${s.suitcase.includes(id)?'selected':''}">${img(pic,'',name)}<span>${name}</span></button>`).join('')}</div></div>${text('Nghỉ hè tháng 7, Nam bay sang Sydney. Bố dặn mang áo ấm.','Em chọn đồ cho Nam, rồi viết một câu giải thích vì sao.')}<label class="qc-write"><span>Vì sao cần những đồ này?</span><textarea data-save="reason" maxlength="1000" rows="2">${esc(s.reason)}</textarea></label>${ui.packMsg?feedback(!!pageDone(s,13),ui.packMsg):''}${key(pageDone(s,13)&&!!ui.packMsg,'Sydney ở nửa cầu Nam. Tháng 7 nửa cầu Nam chếch xa Mặt Trời nên là mùa lạnh: cần áo ấm.')}${actions(pageDone(s,13)&&ui.packMsg?go('Tiếp: bài kiểm tra',14):primary('Kiểm tra vali','check-pack'))}`;

 // C · SAU GIỜ
 case 14:{const Q=c.data.quiz as Question[],z=ui.quiz,last=s.attempts.at(-1);
  if(z){const i=z.order[z.pos],q=Q[i];return `<div class="qc-progress">Câu ${z.pos+1} / ${z.order.length}${z.order.length<10?' · làm lại câu sai':''}</div><div class="qc"><h3>${i+1}. ${esc(q.prompt)}</h3>${options('quiz-pick',q.options,z.chosen,z.shown?q.correct:undefined,z.shown)}${z.shown?feedback(z.chosen===q.correct,(z.chosen===q.correct?'Đúng rồi! ':'Đáp án: '+esc(q.options[q.correct])+'. ')+esc(q.explanation)):''}</div>${actions(z.shown?primary(z.pos===z.order.length-1?'Xem kết quả':'Câu tiếp','quiz-next'):primary('Trả lời','quiz-answer',z.chosen===null))}`;}
  if(!last)return `<div class="fr-stage fr-hero">${img('E05','fr-hero-img','Huy hiệu nhà giải mã')}<div class="fr-mission"><p class="fr-score"><b>10</b> câu hỏi</p></div></div>${text('10 câu, mỗi lần một câu. Trả lời xong em sẽ thấy lời giải ngay.','Đạt khi đúng từ 7 câu và đúng câu 7.')}${actions(primary('Bắt đầu','quiz-start'))}`;
  const wrong=Q.map((q,i)=>i).filter(i=>last.answers[i]!==Q[i].correct);
  return `<div class="fr-stage fr-hero">${img(last.passed?'A06':'A05','fr-hero-img',last.passed?'Sao Mai chúc mừng':'Sao Mai động viên')}<div class="fr-mission"><p class="fr-score"><b>${last.score}</b>/10</p><p>${last.passed?'<strong>Đạt!</strong> Em đã giải thích đúng nguyên nhân mùa.':'<strong>Chưa đạt.</strong> Cần từ 7 câu và đúng câu 7.'}</p></div></div>${wrong.length?`<ol class="qc-review" aria-label="Lời giải câu sai">${wrong.map(i=>`<li><b>Câu ${i+1}.</b> ${esc(Q[i].prompt)} <span>Đáp án: <strong>${esc(Q[i].options[Q[i].correct])}</strong></span></li>`).join('')}</ol>`:''}${actions(wrong.length?primary('Làm lại câu sai','quiz-retry'):go('Tiếp: nhìn lại dự đoán',15))}`;}

 case 15:{const P=c.data.predictions as {prompt:string;options:string[]}[],right=[1,1,2];
  const rows=s.predictions?`<ol class="qc-compare">${P.map((q,i)=>{const same=s.predictions![i]===right[i];return `<li class="${same?'same':''}"><small>${esc(q.prompt)}</small><span>Em đoán: <b>${esc(q.options[s.predictions![i]])}</b></span><span>${same?icon('check'):''}Kết quả: <b>${esc(q.options[right[i]])}</b></span></li>`;}).join('')}</ol>`:`<p class="qc-feedback bad">Em chưa lưu dự đoán ở trang 4. Em vẫn có thể viết điều em đã hiểu.</p>`;
  return `${rows}${text('Đây là 3 dự đoán của em trước giờ học. Bây giờ em nghĩ gì? Viết một điều em đã thay đổi suy nghĩ.')}<label class="qc-write"><span>Trước đây em nghĩ… Bây giờ em hiểu…</span><textarea data-save="reflection" maxlength="1200" rows="3">${esc(s.reflection)}</textarea></label>${ui.saved==='reflection'?feedback(s.reflection.trim().length>=10,s.reflection.trim().length>=10?'Đã lưu vào hồ sơ của em.':'Em viết thêm một chút nhé (ít nhất một câu).'):''}${actions(primary('Lưu','save-reflection'))}`;}

 case 16:{const earned=c.badges,last=s.attempts.at(-1),sheets=[7,8,10].filter(p=>pageDone(s,p)).length;
  return `<div class="fr-stage fr-badges">${stations.map((st,i)=>`<div class="fr-badge ${earned.includes(i)?'earned':''}">${img(`E0${i+1}`,'',st.badge)}<strong>${st.badge}</strong><small>${earned.includes(i)?icon('check')+'Đã nhận':'Chưa xong'}</small></div>`).join('')}</div><p class="qc-stats">Bài kiểm tra: <b>${last?`${last.score}/10`:'chưa làm'}</b> · Phiếu đã xong: <b>${sheets}/3</b></p>${text('Gửi kết quả cho thầy cô nhé.','Thử thách thêm: ghi giờ Mặt Trời mọc, lặn ở nơi em sống trong 3 ngày, rồi so với số liệu trong sách.')}<div class="fr-controls">${btn('Gửi kết quả','send')}${btn('Bảng quan sát 3 ngày','observe')}</div>${actions(go('Sang Sổ tay ôn tập',17))}`;}

 // D · MỌI LÚC
 case 17:{const d=ui.deck,F=c.data.flashcards as [string,string][],tabs=chips('deck-tab',[['cards','Thẻ ghi nhớ'],['practice','Luyện 5 câu']],v=>d.tab===v).replace('role="group"','role="group" aria-label="Chọn mục ôn"');
  let inner='';
  if(d.tab==='cards'){const [front,back]=F[d.i%F.length];inner=`<button type="button" class="flashcard${d.flip?' flipped':''}" data-action="flip" aria-label="Lật thẻ"><small>Thẻ ${d.i%F.length+1}/${F.length} · ${d.flip?'mặt sau':'chạm để lật'}</small><strong>${esc(d.flip?back:front)}</strong></button><div class="fr-controls">${btn('Thẻ tiếp','card-next')}</div>`;}
  else if(d.tab==='practice'){const q=findQ(c.data,d.pool[d.pos]);inner=q?`<div class="qc-progress">Câu ${d.pos+1} / ${d.pool.length} · không tính điểm</div><div class="qc"><h3>${esc(q.prompt)}</h3>${options('drill-pick',q.options,d.chosen,d.chosen===null?undefined:q.correct,d.chosen!==null)}${d.chosen===null?'':feedback(d.chosen===q.correct,esc(q.explanation))}</div><div class="fr-controls">${btn(d.pos===d.pool.length-1?'Lượt mới':'Câu tiếp','drill-next','secondary',d.chosen===null?'disabled':'')}</div>`:'';}
  return `${text('Lật thẻ ghi nhớ, hoặc luyện 5 câu ngẫu nhiên.')}${tabs}<div class="deck">${inner}</div>`;}

 case 18:return `<div class="fr-stage fr-hero">${img('A06','fr-hero-img','Sao Mai chúc mừng')}<div class="fr-mission">${text('Tối nay, em hãy nhìn bầu trời: Mặt Trời lặn lúc mấy giờ?')}<p class="fr-meta">${esc(c.config.book.author)} · ${esc(c.config.book.school)}<br>${esc(c.config.book.course)} · phiên bản ${esc(c.config.book.version)}</p></div></div><div class="fr-controls">${btn('Tài liệu cho thầy cô','teacher-resources')}${btn('Học lại từ đầu','restart')}</div>`;
 default:return '';
 }
}
