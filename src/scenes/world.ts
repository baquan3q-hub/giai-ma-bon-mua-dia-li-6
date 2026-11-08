import {earthFrame} from './earth-frame';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {VRButton} from 'three/addons/webxr/VRButton.js';
import {axisVector,orbitPosition,rad,solarDirection,daylightPath,dateLabel,hours,dayLength} from '../science/earth';
type State={day:number;lat:number;time:number};
type Kind='orbit'|'observatory'|'sky';
type Options={quality:'high'|'low';reduced:boolean;onSeen:(id:string)=>void};
export function createScene(host:HTMLElement,kind:Kind,initial:State,options:Options){
 const abort=new AbortController(),signal=abort.signal;
 const renderer=new THREE.WebGLRenderer({antialias:options.quality==='high',alpha:false});
 renderer.setPixelRatio(Math.min(devicePixelRatio,options.quality==='high'?1.7:1));
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 renderer.domElement.setAttribute('aria-label',kind==='sky'?'Cảnh bầu trời mô phỏng 360 độ':'Mô phỏng Trái Đất quanh Mặt Trời');
 renderer.domElement.tabIndex=0;renderer.xr.enabled=true;
 host.replaceChildren(renderer.domElement);host.classList.add('world-host');
 const scene=new THREE.Scene();scene.background=new THREE.Color('#09182e');
 const camera=new THREE.PerspectiveCamera(48,1,0.05,150);camera.position.set(0,6,9);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=3;controls.maxDistance=22;controls.maxPolarAngle=Math.PI*0.86;
 const low=options.quality==='low',detail=low?24:48;
 scene.add(new THREE.AmbientLight('#56758a',0.4));scene.add(new THREE.HemisphereLight('#cde6ff','#061124',0.7));
 const textures:THREE.Texture[]=[];
 const mat=(color:THREE.ColorRepresentation,metalness=0)=>new THREE.MeshStandardMaterial({color,metalness,roughness:0.55});
 const sphere=(r:number,material:THREE.Material)=>new THREE.Mesh(new THREE.SphereGeometry(r,detail,detail/2),material);
 // Scientific geometry is separate from decorative AI illustrations.
 const sun=sphere(0.6,new THREE.MeshBasicMaterial({color:'#ffc45b'}));scene.add(sun);
 const halo=sphere(0.69,new THREE.MeshBasicMaterial({color:'#f8ad38',transparent:true,opacity:0.10,side:THREE.BackSide}));scene.add(halo);
 const sunlight=new THREE.PointLight('#fff4db',50,0,1);scene.add(sunlight);
 const earth=earthFrame();const earthRoot=earth.root,tilted=earth.tilted,axis=earth.axis;scene.add(earthRoot);
 const globe=sphere(0.43,mat('#2E86DE',0.15));tilted.add(globe);
 const grid=new THREE.Group();globe.add(grid);
 for(const lat of [-66.56,-23.44,0,23.44,66.56]){const p:THREE.Vector3[]=[];const y=.435*Math.sin(rad(lat)),r=.435*Math.cos(rad(lat));for(let a=0;a<=96;a++)p.push(new THREE.Vector3(r*Math.cos(a/96*Math.PI*2),y,r*Math.sin(a/96*Math.PI*2)));grid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p),new THREE.LineBasicMaterial({color:lat===0?'#f2e1b5':'#a3cce3',transparent:true,opacity:lat===0?1:.5})));}
 for(let lon=0;lon<180;lon+=30){const p:THREE.Vector3[]=[];for(let a=0;a<=96;a++){const theta=a/96*2*Math.PI;p.push(new THREE.Vector3(.435*Math.cos(theta)*Math.cos(rad(lon)),.435*Math.sin(theta),.435*Math.cos(theta)*Math.sin(rad(lon))));}grid.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p),new THREE.LineBasicMaterial({color:'#8acbd7',transparent:true,opacity:.3})));}
 const pole=new THREE.Line(new THREE.BufferGeometry().setFromPoints([axis.clone().multiplyScalar(-.9),axis.clone().multiplyScalar(.9)]),new THREE.LineBasicMaterial({color:'#ffde83'}));earthRoot.add(pole);
 const north=sphere(.035,new THREE.MeshBasicMaterial({color:'#fff5d6'}));north.position.copy(axis.clone().multiplyScalar(.9));earthRoot.add(north);
 const orbitPoints=[];for(let d=1;d<=366;d++)orbitPoints.push(new THREE.Vector3(...orbitPosition(d)));const orbit=new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPoints),new THREE.LineBasicMaterial({color:'#c49c59',transparent:true,opacity:.7}));scene.add(orbit);
 const orbitPlane=new THREE.GridHelper(10,10,'#24395a','#152945');orbitPlane.position.y=-.03;scene.add(orbitPlane);
 const starsGeo=new THREE.BufferGeometry();const starPoints=[];for(let i=0;i<700;i++){const t=i*2.39996323,u=1-2*(i+.5)/700,r=40;starPoints.push(r*Math.sqrt(1-u*u)*Math.cos(t),r*u,r*Math.sqrt(1-u*u)*Math.sin(t));}starsGeo.setAttribute('position',new THREE.Float32BufferAttribute(starPoints,3));const stars=new THREE.Points(starsGeo,new THREE.PointsMaterial({color:'#b1d4f1',size:.045}));scene.add(stars);
 if(kind==='observatory'){
  const floor=new THREE.Mesh(new THREE.CircleGeometry(15,64),mat('#15243b',.4));floor.rotation.x=-Math.PI/2;floor.position.y=-1.1;scene.add(floor);
  for(let i=0;i<8;i++){const theta=i*Math.PI/4;const arch=new THREE.Mesh(new THREE.TorusGeometry(13,.09,8,64,Math.PI),mat('#ae7e39',.7));arch.rotation.y=theta;arch.position.y=-1.1;scene.add(arch);}
  const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(5,5.2,.35,64),mat('#20364b',.5));pedestal.position.y=-.85;scene.add(pedestal);
 }
 const skySun=sphere(.65,new THREE.MeshBasicMaterial({color:'#fff1ae'}));const skyPath=new THREE.Line(new THREE.BufferGeometry(),new THREE.LineBasicMaterial({color:'#ffd375'}));
 const compass=new THREE.Group();
 function textSprite(text:string,color='#f5e9cc',w=512){const canvas=document.createElement('canvas');canvas.width=w;canvas.height=128;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#10233be8';ctx.fillRect(0,0,w,128);ctx.fillStyle=color;ctx.font='bold 32px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,w/2,64,w-20);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;textures.push(texture);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:true,transparent:true}));sp.scale.set(w/180,128/180,1);return sp;}
 if(kind==='sky'){
  for(const object of [sun,halo,earthRoot,orbit,orbitPlane])object.visible=false;
  sunlight.visible=false;const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120),mat('#234e49'));ground.rotation.x=-Math.PI/2;ground.position.y=-.05;scene.add(ground);scene.add(new THREE.HemisphereLight('#c9efff','#4d6c5b',2));
  for(let i=0;i<36;i++){const angle=i*Math.PI/18;const height=1+(i*7%9)*.28;const block=new THREE.Mesh(new THREE.BoxGeometry(1.2,height,1.2),mat(i%2?'#325864':'#517d83'));block.position.set(18*Math.sin(angle),height/2,18*Math.cos(angle));scene.add(block);}
  for(const [text,x,z]of [['BẮC',0,12],['ĐÔNG',12,0],['NAM',0,-12],['TÂY',-12,0]] as const){const sp=textSprite(text);sp.position.set(x,2,z);compass.add(sp);}scene.add(compass,skySun,skyPath);
 }
 const ui=document.createElement('div');ui.className='world-ui';host.append(ui);
 const mode=document.createElement('button');mode.textContent=kind==='sky'?'Kéo để nhìn quanh':'Khám phá mô hình';mode.className='world-mode';ui.append(mode);
 const status=document.createElement('div');status.className='world-status';status.setAttribute('role','status');ui.append(status);
 const detailBox=document.createElement('div');detailBox.className='world-detail';detailBox.hidden=true;ui.append(detailBox);
 const hint=document.createElement('div');hint.className='world-hint';hint.textContent='Kéo để nhìn quanh · Chạm điểm chú thích';ui.append(hint);
 let state={...initial},disposed=false,modelMode=kind==='orbit',yaw=0,pitch=0,lastDay=-1,lastLat=100,active:string|undefined;
 const defaultPos=kind==='sky'?new THREE.Vector3(0,1.65,0):kind==='observatory'?new THREE.Vector3(0,2.4,9):new THREE.Vector3(0,6,9);
 function reset(){camera.position.copy(defaultPos);controls.target.set(0,0,0);camera.lookAt(kind==='sky'?new THREE.Vector3(0,2,-12):new THREE.Vector3(0,0,0));const e=new THREE.Euler().setFromQuaternion(camera.quaternion,'YXZ');yaw=e.y;pitch=e.x;if(modelMode)controls.update();}
 reset();controls.enabled=modelMode;
 mode.addEventListener('click',()=>{if(kind==='sky')return;modelMode=!modelMode;controls.enabled=modelMode;mode.textContent=modelMode?'Nhìn quanh không gian':'Khám phá mô hình';if(!modelMode){const e=new THREE.Euler().setFromQuaternion(camera.quaternion,'YXZ');yaw=e.y;pitch=e.x;}}, {signal});
 type Marker={id:string;title:string;text:string;pos:()=>THREE.Vector3;el:HTMLButtonElement;sprite:THREE.Sprite};const markers:Marker[]=[];
 const addMarker=(id:string,title:string,text:string,pos:()=>THREE.Vector3)=>{const el=document.createElement('button');el.className='world-marker';el.textContent=title;el.setAttribute('aria-label',`Chú thích: ${title}`);host.append(el);const sprite=textSprite(title);sprite.scale.multiplyScalar(.45);scene.add(sprite);sprite.visible=false;const marker={id,title,text,pos,el,sprite};markers.push(marker);el.addEventListener('click',()=>select(marker),{signal});};
 function select(m:Marker){active=m.id;options.onSeen(m.id);detailBox.hidden=false;detailBox.textContent=m.text;detailBox.setAttribute('role','status');if(m.id==='axis'||m.id==='direction')pole.material.color.set('#ffffff');if(kind==='sky'){const times=daylightPath(state.day,state.lat);state.time=m.id==='rise'?times.rise:m.id==='set'?times.set:12;update(state);const slider=host.closest('dialog')?.querySelector<HTMLInputElement>('[data-input="time"]');if(slider){slider.value=String(state.time);slider.dispatchEvent(new Event('input',{bubbles:true}));}}}
 if(kind==='sky'){
  addMarker('rise','Mọc','Mặt Trời lên đường chân trời. Chạm để xem thời điểm mọc trong mô hình.',()=>new THREE.Vector3(...solarDirection(state.day,state.lat,daylightPath(state.day,state.lat).rise)).multiplyScalar(15).add(new THREE.Vector3(0,1.65,0)));
  addMarker('noon','Cao nhất','Giữa ngày theo giờ Mặt Trời địa phương; không nhất thiết là 12 giờ đồng hồ.',()=>new THREE.Vector3(...solarDirection(state.day,state.lat,12)).multiplyScalar(15).add(new THREE.Vector3(0,1.65,0)));
  addMarker('set','Lặn','Mặt Trời xuống dưới đường chân trời. So sánh khoảng thời gian từ mọc đến lặn.',()=>new THREE.Vector3(...solarDirection(state.day,state.lat,daylightPath(state.day,state.lat).set)).multiplyScalar(15).add(new THREE.Vector3(0,1.65,0)));
 }else{
  addMarker('sun','Mặt Trời','Nguồn ánh sáng và nhiệt của Trái Đất.',()=>new THREE.Vector3(0,.9,0));
  addMarker('orbit','Quỹ đạo','Quỹ đạo elip gần tròn. Kích thước các thiên thể đã được phóng đại để nhìn rõ.',()=>new THREE.Vector3(3.5,0,1));
  addMarker('axis','Trục nghiêng','66°33′ với mặt phẳng quỹ đạo; khoảng 23,44° với phương vuông góc.',()=>earthRoot.position.clone().add(axis.clone().multiplyScalar(1.1)));
  addMarker('direction','Giữ hướng','Đầu trục giữ cùng hướng trong không gian trong mô hình một năm. Đổi ngày để kiểm chứng.',()=>earthRoot.position.clone().add(new THREE.Vector3(0,-.8,0)));
  addMarker('year','Một năm','Một vòng quanh Mặt Trời mất khoảng 365 ngày 6 giờ.',()=>new THREE.Vector3(-1.7,0,3.4));
 }
 const raycaster=new THREE.Raycaster();const ndc=new THREE.Vector2();let down:{x:number;y:number;id:number}|undefined;
 renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,id:e.pointerId};renderer.domElement.setPointerCapture(e.pointerId);},{signal});
 renderer.domElement.addEventListener('pointermove',e=>{if(!down||e.pointerId!==down.id||modelMode||renderer.xr.isPresenting)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;yaw-=dx*.004;pitch=Math.max(-1.4,Math.min(1.4,pitch-dy*.004));camera.quaternion.setFromEuler(new THREE.Euler(pitch,yaw,0,'YXZ'));down.x=e.clientX;down.y=e.clientY;},{signal});
 const clearDown=()=>down=undefined;renderer.domElement.addEventListener('pointerup',clearDown,{signal});renderer.domElement.addEventListener('pointercancel',clearDown,{signal});
 renderer.domElement.addEventListener('keydown',e=>{if(modelMode)return;const keys:Record<string,[number,number]>={ArrowLeft:[.1,0],ArrowRight:[-.1,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]};if(keys[e.key]){e.preventDefault();e.stopPropagation();yaw+=keys[e.key][0];pitch=Math.max(-1.4,Math.min(1.4,pitch+keys[e.key][1]));camera.quaternion.setFromEuler(new THREE.Euler(pitch,yaw,0,'YXZ'));}},{signal});
 function update(s:State){state={...s};earth.move(s.day);status.textContent=kind==='sky'?`${s.lat<0?'Sydney':'Hà Nội'} · ${dateLabel(s.day)} · Ngày ${hours(dayLength(s.day,s.lat))}`:`${dateLabel(s.day)} · Trục giữ hướng`;
  if(kind==='sky'){
   skySun.position.set(...solarDirection(s.day,s.lat,s.time)).multiplyScalar(24).add(new THREE.Vector3(0,1.65,0));const brightness=Math.max(0,Math.min(1,(solarDirection(s.day,s.lat,s.time)[1]+.10)*2));scene.background=new THREE.Color('#071327').lerp(new THREE.Color('#75b7d2'),brightness);stars.material.opacity=1-brightness;stars.material.transparent=true;
   if(lastDay!==s.day||lastLat!==s.lat){const path=daylightPath(s.day,s.lat);const points=[];for(let i=0;i<=80;i++)points.push(new THREE.Vector3(...solarDirection(s.day,s.lat,path.rise+(path.set-path.rise)*i/80)).multiplyScalar(23).add(new THREE.Vector3(0,1.65,0)));skyPath.geometry.dispose();skyPath.geometry=new THREE.BufferGeometry().setFromPoints(points);lastDay=s.day;lastLat=s.lat;}
  }
 }
 update(state);
 const resize=new ResizeObserver(()=>{const w=host.clientWidth,h=Math.max(200,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(host);
 const clock=new THREE.Clock();const projected=new THREE.Vector3();let frame=0;
 renderer.setAnimationLoop(()=>{if(disposed||document.hidden)return;const dt=Math.min(clock.getDelta(),.05);if(!options.reduced)globe.rotation.y+=dt*.12;if(controls.enabled&&!renderer.xr.isPresenting)controls.update();
  const xr=renderer.xr.isPresenting;ui.hidden=xr;
  if(frame++%2===0)for(const marker of markers){const pos=marker.pos();marker.sprite.position.copy(pos);marker.sprite.visible=xr;projected.copy(pos).project(camera);let visible=!xr&&projected.z<1&&projected.z>-1&&Math.abs(projected.x)<.95&&Math.abs(projected.y)<.88;
   if(visible&&kind!=='sky'){const direction=pos.clone().sub(camera.position);const distance=direction.length();raycaster.set(camera.position,direction.normalize());const hits=raycaster.intersectObject(globe,true);if(hits[0]&&hits[0].distance<distance-.35)visible=false;}
   marker.el.hidden=!visible;marker.el.style.left=`${(projected.x*.5+.5)*100}%`;marker.el.style.top=`${(-projected.y*.5+.5)*100}%`;marker.el.classList.toggle('active',active===marker.id);
  }
  renderer.render(scene,camera);
 });
 // WebXR extension: feature-gated; actual headset acceptance remains pending.
 if('xr' in navigator&&kind!=='orbit'&&isSecureContext){const xr=(navigator as any).xr;void xr.isSessionSupported('immersive-vr').then((supported:boolean)=>{if(!supported||disposed)return;const vr=VRButton.createButton(renderer);vr.classList.add('vr-entry');host.append(vr);for(let i=0;i<2;i++){const controller=renderer.xr.getController(i);const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(0,0,-20)]),new THREE.LineBasicMaterial({color:'#f5d285'}));controller.add(line);controller.addEventListener('select',()=>{raycaster.setFromXRController(controller);const hits=raycaster.intersectObjects(markers.map(m=>m.sprite));const m=markers.find(m=>m.sprite===hits[0]?.object);if(m){select(m);const panel=textSprite(m.title+': '+m.text, '#ffffff',1600);panel.position.copy(camera.getWorldPosition(new THREE.Vector3())).add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(3));panel.scale.set(5,.4,1);scene.add(panel);setTimeout(()=>{scene.remove(panel);panel.material.dispose();},7000);}});scene.add(controller);}}).catch(()=>{});}
 async function gyro(){if(!isSecureContext){status.textContent='Cảm biến cần HTTPS. Em vẫn kéo tay để nhìn quanh được.';return;}if(!('DeviceOrientationEvent' in window)){status.textContent='Thiết bị không có cảm biến phù hợp. Hãy kéo tay.';return;}const Orientation=DeviceOrientationEvent as typeof DeviceOrientationEvent&{requestPermission?:()=>Promise<string>};try{if(Orientation.requestPermission&&await Orientation.requestPermission()!=='granted'){status.textContent='Chưa cấp quyền. Em vẫn dùng kéo tay được.';return;}modelMode=false;controls.enabled=false;const q1=new THREE.Quaternion(-Math.sqrt(.5),0,0,Math.sqrt(.5)),zee=new THREE.Vector3(0,0,1);let offset:THREE.Quaternion|undefined;window.addEventListener('deviceorientation',e=>{if(e.alpha===null||e.beta===null||e.gamma===null)return;const orientation=rad(screen.orientation?.angle??0);const raw=new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(e.beta),rad(e.alpha),-rad(e.gamma),'YXZ')).multiply(q1).multiply(new THREE.Quaternion().setFromAxisAngle(zee,-orientation));if(!offset)offset=camera.quaternion.clone().multiply(raw.clone().invert());camera.quaternion.copy(offset).multiply(raw);},{signal});status.textContent='Đã bật cảm biến. Dùng Đặt lại để về góc nhìn ban đầu.';}catch{status.textContent='Thiết bị không cấp quyền. Em vẫn dùng kéo tay được.';}}
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);status.textContent='Đồ hoạ bị gián đoạn. Đóng cảnh và mở lại, hoặc dùng danh sách chú thích 2D.';},{signal});
 function focus(id:string){const m=markers.find(m=>m.id===id);if(!m)return;select(m);controls.enabled=false;modelMode=false;camera.lookAt(m.pos());const e=new THREE.Euler().setFromQuaternion(camera.quaternion,'YXZ');yaw=e.y;pitch=e.x;}
 return {update,reset,gyro,focus,dispose(){disposed=true;abort.abort();resize.disconnect();controls.dispose();renderer.setAnimationLoop(null);scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line||o instanceof THREE.Points){o.geometry.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m.dispose());}});textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();host.replaceChildren();}};
}
