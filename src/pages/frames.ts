// Icon giao diện dùng chung. Lời Sao Mai từng trang nằm trong src/content/book.ts (trường say).
// Icon SVG là bản tạm; khi có bộ ảnh J01–J12 thì thay trong hàm icon().
const paths:Record<string,string>={
 list:'<path d="M4 6h16M4 12h16M4 18h10"/>',
 sound:'<path d="M4 9v6h4l5 4V5L8 9H4zM16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>',
 mute:'<path d="M4 9v6h4l5 4V5L8 9H4zM16.5 9.5l4.5 5M21 9.5l-4.5 5"/>',
 listen:'<path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1z"/>',
 settings:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
 expand:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 play:'<path d="M8 5l11 7-11 7z"/>',
 reset:'<path d="M4.5 12a7.5 7.5 0 1 0 2.6-5.7M4 4v5h5"/>',
 tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
 chart:'<path d="M5 20V11M12 20V4M19 20v-6"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
 film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9.5v5l4.5-2.5z"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
 hot:'<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0zM12 9v8"/>',
 cold:'<path d="M10 14V5a2 2 0 0 1 4 0v9a4 4 0 1 1-4 0zM12 15v2"/>',
 next:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21M8 10.5h5M10.5 8v5"/>',
 more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
 teacher:'<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20l4-4 4 4"/>'
};
export const icon=(name:string)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]??''}</svg>`;

export const tool=(name:string,label:string,action:string,extra='')=>`<button type="button" class="fr-tool" data-action="${action}" ${extra}>${icon(name)}<span>${label}</span></button>`;
