// Mốc 4 · Xử lý tài nguyên nguồn mở (bản gốc giữ trong ../anh-goc/, nguồn ghi ở public/data/asset-sources.json).
// 1) Dải chân trời 360° từ ảnh toàn cảnh CC0 Poly Haven "Round Platform": cắt từ +30° xuống đáy, trời → trong suốt
//    để màu trời vẫn do ứng dụng tính theo độ cao Mặt Trời.
// 2) Hai bản đồ nhiệt độ không khí bề mặt tháng 1 / tháng 7 (NASA AIRS qua GIBS) + thang màu.
import sharp from 'sharp';
const SRC='../anh-goc';
{
 const W=4096,H=2048,TOP=30,y0=Math.round((90-TOP)/180*H);
 const {data,info}=await sharp(`${SRC}/textures/round_platform-polyhaven-original.jpg`).resize(W,H).extract({left:0,top:y0,width:W,height:H-y0}).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const h=info.height,hz=H/2-y0,o=Buffer.alloc(W*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<W;x++){
  const i=(y*W+x)*3,j=(y*W+x)*4,r=data[i],g=data[i+1],b=data[i+2];let a=255;
  if(y<hz+6){const L=.299*r+.587*g+.114*b,sat=Math.max(r,g,b)-Math.min(r,g,b);const sky=Math.min(1,Math.max(0,(L-120)/45))*(sat<70?1:.3);a=Math.round(255*(1-sky)*Math.min(1,y/(hz*.35)));}
  o[j]=r;o[j+1]=g;o[j+2]=b;o[j+3]=a;
 }
 await sharp(o,{raw:{width:W,height:h,channels:4}}).webp({quality:72,alphaQuality:80,effort:6}).toFile('public/assets/textures/horizon-band.webp');
 if(process.argv.includes('--preview'))await sharp(o,{raw:{width:W,height:h,channels:4}}).flatten({background:'#e0457b'}).resize(1600).png().toFile(`${SRC}/textures/horizon-band-preview.png`);
 console.log('horizon-band.webp',W,'x',h,'· chân trời ở hàng',hz,'· góc trên',TOP+'°');
}
for(const m of ['01','07'])await sharp(`${SRC}/nasa/airs-tair-2024-${m}.png`).resize(1024,512).webp({quality:80}).toFile(`public/assets/textures/nasa-tair-2024-${m}.webp`);
// Chỉ lấy dải màu của thang (bỏ chữ Kelvin gốc); nhãn °C tiếng Việt do trang tự ghi.
await sharp(`${SRC}/nasa/airs-tair-legend.png`).extract({left:33,top:33,width:356,height:19}).webp({quality:90}).toFile('public/assets/textures/nasa-tair-scale.webp');
console.log('Đã tạo 2 bản đồ nhiệt độ NASA và thang màu.');
