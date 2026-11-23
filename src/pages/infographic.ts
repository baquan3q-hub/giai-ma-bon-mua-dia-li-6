// Infographic "4 ngày đặc biệt" (KHBD 4.1): một hình tổng kết 21/3, 22/6, 23/9, 22/12, tải về được.
// SVG tự chứa (màu và phông viết thẳng, không dùng biến CSS) để xuất PNG giống hệt trên màn hình.
import {dates,dayLength,declination,hours} from '../science/earth';

const HANOI=21.03,SYDNEY=-33.87;
const DAYS=[
 {name:'Xuân phân',sun:'Xích đạo',n:'Bắt đầu mùa xuân',s:'Bắt đầu mùa thu',ink:'#2f8f5b'},
 {name:'Hạ chí',sun:'Chí tuyến Bắc',n:'Bắt đầu mùa hạ',s:'Bắt đầu mùa đông',ink:'#c0392b'},
 {name:'Thu phân',sun:'Xích đạo',n:'Bắt đầu mùa thu',s:'Bắt đầu mùa xuân',ink:'#b26a12'},
 {name:'Đông chí',sun:'Chí tuyến Nam',n:'Bắt đầu mùa đông',s:'Bắt đầu mùa hạ',ink:'#1f6fb8'}];
const short=(h:number)=>hours(h).replace(' giờ ','h').replace(' phút','');

/** Trái Đất nhìn ngang: Mặt Trời ở bên trái; đầu Bắc của trục ngả về hoặc chếch xa Mặt Trời. */
function globe(cx:number,cy:number,decl:number,id:string){const R=38,t=-decl,p=(lat:number)=>{const a=(lat+t)*Math.PI/180;return [cx-R*Math.cos(a),cy-R*Math.sin(a)];};
 const [ex,ey]=p(decl);const ax=Math.sin(t*Math.PI/180)*(R+14),ay=Math.cos(t*Math.PI/180)*(R+14);
 // Vĩ tuyến = dây cung ngang ở vĩ độ lat, rồi xoay cùng góc với trục.
 const eq=(lat:number)=>{const dx=R*Math.cos(lat*Math.PI/180),my=cy-R*Math.sin(lat*Math.PI/180),ca=Math.cos(t*Math.PI/180),sa=Math.sin(t*Math.PI/180);
  const r=(x:number,y:number)=>[cx+(x-cx)*ca-(y-cy)*sa,cy+(x-cx)*sa+(y-cy)*ca].map(v=>v.toFixed(1)).join(' ');return `M${r(cx-dx,my)}L${r(cx+dx,my)}`;};
 return `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>
 <g stroke="#e0a526" stroke-width="2.5" stroke-linecap="round">${[-24,-8,8,24].map(d=>`<path d="M${cx-R-46} ${cy+d}H${cx-R-10}"/>`).join('')}</g>
 <path d="M${cx-R-46} ${ey.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#c97a12" stroke-width="3.5"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="4" fill="#c97a12"/>
 <circle cx="${cx}" cy="${cy}" r="${R}" fill="#7cc3e8"/><rect x="${cx}" y="${cy-R}" width="${R}" height="${2*R}" fill="#14294a" opacity=".6" clip-path="url(#${id})"/>
 <path d="${eq(0)}" stroke="#c0392b" stroke-width="2.5"/><path d="${eq(23.44)}" stroke="#ffffffaa" stroke-width="1.5" stroke-dasharray="4 3"/><path d="${eq(-23.44)}" stroke="#ffffffaa" stroke-width="1.5" stroke-dasharray="4 3"/>
 <path d="M${(cx-ax).toFixed(1)} ${(cy+ay).toFixed(1)}L${(cx+ax).toFixed(1)} ${(cy-ay).toFixed(1)}" stroke="#24364d" stroke-width="2.5" stroke-dasharray="5 3"/>
 <text x="${(cx+ax).toFixed(1)}" y="${(cy-ay-6).toFixed(1)}" text-anchor="middle" font-size="13" font-weight="700" fill="#24364d">B</text>`;}

export function fourDaysSvg(){const W=680,H=806,cw=320,ch=318;
 const cards=dates.map((d,i)=>{const k=DAYS[i],x=14+(i%2)*(cw+12),y=120+Math.floor(i/2)*(ch+12),dc=declination(d.day),gx=x+cw/2+30,gy=y+124;
  return `<g><rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="18" fill="#fffdf7" stroke="${k.ink}" stroke-width="2"/>
  <text x="${x+18}" y="${y+44}" font-size="34" font-weight="700" fill="${k.ink}">${d.label}</text><text x="${x+cw-18}" y="${y+42}" text-anchor="end" font-size="20" font-weight="700" fill="#24364d">${k.name}</text>
  ${globe(gx,gy,dc,`g4d${i}`)}<text x="${x+18}" y="${y+80}" font-size="13" fill="#5a4a2a">Mặt Trời</text>
  <text x="${x+18}" y="${y+196}" font-size="14" fill="#566875">Chiếu thẳng góc tại</text><text x="${x+18}" y="${y+216}" font-size="16" font-weight="700" fill="#24364d">${k.sun}</text>
  <text x="${x+18}" y="${y+246}" font-size="14" fill="#24364d"><tspan font-weight="700">Nửa cầu Bắc:</tspan> ${k.n.toLowerCase()}</text>
  <text x="${x+18}" y="${y+268}" font-size="14" fill="#24364d"><tspan font-weight="700">Nửa cầu Nam:</tspan> ${k.s.toLowerCase()}</text>
  <text x="${x+18}" y="${y+298}" font-size="14" fill="#566875">Ngày: Hà Nội <tspan font-weight="700" fill="#24364d">${short(dayLength(d.day,HANOI))}</tspan> · Sydney <tspan font-weight="700" fill="#24364d">${short(dayLength(d.day,SYDNEY))}</tspan></text></g>`;}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="'Be Vietnam Pro',Arial,sans-serif" role="img" aria-label="Bốn ngày đặc biệt: 21/3 xuân phân và 23/9 thu phân Mặt Trời chiếu thẳng góc Xích đạo, ngày bằng đêm; 22/6 hạ chí nửa cầu Bắc ngả về Mặt Trời; 22/12 đông chí nửa cầu Nam ngả về Mặt Trời. Hai nửa cầu luôn trái mùa.">
 <rect width="${W}" height="${H}" fill="#f6f3eb"/><rect width="${W}" height="104" fill="#0b172a"/>
 <text x="24" y="46" font-size="30" font-weight="700" fill="#f5cc81">4 ngày đặc biệt trong năm</text>
 <text x="24" y="80" font-size="16" fill="#e9e3d6">Trục Trái Đất nghiêng và giữ hướng → hai nửa cầu luân phiên ngả về Mặt Trời.</text>
 ${cards}
 <text x="24" y="${H-14}" font-size="12" fill="#566875">Giải mã bốn mùa · Địa lí 6 (KNTT) Bài 8 · Ngày theo quy ước SGK, số liệu gần đúng · Không theo tỉ lệ</text></svg>`;}
