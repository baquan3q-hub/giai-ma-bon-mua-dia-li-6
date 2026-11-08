// Orthographic globe from the attributed equirectangular Solar System Scope map.
import sharp from 'sharp';
const {data,info}=await sharp('public/assets/textures/earth-day.jpg').ensureAlpha().raw().toBuffer({resolveWithObject:true});
const size=600,out=Buffer.alloc(size*size*4),centerLongitude=20*Math.PI/180;
for(let py=0;py<size;py++)for(let px=0;px<size;px++){
 const x=(px+.5-size/2)/(size/2-2),y=-(py+.5-size/2)/(size/2-2),r=x*x+y*y;if(r>1)continue;
 const z=Math.sqrt(1-r),lon=Math.atan2(x,z)+centerLongitude,lat=Math.asin(y);
 const u=((lon/(2*Math.PI)+.5)%1+1)%1,v=.5-lat/Math.PI;
 const tx=Math.min(info.width-1,Math.max(0,Math.floor(u*info.width))),ty=Math.min(info.height-1,Math.max(0,Math.floor(v*info.height))),a=(ty*info.width+tx)*4,b=(py*size+px)*4,light=.55+.45*z;
 for(let c=0;c<3;c++)out[b+c]=Math.round(data[a+c]*light);out[b+3]=255;
}
await sharp(out,{raw:{width:size,height:size,channels:4}}).webp({quality:90,alphaQuality:100}).toFile('public/assets/textures/earth-globe.webp');
console.log('Created attributed orthographic globe thumbnail.');
