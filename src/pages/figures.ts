// Hình SVG tương tác của Mốc 3. Số liệu lấy từ src/science/figures.ts và earth.ts.
import {base} from './ui';
import {dates,hours,rad} from '../science/earth';
import {tiltAngles,TILT_SGK_MIN,orbitPoint,orbitAxis2D,ORBIT,parallelSplit} from '../science/figures';

const f1=(n:number)=>n.toFixed(1);

// Tr. 9 · Trục nghiêng theo thanh kéo (phút cung). Hai cung: so với phương vuông góc (xanh) và so với mặt phẳng quỹ đạo (đỏ).
export function tiltSvg(min:number){
 const g=tiltAngles(min),t=rad(g.deg),cx=140,cy=104,L=96,R=78,sx=Math.sin(t),cz=Math.cos(t);
 const p=(r:number,a:number)=>`${f1(cx+Math.sin(a)*r)} ${f1(cy-Math.cos(a)*r)}`;
 const mid2=(t+Math.PI/2)/2;
 const blue=g.deg>=1?`<path d="M${p(R,0)}A${R} ${R} 0 0 1 ${p(R,t)}" fill="none" stroke="#2e86de" stroke-width="3"/>`:'';
 return `<svg class="fr-tilt-svg" viewBox="0 0 350 208" role="img" aria-label="Trục Trái Đất nghiêng ${g.perp} so với phương vuông góc với mặt phẳng quỹ đạo, tức ${g.plane} so với mặt phẳng quỹ đạo"><path d="M14 ${cy}H344" stroke="#7b8fa3" stroke-width="2" stroke-dasharray="7 5"/><path d="M${cx} 4V204" stroke="#7b8fa3" stroke-width="2" stroke-dasharray="7 5"/><image href="${base}assets/textures/earth-globe.webp" x="${cx-58}" y="${cy-58}" width="116" height="116" transform="rotate(${f1(g.deg)} ${cx} ${cy})"/><ellipse cx="${cx}" cy="${cy}" rx="58" ry="15" transform="rotate(${f1(g.deg)} ${cx} ${cy})" fill="none" stroke="#d7edf5" stroke-width="2"/><path d="M${f1(cx-sx*L)} ${f1(cy+cz*L)}L${f1(cx+sx*L)} ${f1(cy-cz*L)}" stroke="#e2ad47" stroke-width="5" stroke-linecap="round"/>${blue}<path d="M${p(R-14,t)}A${R-14} ${R-14} 0 0 1 ${p(R-14,Math.PI/2)}" fill="none" stroke="#c0392b" stroke-width="3"/><g font-size="15" font-weight="700"><text x="${f1(cx+sx*L+10)}" y="24" fill="#1f6fb8">${g.perp}</text><text x="${f1(cx+Math.sin(mid2)*(R+8))}" y="${f1(cy-Math.cos(mid2)*(R+8))}" fill="#a93226">${g.plane}</text></g><g font-size="14" fill="#3b5370"><text x="${cx-6}" y="16" text-anchor="end">phương vuông góc</text><text x="346" y="${cy+20}" text-anchor="end">mặt phẳng quỹ đạo</text></g></svg>`;
}
export function tiltFacts(min:number){
 const g=tiltAngles(min),flat=g.min===0,full=g.min===TILT_SGK_MIN;
 return `<span class="blue"><b>${g.perp}</b>so với phương vuông góc</span><span class="red"><b>${g.plane}</b>so với mặt phẳng quỹ đạo</span><span class="wide ${flat?'flat':''}"><b>${hours(g.hanoiJune)}</b>ban ngày ở Hà Nội ngày 22/6 ${flat?'· như mọi ngày, không có mùa nóng – lạnh rõ rệt':full?'· đúng như thực tế':'· nếu trục nghiêng như vậy'}</span>`;
}

// Tr. 12 · Bốn vị trí trên quỹ đạo, chạm để chọn ngày. Nửa tối quay lưng về Mặt Trời; trục song song ở cả bốn vị trí.
export function orbitSvg(selDay:number){
 const {cx,cy}=ORBIT,rx=ORBIT.scale*3.8,ry=rx*ORBIT.squash,r=16,ax=orbitAxis2D(),A=r+10;
 const th=Math.acos(.6),ex=cx+rx*Math.cos(th),ey=cy+ry*Math.sin(th),ang=Math.atan2(-ry*Math.cos(th),rx*Math.sin(th))*180/Math.PI;
 const earth=(d:{label:string,day:number})=>{
  const q=orbitPoint(d.day),on=d.day===selDay,phi=Math.atan2(cy-q.y,cx-q.x);
  const P=(a:number)=>`${f1(q.x+r*Math.cos(a))} ${f1(q.y+r*Math.sin(a))}`;
  const side=q.x<cx-60||q.x>cx+60;
  const lx=side?q.x:q.x+r+12,ly=side?q.y+r+24:q.y+6;
  return `<g class="orbit-pos${on?' on':''}" data-action="date:${d.day}"><circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="28" fill="transparent"/>${on?`<circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="${r+6}" fill="none" stroke="#d49b2f" stroke-width="3"/>`:''}<circle cx="${f1(q.x)}" cy="${f1(q.y)}" r="${r}" fill="#7cc3e8"/><path d="M${P(phi+Math.PI/2)}A${r} ${r} 0 0 1 ${P(phi-Math.PI/2)}Z" fill="#14294a" opacity=".82"/><path d="M${f1(q.x-ax.dx*A)} ${f1(q.y-ax.dy*A)}L${f1(q.x+ax.dx*A)} ${f1(q.y+ax.dy*A)}" stroke="#e2ad47" stroke-width="3" stroke-linecap="round"/><circle cx="${f1(q.x+ax.dx*A)}" cy="${f1(q.y+ax.dy*A)}" r="3.5" fill="#c0392b"/><text x="${f1(lx)}" y="${f1(ly)}" text-anchor="${side?'middle':'start'}" font-size="17" font-weight="${on?800:600}" fill="${on?'#8a5a12':'#3b5370'}">${d.label}</text></g>`;
 };
 return `<svg class="fr-orbit-svg" viewBox="0 0 400 214" role="img" aria-label="Sơ đồ bốn vị trí của Trái Đất trên quỹ đạo. Trục Trái Đất song song với nhau ở cả bốn vị trí. Đang chọn ngày ${dates.find(d=>d.day===selDay)?.label??''}."><ellipse cx="${cx}" cy="${cy}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="#b9a77a" stroke-width="2" stroke-dasharray="6 5"/><path d="M-7 -6L7 0L-7 6Z" fill="#b9a77a" transform="translate(${f1(ex)} ${f1(ey)}) rotate(${f1(ang)})"/><circle cx="${cx}" cy="${cy}" r="34" fill="#f8c64a" opacity=".25"/><circle cx="${cx}" cy="${cy}" r="22" fill="#f6b93b"/>${dates.map(earth).join('')}<text x="12" y="208" font-size="16" fill="#3b5370"><tspan fill="#c0392b">●</tspan> đầu Bắc của trục</text></svg>`;
}

// Tr. 14 · Trái Đất nhìn ngang, Mặt Trời chiếu từ trái. Vĩ tuyến đang chọn: phần vàng nằm trong vùng sáng (ban ngày).
export function globeSvg(day:number,lat:number){
 const {decl,halfDay}=parallelSplit(day,lat),cx=118,cy=104,R=76,phi=rad(lat);
 const y0=cy-R*Math.sin(phi),pr=R*Math.cos(phi),pry=pr*.14;
 const arc=(a:number,b:number)=>{if(b<=a)return '';const n=Math.max(2,Math.ceil((b-a)/6));return Array.from({length:n+1},(_,i)=>{const H=rad(a+(b-a)*i/n);return `${f1(cx-pr*Math.cos(H))},${f1(y0+pry*Math.sin(H))}`;}).join(' ');};
 const lit=arc(-halfDay,halfDay),night=arc(halfDay,360-halfDay);
 const rays=[-44,0,44].map(dy=>`<path d="M4 ${cy+dy}H30" stroke="#e2ad47" stroke-width="3"/><path d="M30 ${cy+dy-6}L38 ${cy+dy}L30 ${cy+dy+6}Z" fill="#e2ad47"/>`).join('');
 return `<svg class="fr-globe-svg" viewBox="0 0 220 212" role="img" aria-label="Trái Đất ngày ${dates.find(d=>d.day===day)?.label??''}: vĩ tuyến ${Math.abs(lat)}° ${lat<0?'Nam':lat>0?'Bắc':''} có ${hours(halfDay/7.5)} ban ngày">${rays}<circle cx="${cx}" cy="${cy}" r="${R}" fill="#cfe6f5"/><path d="M${cx} ${cy-R}A${R} ${R} 0 0 1 ${cx} ${cy+R}Z" fill="#14294a" opacity=".85"/><g transform="rotate(${f1(-decl)} ${cx} ${cy})"><path d="M${cx} ${cy-R-14}V${cy+R+14}" stroke="#e2ad47" stroke-width="3"/><circle cx="${cx}" cy="${cy-R-14}" r="4" fill="#c0392b"/><ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${f1(R*.14)}" fill="none" stroke="#8fb3cf" stroke-width="1.5" stroke-dasharray="4 4"/>${night?`<polyline points="${night}" fill="none" stroke="#9fc3e6" stroke-width="4" stroke-linecap="round"/>`:''}${lit?`<polyline points="${lit}" fill="none" stroke="#f39c12" stroke-width="5" stroke-linecap="round"/>`:''}</g><g font-size="21" font-weight="700"><text x="${cx-R/2}" y="208" text-anchor="middle" fill="#8a5a12">NGÀY</text><text x="${cx+R/2}" y="208" text-anchor="middle" fill="#14294a">ĐÊM</text></g></svg>`;
}
