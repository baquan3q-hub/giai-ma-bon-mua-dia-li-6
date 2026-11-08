let busy=false;
export const isTurning=()=>busy;
function snapshot(book:HTMLElement,width:number,height:number){const copy=book.cloneNode(true) as HTMLElement;copy.removeAttribute('id');copy.querySelectorAll('[id]').forEach(e=>e.removeAttribute('id'));copy.querySelectorAll('canvas').forEach(c=>{const img=document.createElement('img');img.src=import.meta.env.BASE_URL+'assets/textures/earth-day.jpg';img.alt='';img.style.cssText='width:100%;height:100%;object-fit:cover;opacity:.6';c.replaceWith(img);});copy.querySelectorAll('button,input,select,textarea,a').forEach(el=>el.setAttribute('tabindex','-1'));copy.style.cssText+=`;width:${width}px;min-height:${height}px;height:${height}px;max-width:none;box-shadow:none;animation:none;position:absolute;top:0;`;copy.setAttribute('aria-hidden','true');copy.inert=true;return copy;}
export function turnBook(update:()=>void,direction:1|-1,reduced:boolean){
 if(busy)return false;const old=document.querySelector<HTMLElement>('.book');
 if(!old||reduced){update();return true;}
 const rect=old.getBoundingClientRect(),spread=old.classList.contains('spread');
 const front=snapshot(old,rect.width,rect.height);busy=true;update();
 const current=document.querySelector<HTMLElement>('.book');if(!current){busy=false;return true;}
 current.dataset.flipDirection=direction===1?'forward':'backward';current.dataset.flipState='flipping';const back=snapshot(current,rect.width,rect.height),container=document.createElement('div');
 container.className='flip-stage';container.setAttribute('aria-hidden','true');container.inert=true;
 container.style.cssText=`position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;perspective:1800px;z-index:90;pointer-events:none;`;
 const leaf=document.createElement('div');leaf.className='turning-leaf';const half=spread?rect.width/2:rect.width;
 leaf.style.cssText=`position:absolute;top:0;${direction===1?'right':'left'}:0;width:${half}px;height:${rect.height}px;transform-style:preserve-3d;transform-origin:${direction===1?'left':'right'} center;`;
 const face=(side:'front'|'back',copy:HTMLElement)=>{const panel=document.createElement('div');panel.className=`leaf-face leaf-${side}`;panel.style.cssText=`position:absolute;inset:0;overflow:hidden;backface-visibility:hidden;background:#f6f3eb;${side==='back'?'transform:rotateY(180deg);':''}`;copy.style.left=spread?((side==='front'&&direction===1)||(side==='back'&&direction===-1)?`-${half}px`:'0'):'0';panel.append(copy);const sheen=document.createElement('div');sheen.className='leaf-sheen';panel.append(sheen);return panel;};
 leaf.append(face('front',front),face('back',back));container.append(leaf);document.body.append(container);
 const finish=()=>{container.remove();current.dataset.flipState='read';busy=false;};
 if(typeof leaf.animate==='function'){
  const animation=leaf.animate([{transform:'rotateY(0deg)'},{transform:`rotateY(${direction===1?-75:75}deg)`,offset:.48},{transform:`rotateY(${direction===1?-180:180}deg)`}],{duration:900,easing:'cubic-bezier(.22,.65,.2,1)',fill:'forwards'});
  animation.finished.catch(()=>{}).finally(finish);
 }else{leaf.classList.add(direction===1?'css-flip-next':'css-flip-prev');setTimeout(finish,930);}
 return true;
}
