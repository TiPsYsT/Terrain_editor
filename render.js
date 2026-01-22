import { INCH, OBJECTIVE } from "./terrain-types.js";

/* ================= GRID ================= */

export function drawGrid(ctx, w, h) {
  const cols = 60, rows = 44;
  const midX = 30, midY = 22;

  ctx.strokeStyle = "#bbb";
  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";

  for (let i=0;i<=cols;i++){
    const x=i*INCH;
    ctx.lineWidth=i%10===0?2:0.5;
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke();
    const label=i<=midX?i:cols-i;
    if(i%5===0||i===midX){
      ctx.fillText(label,x+2,12);
      ctx.fillText(label,x+2,h-4);
    }
  }

  for (let i=0;i<=rows;i++){
    const y=i*INCH;
    ctx.lineWidth=i%10===0?2:0.5;
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
    const label=i<=midY?i:rows-i;
    if(i%5===0||i===midY){
      ctx.fillText(label,2,y-2);
      ctx.fillText(label,w-26,y-2);
    }
  }
}

/* ================= DEPLOYMENT ================= */

export function drawDeployment(ctx, dep){
  if(!dep) return;
  const draw=(polys,c)=>{
    ctx.fillStyle=c;
    polys.forEach(p=>{
      ctx.beginPath();
      p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
      ctx.closePath(); ctx.fill();
    });
  };
  draw(dep.player,"rgba(0,120,255,0.18)");
  draw(dep.enemy,"rgba(255,80,80,0.18)");
}

/* ================= TERRAIN (MED ROTATION + WALLS) ================= */

export function drawPiece(ctx,p){
  const cx=p.x+p.w/2;
  const cy=p.y+p.h/2;
  const rot=(p.rotation||0)*Math.PI/180;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rot);
  ctx.translate(-p.w/2,-p.h/2);

  ctx.fillStyle =
    p.color==="red"  ? "rgba(220,80,80,0.55)" :
    p.color==="blue" ? "rgba(80,120,220,0.55)" :
    "rgba(160,160,160,0.6)";
  ctx.fillRect(0,0,p.w,p.h);

  ctx.strokeStyle="black";
  ctx.lineWidth=2;
  ctx.strokeRect(0,0,p.w,p.h);

  if(Array.isArray(p.walls)){
    const t=INCH;
    ctx.fillStyle="#666";
    p.walls.forEach(w=>{
      const [[x1,y1],[x2,y2]]=w;
      if(x1===x2){
        ctx.fillRect(x1-t/2,Math.min(y1,y2),t,Math.abs(y2-y1));
      }else{
        ctx.fillRect(Math.min(x1,x2),y1-t/2,Math.abs(x2-x1),t);
      }
    });
  }

  ctx.restore();
}

/* ================= OBJECTIVES ================= */

export function drawObjectives(ctx,objs){
  objs.forEach((o,i)=>{
    const x=o.x*INCH, y=o.y*INCH;
    ctx.beginPath();
    ctx.fillStyle="gold";
    ctx.arc(x,y,OBJECTIVE.r,0,Math.PI*2);
    ctx.fill();
    ctx.strokeStyle="black";
    ctx.stroke();
    ctx.fillStyle="#000";
    ctx.font="bold 14px sans-serif";
    ctx.fillText(i+1,x-4,y+5);
  });
}
