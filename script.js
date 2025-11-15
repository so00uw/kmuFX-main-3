const STAGE_W = 1920, STAGE_H = 1080;

function fitStage() {
  const STAGE_W = 1920;
  const STAGE_H = 1080;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const s = Math.min(vw / STAGE_W, vh / STAGE_H);
  const stage = document.getElementById('stage');

  // 순서 바꿈: scale 먼저 → translate 나중
  stage.style.transform = `scale(${s}) translate(-50%, -50%)`;

}
window.addEventListener('load', fitStage);
window.addEventListener('resize', fitStage);




function makeDraggable(win){
  const title = win.querySelector('.win-title'); if(!title) return;
  let sx=0, sy=0, ox=0, oy=0, dragging=false;
  title.addEventListener('mousedown', (e)=>{
    dragging=true; sx=e.clientX; sy=e.clientY;
    // 화면좌표→스테이지 좌표 환산(스케일 보정)
    const vw=innerWidth, vh=innerHeight, s=Math.min(vw/STAGE_W, vh/STAGE_H);
    const r=win.getBoundingClientRect();
    ox=(r.left-(vw-STAGE_Ws)/2)/s; oy=(r.top-(vh-STAGE_Hs)/2)/s;
    document.body.style.cursor='move';
  });
  addEventListener('mousemove', (e)=>{
    if(!dragging) return;
    const s=Math.min(innerWidth/STAGE_W, innerHeight/STAGE_H);
    win.style.left = Math.round(ox+(e.clientX-sx)/s)+'px';
    win.style.top  = Math.round(oy+(e.clientY-sy)/s)+'px';
  });
  addEventListener('mouseup', ()=>{ dragging=false; document.body.style.cursor='default'; });
}

async function loadWindows(list){
  const host = document.getElementById('layer-windows');
  for(const name of list){
    const res = await fetch(`components/window${name}.html`);
    const html = await res.text();
    const wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
    const win = wrap.firstElementChild;
    host.appendChild(win);
    makeDraggable(win);
  }
}

/* 이 배열만 수정하면 어떤 창을 띄울지 제어 (a~o 중 필요한 것) */
addEventListener('load', ()=>{
  loadWindows(['a','b','c']); // ← 여기서 c 포함해서 필요한 창들 나열
});