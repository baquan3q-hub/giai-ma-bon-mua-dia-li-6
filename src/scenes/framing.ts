// Khung nhìn của mô hình quỹ đạo (tr. 6). Hàm thuần, chỉ dùng toán của Three.js nên chạy được trong test.
import {PerspectiveCamera,Vector3} from 'three';
import {orbitPosition} from '../science/earth';
// Phóng đại (không theo tỉ lệ thật): Trái Đất ×K, Mặt Trời ×SUN; camera nhìn chếch ELEV độ như Hình 1 SGK.
export const K=2.6,SUN=2.6,EARTH_R=.43*K,ELEV=25*Math.PI/180,FOV=22;
// Vị trí camera vừa đủ thấy cả quỹ đạo với tỉ lệ khung aspect = rộng / cao.
export function overview(aspect:number){
 const dir=new Vector3(0,Math.sin(ELEV),Math.cos(ELEV)),cam=new PerspectiveCamera(FOV,Math.max(.5,aspect),.05,400);
 // Các điểm phải nằm trong khung: mép Trái Đất trên cả quỹ đạo và đỉnh Mặt Trời.
 const pts:Vector3[]=[new Vector3(0,.6*SUN,0)];for(let d=1;d<=365;d+=5){const e=new Vector3(...orbitPosition(d));for(const o of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]])pts.push(e.clone().add(new Vector3(...o).multiplyScalar(EARTH_R)));}
 const fits=(d:number)=>{cam.position.copy(dir).multiplyScalar(d);cam.lookAt(0,0,0);cam.updateMatrixWorld(true);return pts.every(p=>{const q=p.clone().project(cam);return Math.abs(q.x)<=.985&&Math.abs(q.y)<=.95;});};
 let lo=4,hi=200;for(let i=0;i<40;i++){const m=(lo+hi)/2;if(fits(m))hi=m;else lo=m;}
 return dir.multiplyScalar(hi);
}
// Nhìn gần: cạnh Trái Đất, lệch về phía Mặt Trời chiếu để thấy cả đường sáng – tối.
export function closeView(earth:Vector3){
 const toSun=earth.clone().negate().normalize(),side=new Vector3().crossVectors(toSun,new Vector3(0,1,0)).normalize();
 return earth.clone().add(toSun.multiplyScalar(.55).add(side.multiplyScalar(.8)).add(new Vector3(0,.3,0)).normalize().multiplyScalar(EARTH_R/(.55*Math.tan(FOV/2*Math.PI/180))));
}
// Tỉ lệ đường kính Trái Đất so với chiều cao khung (0–1).
export function earthShare(camera:PerspectiveCamera,earth:Vector3){
 camera.updateMatrixWorld(true);const up=new Vector3(0,1,0).applyQuaternion(camera.quaternion).multiplyScalar(EARTH_R);
 const a=earth.clone().project(camera),b=earth.clone().add(up).project(camera);return Math.abs(b.y-a.y);
}
export function cameraFor(aspect:number,day:number,close=false){
 const cam=new PerspectiveCamera(FOV,aspect,.05,150),e=new Vector3(...orbitPosition(day));
 if(close){cam.position.copy(closeView(e));cam.lookAt(e);}else{cam.position.copy(overview(aspect));cam.lookAt(0,0,0);}
 cam.updateProjectionMatrix();return {cam,e};
}
