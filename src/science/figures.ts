// Số liệu cho các hình tương tác v1.3 (tr. 9, 12, 14). Hàm thuần, không phụ thuộc giao diện, có test.
import {EPSILON,declination,orbitPosition,axisVector,dayLengthAt,solarDirection} from './earth';

// Tr. 9 · Góc trục tính bằng phút cung để khớp cách ghi của SGK (23°27′ + 66°33′ = 90°).
export const TILT_SGK_MIN=23*60+27;
export const dm=(min:number)=>`${Math.floor(min/60)}°${String(Math.round(min%60)).padStart(2,'0')}′`;
export function tiltAngles(min:number){
 const m=Math.max(0,Math.min(TILT_SGK_MIN,Math.round(min)));const a=m/60;
 return {min:m,deg:a,perp:dm(m),plane:dm(90*60-m),
  // Ngày hạ chí, xích vĩ Mặt Trời bằng đúng góc nghiêng của trục.
  hanoiJune:dayLengthAt(a,21),hanoiDec:dayLengthAt(-a,21)};
}

// Tr. 12 · Sơ đồ quỹ đạo nhìn chéo từ trên cao, Mặt Trời ở tâm.
// Trục chiếu xuống mặt phẳng hình: cùng một vector cho mọi vị trí (trục giữ hướng).
export const ORBIT={cx:200,cy:104,scale:150/3.8,squash:0.45};
export function orbitPoint(day:number){const [x,,z]=orbitPosition(day);return {x:ORBIT.cx+x*ORBIT.scale,y:ORBIT.cy+z*ORBIT.scale*ORBIT.squash};}
export function orbitAxis2D(){const [ax,ay]=axisVector();return {dx:ax,dy:-ay};}
// >0: đầu Bắc của trục ngả về phía Mặt Trời (mùa hạ ở bán cầu Bắc).
export function northTowardSun(day:number){const [x,,z]=orbitPosition(day);const [ax,,az]=axisVector();return -(x*ax+z*az);}

// Tr. 14 · Vĩ tuyến chia phần ngày/đêm theo nửa cung ban ngày H0 (độ): H0 = 7,5 × số giờ ban ngày.
export function parallelSplit(day:number,lat:number){const decl=declination(day);return {decl,halfDay:dayLengthAt(decl,lat)*7.5};}

// Tr. 16 · Cảnh bầu trời 360°. solarDirection trả [Đông, Lên, Bắc]; Three.js là hệ tay phải nên với x = Đông, y = Lên
// thì Bắc phải là −z. Giữ nguyên +z = Bắc sẽ lật gương cả bầu trời (nhìn hướng Nam, Mặt Trời đi từ phải sang trái).
export function skyVector(day:number,lat:number,time:number):[number,number,number]{const [e,u,n]=solarDirection(day,lat,time);return [e,u,-n];}

export {EPSILON};
