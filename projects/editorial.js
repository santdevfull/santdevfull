// Presentation behavior — passive progress and navigation cues only.
// All content remains visible without JavaScript; no scroll hijacking or autoplay.
const root=document.documentElement;
let queued=false;
function updateProgress(){
 const max=root.scrollHeight-window.innerHeight;
 root.style.setProperty("--scroll-progress",String(max>0?Math.min(1,Math.max(0,window.scrollY/max)):0));
 queued=false;
}
window.addEventListener("scroll",()=>{
 if(queued)return;
 queued=true;
 requestAnimationFrame(updateProgress);
},{passive:true});
window.addEventListener("resize",updateProgress,{passive:true});
updateProgress();

if("IntersectionObserver" in window){
 const nav=[...document.querySelectorAll(".main-navigation a[href^='#']")];
 const map=new Map(nav.map(x=>[x.getAttribute("href").slice(1),x]));
 const observer=new IntersectionObserver(entries=>{
   const visible=entries.filter(x=>x.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
   if(visible.length){
     nav.forEach(x=>x.removeAttribute("aria-current"));
     map.get(visible[0].target.id)?.setAttribute("aria-current","location");
   }
 },{rootMargin:"-18% 0px -58% 0px",threshold:[0,.1,.4]});
 for(const section of document.querySelectorAll("main section[id]"))observer.observe(section);
}
