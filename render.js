import { INCH } from "./terrain-types.js";

export function drawGrid(ctx, w, h) {
  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;

  for (let x = 0; x <= w; x += INCH) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  for (let y = 0; y <= h; y += INCH) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

export function drawPiece(ctx, p) {
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  const rot = (p.rotation || 0) * Math.PI / 180;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.translate(-p.w / 2, -p.h / 2);

  ctx.fillStyle =
    p.color === "red" ? "rgba(220,80,80,0.55)" :
    p.color === "blue" ? "rgba(80,120,220,0.55)" :
    "rgba(160,160,160,0.6)";

  ctx.fillRect(0, 0, p.w, p.h);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, p.w, p.h);

  const t = INCH;
  ctx.fillStyle = "#666";

  (p.walls || []).forEach(w => {
    const [[x1, y1], [x2, y2]] = w;
    if (x1 === x2) {
      ctx.fillRect(x1 - t / 2, Math.min(y1, y2), t, Math.abs(y2 - y1));
    } else {
      ctx.fillRect(Math.min(x1, x2), y1 - t / 2, Math.abs(x2 - x1), t);
    }
  });

  ctx.restore();
}
