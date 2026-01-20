import { RUINS, defaultWalls, INCH } from "./terrain-types.js";
import { drawGrid, drawPiece } from "./render.js";
import { exportJSON } from "./export.js";

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let pieces = [];
let selected = null;
let dragging = false;
let offset = { x: 0, y: 0 };

function snap(v) {
  return Math.round(v / INCH) * INCH;
}

function addRuin(type) {
  const { w, h } = RUINS[type];
  pieces.push({
    x: snap(100),
    y: snap(100),
    w,
    h,
    rotation: 0,
    walls: defaultWalls(w, h)
  });
  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(ctx, canvas.width, canvas.height);
  pieces.forEach(p => drawPiece(ctx, p));
}

canvas.onmousedown = e => {
  const x = e.offsetX;
  const y = e.offsetY;
  selected = pieces.findLast(
    p => x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h
  );
  if (selected) {
    dragging = true;
    offset.x = x - selected.x;
    offset.y = y - selected.y;
  }
};

canvas.onmousemove = e => {
  if (!dragging || !selected) return;
  selected.x = snap(e.offsetX - offset.x);
  selected.y = snap(e.offsetY - offset.y);
  draw();
};

canvas.onmouseup = () => (dragging = false);

/* UI */
document.getElementById("add-ruin-small").onclick = () => addRuin("small");
document.getElementById("add-ruin-medium").onclick = () => addRuin("medium");
document.getElementById("add-ruin-large").onclick = () => addRuin("large");

document.getElementById("rotate-left").onclick = () => {
  if (selected) selected.rotation -= 45;
  draw();
};

document.getElementById("rotate-right").onclick = () => {
  if (selected) selected.rotation += 45;
  draw();
};

document.getElementById("export").onclick = () => exportJSON(pieces);

draw();
