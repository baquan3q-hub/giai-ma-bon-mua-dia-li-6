import {test} from 'node:test';import assert from 'node:assert/strict';
import {dayLength,dayLengthAt,declination,dates,hours} from '../src/science/earth';
import {TILT_SGK_MIN,dm,tiltAngles,ORBIT,orbitPoint,orbitAxis2D,northTowardSun,parallelSplit,skyVector} from '../src/science/figures';

test('Tr. 9 · Góc trục ghi theo SGK: 23°27′ + 66°33′ = 90°',()=>{
 assert.equal(dm(TILT_SGK_MIN),'23°27′');
 const sgk=tiltAngles(TILT_SGK_MIN);assert.equal(sgk.perp,'23°27′');assert.equal(sgk.plane,'66°33′');
 const up=tiltAngles(0);assert.equal(up.perp,'0°00′');assert.equal(up.plane,'90°00′');
 assert.equal(hours(up.hanoiJune),'12 giờ 00 phút');assert.equal(hours(up.hanoiDec),'12 giờ 00 phút');
 assert.equal(hours(sgk.hanoiJune),'13 giờ 17 phút');assert.equal(hours(sgk.hanoiDec),'10 giờ 43 phút');
 assert.equal(tiltAngles(-50).min,0);assert.equal(tiltAngles(5000).min,TILT_SGK_MIN);
 for(let m=0;m<=TILT_SGK_MIN;m+=67){const g=tiltAngles(m);assert.ok(g.hanoiJune>=12&&g.hanoiDec<=12);}
});

test('Tr. 12 · Trục song song ở bốn vị trí, Bắc ngả về Mặt Trời ngày 22/6',()=>{
 const a=orbitAxis2D();for(const d of dates)assert.deepEqual(orbitAxis2D(),a);
 assert.ok(a.dx>0&&a.dy<0);
 assert.ok(northTowardSun(173)>0);assert.ok(northTowardSun(356)<0);
 const peak=northTowardSun(173);assert.ok(Math.abs(northTowardSun(80))<0.05*peak&&Math.abs(northTowardSun(266))<0.05*peak,"xuân phân, thu phân: trục không ngả về phía nào");
 // Trên hình: đầu Bắc (đi theo dx) hướng về phía Mặt Trời ở 22/6, quay xa ở 22/12.
 const toward=(day:number)=>(ORBIT.cx-orbitPoint(day).x)*a.dx;
 assert.ok(toward(173)>0);assert.ok(toward(356)<0);
 for(const d of dates){const p=orbitPoint(d.day);assert.ok(p.x>=20&&p.x<=380&&p.y>=20&&p.y<=200,`${d.label} nằm trong khung`);}
});

test('Tr. 14 · Vĩ tuyến chia ngày/đêm khớp số giờ ban ngày',()=>{
 for(const lat of [0,21,-34,66])for(const d of [1,80,173,266,356]){
  const s=parallelSplit(d,lat);assert.ok(Math.abs(s.halfDay*2/15-dayLength(d,lat))<1e-9);assert.equal(s.decl,declination(d));
 }
 for(const d of [1,173,356])assert.equal(parallelSplit(d,0).halfDay,90);
 assert.equal(dayLengthAt(0,21),12);
});

test('Tr. 16 · Bầu trời 360° không bị lật gương',()=>{
 // Hệ Three.js tay phải: nhìn theo f, tay phải là f × lên.
 const right=(f:number[])=>[f[1]*0-f[2]*1,f[2]*0-f[0]*0,f[0]*1-f[1]*0];
 const dot=(a:number[],b:number[])=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
 const south=[0,0,1],north=[0,0,-1];
 // Hà Nội 22/6: nhìn hướng Nam, Mặt Trời buổi sáng ở bên trái (Đông), buổi chiều bên phải (Tây).
 assert.ok(dot(skyVector(173,21,9),right(south))<0);assert.ok(dot(skyVector(173,21,15),right(south))>0);
 // Sydney 22/12: Mặt Trời trưa ở phía Bắc; nhìn hướng Bắc, sáng ở bên phải (Đông).
 assert.ok(dot(skyVector(356,-34,12),north)>0);assert.ok(dot(skyVector(356,-34,9),right(north))>0);
 // Hà Nội 22/6 mọc lệch về phía Bắc (−z).
 const r=skyVector(173,21,12-dayLength(173,21)/2);assert.ok(r[0]>0&&r[2]<0);
});
