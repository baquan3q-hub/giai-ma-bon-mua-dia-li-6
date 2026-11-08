import sharp from 'sharp';
import {readdir,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const originals=path.resolve(app,'../anh-goc'),dest=path.join(app,'public/assets');
await mkdir(dest,{recursive:true});
const rows=['id,file,width,height,alpha,web_bytes'];
for(const category of await readdir(originals,{withFileTypes:true})){
 if(!category.isDirectory())continue;
 for(const file of await readdir(path.join(originals,category.name))){
  if(!file.endsWith('.png'))continue;
  const id=file.replace('.png',''),input=path.join(originals,category.name,file);
  const metadata=await sharp(input).metadata();
  const buffer=await sharp(input).resize({width:id.startsWith('B')?1800:id.startsWith('C')?1000:600,withoutEnlargement:true}).webp({quality:id.startsWith('B')?82:86,alphaQuality:100}).toBuffer();
  await writeFile(path.join(dest,`${id}.webp`),buffer);
  rows.push([id,`anh-goc/${category.name}/${file}`,metadata.width,metadata.height,!!metadata.hasAlpha,buffer.length].join(','));
 }
}
await writeFile(path.resolve(app,'../tai-lieu/danh-muc-anh.csv'),'\ufeff'+rows.join('\n'),'utf8');
console.log(`Tối ưu ${rows.length-1} ảnh, giữ nguyên bản gốc.`);
