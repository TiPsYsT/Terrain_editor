import { INCH } from "./terrain-types.js";

/* ================= GRID ================= */

export function drawGrid(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = "#ccc";
  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";

  const cols = Math.floor(w / INCH);
  const rows = Math.floor(h / INCH);

  // Vertikala linjer + X-siffror
  for (let i = 0; i <= cols; i++) {
    const x = i * INCH;

    ctx.beginPath();
    ctx.lineWidth = i % 10 === 0 ? 2 : 0.5;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();

    if (i % 5 === 0) {
      ctx.fillText(i, x + 2, 12);          // topp
      ctx.fillText(i, x + 2, h - 4);       // botten
    }
  }

  // Horisontella linjer + Y-siffror
  for (let i = 0; i <= rows; i++) {
    const y = i * INCH;

    ctx.beginPath();
    ctx.lineWidth = i % 10 === 0 ? 2 : 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();

    if (i % 5 === 0) {
      ctx.fillText(i, 2, y - 2);           // vänster
      ctx.fillText(i, w - 24, y - 2);      // höger
    }
  }

  ctx.restore();
}

/* ================= TERRAIN ================= */

export function drawPiece(ctx, p) {
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  const rot = (p.rotation || 0) * Math.PI / 180;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.translate(-p.w / 2, -p.h / 2);

  // fill
  ctx.fillStyle =
    p.color === "red"  ? "rgba(220,80,80,0.55)" :
    p.color === "blue" ? "rgba(80,120,220,0.55)" :
    "rgba(160,160,160,0.6)";

  ctx.fillRect(0, 0, p.w, p.h);

  // outline
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, p.w, p.h);

  // walls (1" tjocka)
  if (Array.isArray(p.walls) && p.walls.length > 0) {
    const t = INCH;
    ctx.fillStyle = "#666";

    p.walls.forEach(w => {
      const [[x1, y1], [x2, y2]] = w;

      if (x1 === x2) {
        // vertikal vägg
        ctx.fillRect(
          x1 - t / 2,
          Math.min(y1, y2),
          t,
          Math.abs(y2 - y1)
        );
      } else {
        // horisontell vägg
        ctx.fillRect(
          Math.min(x1, x2),
          y1 - t / 2,
          Math.abs(x2 - x1),
          t
        );
      }
    });
  }

  ctx.restore();
}

/* ================= OBJECTIVES ================= */

export function drawObjectives(ctx, objectives = []) {
  ctx.save();

  objectives.forEach(o => {
    // o.x / o.y är i INCH
    const x = o.x * INCH;
    const y = o.y * INCH;

    // objective
    ctx.beginPath();
    ctx.fillStyle = "gold";
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    // control range
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.arc(x, y, 76, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.restore();
}
