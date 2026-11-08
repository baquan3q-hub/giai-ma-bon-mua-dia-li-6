import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export function addRealisticSurfaces(globe:THREE.Mesh,sun:THREE.Mesh,host:HTMLElement,low:boolean,isDisposed:()=>boolean,track:(t:THREE.Texture)=>void){
 const base=import.meta.env.BASE_URL,loader=new THREE.TextureLoader();
 const note=document.createElement('div');note.className='world-model-credit';note.textContent='Bề mặt: Solar System Scope · CC BY 4.0';host.append(note);
 let clouds:THREE.Mesh|undefined,loadedNASA=false;
 const releaseObject=(root:THREE.Object3D)=>root.traverse(o=>{if(o instanceof THREE.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value instanceof THREE.Texture)value.dispose();m.dispose();}}});
 async function texture(name:string,color=true){const t=await loader.loadAsync(`${base}assets/textures/${name}.jpg`);if(isDisposed()){t.dispose();throw Error('Scene disposed');}if(color)t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;track(t);return t;}
 void Promise.all([texture('earth-day'),texture('earth-night'),texture('earth-clouds',false)]).then(([day,night,cloud])=>{
  if(isDisposed())return;
  if(!loadedNASA){const old=globe.material as THREE.Material;globe.material=new THREE.MeshStandardMaterial({map:day,emissiveMap:night,emissive:'#ffffff',emissiveIntensity:.16,roughness:.85,metalness:.03});old.dispose();}
  clouds=new THREE.Mesh(new THREE.SphereGeometry(.442,low?32:64,low?16:32),new THREE.MeshStandardMaterial({alphaMap:cloud,color:'#ffffff',transparent:true,opacity:.55,depthWrite:false,roughness:1}));globe.add(clouds);
 }).catch(()=>{});
 void texture('sun').then(t=>{if(isDisposed())return;const old=sun.material as THREE.Material;sun.material=new THREE.MeshBasicMaterial({map:t,color:'#ffffff'});old.dispose();}).catch(()=>{});
 if(!low)void new GLTFLoader().loadAsync(`${base}assets/models/earth-nasa.glb`).then(gltf=>{
  if(isDisposed()){releaseObject(gltf.scene);return;}
  const bounds=new THREE.Box3().setFromObject(gltf.scene),center=bounds.getCenter(new THREE.Vector3()),size=bounds.getSize(new THREE.Vector3());
  const group=new THREE.Group();gltf.scene.position.sub(center);group.add(gltf.scene);group.scale.setScalar(.43/(Math.max(size.x,size.y,size.z)/2));
  gltf.scene.traverse(o=>{if(o instanceof THREE.Mesh){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>{for(const v of Object.values(m))if(v instanceof THREE.Texture)track(v);});}});
  const old=globe.material as THREE.Material;globe.material=new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false});old.dispose();globe.add(group);loadedNASA=true;host.dataset.model='nasa-vtad';note.textContent='Mô hình: NASA VTAD · Bề mặt bổ sung: Solar System Scope / CC BY 4.0';
 }).catch(()=>{if(!isDisposed())host.dataset.model='textured-sphere';});
 const atmosphere=new THREE.Mesh(new THREE.SphereGeometry(.465,32,24),new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.BackSide,blending:THREE.AdditiveBlending,vertexShader:'varying vec3 n; varying vec3 v; void main(){vec4 p=modelViewMatrix*vec4(position,1.0);n=normalize(normalMatrix*normal);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n; varying vec3 v; void main(){float rim=pow(1.0-abs(dot(normalize(n),normalize(v))),3.0);gl_FragColor=vec4(0.12,0.46,0.95,rim*0.6);}'}));globe.add(atmosphere);
 return {tick(dt:number){if(clouds)clouds.rotation.y+=dt*.025;}};
}
