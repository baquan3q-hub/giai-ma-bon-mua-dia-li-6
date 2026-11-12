import {test} from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,readdirSync,statSync} from 'node:fs';
const src=JSON.parse(readFileSync('public/data/asset-sources.json','utf8'));
test('Mọi file mô hình/texture đều có mục nguồn và giấy phép',()=>{
 const listed=new Set<string>([src.earthModel.file,...src.textures.files.map((f:string)=>src.textures.directory+f),...src.textures.derivedFiles.map((f:string)=>src.textures.directory+f),...src.openAssets.flatMap((a:any)=>a.files)]);
 const onDisk=['models','textures'].flatMap(d=>readdirSync(`public/assets/${d}`).map(f=>`assets/${d}/${f}`));
 for(const f of onDisk)assert.ok(listed.has(f),`${f} chưa có nguồn trong asset-sources.json`);
 for(const f of listed)assert.ok(onDisk.includes(f),`${f} có trong nguồn nhưng không có file`);
 for(const a of src.openAssets){for(const k of ['credit','source','license','licenseURL','changes'])assert.ok(a[k],`${a.id} thiếu ${k}`);assert.ok(!/^https?:/.test(a.files[0]),'không hotlink');}
});
test('Tài nguyên nguồn mở thêm ở v1.3 không quá 3 MB',()=>{
 const bytes=src.openAssets.flatMap((a:any)=>a.files).reduce((s:number,f:string)=>s+statSync('public/'+f).size,0);
 assert.ok(bytes<=3*1024*1024,`${bytes} byte`);
});
