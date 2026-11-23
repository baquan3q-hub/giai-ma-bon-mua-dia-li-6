export type Sound='page'|'tap'|'correct'|'retry'|'badge';
let ctx:AudioContext|undefined,enabled=true;
export const setSound=(value:boolean)=>enabled=value;
export async function unlockSound(){if(!enabled)return;try{ctx??=new AudioContext();if(ctx.state==='suspended')await ctx.resume();}catch{/* Text feedback remains available. */}}
export function playSound(kind:Sound){if(!enabled||!ctx||ctx.state!=='running')return;const c=ctx,t=c.currentTime;
 if(kind==='page'){
  const length=Math.floor(c.sampleRate*.46),buffer=c.createBuffer(1,length,c.sampleRate),channel=buffer.getChannelData(0);
  for(let i=0;i<length;i++){const x=i/length;channel[i]=(Math.random()*2-1)*Math.sin(Math.PI*x)*Math.pow(1-x,.6);}
  const source=c.createBufferSource(),filter=c.createBiquadFilter(),gain=c.createGain();source.buffer=buffer;filter.type='bandpass';filter.Q.value=.6;filter.frequency.setValueAtTime(800,t);filter.frequency.exponentialRampToValueAtTime(3600,t+.15);filter.frequency.exponentialRampToValueAtTime(650,t+.45);gain.gain.value=.17;source.connect(filter).connect(gain).connect(c.destination);source.onended=()=>{source.disconnect();filter.disconnect();gain.disconnect();};source.start();return;
 }
 const notes=kind==='correct'?[660,880]:kind==='retry'?[290,240]:kind==='badge'?[523,659,784,1047]:[720];
 notes.forEach((hz,i)=>{const o=c.createOscillator(),g=c.createGain(),at=t+i*.08;o.type=kind==='retry'?'triangle':'sine';o.frequency.value=hz;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(.045,at+.015);g.gain.exponentialRampToValueAtTime(.0001,at+.17);o.connect(g).connect(c.destination);o.start(at);o.stop(at+.19);o.onended=()=>{o.disconnect();g.disconnect();};});
}
// Giọng đọc: Chrome/Android nạp danh sách giọng chậm (voiceschanged), và hay ngắt câu dài sau ~15 giây.
// Vì vậy chờ giọng tối đa 1,5 giây rồi đọc từng câu ngắn nối tiếp nhau.
let clip:HTMLAudioElement|undefined;
function viVoice():Promise<SpeechSynthesisVoice|undefined>{const pick=()=>speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().replace('_','-').startsWith('vi'));const now=pick();if(now||speechSynthesis.getVoices().length)return Promise.resolve(now);
 return new Promise(res=>{const done=()=>{clearTimeout(t);speechSynthesis.removeEventListener('voiceschanged',done);res(pick());};const t=setTimeout(done,1500);speechSynthesis.addEventListener('voiceschanged',done);});}
export function sentences(text:string,max=160):string[]{const out:string[]=[];for(const s of text.replace(/\s+/g,' ').trim().split(/(?<=[.!?…:;])\s+/)){if(!s)continue;if(s.length<=max){out.push(s);continue;}let cur='';for(const w of s.split(/(?<=,)\s+|\s+/)){if((cur+' '+w).trim().length>max&&cur){out.push(cur.trim());cur='';}cur+=' '+w;}if(cur.trim())out.push(cur.trim());}return out;}
export async function speak(text:string):Promise<boolean>{if(!('speechSynthesis' in window))return false;const voice=await viVoice();if(!voice)return false;stopSpeaking();
 for(const part of sentences(text)){const u=new SpeechSynthesisUtterance(part);u.lang='vi-VN';u.voice=voice;u.rate=.92;speechSynthesis.speak(u);}return true;}
/** Phát tệp thu sẵn (mp3) nếu có; trả về false khi tệp không tải được. */
export function playClip(url:string):Promise<boolean>{stopSpeaking();const a=new Audio(url);clip=a;return a.play().then(()=>true,()=>false);}
export function stopSpeaking(){if('speechSynthesis' in window)speechSynthesis.cancel();if(clip){clip.pause();clip=undefined;}}
