import { INCH } from "./terrain-types.js";

/* ================= GRID ================= */

export function drawGrid(ctx, w, h) {
  ctx.save();
  ctx.strokeStyle = "#ccc";
  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";

  const cols = Math.round(w / INCH); // 60
  const rows = Math.round(h / INCH); // 44
  const midX = cols / 2;             // 30
  const midY = rows / 2;             // 22

  // VERTIKALA LINJER (X)
  for (let i = 0; i <= cols; i++) {
    const x = i * INCH;

    ctx.beginPath();
    ctx.lineWidth = i % 10 === 0 ? 2 : 0.5;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();

    // Numrering: 0 → 30 → 0
    let label = i <= midX ? i : cols - i;

    if (i % 5 === 0 || i === midX) {
      ctx.fillText(label, x + 2, 12);
      ctx.fillText(label, x + 2, h - 4);
    }
  }

  // HORISONTELLA LINJER (Y)
  for (let i = 0; i <= rows; i++) {
    const y = i * INCH;

    ctx.beginPath();
    ctx.lineWidth = i % 10 === 0 ? 2 : 0.5;
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();

    // Numrering: 0 → 22 → 0
    let label = i <= midY ? i : rows - i;

    if (i % 5 === 0 || i === midY) {
      ctx.fillText(label, 2, y - 2);
      ctx.fillText(label, w - 26, y - 2);
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

  ctx.fillStyle =
    p.color === "red"  ? "rgba(220,80,80,0.55)" :
    p.color === "blue" ? "rgba(80,120,220,0.55)" :
    "rgba(160,160,160,0.6)";

  ctx.fillRect(0, 0, p.w, p.h);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, p.w, p.h);

  if (Array.isArray(p.walls)) {
    const t = INCH;
    ctx.fillStyle = "#666";

    p.walls.forEach(w => {
      const [[x1, y1], [x2, y2]] = w;
      if (x1 === x2) {
        ctx.fillRect(x1 - t / 2, Math.min(y1, y2), t, Math.abs(y2 - y1));
      } else {
        ctx.fillRect(Math.min(x1, x2), y1 - t / 2, Math.abs(x2 - x1), t);
      }
    });
  }

  ctx.restore();
}

/* ================= OBJECTIVES ================= */

export function drawObjectives(ctx, objectives = []) {
  ctx.save();

  objectives.forEach((o, i) => {
    const x = o.x * INCH;
    const y = o.y * INCH;

    ctx.beginPath();
    ctx.fillStyle = "gold";
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();

    // nummer 1–5
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(i + 1, x - 4, y + 5);
  });

  ctx.restore();
}
