export const rad=(d:number)=>d*Math.PI/180;
export const deg=(r:number)=>r*180/Math.PI;
export const EPSILON=23.44;
export const dates=[{label:'21/3',day:80},{label:'22/6',day:173},{label:'23/9',day:266},{label:'22/12',day:356}];
export function declination(day:number){return EPSILON*Math.sin(2*Math.PI*(day-80)/365);}
export function dayLength(day:number,lat:number){
  if(!Number.isFinite(day)||!Number.isFinite(lat)||Math.abs(lat)>90)throw new RangeError('Ngày hoặc vĩ độ không hợp lệ');
  const c=-Math.tan(rad(lat))*Math.tan(rad(declination(day)));
  return c>=1?0:c<=-1?24:2*deg(Math.acos(c))/15;
}
export function hours(value:number){const m=Math.round(value*60);return `${Math.floor(m/60)} giờ ${String(m%60).padStart(2,'0')} phút`;}
export function dateLabel(day:number){const date=new Date(Date.UTC(2025,0,day));return `${date.getUTCDate()}/${date.getUTCMonth()+1}`;}
export function axisVector():[number,number,number]{return [Math.sin(rad(EPSILON)),Math.cos(rad(EPSILON)),0];}
// Fixed world axis + translation, never rotate the Earth's parent around the Sun.
export function orbitPosition(day:number):[number,number,number]{
  const angle=2*Math.PI*(day-173)/365;
  const radius=3.8*distanceAU(day);
  return [-radius*Math.cos(angle),0,radius*Math.sin(angle)];
}
// Teaching approximation: perihelion near 3 January, eccentricity 0.0167.
export function distanceAU(day:number){return 1-0.0167*Math.cos(2*Math.PI*(day-3)/365);}
export function solarDirection(day:number,lat:number,time:number):[number,number,number]{
  const d=rad(declination(day)),p=rad(lat),h=rad((time-12)*15);
  return [-Math.cos(d)*Math.sin(h),Math.sin(p)*Math.sin(d)+Math.cos(p)*Math.cos(d)*Math.cos(h),Math.cos(p)*Math.sin(d)-Math.sin(p)*Math.cos(d)*Math.cos(h)];
}
export function daylightPath(day:number,lat:number){const len=dayLength(day,lat);return {rise:12-len/2,set:12+len/2,noon:12};}
