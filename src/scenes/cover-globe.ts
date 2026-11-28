// Trái Đất 3D trên bìa: ảnh bề mặt thật (ngày + ánh đèn ban đêm + mây), Mặt Trời chiếu từ bên trái.
// Trục nghiêng 23,5° ngả về phía Mặt Trời = ngày 22/6 (nửa cầu Bắc mùa hạ), khớp nội dung bài.
// Chạy offline: chỉ dùng ảnh trong public/assets/textures. Quay 5 giây rồi dừng (WCAG 2.2.2); kéo để xoay.
import * as THREE from 'three';

export interface CoverGlobe{dispose():void}
const TILT=23.44*Math.PI/180;

const surfaceVert=`varying vec2 vUv;varying vec3 vN;varying vec3 vView;
void main(){vUv=uv;vec4 w=modelMatrix*vec4(position,1.0);vN=normalize(mat3(modelMatrix)*normal);vView=normalize(cameraPosition-w.xyz);gl_Position=projectionMatrix*viewMatrix*w;}`;
// Nửa ngày: ảnh ngày + phản chiếu biển nhẹ; nửa đêm: ánh đèn thành phố; vạch sáng – tối ấm màu bình minh.
const surfaceFrag=`uniform sampler2D dayMap;uniform sampler2D nightMap;uniform vec3 sunDir;
varying vec2 vUv;varying vec3 vN;varying vec3 vView;
void main(){vec3 n=normalize(vN);float d=dot(n,sunDir);
 float lit=smoothstep(-0.12,0.18,d);
 vec3 day=texture2D(dayMap,vUv).rgb;
 vec3 night=texture2D(nightMap,vUv).rgb;night=pow(night,vec3(1.25))*vec3(2.2,1.7,1.1);
 float spec=pow(max(dot(reflect(-sunDir,n),vView),0.0),28.0)*0.35*(1.0-step(0.32,day.r+day.g));
 vec3 c=mix(night*0.9+vec3(0.006,0.01,0.03),day*(0.22+1.05*pow(max(d,0.0),0.7))+spec,lit);
 float band=exp(-pow((d-0.02)/0.045,2.0));c+=vec3(1.0,0.55,0.25)*band*0.12*(0.4+0.6*lit);
 gl_FragColor=vec4(c,1.0);}`;
const cloudFrag=`uniform sampler2D cloudMap;uniform vec3 sunDir;varying vec2 vUv;varying vec3 vN;varying vec3 vView;
void main(){float a=texture2D(cloudMap,vUv).r;float d=dot(normalize(vN),sunDir);float l=smoothstep(-0.1,0.3,d);
 gl_FragColor=vec4(vec3(1.0,0.97,0.93)*(0.08+0.92*l),a*mix(0.12,0.8,l));}`;
const atmoFrag=`uniform vec3 sunDir;varying vec3 vN;varying vec3 vView;
void main(){vec3 n=normalize(vN);float g=pow(max(-dot(n,normalize(vView)),0.0)*2.4,2.2);float l=smoothstep(-0.3,0.5,dot(n,sunDir));
 gl_FragColor=vec4(vec3(0.32,0.62,1.0)*g*(0.04+0.9*l),1.0);}`;

export function mountCoverGlobe(host:HTMLElement,opts:{reduced:boolean;low:boolean}):CoverGlobe{
 const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');
 const renderer=new THREE.WebGLRenderer({canvas,antialias:!opts.low,alpha:true,powerPreference:'low-power'});
 // Ảnh đã ở sRGB; giữ nguyên giá trị, không chuyển đổi lần nữa.
 renderer.outputColorSpace=THREE.LinearSRGBColorSpace;
 renderer.setPixelRatio(Math.min(devicePixelRatio,opts.low?1:2));
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(26,1,.1,50);camera.position.set(0,0,4.9);
 const sunDir=new THREE.Vector3(-1,.18,.55).normalize();
 const seg=opts.low?48:96;
 const tilted=new THREE.Group();tilted.rotation.z=TILT;scene.add(tilted);   // đầu Bắc ngả sang trái, về phía Mặt Trời
 const spin=new THREE.Group();spin.rotation.y=1.85;tilted.add(spin);           // mở đầu: Việt Nam ở phía sáng; quay 5 giây (tây → đông) thì Việt Nam ra giữa
 const base=import.meta.env.BASE_URL,loader=new THREE.TextureLoader(),textures:THREE.Texture[]=[];
 let pending=0;
 // Chỉ hiện canvas khi đủ ảnh bề mặt; trước đó ảnh tĩnh C01 vẫn ở chỗ cũ.
 const tex=(name:string)=>{pending++;const t=loader.load(`${base}assets/textures/${name}`,()=>{if(--pending===0&&!disposed)host.classList.add('is-3d');draw();});t.anisotropy=opts.low?1:8;textures.push(t);return t;};
 const uniforms={sunDir:{value:sunDir}};
 const earth=new THREE.Mesh(new THREE.SphereGeometry(1,seg,seg/2),new THREE.ShaderMaterial({vertexShader:surfaceVert,fragmentShader:surfaceFrag,uniforms:{...uniforms,dayMap:{value:tex('earth-day.jpg')},nightMap:{value:tex('earth-night.jpg')}}}));
 spin.add(earth);
 if(!opts.low){const clouds=new THREE.Mesh(new THREE.SphereGeometry(1.008,seg,seg/2),new THREE.ShaderMaterial({vertexShader:surfaceVert,fragmentShader:cloudFrag,transparent:true,depthWrite:false,uniforms:{...uniforms,cloudMap:{value:tex('earth-clouds.jpg')}}}));clouds.name='clouds';spin.add(clouds);}
 const atmo=new THREE.Mesh(new THREE.SphereGeometry(1.1,64,32),new THREE.ShaderMaterial({vertexShader:surfaceVert,fragmentShader:atmoFrag,uniforms,transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending}));
 scene.add(atmo);
 // Trục Bắc – Nam: nét mảnh, chỉ để gợi "trục nghiêng".
 const axis=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,-1.32,0),new THREE.Vector3(0,1.32,0)]),new THREE.LineBasicMaterial({color:'#FFD27A',transparent:true,opacity:.75}));tilted.add(axis);
 host.prepend(canvas);

 let raf=0,disposed=false,intro=opts.reduced?0:5,last=performance.now(),drag:{x:number;v:number}|undefined,velocity=0;
 function size(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;
  // Giữ quả cầu vừa khung theo chiều ngắn hơn.
  const fit=1.24/Math.tan(THREE.MathUtils.degToRad(camera.fov/2));camera.position.z=camera.aspect<1?fit/camera.aspect:fit;camera.updateProjectionMatrix();draw();}
 function draw(){if(!disposed)renderer.render(scene,camera);}
 function loop(now:number){raf=0;const dt=Math.min(.05,(now-last)/1000);last=now;
  if(intro>0){const k=Math.min(1,intro/5);spin.rotation.y+=dt*.32*k*k;intro-=dt;}
  if(!drag&&Math.abs(velocity)>.0005){spin.rotation.y+=velocity;velocity*=.93;}
  const clouds=spin.getObjectByName('clouds');if(clouds&&(intro>0||Math.abs(velocity)>.0005||drag))clouds.rotation.y+=dt*.01;
  draw();if(intro>0||drag||Math.abs(velocity)>.0005)raf=requestAnimationFrame(loop);}
 const wake=()=>{if(!raf&&!disposed){last=performance.now();raf=requestAnimationFrame(loop);}};
 const down=(e:PointerEvent)=>{drag={x:e.clientX,v:0};intro=0;velocity=0;host.setPointerCapture(e.pointerId);wake();};
 const move=(e:PointerEvent)=>{if(!drag)return;const dx=(e.clientX-drag.x)/host.clientWidth*3.2;drag.x=e.clientX;drag.v=dx;spin.rotation.y+=dx;if(opts.reduced)draw();};
 const up=()=>{if(!drag)return;velocity=opts.reduced?0:drag.v;drag=undefined;wake();};
 host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);
 const ro=new ResizeObserver(size);ro.observe(host);size();wake();
 return {dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(raf);ro.disconnect();
  host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',up);
  scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Line){o.geometry.dispose();(o.material as THREE.Material).dispose();}});
  textures.forEach(t=>t.dispose());renderer.dispose();renderer.forceContextLoss();canvas.remove();host.classList.remove('is-3d');}};
}
