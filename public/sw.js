// Học offline: lưu sẵn khung sách + dữ liệu; ảnh, mô hình 3D, mã JS/CSS (tên có mã băm) lưu dần khi em mở tới.
// Trang chính và data/*.json: lấy mạng trước để luôn có bản mới, mất mạng thì dùng bản đã lưu.
const CACHE='gmbm-1.7.0';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','data/questions.json','data/config.json','data/resources.json','data/hints.json','assets/A01.webp','assets/A02.webp','assets/E05.webp','assets/B01.webp','assets/B02.webp','assets/B03.webp','assets/B04.webp','assets/B05.webp'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('gmbm-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// Lần mở đầu tiên: trang gửi danh sách tệp đã tải (trước khi sw kịp điều khiển) để lưu luôn.
self.addEventListener('message',e=>{const urls=(e.data&&e.data.cache||[]).filter(u=>{try{return new URL(u).origin===location.origin}catch{return false}});e.waitUntil(caches.open(CACHE).then(c=>Promise.all(urls.map(u=>c.match(u,{ignoreVary:true}).then(h=>h||c.add(u).catch(()=>{})))))) ;});
const put=(req,res)=>{if(res.ok&&res.type==='basic'){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));}return res;};
self.addEventListener('fetch',e=>{const req=e.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==location.origin||req.headers.has('range'))return;
 const fresh=req.mode==='navigate'||url.pathname.includes('/data/');
 if(fresh){e.respondWith(fetch(req).then(r=>put(req,r)).catch(()=>caches.match(req,{ignoreSearch:true,ignoreVary:true}).then(r=>r||caches.match('./'))));return;}
 e.respondWith(caches.match(req,{ignoreVary:true}).then(hit=>hit||fetch(req).then(r=>put(req,r))));});
