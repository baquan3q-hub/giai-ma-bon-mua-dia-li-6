import {turnBook,isTurning} from './book/flip';
import {readPreferences,writePreferences} from './media/preferences';
import {unlockSound,setSound,playSound,speak,stopSpeaking} from './media/sound';
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
import {content as pageContent,freshUI,firstOpen,type UI,type Question} from './pages/content';
import {pages,spreads,stations,goals,phases,PAGE_COUNT} from './content/book';
import {fresh,load,save,completed,pageDone,warm,CODE,PLACES,SHEET3_DAYS,type ProgressV1} from './state/progress';
import {dates,dateLabel} from './science/earth';

type Data={predictions:{prompt:string;options:string[]}[];[key:string]:any};
type SceneHandle={update:(s:ProgressV1['scene'])=>void;dispose:()=>void;reset:()=>void;gyro:()=>Promise<void>;closeUp:(on:boolean)=>void};
const root=document.querySelector<HTMLDivElement>('#app')!;
const loaded=(()=>{try{return load(localStorage);}catch{return {state:fresh(),warning:'Trình duyệt không cho phép lưu. Tiến độ chỉ giữ trong phiên này.'};}})();
let state=loaded.state,warning=loaded.warning,data:Data,config:any;
let resources:Resource[]=[];const preferences=readPreferences();setSound(preferences.sound);
let scene:SceneHandle|undefined,sceneToken=0;
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
function stopScene(){sceneToken++;scene?.dispose();scene=undefined;stopPlay();}
function reducedMotion(){return state.reducedMotion||preferences.motion==='off'||(preferences.motion==='system'&&matchMedia('(prefers-reduced-motion: reduce)').matches);}
let resumePage=state.page;
function resetUI(){ui=freshUI();if(state.seen.includes('news'))ui.revealed=['hn','sy'];}
resetUI();
function change(p:number){if(p<1||p>PAGE_COUNT||isTurning())return;const previous=state.page;const sameSpread=wide.matches&&spreads.find(v=>v.includes(previous))?.includes(p);window.scrollTo({top:0,behavior:'instant'});const update=()=>{closeDialog();stopScene();stopSpeaking();if(!sameSpread)resetUI();state.page=p;persist();render();document.querySelector<HTMLElement>(`[data-page="${p}"] h1,[data-page="${p}"] h2`)?.focus({preventScroll:true});announce(`Trang ${p}: ${pages[p-1].title}`);};if(sameSpread||previous===p)update();else if(turnBook(update,p>previous?1:-1,reducedMotion()))playSound('page');}
function step(delta:number){if(wide.matches){const i=spreads.findIndex(s=>s.includes(state.page));const v=spreads[i+delta];if(v)change(v[0]);}else change(state.page+delta);}
function content(p:number){return pageContent(p,{state,data,config,ui,badges:badges(),resumePage});}
// Đưa ngày/vĩ độ về giá trị trang đang cần, và ghi các ô Phiếu 3 / cảnh trời em đã xem.
function prepare(){const v=view(),sc=state.scene;
 if(v.includes(8)&&!dates.some(d=>d.day===sc.day))sc.day=173;
 if((v.includes(10)||v.includes(11))&&!SHEET3_DAYS.includes(sc.day))sc.day=173;
 if(v.includes(10)&&!PLACES.some(([l])=>l===sc.lat))sc.lat=21;
 if(v.includes(11)&&!v.includes(10)&&sc.lat!==21&&sc.lat!==-34)sc.lat=21;
 const mark=(id:string)=>{if(!state.seen.includes(id))state.seen.push(id);};
 if(v.includes(10))mark(`dl:${sc.lat}:${sc.day}`);
 if(v.includes(11)&&(sc.lat===21||sc.lat===-34))mark(`sky-${sc.lat}`);
 persist();}
function partLabel(p:number){const ph=pages[p-1].phase;return ph?`${ph} · ${phases[ph].name}`:p===1?'Bìa':'Kết thúc';}
function article(p:number){const item=pages[p-1];const head=p===1?'':`<header class="fr-head"><span class="eyebrow">${esc(partLabel(p).toUpperCase())}</span><h2 tabindex="-1">${item.title}</h2></header>${item.say?`<div class="fr-speech">${img('A02','','')}<span>${item.say}</span></div>`:''}`;return `<article class="page ${p===1?'cover':''} ${p===PAGE_COUNT?'back-cover':''} ${p>1?'framed v14-page':''}" data-page="${p}" style="--page-side:${p%2===0?'0%':'100%'}">${head}<div class="page-body">${content(p)}</div>${p===1?'':`<footer class="page-footer"><span>GIẢI MÃ BỐN MÙA</span><b>${String(p).padStart(2,'0')}</b></footer>`}</article>`;}
function render(){stopScene();prepare();const visible=view(),page=pages[state.page-1];document.documentElement.classList.toggle('reduced-motion',reducedMotion());document.documentElement.classList.toggle('force-book-motion',preferences.motion==='on');
 root.innerHTML=`<header class="app-header"><span class="brand"><span class="brand-mark">✧</span><span>GIẢI MÃ <b>BỐN MÙA</b><small>ĐỊA LÍ 6 · BÀI 8</small></span></span><nav aria-label="Công cụ">${btn(icon('list')+'<span>Mục lục</span>','toc','header-button')}${btn(icon('more'),'menu','header-button menu-button','aria-label="Thêm: đọc to, âm thanh, cỡ chữ, thầy cô" aria-haspopup="dialog"')}</nav></header><main><div id="storage-warning" role="status">${esc(warning)}</div><div class="book-stage"><div class="book ${visible.length===2?'spread':'single'} ${state.page===1?'front-cover':''}" style="--page-side:${state.page%2===0?'0%':'100%'};--scene-bg:url('${base}assets/${page.image}.webp')">${visible.map(article).join('')}</div></div><nav class="book-navigation v14-nav" aria-label="Lật trang">${btn('←','previous','nav-arrow',`aria-label="Trang trước" ${visible[0]===1?'disabled':''}`)}<div class="nav-label"><span>${esc(partLabel(visible.at(-1)!))}</span><strong>Trang ${visible.join('–')} / ${PAGE_COUNT}</strong></div>${btn('→','next','nav-arrow',`aria-label="Trang sau" ${visible.at(-1)===PAGE_COUNT?'disabled':''}`)}</nav></main>`;
 history.replaceState(null,'',`#trang-${state.page}`);resumePage=Math.max(resumePage,state.page);
 const next=spreads[spreads.findIndex(s=>s.includes(state.page))+1];if(next){const preload=new Image();preload.src=`${base}assets/${pages[next[0]-1].image}.webp`;}
 if(preferences.voice&&preferences.sound)queueMicrotask(()=>readPage(state.page,true));
 const orbit=document.querySelector<HTMLElement>('#orbit-mount'),sky=document.querySelector<HTMLElement>('#sky-mount');
 if(orbit)void mountScene(orbit,'orbit');else if(sky)void mountScene(sky,'sky');
}
// Vẽ lại phần thân các trang đang mở mà không dựng lại cảnh 3D đang chạy.
function repaint(){prepare();const active=document.activeElement as HTMLElement|null,action=active?.dataset?.action,inPage=active?.closest<HTMLElement>('[data-page]')?.dataset.page;
 for(const p of view()){const body=document.querySelector(`[data-page="${p}"] .page-body`);if(!body)continue;const live=body.querySelector<HTMLElement>('.inline-simulation');const t=document.createElement('div');t.innerHTML=content(p);if(live){const slot=t.querySelector(`#${live.id}`);slot?.replaceWith(live);}body.replaceChildren(...t.childNodes);}
 markPlay();
 if(inPage&&(!active||!active.isConnected)){const pageEl=document.querySelector(`[data-page="${inPage}"]`);const target=(action&&pageEl?.querySelector<HTMLElement>(`[data-action="${action}"]:not([disabled])`))||pageEl?.querySelector<HTMLElement>('.qc-feedback')||pageEl?.querySelector<HTMLElement>('.fr-actions .primary:not([disabled])');if(target){if(!target.matches('button,a,input,textarea'))target.tabIndex=-1;target.focus({preventScroll:true});}}
}
function openDialog(title:string,body:string,cls=''){closeDialog();lastFocus=document.activeElement as HTMLElement;dialog=document.createElement('dialog');dialog.className=`activity-dialog ${cls}`;dialog.innerHTML=`<header><span class="eyebrow">GIẢI MÃ BỐN MÙA</span><h2>${title}</h2>${btn('Đóng ×','close','close-button')}</header><div class="dialog-body">${body}</div>`;document.body.append(dialog);stopSpeaking();dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});dialog.showModal();dialog.querySelector<HTMLElement>('.dialog-body button,.dialog-body input,.dialog-body select,.dialog-body textarea')?.focus();}
function closeDialog(){if(dialog){dialog.close();dialog.remove();dialog=undefined;persist();if(lastFocus?.isConnected)lastFocus.focus();}}
function toc(){const done=badges(),row=(p:number)=>{const d=pageDone(state,p);return `<li>${btn(`<b>${p}</b><span>${pages[p-1].title}</span>${d?icon('check'):''}`,`go:${p}`,`toc-link${p===state.page?' current':''}${d?' done':''}`,p===state.page?'aria-current="page"':'')}</li>`;};
 openDialog('Mục lục',`<details class="toc-goals"><summary>Học xong, em sẽ…</summary><ol>${goals.map(g=>`<li>${g}</li>`).join('')}</ol></details><ol class="toc-list">${row(1)}</ol>${(Object.entries(phases) as [keyof typeof phases,{name:string;hint:string}][]).map(([k,v])=>`<section class="toc-part"><h3><b>${k}</b>${v.name}<small>${v.hint}</small></h3><ol class="toc-list">${pages.filter(p=>p.phase===k).map(p=>row(p.number)).join('')}</ol></section>`).join('')}<ol class="toc-list">${row(PAGE_COUNT)}</ol><div class="toc-badges" aria-label="Huy hiệu">${stations.map((s,i)=>`<span class="${done.includes(i)?'earned':''}">${img(`E0${i+1}`,'',s.badge)}<small>${s.badge}</small></span>`).join('')}</div>`,'toc-dialog');}
function menu(){const skyOpen=view().includes(11)&&!!scene;
 openDialog('Thêm',`<div class="menu-list">${btn(icon('listen')+'<span>Đọc to trang này</span>','read-page')}${btn(icon(preferences.sound?'sound':'mute')+`<span>Âm thanh: ${preferences.sound?'Bật':'Tắt'}</span>`,'toggle-sound','sound-toggle',`aria-pressed="${preferences.sound}"`)}${btn(icon('expand')+`<span>${document.fullscreenElement?'Thoát toàn màn hình':'Toàn màn hình'}</span>`,'fullscreen')}${btn('<b class="aa">Aa</b>'+`<span>Cỡ chữ: ${preferences.large?'Lớn':'Thường'}</span>`,'text-size','',`aria-pressed="${preferences.large}"`)}${btn(icon('teacher')+'<span>Thầy cô dạy trên lớp</span>','teacher')}${skyOpen?btn(icon('globe')+'<span>Xoay điện thoại để nhìn trời</span>','gyro'):''}</div><details class="menu-more"><summary>Tuỳ chọn khác</summary><label>Hiệu ứng lật sách<select data-motion="mode"><option value="system" ${preferences.motion==='system'?'selected':''}>Theo thiết bị</option><option value="on" ${preferences.motion==='on'?'selected':''}>Có hiệu ứng</option><option value="off" ${preferences.motion==='off'?'selected':''}>Giảm chuyển động</option></select></label><label>Chất lượng 3D<select data-setting="quality"><option value="high" ${state.quality==='high'?'selected':''}>Cao</option><option value="low" ${state.quality==='low'?'selected':''}>Thấp (máy yếu)</option></select></label><label class="check"><input type="checkbox" data-pref="voice" ${preferences.voice?'checked':''}> Tự đọc to khi mở trang</label>${btn('Nguồn và phiên bản','sources','text-button')}${btn('Học lại từ đầu','restart','text-button danger-text')}</details>`,'menu-dialog');}
function teacher(){openDialog('Thầy cô dạy trên lớp',`<p>Chọn hoạt động để mở đúng trang khi chiếu. Chế độ trình chiếu riêng (chữ to, đồng hồ, bình chọn) sẽ có ở bản cập nhật tới.</p>${LESSON.map(([h,list])=>`<section class="toc-part"><h3>${h}</h3><ol class="toc-list">${list.map(([n,p])=>`<li>${btn(`<b>${p}</b><span>${n}</span>`,`go:${p}`,'toc-link')}</li>`).join('')}</ol></section>`).join('')}`,'toc-dialog');}
async function mountScene(el:HTMLElement,kind:'orbit'|'sky'){const token=++sceneToken;try{const {createScene}=await import('./scenes/world');if(token!==sceneToken||!el.isConnected)return;scene=createScene(el,kind,state.scene,{quality:state.quality,reduced:reducedMotion(),onSeen:()=>{}});if(ui.near)scene.closeUp(true);}catch{if(token!==sceneToken||!el.isConnected)return;el.innerHTML=kind==='sky'?'<div class="fallback-scene"><p>Máy chưa mở được cảnh 3D. Em xem hình ở trang 10: Hà Nội ngày 22/6 dài 13 giờ 17 phút, Sydney chỉ khoảng 10 giờ.</p></div>':`<div class="fallback-scene"><p>Máy chưa mở được cảnh 3D. Em xem hình quỹ đạo ở trang 7.</p></div>`;}}
function updateScene(){scene?.update(state.scene);document.querySelectorAll<HTMLElement>('[data-action^="date:"]').forEach(e=>{const on=e.dataset.action===`date:${state.scene.day}`;e.classList.toggle('active',on);e.setAttribute('aria-pressed',String(on));});}
function markPlay(){for(const [action,label] of [['play-orbit','Chạy một năm'],['play-sky','Chạy một ngày']] as const)document.querySelectorAll(`[data-action="${action}"]`).forEach(el=>{const on=!!playing&&playingSky===(action==='play-sky');el.setAttribute('aria-pressed',String(on));const s=el.querySelector('span');if(s)s.textContent=on?'Dừng':label;});}
function play(sky:boolean){if(playing){const same=playingSky===sky;stopPlay();if(same)return;}playingSky=sky;playedDays=0;playing=setInterval(()=>{if(document.hidden)return;if(sky)state.scene.time=(state.scene.time+0.06)%24;else{state.scene.day=state.scene.day%365+1;if(++playedDays>=365&&!state.seen.includes('orbit-year')){state.seen.push('orbit-year');persist();stopPlay();notify('Trái Đất đã đi hết một vòng quanh Mặt Trời: 365 ngày!');repaint();}}updateScene();},sky?60:30);markPlay();}
function cur(name:string){return ui.steps[name]??{i:firstOpen(state,STEPS[name]),chosen:null,result:null};}
function findQ(id:string):Question{return Object.values(data).flat().find((q:any)=>q?.id===id);}
function newPool(){const ids=['orbit','journal','truth','table','quiz'].flatMap(g=>(data[g] as Question[]).map(q=>q.id));for(let i=ids.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ids[i],ids[j]]=[ids[j],ids[i]];}ui.deck.pool=ids.slice(0,5);ui.deck.pos=0;ui.deck.chosen=null;}
async function send(){openDialog('Gửi kết quả cho thầy cô',`<label>Họ tên (chỉ dùng khi gửi)<input id="student-name" autocomplete="name" maxlength="100"></label><label>Lớp<input id="student-class" maxlength="50"></label><p>Kết quả lưu trên máy này. Em tải hồ sơ hoặc mở Form để gửi.</p>${btn('Tải hồ sơ','export','primary')}${config.googleForm.url?btn('Mở Google Form điền sẵn','form'):'<p class="caption">Thầy cô chưa cài Google Form. Sách chưa gửi dữ liệu ra ngoài.</p>'}${btn('Mã QR của sách','qr','text-button')}`);}
function observe(){const o=state.obs??[];openDialog('Bảng quan sát 3 ngày',`<p>Ghi ngày, giờ Mặt Trời mọc và lặn ở nơi em sống. <b>Không nhìn thẳng vào Mặt Trời.</b></p>${[0,1,2].map(i=>`<label>Ngày ${i+1}<input data-obs="${i}" maxlength="300" placeholder="VD: 20/11 · mọc 6:05 · lặn 17:15" value="${esc(o[i]??'')}"></label>`).join('')}<p class="caption">Tự lưu khi em gõ. Đây là nhiệm vụ tự chọn.</p>`);}
function payload(){return {book:'Giải mã bốn mùa',version:1,layout:18,exportedAt:new Date().toISOString(),completed:completed(state),predictions:state.predictions,question:state.question,answers:state.answers,attempts:state.attempts,reflection:state.reflection,suitcase:state.suitcase,reason:state.reason,observations:state.obs??[]};}
function download(name:string,body:string,type:string){const url=URL.createObjectURL(new Blob([body],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function safeURL(raw:string){const u=new URL(raw);if(u.protocol!=='https:')throw Error('Chỉ dùng liên kết HTTPS');return u;}
function readPage(p:number,auto=false){if(!preferences.sound){if(!auto)notify('Âm thanh đang tắt. Mở menu ⋯ để bật.');return;}const el=document.querySelector(`[data-page="${p}"]`);const text=Array.from(el?.querySelectorAll('.fr-speech span,.fr-text p,.fr-text li,.qc h3')||[]).map(e=>e.textContent||'').join(' ');if(!speak(pages[p-1].title+'. '+text)&&!auto)notify('Máy chưa có giọng tiếng Việt. Em đọc chữ trên trang nhé.');}
function showResources(){openDialog('Tài liệu cho thầy cô',`<p>Tài liệu tham khảo, phần lớn bằng tiếng Anh. Video chỉ kết nối YouTube khi bấm phát.</p><div class="resource-cards">${resources.map(r=>`<button data-action="resource:${esc(r.id)}"><img src="${base}assets/${r.type==='youtube'?'F06':'F05'}.webp" alt=""><span><small>${r.type==='youtube'?'VIDEO':'TÀI LIỆU'}</small><strong>${esc(r.title)}</strong><em>${esc(r.source)}</em></span></button>`).join('')}</div>`);}
function openResource(id:string,embed:boolean){const r=resources.find(r=>r.id===id);if(!r)return;const url=safeResourceURL(r.url);if(!url){announce('Liên kết chưa hợp lệ.');return;}const videoId=youtubeId(r.url);const player=r.type==='youtube'&&videoId?(embed?`<iframe class="youtube-player" title="${esc(r.title)}" src="${embedURL(videoId)}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`:`<div class="youtube-poster">${img('F06','','')}<h3>${esc(r.title)}</h3>${btn('Phát video',`embed:${r.id}`,'primary')}</div>`):'';openDialog(r.title,`${player}<p class="resource-source">${esc(r.source)}</p><p>${esc(r.description)}</p><a class="primary" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${r.type==='youtube'?'Mở YouTube':'Mở tài liệu ở tab mới'} ↗</a>`,'resource-dialog');}
function sources(){openDialog('Nguồn và phiên bản',`<p>Đối chiếu: SGK Lịch sử và Địa lí 6, Kết nối tri thức, Bài 8, tr. 122–124.</p><ul><li><a href="https://spaceplace.nasa.gov/seasons/en/" target="_blank" rel="noopener">NASA · Nguyên nhân sinh ra mùa</a></li><li><a href="https://gml.noaa.gov/grad/solcalc/solareqns.PDF" target="_blank" rel="noopener">NOAA · Vị trí Mặt Trời</a></li><li><a href="https://threejs.org/" target="_blank" rel="noopener">Three.js · Mô phỏng 3D</a></li><li><a href="https://science.nasa.gov/resource/earth-with-clouds-3d-model/" target="_blank" rel="noopener">NASA VTAD · Earth with Clouds</a></li><li><a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noopener">Solar System Scope · Bản đồ bề mặt, CC BY 4.0</a></li><li><a href="https://gibs.earthdata.nasa.gov/" target="_blank" rel="noopener">NASA GIBS · AIRS · Bản đồ nhiệt độ tháng 1 và 7/2024 (tr. 9)</a></li><li><a href="https://polyhaven.com/a/round_platform" target="_blank" rel="noopener">Poly Haven · Round Platform, CC0 (chân trời tr. 11)</a></li></ul><p>Nhân vật và icon trang trí tạo bằng AI. Kích thước, tốc độ và số liệu trong mô hình là gần đúng.</p><p>Phiên bản ${esc(config.book.version)}.</p>`);}

document.addEventListener('click',async e=>{const target=(e.target as HTMLElement).closest<HTMLElement>('[data-action]');if(!target||(target as HTMLButtonElement).disabled)return;const [name,value='']=target.dataset.action!.split(':');const before=badges();
 switch(name){
 case 'go':e.preventDefault();change(Number(value));break;case 'next':step(1);break;case 'previous':step(-1);break;
 case 'close':closeDialog();break;case 'toc':toc();break;case 'menu':menu();break;case 'teacher':teacher();break;case 'noop':break;
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
 case 'check':{const st=cur(value);if(st.chosen===null)break;const id=STEPS[value][st.i],q=findQ(id),ok=st.chosen===q.correct;state.answers[id]=ok?0:st.chosen+1;ui.steps[value]={...st,result:ok?'ok':'bad'};playSound(ok?'correct':'retry');persist();repaint();break;}
 case 'step-next':{const ids=STEPS[value],st=cur(value);const next=ids.findIndex((id,i)=>i>st.i&&state.answers[id]!==0),any=next>=0?next:ids.findIndex(id=>state.answers[id]!==0);if(any<0)delete ui.steps[value];else ui.steps[value]={i:any,chosen:null,result:null};repaint();break;}
 case 'north':ui.north=Number(value);ui.seasonMsg='';repaint();break;case 'south':ui.south=Number(value);ui.seasonMsg='';repaint();break;
 case 'check-season':{const k=dates.findIndex(d=>d.day===state.scene.day);if(k<0||ui.north===null||ui.south===null)break;const okN=ui.north===[2,0,2,1][k],okS=ui.south===[2,1,2,0][k];state.answers[`season-${k*2}`]=okN?0:ui.north+1;state.answers[`season-${k*2+1}`]=okS?0:ui.south+1;playSound(okN&&okS?'correct':'retry');if(okN&&okS){const left=dates.findIndex((_,i)=>state.answers[`season-${i*2}`]!==0||state.answers[`season-${i*2+1}`]!==0);ui.seasonMsg=left<0?'Đúng rồi! Em đã điền đủ bảng.':`Đúng rồi! Tiếp theo: ngày ${dates[left].label}.`;if(left>=0)state.scene.day=dates[left].day;ui.north=ui.south=null;updateScene();}else ui.seasonMsg=`Chưa đúng ở nửa cầu ${!okN&&!okS?'Bắc và Nam':!okN?'Bắc':'Nam'}. Nửa cầu nào ngả về phía Mặt Trời?`;persist();repaint();break;}
 case 'truth9':{if(state.answers['distance']!==undefined)break;const q=findQ('distance'),i=Number(value);state.answers['distance']=i===q.correct?0:i+1;playSound(i===q.correct?'correct':'retry');persist();repaint();break;}
 case 'pack':state.suitcase=state.suitcase.includes(value)?state.suitcase.filter(v=>v!==value):[...state.suitcase,value];ui.packMsg='';persist();playSound('tap');repaint();break;
 case 'check-pack':ui.packMsg=!warm(state)?'Tháng 7 ở Sydney là mùa lạnh. Vali còn thiếu đồ giữ ấm.':state.reason.trim().length<15?'Vali ổn rồi! Em viết thêm vì sao cần đồ ấm nhé.':'Chuẩn rồi! Nam sẽ không bị lạnh ở Sydney.';playSound(pageDone(state,13)?'correct':'retry');repaint();break;
 case 'quiz-start':ui.quiz={order:[...Array(10).keys()],pos:0,chosen:null,shown:false,answers:[]};repaint();break;
 case 'quiz-retry':{const last=state.attempts.at(-1),Q=data.quiz as Question[];if(!last)break;ui.quiz={order:Q.map((_,i)=>i).filter(i=>last.answers[i]!==Q[i].correct),pos:0,chosen:null,shown:false,answers:[...last.answers]};repaint();break;}
 case 'quiz-pick':if(ui.quiz&&!ui.quiz.shown){ui.quiz.chosen=Number(value);repaint();}break;
 case 'quiz-answer':{const z=ui.quiz;if(!z||z.chosen===null)break;z.shown=true;const i=z.order[z.pos];z.answers[i]=z.chosen;playSound(z.chosen===(data.quiz as Question[])[i].correct?'correct':'retry');repaint();break;}
 case 'quiz-next':{const z=ui.quiz;if(!z||!z.shown)break;if(z.pos<z.order.length-1){z.pos++;z.chosen=null;z.shown=false;}else{const a=gradeQuiz(z.answers,(data.quiz as Question[]).map(q=>q.correct));state.attempts.push(a);ui.quiz=null;persist();playSound(a.passed?'badge':'tap');}repaint();break;}
 case 'save-reflection':ui.saved='reflection';persist();repaint();break;
 case 'send':void send();break;case 'observe':observe();break;
 case 'export':download('ho-so-giai-ma-bon-mua.json',JSON.stringify(payload(),null,2),'application/json');break;
 case 'form':try{const u=safeURL(config.googleForm.url);const entries=config.googleForm.entries;for(const [k,v] of Object.entries({name:(document.querySelector('#student-name') as HTMLInputElement).value,className:(document.querySelector('#student-class') as HTMLInputElement).value,result:JSON.stringify(payload())})){if(/^entry\.\d+$/.test(entries[k]))u.searchParams.set(entries[k],v);}window.open(u.href,'_blank','noopener,noreferrer');announce('Đã mở Form. Em cần bấm Gửi trong Form.');}catch{announce('Cấu hình Google Form chưa hợp lệ.');}break;
 case 'qr':{const {toDataURL}=await import('qrcode');const url=new URL(location.href);url.hash='';url.search='';const image=await toDataURL(url.href,{width:300,margin:2});openDialog('Mã QR của sách',`<img class="qr-image" src="${image}" alt="Mã QR địa chỉ sách"><p>${esc(url.href)}</p><a class="primary" href="${image}" download="qr-bon-mua.png">Tải QR</a>`);break;}
 case 'deck-tab':ui.deck.tab=value as UI['deck']['tab'];if(value==='practice'&&!ui.deck.pool.length)newPool();repaint();break;
 case 'flip':ui.deck.flip=!ui.deck.flip;repaint();break;
 case 'card-next':ui.deck.i++;ui.deck.flip=false;repaint();break;
 case 'drill-pick':{const d=ui.deck;if(d.chosen!==null)break;d.chosen=Number(value);playSound(d.chosen===findQ(d.pool[d.pos]).correct?'correct':'retry');repaint();break;}
 case 'drill-next':if(ui.deck.pos<ui.deck.pool.length-1){ui.deck.pos++;ui.deck.chosen=null;}else newPool();repaint();break;
 case 'teacher-resources':showResources();break;
 case 'resource':openResource(value,false);break;case 'embed':openResource(value,true);break;
 case 'restart':openDialog('Học lại từ đầu?',`<p>Thao tác này xoá tiến độ của cuốn sách trên trình duyệt này.</p>${btn('Tải hồ sơ trước','export')}${btn('Xoá và học lại','confirm-reset','danger')}`);break;
 case 'confirm-reset':closeDialog();state=fresh();resumePage=1;resetUI();persist();render();break;
 }
 const earned=badges().filter(b=>!before.includes(b));if(earned.length){playSound('badge');notify(`Em nhận huy hiệu “${stations[earned[0]].badge}”!`);}
});
document.addEventListener('input',e=>{const el=e.target as HTMLInputElement;const key=el.dataset.save;if(key==='question'||key==='reason'||key==='reflection'){state[key]=el.value;if(key==='reflection'&&ui.saved)ui.saved='';persist();}if(el.dataset.obs!==undefined){const o=state.obs??[];const i=Number(el.dataset.obs);while(o.length<=i)o.push('');o[i]=el.value.slice(0,300);state.obs=o;persist();}});
document.addEventListener('change',e=>{const el=e.target as HTMLInputElement;if(el.dataset.motion){preferences.motion=el.value as 'system'|'on'|'off';state.reducedMotion=el.value==='off';writePreferences(preferences);persist();}if(el.dataset.pref==='voice'){preferences.voice=el.checked;if(!el.checked)stopSpeaking();writePreferences(preferences);}if(el.dataset.setting==='quality'){state.quality=el.value as ProgressV1['quality'];persist();}});
document.addEventListener('keydown',e=>{if(dialog||((e.target as HTMLElement).closest('input,textarea,select,[data-interactive]')))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();step(1);}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();step(-1);}});
let swipe:{x:number;y:number}|undefined;
document.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&!dialog&&!(e.target as HTMLElement).closest('button,a,input,select,textarea,[data-interactive]'))swipe={x:e.clientX,y:e.clientY};});
document.addEventListener('pointerup',e=>{if(!swipe)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=undefined;if(Math.abs(dx)>85&&Math.abs(dy)<45)step(dx<0?1:-1);});
document.addEventListener('pointercancel',()=>swipe=undefined);
wide.addEventListener('change',()=>{if(!dialog)render();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)persist();});
window.addEventListener('beforeunload',()=>{persist();stopScene();});

const hashPage=Number(location.hash.match(/^#trang-(\d+)$/)?.[1]);if(hashPage>=1&&hashPage<=PAGE_COUNT)state.page=hashPage;
root.innerHTML='<div class="boot"><span>✧</span><h1>Giải mã bốn mùa</h1><p>Đang mở cuốn sách…</p></div>';
document.addEventListener('pointerdown',()=>{void unlockSound();},{once:true});
document.addEventListener('keydown',()=>{void unlockSound();},{once:true});
Promise.all([fetch(`${base}data/questions.json`).then(r=>{if(!r.ok)throw Error();return r.json();}),fetch(`${base}data/config.json`).then(r=>{if(!r.ok)throw Error();return r.json();}),fetch(`${base}data/resources.json`).then(r=>r.ok?r.json():[]).catch(()=>[])]).then(([q,c,r])=>{data=q;config=c;resources=Array.isArray(r)?r.filter((v:any)=>typeof v.id==='string'&&Array.isArray(v.pages)&&safeResourceURL(v.url)):[];render();}).catch(()=>{root.innerHTML='<div class="boot"><h1>Chưa tải được nội dung</h1><p>Kiểm tra kết nối rồi tải lại trang. Tiến độ đã lưu vẫn được giữ.</p><button onclick="location.reload()">Thử lại</button></div>';});
