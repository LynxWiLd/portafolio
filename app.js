// Typing effect
const roles = [
  "Frontend Developer",
  "UX / UI Focus",
  "SaaS Builder",
  "CEO @ Estudio Camaleón",
  "React · Next.js · Node"
];
const el = document.getElementById("typing");
let ri = 0, ci = 0, del = false;
(function type(){
  const word = roles[ri];
  el.textContent = word.slice(0, ci);
  if(!del){ ci++; if(ci > word.length){ del = true; return setTimeout(type, 1400);} }
  else { ci--; if(ci === 0){ del = false; ri = (ri+1)%roles.length; } }
  setTimeout(type, del ? 32 : 62);
})();

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if(e.isIntersecting){ e.target.classList.add("visible"); io.unobserve(e.target); }
}), {threshold:.12});
document.querySelectorAll(".reveal").forEach(n => io.observe(n));

// Counters
const cio = new IntersectionObserver(es => es.forEach(e => {
  if(!e.isIntersecting) return;
  const n = e.target, t = +n.dataset.target; let c = 0;
  const step = Math.max(1, Math.round(t/90));
  (function tick(){ c += step; if(c >= t){ n.textContent = String(t).replace(/\B(?=(\d{3})+(?!\d))/g, "."); } else { n.textContent = c; requestAnimationFrame(tick);} })();
  cio.unobserve(n);
}), {threshold:.5});
document.querySelectorAll(".counter").forEach(n => cio.observe(n));

// Progress + nav + glow
const prog = document.getElementById("progress");
const glow = document.getElementById("cursor-glow");
addEventListener("scroll", () => {
  const h = document.documentElement;
  prog.style.width = (h.scrollTop/(h.scrollHeight-h.clientHeight)*100) + "%";
}, {passive:true});
addEventListener("pointermove", e => {
  glow.style.left = e.clientX+"px"; glow.style.top = e.clientY+"px";
}, {passive:true});

// Mobile menu
const btn = document.getElementById("menu-btn");
const mm = document.getElementById("mobile-menu");
btn.onclick = () => mm.classList.toggle("open");
mm.querySelectorAll("a").forEach(a => a.onclick = () => mm.classList.remove("open"));

// Tilt + spotlight (solo puntero fino: en táctil el arrastre del scroll lo haría temblar)
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
if(finePointer) document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
    card.style.transform = `perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-4px)`;
    card.style.setProperty("--mx", ((x+.5)*100)+"%");
    card.style.setProperty("--my", ((y+.5)*100)+"%");
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

// Magnetic buttons (solo puntero fino, por el mismo motivo)
if(finePointer) document.querySelectorAll(".magnetic").forEach(b => {
  b.addEventListener("pointermove", e => {
    const r = b.getBoundingClientRect();
    b.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.18}px)`;
  });
  b.addEventListener("pointerleave", () => b.style.transform = "");
});

// Project filters
document.querySelectorAll(".filter").forEach(f => f.onclick = () => {
  document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
  f.classList.add("active");
  const v = f.dataset.f;
  document.querySelectorAll("#projects-grid .project").forEach(p => {
    p.classList.toggle("hide", v !== "all" && !p.dataset.cat.includes(v));
  });
});

// Marquee duplicate for seamless loop
const track = document.getElementById("marquee-track");
track.innerHTML += track.innerHTML;

// Contribuciones en vivo desde data.json (lo actualiza la Action semanal)
fetch("data.json")
  .then(r => { if(!r.ok) throw 0; return r.json(); })
  .then(d => {
    const n = document.getElementById("contribuciones");
    if(n && d.contributions != null)
      n.textContent = String(d.contributions).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " contribuciones / año";
  })
  .catch(() => {});

// En táctil (sin hover), la foto alterna sola cada 4s mientras esté visible.
// Con click se alterna manualmente (p. ej. con reduced-motion, sin ciclo).
const photoWrap = document.querySelector(".photo-wrap");
if(photoWrap){
  const noHover = matchMedia("(hover: none)").matches;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(noHover && !reduceMotion){
    // Marca temporal en vez de flag: el tiempo siempre avanza, no puede atascarse.
    let timer = null, lastScroll = 0;
    // Pausa el ciclo mientras el usuario se está deslizando: el cambio
    // a mitad del scroll es lo que se veía raro.
    addEventListener("scroll", () => { lastScroll = Date.now(); }, {passive:true});
    const flip = () => { if(Date.now() - lastScroll > 1200) photoWrap.classList.toggle("show-alt"); };
    const start = () => { if(!timer) timer = setInterval(flip, 4000); };
    const stop = () => { clearInterval(timer); timer = null; };
    new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? start() : stop())).observe(photoWrap);
  } else if(noHover){
    photoWrap.addEventListener("click", () => photoWrap.classList.toggle("show-alt"));
  }
}

// Particles network
const cv = document.getElementById("particles"), ctx = cv.getContext("2d");
let W,H,pts=[];
function size(){ W=cv.width=innerWidth; H=cv.height=innerHeight;
  pts = Array.from({length: Math.min(70, W/18)}, () => ({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4}));
}
size(); addEventListener("resize", size);
(function loop(){
  ctx.clearRect(0,0,W,H);
  pts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1; if(p.y<0||p.y>H)p.vy*=-1;
    ctx.fillStyle="rgba(34,211,238,.7)"; ctx.fillRect(p.x,p.y,1.6,1.6);
  });
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
    const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
    if(d<130){ ctx.strokeStyle=`rgba(139,92,246,${(1-d/130)*.25})`; ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
  }
  requestAnimationFrame(loop);
})();

document.getElementById("to-top").onclick = e => { e.preventDefault(); scrollTo({top:0,behavior:"smooth"}); };
