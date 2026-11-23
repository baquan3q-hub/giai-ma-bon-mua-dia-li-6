import {test} from 'node:test';import assert from 'node:assert/strict';
import {Vector3} from 'three';
import {cameraFor,earthShare,EARTH_R,SUN,K} from '../src/scenes/framing';
import {orbitPosition} from '../src/science/earth';
const DAYS=[80,173,266,356];
// Tỉ lệ khung của ô mô hình đo được ở 360×800, 390×844, 768×1024 và 1366×900.
const ASPECTS=[1.36,1.44,1.9,2.3];
test('Mô hình quỹ đạo: Trái Đất chiếm ≥ 25% chiều cao khung, nhìn gần ≥ 45%',()=>{
 for(const a of ASPECTS)for(const d of DAYS){
  const o=cameraFor(a,d);assert.ok(earthShare(o.cam,o.e)>=.25,`toàn cảnh, khung ${a}, ngày ${d}: ${(earthShare(o.cam,o.e)*100).toFixed(1)}%`);
  const c=cameraFor(a,d,true);assert.ok(earthShare(c.cam,c.e)>=.45,`nhìn gần, khung ${a}, ngày ${d}`);}
});
test('Mô hình quỹ đạo: thấy trọn quỹ đạo, Mặt Trời vẫn lớn hơn Trái Đất, không chạm nhau',()=>{
 assert.ok(.6*SUN>EARTH_R,'Mặt Trời phải to hơn Trái Đất');
 assert.ok(3.8*(1-.0167)-.6*SUN-EARTH_R>1,'khe giữa Mặt Trời và Trái Đất');
 for(const a of ASPECTS){const {cam}=cameraFor(a,173);cam.updateMatrixWorld(true);
  for(let d=1;d<=365;d+=4){const e=new Vector3(...orbitPosition(d));for(const off of [[EARTH_R,0,0],[-EARTH_R,0,0],[0,EARTH_R,0],[0,-EARTH_R,0]] as const){const p=e.clone().add(new Vector3(...off)).project(cam);assert.ok(Math.abs(p.x)<=1.001&&Math.abs(p.y)<=1.001,`khung ${a}, ngày ${d} ra ngoài khung`);}}}
 assert.equal(K,2.6);
});
if(process.env.BAO_CAO)for(const a of ASPECTS)console.log(`khung ${a}: toàn cảnh ${DAYS.map(d=>{const o=cameraFor(a,d);return (earthShare(o.cam,o.e)*100).toFixed(0)+'%';}).join(' ')} · nhìn gần ${DAYS.map(d=>{const o=cameraFor(a,d,true);return (earthShare(o.cam,o.e)*100).toFixed(0)+'%';}).join(' ')}`);
