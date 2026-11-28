import {turnBook,isTurning} from './book/flip';
import {readPreferences,writePreferences} from './media/preferences';
import {unlockSound,setSound,playSound,speak,stopSpeaking,playClip} from './media/sound';
import {embedURL,safeResourceURL,youtubeId,type Resource} from './media/resources';
import './styles/upgrade.css';
import {gradeQuiz} from './activities/grade';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import '@fontsource/lexend/400.css';
import '@fontsource/lexend/600.css';
import './styles/book.css';
import './styles/viewport.css';
import './styles/tokens.css';
import './styles/frames.css';
import './styles/v14.css';
import {icon} from './pages/frames';
import {base,esc,img,btn,go} from './pages/ui';
import {fourDaysSvg} from './pages/infographic';
import {content as pageContent,freshUI,firstOpen,orbitHint,seasonHint,chartX,globeOf,metricsOf,options,packItems,type UI,type Question} from './pages/content';
import './styles/v15.css';
import './styles/v16.css';
import './styles/v17.css';
import './styles/design-tokens.css';
import './styles/theme-dai-quan-sat.css';
import {pages,spreads,stations,goals,phases,PAGE_COUNT} from './content/book';
import {fresh,load,save,completed,pageDone,warm,CODE,PLACES,SHEET3_DAYS,SEASONS,SEASON_NAMES,SEASON_N,SEASON_S,readsDayLength,unsuitable,packRubric,type ProgressV1} from './state/progress';
import {dates,dateLabel} from './science/earth';

type Data={predictions:{prompt:string;options:string[]}[];[key:string]:any};
type SceneHandle={update:(s:ProgressV1['scene'])=>void;dispose:()=>void;reset:()=>void;gyro:()=>Promise<void>;closeUp:(on:boolean)=>void};
const root=document.querySelector<HTMLDivElement>('#app')!;
const loaded=(()=>{try{return load(localStorage);}catch{return {state:fresh(),warning:'Trình duyệt không cho phép lưu. Tiến độ chỉ giữ trong phiên này.'};}})();
let state=loaded.state,warning=loaded.warning,data:Data,config:any;
let resources:Resource[]=[];
// Gợi ý 2 tầng theo trang (public/data/hints.json): ask = câu hỏi gợi mở, look = chỉ chỗ cần nhìn, at = vùng tô sáng.
let hints:Record<string,{ask:string;look:string;at:string}>={};const preferences=readPreferences();setSound(preferences.sound);
let scene:SceneHandle|undefined,sceneToken=0,coverGlobe:{dispose():void}|undefined;
let dialog:HTMLDialogElement|undefined,lastFocus:HTMLElement|null=null;
let playing:ReturnType<typeof setInterval>|undefined,playingSky=false,playedDays=0;
let ui:UI=freshUI();
document.documentElement.classList.add('v13','v14');
document.documentElement.classList.toggle('text-large',preferences.large);
const wide=matchMedia('(min-width:1100px) and (min-aspect-ratio:5/4)');
// Phiếu từng ô (content.ts stepper): tên → các câu hỏi.
const STEPS:Record<string,string[]>={sheet1:['orbit-1','orbit-2','journal-1','orbit-3'],code:CODE,why:['why'],poles:['poles']};
// Hoạt động của KHBD 2 tiết → trang sách (docs/anh-xa-khbd-ebook.md). Chế độ trình chiếu đầy đủ làm ở Mốc 4.
const LESSON:[string,[string,number][]][]=[
 ['Trước giờ',[['Giao nhiệm vụ trước giờ',2]]],
 ['Tiết 1',[['HĐ1. Mở đầu',4],['HĐ2.1. Chuyển động quanh Mặt Trời',6],['HĐ2.2. Mùa trên Trái Đất',8],['Củng cố Tiết 1',9]]],
 ['Tiết 2',[['HĐ1. Khởi động',10],['HĐ2.3. Ngày – đêm dài ngắn',10],['HĐ3. Luyện tập',12],['HĐ4. Vận dụng',13],['Giao việc sau giờ',14]]]];

function persist(){try{if(!save(localStorage,state)&&!warning){warning='Không lưu được tiến độ. Hãy giữ trang mở trong phiên học này.';const w=document.querySelector('#storage-warning');if(w)w.textContent=warning;}}catch{warning='Không lưu được tiến độ trên thiết bị này.';}}
function announce(text:string){const live=document.querySelector('#live');if(live)live.textContent=text;}
function notify(text:string){announce(text);document.querySelector('.app-toast')?.remove();const toast=document.createElement('div');toast.className='app-toast';toast.setAttribute('role','status');toast.textContent=text;document.body.append(toast);setTimeout(()=>toast.remove(),5000);}
const badges=()=>completed(state) as number[];
function view(){return wide.matches?spreads.find(s=>s.includes(state.page))!:[state.page];}
function stopPlay(){if(playing){clearInterval(playing);playing=undefined;}markPlay();}
function stopScene(){sceneToken++;scene?.dispose();scene=undefined;coverGlobe?.dispose();coverGlobe=undefined;stopPlay();}
function reducedMotion(){return state.reducedMotion||preferences.motion==='off'||(preferences.motion==='system'&&matchMedia('(prefers-reduced-motion: reduce)').matches);}
let resumePage=state.page;
function resetUI(){ui=freshUI();if(state.seen.includes('news'))ui.revealed=['hn','sy'];}
resetUI();
function change(p:number){if(p<1||p>PAGE_COUNT||isTurning())return;const previous=state.page;const sameSpread=wide.matches&&spreads.find(v=>v.includes(previous))?.includes(p);window.scrollTo({top:0,behavior:'instant'});const update=()=>{closeDialog();stopScene();stopSpeaking();if(!sameSpread){resetUI();hint=undefined;}state.page=p;persist();render();document.querySelector<HTMLElement>(`[data-page="${p}"] h1,[data-page="${p}"] h2`)?.focus({preventScroll:true});announce(`Trang ${p}: ${pages[p-1].title}`);};if(sameSpread||previous===p)update();else if(turnBook(update,p>previous?1:-1,reducedMotion()))playSound('page');}
function step(delta:number){if(wide.matches){const i=spreads.findIndex(s=>s.includes(state.page));const v=spreads[i+delta];if(v)change(v[0]);}else change(state.page+delta);}
function content(p:number){return pageContent(p,{state,data,config,ui,badges:badges(),resumePage});}
// Đưa ngày/vĩ độ về giá trị trang đang cần, và ghi các ô Phiếu 3 / cảnh trời em đã xem.
function prepare(){const v=view(),sc=state.scene;
 if(v.includes(8)&&!dates.some(d=>d.day===sc.day))sc.day=173;
 if(v.includes(11)&&!v.includes(10)&&!SHEET3_DAYS.includes(sc.day))sc.day=173;
 if(v.includes(10)&&!PLACES.some(([l])=>l===sc.lat))sc.lat=21;
 if(v.includes(11)&&!v.includes(10)&&sc.lat!==21&&sc.lat!==-34)sc.lat=21;
 const mark=(id:string)=>{if(!state.seen.includes(id))state.seen.push(id);};
 if(v.includes(11)&&(sc.lat===21||sc.lat===-34))mark(`sky-${sc.lat}`);
 persist();}
function partLabel(p:number){const ph=pages[p-1].phase;return ph?`${ph} · ${phases[ph].name}`:p===1?'Bìa':'Kết thúc';}
// Các trang đã chuyển sang giao diện "Đài quan sát"; thêm dần số trang vào đây.
const OBS_PAGES=new Set([2,3]);
function article(p:number){const item=pages[p-1],obs=OBS_PAGES.has(p);const head=p===1?'':`<header class="fr-head"><span class="eyebrow">${esc(obs?partLabel(p):partLabel(p).toUpperCase())}</span><h2 tabindex="-1">${item.title}</h2></header>${item.say?`<div class="fr-speech">${img('A02','','')}<span class="say" aria-live="polite">${item.say}</span>${hints[p]?btn('💡 <span>Gợi ý</span>',`hint:${p}`,'hint-btn','aria-expanded="false"'):''}</div>`:''}`;return `<article class="page ${p===1?'cover':''} ${p===PAGE_COUNT?'back-cover':''} ${p>1?'framed v14-page':''}${obs?' obs':''}" data-page="${p}" style="--page-side:${p%2===0?'0%':'100%'}">${head}<div class="page-body">${content(p)}</div>${p===1?'':`<footer class="page-footer"><span>GIẢI MÃ BỐN MÙA</span><b>${String(p).padStart(2,'0')}</b></footer>`}</article>`;}
function render(){stopScene();prepare();const visible=view(),page=pages[state.page-1];document.documentElement.classList.toggle('reduced-motion',reducedMotion());document.documentElement.classList.toggle('force-book-motion',preferences.motion==='on');
 root.innerHTML=`<header class="app-header"><span class="brand"><span class="brand-mark">✧</span><span>GIẢI MÃ <b>BỐN MÙA</b><small>ĐỊA LÍ 6 · BÀI 8</small></span></span>${stationBar()}<nav aria-label="Công cụ">${btn(icon('list')+'<span>Mục lục</span>','toc','header-button')}${btn(icon('more'),'menu','header-button menu-button','aria-label="Thêm: đọc to, âm thanh, cỡ chữ, thầy cô" aria-haspopup="dialog"')}</nav></header><main><div id="storage-warning" role="status">${esc(warning)}</div><div class="book-stage"><div class="book ${visible.length===2?'spread':'single'} ${state.page===1?'front-cover':''}" style="--page-side:${state.page%2===0?'0%':'100%'};--scene-bg:url('${new URL(`${base}assets/${page.image}.webp`,location.href).href}')">${visible.map(article).join('')}</div></div><nav class="book-navigation v14-nav" aria-label="Lật trang">${btn('←','previous','nav-arrow',`aria-label="Trang trước" ${visible[0]===1?'disabled':''}`)}<div class="nav-label"><span>${esc(partLabel(visible.at(-1)!))}</span><strong>Trang ${visible.join('–')} / ${PAGE_COUNT}</strong></div>${btn('→','next','nav-arrow',`aria-label="Trang sau" ${visible.at(-1)===PAGE_COUNT?'disabled':''}`)}</nav></main>`;
 history.replaceState(null,'',`#trang-${state.page}`);resumePage=Math.max(resumePage,state.page);
 const next=spreads[spreads.findIndex(s=>s.includes(state.page))+1];if(next){const preload=new Image();preload.src=`${base}assets/${pages[next[0]-1].image}.webp`;}
 if(preferences.voice&&preferences.sound)queueMicrotask(()=>readPage(state.page,true));
 const orbit=document.querySelector<HTMLElement>('#orbit-mount'),sky=document.querySelector<HTMLElement>('#sky-mount');
 if(orbit)void mountScene(orbit,'orbit');else if(sky)void mountScene(sky,'sky');
 const globe=document.querySelector<HTMLElement>('#cover-globe');if(globe)void mountCover(globe);
 paintHint();dockPaint();
}
// Vẽ lại phần thân các trang đang mở mà không dựng lại cảnh 3D đang chạy.
function repaint(){prepare();const active=document.activeElement as HTMLElement|null,action=active?.dataset?.action,inPage=active?.closest<HTMLElement>('[data-page]')?.dataset.page;
 for(const p of view()){const body=document.querySelector(`[data-page="${p}"] .page-body`);if(!body)continue;const live=body.querySelector<HTMLElement>('.inline-simulation');const t=document.createElement('div');t.innerHTML=content(p);if(live){const slot=t.querySelector(`#${live.id}`);slot?.replaceWith(live);}body.replaceChildren(...t.childNodes);}
 markPlay();paintHint();const bar=document.querySelector('.station-bar');if(bar)bar.outerHTML=stationBar();if(teach.on&&state.page===13)dockPaint();
 if(inPage&&(!active||!active.isConnected)){const pageEl=document.querySelector(`[data-page="${inPage}"]`);const input=active?.dataset?.input;const target=(input&&pageEl?.querySelector<HTMLElement>(`[data-input="${input}"]`))||(action&&pageEl?.querySelector<HTMLElement>(`[data-action="${action}"]:not([disabled])`))||pageEl?.querySelector<HTMLElement>('.qc-feedback')||pageEl?.querySelector<HTMLElement>('.fr-actions .primary:not([disabled])');if(target){if(!target.matches('button,a,input,textarea'))target.tabIndex=-1;target.focus({preventScroll:true});}}
}
function openDialog(title:string,body:string,cls=''){closeDialog();lastFocus=document.activeElement as HTMLElement;dialog=document.createElement('dialog');dialog.className=`activity-dialog ${cls}`;dialog.innerHTML=`<header><span class="eyebrow">GIẢI MÃ BỐN MÙA</span><h2>${title}</h2>${btn('Đóng ×','close','close-button')}</header><div class="dialog-body">${body}</div>`;document.body.append(dialog);stopSpeaking();dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});dialog.showModal();dialog.querySelector<HTMLElement>('.dialog-body button,.dialog-body input,.dialog-body select,.dialog-body textarea')?.focus();}
function closeDialog(){tfStop();tf=undefined;if(dialog){dialog.close();dialog.remove();dialog=undefined;persist();if(lastFocus?.isConnected)lastFocus.focus();}}
function toc(){const done=badges(),row=(p:number)=>{const d=pageDone(state,p);return `<li>${btn(`<b>${p}</b><span>${pages[p-1].title}</span>${d?icon('check'):''}`,`go:${p}`,`toc-link${p===state.page?' current':''}${d?' done':''}`,p===state.page?'aria-current="page"':'')}</li>`;};
 openDialog('Mục lục',`<details class="toc-goals"><summary>Học xong, em sẽ…</summary><ol>${goals.map(g=>`<li>${g}</li>`).join('')}</ol></details><ol class="toc-list">${row(1)}</ol>${(Object.entries(phases) as [keyof typeof phases,{name:string;hint:string}][]).map(([k,v])=>`<section class="toc-part"><h3><b>${k}</b>${v.name}<small>${v.hint}</small></h3><ol class="toc-list">${pages.filter(p=>p.phase===k).map(p=>row(p.number)).join('')}</ol></section>`).join('')}<ol class="toc-list">${row(PAGE_COUNT)}</ol><div class="toc-badges" aria-label="Huy hiệu">${stations.map((s,i)=>`<span class="${done.includes(i)?'earned':''}">${img(`E0${i+1}`,'',s.badge)}<small>${s.badge}</small></span>`).join('')}</div>`,'toc-dialog');}
function menu(){const skyOpen=view().includes(11)&&!!scene;
 openDialog('Thêm',`<div class="menu-list">${btn(icon('listen')+'<span>Đọc to trang này</span>','read-page')}${btn(icon(preferences.sound?'sound':'mute')+`<span>Âm thanh: ${preferences.sound?'Bật':'Tắt'}</span>`,'toggle-sound','sound-toggle',`aria-pressed="${preferences.sound}"`)}${btn(icon('expand')+`<span>${document.fullscreenElement?'Thoát toàn màn hình':'Toàn màn hình'}</span>`,'fullscreen')}${btn('<b class="aa">Aa</b>'+`<span>Cỡ chữ: ${preferences.large?'Lớn':'Thường'}</span>`,'text-size','',`aria-pressed="${preferences.large}"`)}${btn(icon('teacher')+'<span>Thầy cô dạy trên lớp</span>','teacher')}${skyOpen?btn(icon('globe')+'<span>Xoay điện thoại để nhìn trời</span>','gyro'):''}</div><details class="menu-more"><summary>Tuỳ chọn khác</summary><label>Hiệu ứng lật sách<select data-motion="mode"><option value="system" ${preferences.motion==='system'?'selected':''}>Theo thiết bị</option><option value="on" ${preferences.motion==='on'?'selected':''}>Có hiệu ứng</option><option value="off" ${preferences.motion==='off'?'selected':''}>Giảm chuyển động</option></select></label><label>Chất lượng 3D<select data-setting="quality"><option value="high" ${state.quality==='high'?'selected':''}>Cao</option><option value="low" ${state.quality==='low'?'selected':''}>Thấp (máy yếu)</option></select></label><label class="check"><input type="checkbox" data-pref="voice" ${preferences.voice?'checked':''}> Tự đọc to khi mở trang</label>${btn('Nguồn và phiên bản','sources','text-button')}${btn('Học lại từ đầu','restart','text-button danger-text')}</details>`,'menu-dialog');}
function teacher(){openDialog('Thầy cô dạy trên lớp',`<p>Chọn hoạt động để mở đúng trang khi chiếu. Bảng thầy cô có chế độ trình chiếu (chữ lớn), ẩn/hiện đáp án, đồng hồ đếm ngược, bảng điểm đội và bình chọn giơ tay.</p><div class="fr-controls">${btn(teach.on?'Đóng bảng thầy cô':'Mở bảng thầy cô','t-open','primary')}${btn('Đúng hay Sai · 30 giây','tf-start','secondary')}</div>${LESSON.map(([h,list])=>`<section class="toc-part"><h3>${h}</h3><ol class="toc-list">${list.map(([n,p])=>`<li>${btn(`<b>${p}</b><span>${n}</span>`,`go:${p}`,'toc-link')}</li>`).join('')}</ol></section>`).join('')}`,'toc-dialog');}
// Bìa: Trái Đất 3D tải sau, ảnh tĩnh C01 vẫn hiện nếu máy không có WebGL.
async function mountCover(el:HTMLElement){const token=sceneToken;try{const {mountCoverGlobe}=await import('./scenes/cover-globe');if(token!==sceneToken||!el.isConnected)return;coverGlobe=mountCoverGlobe(el,{reduced:reducedMotion(),low:state.quality==='low'});}catch{/* giữ ảnh tĩnh */}}
async function mountScene(el:HTMLElement,kind:'orbit'|'sky'){const token=++sceneToken;try{const {createScene}=await import('./scenes/world');if(token!==sceneToken||!el.isConnected)return;scene=createScene(el,kind,state.scene,{quality:state.quality,reduced:reducedMotion(),onSeen:()=>{}});if(ui.near)scene.closeUp(true);}catch{if(token!==sceneToken||!el.isConnected)return;el.innerHTML=kind==='sky'?'<div class="fallback-scene"><p>Máy chưa mở được cảnh 3D. Em xem hình ở trang 10: ngày 22/6 Hà Nội có 13 giờ 17 phút ban ngày, Sydney chỉ khoảng 9 giờ 44 phút.</p></div>':`<div class="fallback-scene"><p>Máy chưa mở được cảnh 3D. Em xem hình quỹ đạo ở trang 7.</p></div>`;}}
function updateScene(){scene?.update(state.scene);liveDay();document.querySelectorAll<HTMLElement>('[data-action^="date:"]').forEach(e=>{const on=e.dataset.action===`date:${state.scene.day}`;e.classList.toggle('active',on);e.setAttribute('aria-pressed',String(on));});}
function markPlay(){for(const [action,label] of [['play-orbit','Chạy một năm'],['play-sky','Chạy một ngày']] as const)document.querySelectorAll(`[data-action="${action}"]`).forEach(el=>{const on=!!playing&&playingSky===(action==='play-sky');el.setAttribute('aria-pressed',String(on));const s=el.querySelector('span');if(s)s.textContent=on?'Dừng':label;});}
function play(sky:boolean){if(playing){const same=playingSky===sky;stopPlay();if(same)return;}playingSky=sky;playedDays=0;playing=setInterval(()=>{if(document.hidden)return;if(sky)state.scene.time=(state.scene.time+0.06)%24;else{state.scene.day=state.scene.day%365+1;if(++playedDays>=365&&!state.seen.includes('orbit-year')){state.seen.push('orbit-year');persist();stopPlay();notify('Trái Đất đã đi hết một vòng quanh Mặt Trời: 365 ngày!');repaint();}}updateScene();},sky?60:30);markPlay();}
function cur(name:string){return ui.steps[name]??{i:firstOpen(state,STEPS[name]),chosen:null,result:null};}
function findQ(id:string):Question|undefined{return Object.values(data).flat().find((q:any)=>q?.id===id) as Question|undefined;}
function newPool(){const ids=['orbit','journal','truth','table','quiz'].flatMap(g=>(data[g] as Question[]).map(q=>q.id));for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}ui.deck.pool=ids.slice(0,5);ui.deck.pos=0;ui.deck.chosen=null;}
// Kéo thanh ngày: đổi trực tiếp các phần phụ thuộc ngày, không dựng lại trang (giữ thao tác kéo).
function liveDay(){const d=state.scene.day,label=`${new Date(Date.UTC(2025,0,d)).getUTCDate()}/${new Date(Date.UTC(2025,0,d)).getUTCMonth()+1}`;
 document.querySelectorAll<HTMLInputElement>('[data-input="day"]').forEach(r=>{if(Number(r.value)!==d)r.value=String(d);r.setAttribute('aria-valuetext',`Ngày ${label}`);});
 document.querySelectorAll('#day-label').forEach(e=>e.textContent=label);
 const hint=document.querySelector('#orbit-hint span');if(hint){const t=orbitHint(d);if(hint.textContent!==t)hint.textContent=t;}
 const g=document.querySelector('#globe-fig'),m=document.querySelector('#clock-metrics');if(g)g.innerHTML=globeOf(state);if(m)m.innerHTML=metricsOf(state);
 const mk=document.querySelector('#chart-marker');if(mk){mk.setAttribute('x1',chartX(d));mk.setAttribute('x2',chartX(d));}}
// Tr.6: thanh ngày đi qua đủ 4 quý thì tính như đã xem một năm. Không vẽ lại giữa lúc kéo: sự kiện change (thả tay) sẽ vẽ lại.
function visitQuarter(){if(!view().includes(6))return;const q=Math.min(3,Math.floor((state.scene.day-1)/91.25));if(!ui.quarters.includes(q))ui.quarters.push(q);if(ui.quarters.length===4&&!state.seen.includes('orbit-year')){state.seen.push('orbit-year');persist();notify('Em đã cho Trái Đất đi hết một vòng quanh Mặt Trời: 365 ngày!');}}
// Tr.8: thả thẻ mùa vào ô của Phiếu 2. Sai thì thẻ quay về khay kèm gợi ý.
function dropCard(card:number,slot:number){const i=Math.floor(slot/2),j=slot%2,id=`season-${slot}`;if(state.answers[id]===0||!dates[i])return;const ok=card===(j?SEASON_S:SEASON_N)[i];ui.card=null;ui.bounce=null;
 if(ok){state.answers[id]=0;state.scene.day=dates[i].day;updateScene();const left=SEASONS.filter(x=>state.answers[x]!==0).length;ui.seasonMsg=left?`Đúng rồi! Ngày ${dates[i].label}, nửa cầu ${j?'Nam':'Bắc'}: mùa ${SEASON_NAMES[card].toLowerCase()}. Còn ${left} ô.`:'Đúng rồi! Em đã điền đủ Phiếu số 2.';playSound('correct');}
 else{state.answers[id]=card+1;ui.bounce=card;ui.seasonMsg='Chưa đúng, thẻ đã quay về. '+seasonHint(i,j);playSound('retry');}
 persist();repaint();}
let drag:{card:number;el:HTMLElement;x:number;y:number;id:number;ghost?:HTMLElement}|undefined,suppressClick=false;
document.addEventListener('pointerdown',e=>{const c=(e.target as HTMLElement).closest<HTMLElement>('[data-card]');if(!c||e.button>0)return;e.preventDefault();drag={card:Number(c.dataset.card),el:c,x:e.clientX,y:e.clientY,id:e.pointerId};});
document.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;if(!drag.ghost){if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<8)return;const g=drag.el.cloneNode(true) as HTMLElement;g.className=drag.el.className.replace(' on','')+' drag-ghost';g.removeAttribute('data-action');g.removeAttribute('data-card');g.setAttribute('aria-hidden','true');document.body.append(g);drag.ghost=g;drag.el.classList.add('dragging');}
 drag.ghost.style.transform=`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;const over=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-slot]');document.querySelectorAll('.slot.over').forEach(x=>{if(x!==over)x.classList.remove('over');});over?.classList.add('over');});
function endDrag(e:PointerEvent,drop:boolean){if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=undefined;if(!d.ghost)return;d.ghost.remove();d.el.classList.remove('dragging');document.querySelectorAll('.slot.over').forEach(x=>x.classList.remove('over'));suppressClick=true;setTimeout(()=>{suppressClick=false;},50);const slot=drop?document.elementFromPoint(e.clientX,e.clientY)?.closest<HTMLElement>('[data-slot]'):null;if(slot)dropCard(d.card,Number(slot.dataset.slot));}
document.addEventListener('pointerup',e=>endDrag(e,true));document.addEventListener('pointercancel',e=>endDrag(e,false));
// Đúng hay Sai · 30 giây (5 câu truth-* trong questions.json).
let tf:{order:string[];pos:number;score:number;left:number;chosen:number|null;timer?:ReturnType<typeof setInterval>}|undefined;
function tfStop(){if(tf?.timer){clearInterval(tf.timer);tf.timer=undefined;}}
function tfBody(){if(!tf)return '';const n=tf.order.length,over=tf.left<=0||tf.pos>=n;
 if(over)return `<p class="tf-score" role="status">Em đúng <b>${tf.score}/${n}</b> câu${tf.pos<n?' · hết giờ':''}.</p><ol class="tf-review">${tf.order.map(id=>{const q=findQ(id);return q?`<li><b>“${esc(q.prompt)}”</b> → ${esc(q.options[q.correct])}. ${esc(q.explanation)}</li>`:'';}).join('')}</ol>${btn('Chơi lại','tf-start','primary')}`;
 const q=findQ(tf.order[tf.pos]);if(!q)return '';const picked=tf.chosen!==null;
 return `<div class="tf-top"><span>Câu ${tf.pos+1}/${n}</span><b id="tf-time" class="${tf.left<=10?'low':''}">${tf.left} giây</b><span>Đúng ${tf.score}</span></div><div class="qc"><h3>“${esc(q.prompt)}”</h3>${options('tf-pick',q.options,tf.chosen,picked?q.correct:undefined,picked)}${picked?`<p class="qc-feedback ${tf.chosen===q.correct?'ok':'bad'}" role="status">${tf.chosen===q.correct?'Đúng! ':'Chưa đúng. '}${esc(q.explanation)}</p>`:''}</div>${picked?btn(tf.pos<n-1?'Câu tiếp':'Xem kết quả','tf-next','primary'):''}`;}
function tfPaint(){const b=dialog?.querySelector('.dialog-body');if(!b)return;b.innerHTML=tfBody();b.querySelector<HTMLElement>('.primary,button.qc-opt:not([disabled])')?.focus();}
function tfStart(){const ids=((data.truth??[]) as Question[]).map(q=>q.id);if(!ids.length)return;for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}
 openDialog('Đúng hay Sai · 30 giây','','tf-dialog');tf={order:ids,pos:0,score:0,left:30,chosen:null};tfPaint();
 tf.timer=setInterval(()=>{if(!tf)return;tf.left--;const t=document.querySelector('#tf-time');if(t){t.textContent=`${tf.left} giây`;t.classList.toggle('low',tf.left<=10);}if(tf.left<=0){tfStop();playSound('tap');tfPaint();}},1000);}
// Thanh 5 trạm của KHBD (0–4) trên đầu sách; chấm xanh = đã nhận huy hiệu.
function stationBar(){const done=badges(),cur=stations.findIndex(st=>st.pages.includes(state.page));
 return `<ol class="station-bar" aria-label="Năm trạm, đã có ${done.length} trên 5 huy hiệu">${stations.map((st,i)=>`<li>${btn(`<b>${done.includes(i)?'✓':i}</b>`,`go:${st.page}`,`st-dot${i===cur?' current':''}${done.includes(i)?' done':''}`,`aria-label="Trạm ${i}: ${esc(st.name)}${done.includes(i)?`, đã nhận huy hiệu ${esc(st.badge)}`:''}" title="Trạm ${i}: ${esc(st.name)}" ${i===cur?'aria-current="step"':''}`)}</li>`).join('')}<li class="st-badges" aria-hidden="true">${img('E05','','')}<span>${done.length}/5</span></li></ol>`;}
// Gợi ý 2 tầng (questions.json → hints): bấm lần 1 hỏi gợi mở, lần 2 chỉ chỗ cần nhìn và tô sáng, lần 3 ẩn.
let hint:{p:number;level:number}|undefined;
function paintHint(){document.querySelectorAll('.hint-glow').forEach(e=>e.classList.remove('hint-glow'));
 for(const p of view()){const sp=document.querySelector(`[data-page="${p}"] .fr-speech`),h=hints[p];if(!sp||!h)continue;const lv=hint?.p===p?hint.level:0,say=sp.querySelector('.say'),b=sp.querySelector<HTMLElement>('.hint-btn');if(!say||!b)continue;
  say.innerHTML=lv===1?`<b>Gợi ý 1.</b> ${esc(h.ask)}`:lv===2?`<b>Gợi ý 2.</b> ${esc(h.look)}`:pages[p-1].say;sp.classList.toggle('hinting',lv>0);
  b.innerHTML=lv===0?'💡 <span>Gợi ý</span>':lv===1?'💡 <span>Gợi ý thêm</span>':'<span>Ẩn gợi ý</span>';b.setAttribute('aria-expanded',String(lv>0));
  if(lv===2)document.querySelector(`[data-page="${p}"] .page-body`)?.querySelector(h.at)?.classList.add('hint-glow');}}
// Bảng thầy cô: nổi trên sách, giữ khi lật trang; lưu riêng (không vào hồ sơ học sinh).
type Teacher={on:boolean;min:boolean;present:boolean;hide:boolean;tab:'timer'|'teams'|'vote';len:number;end:number;teams:number[];vq:number;votes:number[][]};
const tFresh=():Teacher=>({on:false,min:false,present:false,hide:false,tab:'timer',len:20,end:0,teams:[0,0,0,0],vq:0,votes:[[0,0,0],[0,0,0],[0,0,0]]});
const counts=(a:unknown,min:number,max:number,len?:number)=>Array.isArray(a)&&a.length>=min&&a.length<=max&&(!len||a.length===len)&&a.every(v=>Number.isInteger(v)&&v>=0&&v<1000);
let teach:Teacher=(()=>{const f=tFresh();try{const t=JSON.parse(localStorage.getItem('gmbm-teacher')??'null');if(t&&typeof t==='object')return {...f,on:t.on===true,min:t.min===true,present:t.present===true,hide:t.hide===true,tab:['timer','teams','vote'].includes(t.tab)?t.tab:f.tab,len:[20,30,60,180].includes(t.len)?t.len:f.len,teams:counts(t.teams,2,6)?t.teams:f.teams,vq:[0,1,2].includes(t.vq)?t.vq:0,votes:Array.isArray(t.votes)&&t.votes.length===3&&t.votes.every((v:unknown)=>counts(v,3,3))?t.votes:f.votes};}catch{}return f;})();
function tSave(){try{localStorage.setItem('gmbm-teacher',JSON.stringify({...teach,end:0}));}catch{}}
const mmss=(ms:number)=>{const t=Math.ceil(ms/1000);return `${Math.floor(t/60)}:${String(t%60).padStart(2,'0')}`;};
let tTick:ReturnType<typeof setInterval>|undefined;
function tTimer(){if(tTick){clearInterval(tTick);tTick=undefined;}if(!teach.end)return;
 tTick=setInterval(()=>{const left=Math.max(0,teach.end-Date.now()),o=document.querySelector('#t-clock');if(o)o.textContent=mmss(left);if(!left){clearInterval(tTick);tTick=undefined;teach.end=0;playSound('badge');dockPaint();const d=document.querySelector('#teacher-dock');d?.classList.add('ring');setTimeout(()=>d?.classList.remove('ring'),2400);}},200);}
function dockBody(){const tab=(v:Teacher['tab'],t:string)=>btn(t,`t-tab:${v}`,`chip${teach.tab===v?' active':''}`,`aria-pressed="${teach.tab===v}"`);
 let body='';
 if(teach.tab==='timer')body=`<output id="t-clock" class="t-clock${teach.end?' run':''}" aria-live="off">${mmss(teach.end?Math.max(0,teach.end-Date.now()):teach.len*1000)}</output><div class="t-row">${([[20,'20 giây'],[30,'30 giây'],[60,'1 phút'],[180,'3 phút']] as [number,string][]).map(([v,t])=>btn(t,`t-len:${v}`,`chip${teach.len===v?' active':''}`,`aria-pressed="${teach.len===v}"`)).join('')}</div>${btn(teach.end?'Dừng':'Bắt đầu','t-go','primary')}`;
 else if(teach.tab==='teams'){const top=Math.max(...teach.teams);body=`<ol class="t-teams">${teach.teams.map((v,i)=>`<li class="${v&&v===top?'lead':''}"><span>Đội ${i+1}</span>${btn('−',`t-score:${i}.-1`,'t-pm',`aria-label="Đội ${i+1} trừ 1 điểm"`)}<b>${v}</b>${btn('+',`t-score:${i}.1`,'t-pm',`aria-label="Đội ${i+1} cộng 1 điểm"`)}</li>`).join('')}</ol><div class="t-row">${btn('Thêm đội','t-teams:1','chip',teach.teams.length>=6?'disabled':'')}${btn('Bớt đội','t-teams:-1','chip',teach.teams.length<=2?'disabled':'')}${btn('Về 0','t-zero','chip')}</div>`;}
 else{const P=(data.predictions??[]) as {prompt:string;options:string[]}[],q=P[teach.vq],v=teach.votes[teach.vq],n=v.reduce((a,b)=>a+b,0),right=[1,1,2][teach.vq];
  body=`<div class="t-row">${P.map((_,i)=>btn(`Câu ${i+1}`,`t-vq:${i}`,`chip${teach.vq===i?' active':''}`,`aria-pressed="${teach.vq===i}"`)).join('')}</div>${q?`<p class="t-q">${esc(q.prompt)}</p><ol class="t-votes">${q.options.map((o,i)=>{const pc=n?Math.round(v[i]/n*100):0;return `<li class="${!teach.hide&&i===right?'right':''}"><span class="t-opt">${String.fromCharCode(65+i)}. ${esc(o)}</span><span class="t-bar"><i style="width:${pc}%"></i><em>${v[i]} · ${pc}%</em></span>${btn('−',`t-vote:${i}.-1`,'t-pm',`aria-label="Bớt 1 phiếu ${String.fromCharCode(65+i)}"`)}${btn('+',`t-vote:${i}.1`,'t-pm',`aria-label="Thêm 1 phiếu ${String.fromCharCode(65+i)}"`)}</li>`;}).join('')}</ol><p class="t-note">Đếm tay giơ lên rồi bấm +. Tổng: <b>${n}</b> phiếu.${teach.hide?' Đáp án đang ẩn.':''}</p>${btn('Xoá phiếu câu này','t-vote-zero','text-button')}`:''}`;}
 const vali=state.page===13||view().includes(13)?(pageDone(state,13)?`<p class="t-rubric">Vali: câu giải thích đạt <b>${packRubric(state.reason).filter(Boolean).length}/3</b> tiêu chí. ${btn(state.rubric[0]===1?'Bỏ xác nhận':'Thầy cô xác nhận','t-rubric','chip')}</p>`:'<p class="t-rubric">Vali: học sinh chưa kiểm tra xong.</p>'):'';
 return `<div class="t-row t-tabs">${tab('timer','Đồng hồ')}${tab('teams','Điểm đội')}${tab('vote','Bình chọn')}</div>${body}${vali}`;}
function dockPaint(){document.documentElement.classList.toggle('present',teach.on&&teach.present);document.documentElement.classList.toggle('hide-answers',teach.on&&teach.hide);document.documentElement.classList.toggle('text-large',preferences.large||(teach.on&&teach.present));
 let d=document.querySelector<HTMLElement>('#teacher-dock');if(!teach.on){d?.remove();return;}
 if(!d){d=document.createElement('aside');d.id='teacher-dock';d.setAttribute('aria-label','Bảng thầy cô');document.body.append(d);}
 d.className=`t-dock${teach.min?' min':''}`;
 d.innerHTML=`<header><b>Thầy cô</b>${btn(teach.present?'Thoát trình chiếu':'Trình chiếu','t-present',`chip${teach.present?' active':''}`,`aria-pressed="${teach.present}"`)}${btn(teach.hide?'Hiện đáp án':'Ẩn đáp án','t-hide',`chip${teach.hide?' active':''}`,`aria-pressed="${teach.hide}"`)}${btn(teach.min?'▴':'▾','t-min','t-icon',`aria-label="${teach.min?'Mở rộng':'Thu nhỏ'} bảng" aria-expanded="${!teach.min}"`)}${btn('✕','t-off','t-icon','aria-label="Đóng bảng thầy cô"')}</header>${teach.min?(teach.end?`<output id="t-clock" class="t-clock mini run">${mmss(Math.max(0,teach.end-Date.now()))}</output>`:''):`<div class="t-body">${dockBody()}</div>`}`;}
// Kết quả gửi thầy cô: mỗi mục một trường riêng của Form / Apps Script.
function who(){return {name:(document.querySelector<HTMLInputElement>('#student-name')?.value??'').slice(0,100),className:(document.querySelector<HTMLInputElement>('#student-class')?.value??'').slice(0,50)};}
function summary(){const last=state.attempts.at(-1),Q=(data.quiz??[]) as Question[],before=state.predictions?.[0],ok7=last&&Q[6]?last.answers[6]===Q[6].correct:undefined;
 const wrong=last?Q.map((_,i)=>i).filter(i=>last.answers[i]!==Q[i].correct).map(i=>i+1):[];
 return {score:last?`${last.score}/10 · ${last.passed?'đạt':'chưa đạt'}`:'chưa làm',wrong:last?(wrong.join(', ')||'không'):'chưa làm',misconception:`Trước giờ đoán: ${before===undefined?'chưa đoán':before===0?'do gần – xa':before===1?'do trục nghiêng':'do Mặt Trời nóng lạnh'} · Câu 7: ${ok7===undefined?'chưa làm':ok7?'đúng (đã hiểu do trục nghiêng)':'sai'}`,sheets:`${[7,8,10].filter(p=>pageDone(state,p)).length}/3`,badges:`${badges().length}/5`,rubric:`${packRubric(state.reason).filter(Boolean).length}/3${state.rubric[0]===1?' · thầy cô đã xác nhận':''}`};}
function resultList(){const r=summary();return `<dl class="result-list"><dt>Bài kiểm tra</dt><dd>${esc(r.score)}</dd><dt>Câu sai</dt><dd>${esc(r.wrong)}</dd><dt>Quan niệm</dt><dd>${esc(r.misconception)}</dd><dt>Phiếu học tập</dt><dd>${r.sheets}</dd><dt>Huy hiệu</dt><dd>${r.badges}</dd><dt>Vali (rubric)</dt><dd>${esc(r.rubric)}</dd></dl>`;}
async function send(){openDialog('Gửi kết quả cho thầy cô',`<label>Họ tên (chỉ dùng khi gửi)<input id="student-name" autocomplete="name" maxlength="100"></label><label>Lớp<input id="student-class" maxlength="50"></label><p>Kết quả lưu trên máy này. Em tải hồ sơ hoặc mở Form để gửi.</p>${resultList()}${btn('Tải hồ sơ','export','primary')}${config?.appsScript?.url?btn('Gửi thẳng cho thầy cô','post'):''}${config?.googleForm?.url?btn('Mở Google Form điền sẵn','form'):''}${config?.googleForm?.url||config?.appsScript?.url?'':'<p class="caption">Thầy cô chưa cài nơi nhận kết quả. Sách chưa gửi dữ liệu ra ngoài.</p>'}${btn('Mã QR của sách','qr','text-button')}`);}
function observe(){const o=state.obs??[];openDialog('Bảng quan sát 3 ngày',`<p>Ghi ngày, giờ Mặt Trời mọc và lặn ở nơi em sống. <b>Không nhìn thẳng vào Mặt Trời.</b></p>${[0,1,2].map(i=>`<label>Ngày ${i+1}<input data-obs="${i}" maxlength="300" placeholder="VD: 20/11 · mọc 6:05 · lặn 17:15" value="${esc(o[i]??'')}"></label>`).join('')}<p class="caption">Tự lưu khi em gõ. Đây là nhiệm vụ tự chọn.</p>`);}
function payload(){return {book:'Giải mã bốn mùa',version:1,layout:18,exportedAt:new Date().toISOString(),completed:completed(state),predictions:state.predictions,question:state.question,answers:state.answers,attempts:state.attempts,reflection:state.reflection,suitcase:state.suitcase,reason:state.reason,rubric:{auto:packRubric(state.reason),teacher:state.rubric[0]===1},hints:state.seen.filter(v=>v.startsWith('hint:')),observations:state.obs??[],summary:summary()};}
function download(name:string,body:string,type:string){const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function safeURL(raw:string){const u=new URL(raw);if(u.protocol!=='https:')throw Error('Chỉ dùng liên kết HTTPS');return u;}
/** Xuất infographic "4 ngày đặc biệt" thành ảnh PNG 2× để in hoặc gửi nhóm lớp. */
function downloadPng(){const svg=fourDaysSvg(),im=new Image(),url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
 im.onload=()=>{const c=document.createElement('canvas');c.width=im.width*2;c.height=im.height*2;const g=c.getContext('2d');if(!g)return;g.scale(2,2);g.drawImage(im,0,0);URL.revokeObjectURL(url);
  c.toBlob(b=>{if(!b){notify('Chưa tạo được ảnh. Em thử lại nhé.');return;}const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='4-ngay-dac-biet.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),4000);notify('Đã tải ảnh 4 ngày đặc biệt.');},'image/png');};
 im.onerror=()=>{URL.revokeObjectURL(url);notify('Chưa tạo được ảnh. Em thử lại nhé.');};im.src=url;}
async function readPage(p:number,auto=false){if(!preferences.sound){if(!auto)notify('Âm thanh đang tắt. Mở menu ⋯ để bật.');return;}
 const mp3=(config as {readAloud?:{mp3?:number[]}}).readAloud?.mp3;if(mp3?.includes(p)&&await playClip(`${base}audio/trang-${p}.mp3`))return;
 const el=document.querySelector(`[data-page="${p}"]`);const text=Array.from(el?.querySelectorAll('.fr-speech .say,.fr-text p,.fr-text li,.qc h3')||[]).map(e=>e.textContent||'').join(' ');
 if(!await speak(pages[p-1].title+'. '+text)&&!auto)notify('Máy chưa có giọng tiếng Việt. Em đọc chữ trên trang nhé.');}
function showResources(){openDialog('Tài liệu cho thầy cô',`<p>Tài liệu tham khảo, phần lớn bằng tiếng Anh. Video chỉ kết nối YouTube khi bấm phát.</p><div class="resource-cards">${resources.map(r=>`<button data-action="resource:${esc(r.id)}"><img src="${base}assets/${r.type==='youtube'?'F06':'F05'}.webp" alt=""><span><small>${r.type==='youtube'?'VIDEO':'TÀI LIỆU'}</small><strong>${esc(r.title)}</strong><em>${esc(r.source)}</em></span></button>`).join('')}</div>`);}
function openResource(id:string,embed:boolean){const r=resources.find(r=>r.id===id);if(!r)return;const url=safeResourceURL(r.url);if(!url){announce('Liên kết chưa hợp lệ.');return;}const videoId=youtubeId(r.url);const player=r.type==='youtube'&&videoId?(embed?`<iframe class="youtube-player" title="${esc(r.title)}" src="${embedURL(videoId)}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`:`<div class="youtube-poster">${img('F06','','')}<h3>${esc(r.title)}</h3>${btn('Phát video',`embed:${r.id}`,'primary')}</div>`):'';openDialog(r.title,`${player}<p class="resource-source">${esc(r.source)}</p><p>${esc(r.description)}</p><a class="primary" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${r.type==='youtube'?'Mở YouTube':'Mở tài liệu ở tab mới'} ↗</a>`,'resource-dialog');}
function sources(){openDialog('Nguồn và phiên bản',`<p>Đối chiếu: SGK Lịch sử và Địa lí 6, Kết nối tri thức, Bài 8, tr. 122–124.</p><ul><li><a href="https://spaceplace.nasa.gov/seasons/en/" target="_blank" rel="noopener">NASA · Nguyên nhân sinh ra mùa</a></li><li><a href="https://gml.noaa.gov/grad/solcalc/solareqns.PDF" target="_blank" rel="noopener">NOAA · Vị trí Mặt Trời</a></li><li><a href="https://threejs.org/" target="_blank" rel="noopener">Three.js · Mô phỏng 3D</a></li><li><a href="https://science.nasa.gov/resource/earth-with-clouds-3d-model/" target="_blank" rel="noopener">NASA VTAD · Earth with Clouds</a></li><li><a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener">Solar System Scope · Bản đồ bề mặt, CC BY 4.0</a></li><li><a href="https://gibs.earthdata.nasa.gov/" target="_blank" rel="noopener">NASA GIBS · AIRS · Bản đồ nhiệt độ tháng 1 và 7/2024 (tr. 9)</a></li><li><a href="https://polyhaven.com/a/round_platform" target="_blank" rel="noopener">Poly Haven · Round Platform, CC0 (chân trời tr. 11)</a></li></ul><p>Nhân vật và icon trang trí tạo bằng AI. Kích thước, tốc độ và số liệu trong mô hình là gần đúng.</p><p>Phiên bản ${esc(config?.book?.version??'')}.</p>`);}

document.addEventListener('click',async e=>{if(suppressClick)return;const target=(e.target as HTMLElement).closest<HTMLElement>('[data-action]');if(!target||(target as HTMLButtonElement).disabled)return;const [name,value='']=target.dataset.action!.split(':');const before=badges();
 switch(name){
 case 'go':e.preventDefault();change(Number(value));break;case 'next':step(1);break;case 'previous':step(-1);break;
 case 'close':closeDialog();break;
 case 'hint':{const p=Number(value);if(!hints[p])break;hint={p,level:hint?.p===p?(hint.level+1)%3:1};if(hint.level&&!state.seen.includes(`hint:${p}`)){state.seen.push(`hint:${p}`);persist();}playSound('tap');paintHint();break;}
 case 't-open':teach.on=!teach.on;teach.min=false;tSave();closeDialog();dockPaint();break;
 case 't-off':teach.on=false;teach.end=0;tSave();tTimer();dockPaint();break;
 case 't-min':teach.min=!teach.min;tSave();dockPaint();break;
 case 't-present':teach.present=!teach.present;tSave();dockPaint();break;
 case 't-hide':teach.hide=!teach.hide;tSave();dockPaint();break;
 case 't-tab':teach.tab=value as Teacher['tab'];tSave();dockPaint();break;
 case 't-len':teach.len=Number(value);teach.end=0;tSave();tTimer();dockPaint();break;
 case 't-go':teach.end=teach.end?0:Date.now()+teach.len*1000;tSave();tTimer();dockPaint();break;
 case 't-score':{const [i,d]=value.split('.').map(Number);if(teach.teams[i]!==undefined)teach.teams[i]=Math.max(0,teach.teams[i]+d);tSave();dockPaint();break;}
 case 't-teams':{const n=Math.min(6,Math.max(2,teach.teams.length+Number(value)));teach.teams=Array.from({length:n},(_,i)=>teach.teams[i]??0);tSave();dockPaint();break;}
 case 't-zero':teach.teams=teach.teams.map(()=>0);tSave();dockPaint();break;
 case 't-vq':teach.vq=Number(value);tSave();dockPaint();break;
 case 't-vote':{const [i,d]=value.split('.').map(Number),v=teach.votes[teach.vq];if(v&&v[i]!==undefined)v[i]=Math.max(0,v[i]+d);tSave();dockPaint();break;}
 case 't-vote-zero':teach.votes[teach.vq]=[0,0,0];tSave();dockPaint();break;
 case 't-rubric':state.rubric=state.rubric[0]===1?[]:[1];persist();repaint();dockPaint();break;case 'toc':toc();break;case 'menu':menu();break;case 'teacher':teacher();break;case 'noop':break;
 case 'toggle-sound':preferences.sound=!preferences.sound;if(!preferences.sound)stopSpeaking();setSound(preferences.sound);writePreferences(preferences);if(preferences.sound){await unlockSound();playSound('tap');}target.innerHTML=icon(preferences.sound?'sound':'mute')+`<span>Âm thanh: ${preferences.sound?'Bật':'Tắt'}</span>`;target.setAttribute('aria-pressed',String(preferences.sound));break;
 case 'text-size':preferences.large=!preferences.large;writePreferences(preferences);document.documentElement.classList.toggle('text-large',preferences.large);target.querySelector('span')!.textContent=`Cỡ chữ: ${preferences.large?'Lớn':'Thường'}`;target.setAttribute('aria-pressed',String(preferences.large));break;
 case 'fullscreen':try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{notify('Trình duyệt này chưa cho toàn màn hình.');}closeDialog();break;
 case 'read-page':closeDialog();readPage(state.page);break;
 case 'gyro':closeDialog();if(scene)await scene.gyro();break;
 case 'sources':sources();break;
 case 'reveal':ui.revealed=ui.revealed.includes(value)?ui.revealed.filter(v=>v!==value):[...ui.revealed,value];if(ui.revealed.length===2&&!state.seen.includes('news')){state.seen.push('news');persist();}playSound('tap');repaint();break;
 case 'predict':ui.pred.draft[ui.pred.i]=Number(value);repaint();break;
 case 'pred-next':if(ui.pred.draft[ui.pred.i]!==undefined){ui.pred.i++;repaint();}break;
 case 'save-prediction':if(ui.pred.draft.length===3&&!state.predictions){state.predictions=[...ui.pred.draft];persist();playSound('correct');repaint();}break;
 case 'spin':ui.spin=!ui.spin;repaint();break;
 case 'near':ui.near=!ui.near;scene?.closeUp(ui.near);repaint();break;
 case 'date':state.scene.day=Number(value);persist();updateScene();repaint();break;
 case 'lat':case 'city':state.scene.lat=Number(value);persist();updateScene();repaint();break;
 case 'play-orbit':play(false);break;case 'play-sky':play(true);break;
 case 'pick':{const [n,i]=value.split('.');const st=cur(n);if(st.result==='ok')break;ui.steps[n]={...st,chosen:Number(i),result:null};repaint();break;}
 case 'check':{const st=cur(value);if(st.chosen===null)break;const id=STEPS[value]?.[st.i],q=id?findQ(id):undefined;if(!id||!q)break;const ok=st.chosen===q.correct;state.answers[id]=ok?0:st.chosen+1;ui.steps[value]={...st,result:ok?'ok':'bad'};playSound(ok?'correct':'retry');persist();repaint();break;}
 case 'step-next':{const ids=STEPS[value],st=cur(value);const next=ids.findIndex((id,i)=>i>st.i&&state.answers[id]!==0),any=next>=0?next:ids.findIndex(id=>state.answers[id]!==0);if(any<0)delete ui.steps[value];else ui.steps[value]={i:any,chosen:null,result:null};repaint();break;}
 case 'card':{const v=Number(value);ui.card=ui.card===v?null:v;ui.bounce=null;playSound('tap');repaint();break;}
 case 'slot':if(ui.card===null){ui.seasonMsg='Chọn một thẻ mùa trước, rồi chạm vào ô.';repaint();}else dropCard(ui.card,Number(value));break;
 case 'hypo':ui.hypo=!ui.hypo;playSound('tap');repaint();break;
 case 'sheet3-write':{const {lat,day}=state.scene,id=`dl:${lat}:${day}`;if(state.seen.includes(id))break;if(!ui.dl.h.trim()){ui.sheetMsg='Em nhập số giờ ban ngày đọc được trên đồng hồ nhé.';repaint();break;}
  if(readsDayLength(lat,day,ui.dl.h,ui.dl.m)){state.seen.push(id);ui.dl={h:'',m:''};ui.sheetMsg='Đúng rồi! Đã ghi vào phiếu, ô ban đêm tự tính bằng 24 giờ trừ ban ngày.';playSound('correct');persist();}else{ui.sheetMsg='Chưa khớp. Nhìn lại số giờ trong vòng tròn “Ban ngày” rồi nhập lại.';playSound('retry');}repaint();break;}
 case 'tf-start':tfStart();break;
 case 'tf-pick':{if(!tf||tf.chosen!==null||tf.left<=0)break;const q=findQ(tf.order[tf.pos]);if(!q)break;tf.chosen=Number(value);if(tf.chosen===q.correct)tf.score++;playSound(tf.chosen===q.correct?'correct':'retry');tfPaint();break;}
 case 'tf-next':if(!tf)break;tf.pos++;tf.chosen=null;if(tf.pos>=tf.order.length){tfStop();playSound('badge');}tfPaint();break;
 case 'truth9':{if(state.answers['distance']!==undefined)break;const q=findQ('distance'),i=Number(value);if(!q)break;state.answers['distance']=i===q.correct?0:i+1;playSound(i===q.correct?'correct':'retry');persist();repaint();break;}
 case 'pack':state.suitcase=state.suitcase.includes(value)?state.suitcase.filter(v=>v!==value):[...state.suitcase,value];ui.packMsg='';state.rubric=[];persist();playSound('tap');repaint();break;
 case 'check-pack':{const bad=unsuitable(state).map((id,i)=>{const n=packItems.find(x=>x[0]===id)?.[2]??id;return i?n.toLowerCase():n;});ui.packMsg=!warm(state)?'Tháng 7 ở Sydney là mùa lạnh. Vali còn thiếu đồ giữ ấm.':bad.length?`${bad.join(', ')} chỉ hợp mùa nóng. Sydney tháng 7 đang lạnh: bỏ ra nhé.`:state.reason.trim().length<15?'Vali ổn rồi! Em viết thêm vì sao cần đồ ấm nhé.':`Chuẩn rồi! Câu giải thích đạt ${packRubric(state.reason).filter(Boolean).length}/3 tiêu chí.`;}playSound(pageDone(state,13)?'correct':'retry');repaint();break;
 case 'quiz-start':ui.quiz={order:[...Array(10).keys()],pos:0,chosen:null,shown:false,answers:[]};repaint();break;
 case 'quiz-retry':{const last=state.attempts.at(-1),Q=data.quiz as Question[];if(!last)break;ui.quiz={order:Q.map((_,i)=>i).filter(i=>last.answers[i]!==Q[i].correct),pos:0,chosen:null,shown:false,answers:[...last.answers]};repaint();break;}
 case 'quiz-pick':if(ui.quiz&&!ui.quiz.shown){ui.quiz.chosen=Number(value);repaint();}break;
 case 'quiz-answer':{const z=ui.quiz;if(!z||z.chosen===null)break;z.shown=true;const i=z.order[z.pos];z.answers[i]=z.chosen;playSound(z.chosen===(data.quiz as Question[])[i].correct?'correct':'retry');repaint();break;}
 case 'quiz-next':{const z=ui.quiz;if(!z||!z.shown)break;if(z.pos<z.order.length-1){z.pos++;z.chosen=null;z.shown=false;}else{const a=gradeQuiz(z.answers,(data.quiz as Question[]).map(q=>q.correct));state.attempts.push(a);ui.quiz=null;persist();playSound(a.passed?'badge':'tap');}repaint();break;}
 case 'save-reflection':ui.saved='reflection';persist();repaint();break;
 case 'send':void send();break;
 case 'post':{const w=who();if(!w.name.trim()){notify('Em nhập họ tên trước nhé.');break;}try{const u=safeURL(config?.appsScript?.url??'');await fetch(u.href,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({...w,...summary(),payload:payload()})});notify('Đã gửi đi. Nếu thầy cô chưa nhận được, em bấm Tải hồ sơ.');}catch{notify('Chưa gửi được. Kiểm tra mạng, hoặc bấm Tải hồ sơ.');}break;}case 'observe':observe();break;
 case 'export':download('ho-so-giai-ma-bon-mua.json',JSON.stringify(payload(),null,2),'application/json');break;
 case 'form':try{const u=safeURL(config?.googleForm?.url??'');const entries=config.googleForm.entries??{};let filled=0;for(const [k,v] of Object.entries({...who(),...summary(),result:JSON.stringify(payload())})){if(/^entry\.\d+$/.test(entries[k]??'')){u.searchParams.set(entries[k],v);filled++;}}window.open(u.href,'_blank','noopener,noreferrer');announce(filled?'Đã mở Form điền sẵn. Em cần bấm Gửi trong Form.':'Đã mở Form. Form chưa cài điền sẵn, em tự điền họ tên, lớp, điểm nhé.');}catch{announce('Cấu hình Google Form chưa hợp lệ.');}break;
 case 'qr':{const {toDataURL}=await import('qrcode');const url=new URL(location.href);url.hash='';url.search='';const image=await toDataURL(url.href,{width:300,margin:2});openDialog('Mã QR của sách',`<img class="qr-image" src="${image}" alt="Mã QR địa chỉ sách"><p>${esc(url.href)}</p><a class="primary" href="${image}" download="qr-bon-mua.png">Tải QR</a>`);break;}
 case 'deck-tab':ui.deck.tab=value as UI['deck']['tab'];if(value==='practice'&&!ui.deck.pool.length)newPool();repaint();break;
 case 'flip':ui.deck.flip=!ui.deck.flip;repaint();break;
 case 'info-png':downloadPng();break;
 case 'card-next':ui.deck.i++;ui.deck.flip=false;repaint();break;
 case 'drill-pick':{const d=ui.deck;if(d.chosen!==null)break;d.chosen=Number(value);playSound(d.chosen===findQ(d.pool[d.pos])?.correct?'correct':'retry');repaint();break;}
 case 'drill-next':if(ui.deck.pos<ui.deck.pool.length-1){ui.deck.pos++;ui.deck.chosen=null;}else newPool();repaint();break;
 case 'teacher-resources':showResources();break;
 case 'resource':openResource(value,false);break;case 'embed':openResource(value,true);break;
 case 'restart':openDialog('Học lại từ đầu?',`<p>Thao tác này xoá tiến độ của cuốn sách trên trình duyệt này.</p>${btn('Tải hồ sơ trước','export')}${btn('Xoá và học lại','confirm-reset','danger')}`);break;
 case 'confirm-reset':closeDialog();state=fresh();resumePage=1;resetUI();persist();render();break;
 }
 const earned=badges().filter(b=>!before.includes(b));if(earned.length){playSound('badge');notify(`Em nhận huy hiệu “${stations[earned[0]].badge}”!`);}
});
document.addEventListener('input',e=>{const el=e.target as HTMLInputElement;const inp=el.dataset.input;if(inp==='day'){state.scene.day=Math.min(365,Math.max(1,Math.round(Number(el.value))||1));updateScene();visitQuarter();return;}if(inp==='dl-h'||inp==='dl-m'){const v=el.value.replace(/\D/g,'').slice(0,2);if(v!==el.value)el.value=v;ui.dl[inp==='dl-h'?'h':'m']=v;if(ui.sheetMsg){ui.sheetMsg='';document.querySelector('[data-page="10"] .qc-feedback')?.remove();}return;}const key=el.dataset.save;if(key==='question'||key==='reason'||key==='reflection'){state[key]=el.value;if(key==='reason'&&state.rubric.length){state.rubric=[];if(teach.on)dockPaint();}if(key==='reflection'&&ui.saved)ui.saved='';persist();}if(el.dataset.obs!==undefined){const o=state.obs??[];const i=Number(el.dataset.obs);while(o.length<=i)o.push('');o[i]=el.value.slice(0,300);state.obs=o;persist();}});
document.addEventListener('change',e=>{const el=e.target as HTMLInputElement;if(el.dataset.input==='day'){persist();repaint();return;}if(el.dataset.motion){preferences.motion=el.value as 'system'|'on'|'off';state.reducedMotion=el.value==='off';writePreferences(preferences);persist();}if(el.dataset.pref==='voice'){preferences.voice=el.checked;if(!el.checked)stopSpeaking();writePreferences(preferences);}if(el.dataset.setting==='quality'){state.quality=el.value as ProgressV1['quality'];persist();}});
document.addEventListener('keydown',e=>{const t=e.target as HTMLElement;if(e.key==='Enter'&&(t.dataset?.input==='dl-h'||t.dataset?.input==='dl-m')){e.preventDefault();t.closest('[data-page]')?.querySelector<HTMLElement>('[data-action="sheet3-write"]')?.click();return;}if(dialog||((e.target as HTMLElement).closest('input,textarea,select,[data-interactive]')))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();step(-1);}});
let swipe:{x:number;y:number}|undefined;
document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!dialog&&!(e.target as HTMLElement).closest('button,a,input,select,textarea,[data-interactive]'))swipe={x:e.clientX,y:e.clientY};});
document.addEventListener('pointerup',e=>{if(!swipe)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=undefined;if(Math.abs(dx)>85&&Math.abs(dy)<45)step(dx<0?1:-1);});
document.addEventListener('pointercancel',()=>swipe=undefined);
wide.addEventListener('change',()=>{if(!dialog)render();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
document.addEventListener('toggle',e=>{const d=e.target as HTMLElement;if(d instanceof HTMLDetailsElement&&d.dataset.fold==='free')ui.free=d.open;},true);
window.addEventListener('beforeunload',()=>{persist();stopScene();});

const hashPage=Number(location.hash.match(/^#trang-(\d+)$/)?.[1]);if(hashPage>=1&&hashPage<=PAGE_COUNT)state.page=hashPage;
root.innerHTML='<div class="boot"><span>✧</span><h1>Giải mã bốn mùa</h1><p>Đang mở cuốn sách…</p></div>';
document.addEventListener('pointerdown',()=>{void unlockSound();},{once:true});
document.addEventListener('keydown',()=>{void unlockSound();},{once:true});
// Học offline (PWA): chỉ đăng kí ở bản build, tránh cache cũ khi đang phát triển.
if(import.meta.env.PROD&&'serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register(`${base}sw.js`).then(()=>navigator.serviceWorker.ready).then(r=>r.active?.postMessage({cache:performance.getEntriesByType('resource').map(e=>e.name).filter(u=>u.startsWith(location.origin)&&!u.includes('/data/'))})).catch(()=>{}));
Promise.all([fetch(`${base}data/questions.json`).then(r=>{if(!r.ok)throw Error();return r.json();}),fetch(`${base}data/config.json`).then(r=>{if(!r.ok)throw Error();return r.json();}),fetch(`${base}data/resources.json`).then(r=>r.ok?r.json():[]).catch(()=>[]),fetch(`${base}data/hints.json`).then(r=>r.ok?r.json():{}).catch(()=>({}))]).then(([q,c,r,h])=>{data=q;config=c;hints=h&&typeof h==='object'?h as typeof hints:{};resources=Array.isArray(r)?r.filter((v:any)=>typeof v.id==='string'&&Array.isArray(v.pages)&&safeResourceURL(v.url)):[];render();}).catch(()=>{root.innerHTML='<div class="boot"><h1>Chưa tải được nội dung</h1><p>Kiểm tra kết nối rồi tải lại trang. Tiến độ đã lưu vẫn được giữ.</p><button onclick="location.reload()">Thử lại</button></div>';});
