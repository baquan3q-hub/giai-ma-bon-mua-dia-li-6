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
export function speak(text:string):boolean{if(!('speechSynthesis' in window))return false;const voice=speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('vi'));if(!voice)return false;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='vi-VN';u.voice=voice;u.rate=.92;speechSynthesis.speak(u);return true;}
export function stopSpeaking(){if('speechSynthesis' in window)speechSynthesis.cancel();}
