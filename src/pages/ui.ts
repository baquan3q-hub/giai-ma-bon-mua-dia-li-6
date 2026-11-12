// Mảnh HTML dùng chung cho vỏ ứng dụng và nội dung trang.
export const base=import.meta.env.BASE_URL;
export const esc=(v:unknown)=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const img=(id:string,cls='',alt='')=>`<img class="${cls}" src="${base}assets/${id}.webp" alt="${alt}" ${cls==='cover-earth'?'fetchpriority="high"':'loading="lazy"'}>`;
export const btn=(label:string,action:string,cls='secondary',extra='')=>`<button type="button" class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
export const arrow='';
export const go=(label:string,p:number,cls='primary')=>btn(`${label} ${arrow}`,`go:${p}`,cls);
