export interface Preferences{sound:boolean;voice:boolean;guidance:boolean;motion:'system'|'on'|'off';large:boolean}
const KEY='giai-ma-bon-mua:preferences:v2';
export function readPreferences():Preferences{try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return {sound:typeof x?.sound==='boolean'?x.sound:true,voice:typeof x?.voice==='boolean'?x.voice:false,guidance:typeof x?.guidance==='boolean'?x.guidance:true,motion:['system','on','off'].includes(x?.motion)?x.motion:'system',large:x?.large===true};}catch{return {sound:true,voice:false,guidance:true,motion:'system',large:false};}}
export function writePreferences(p:Preferences){try{localStorage.setItem(KEY,JSON.stringify(p));}catch{/* Optional settings only. */}}
