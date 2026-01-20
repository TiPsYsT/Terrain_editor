import {
  TERRAIN_TYPES,
  buildL,
  buildLInv,
  INCH
} from "./terrain-types.js";

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

function addTerrain(key) {
  const t = TERRAIN_TYPES[key];

  let walls = [];
  if (t.l === "normal") walls = buildL(t.w, t.h);
  if (t.l === "mirrored") walls = buildLInv(t.w, t.h);

  pieces.push({
    type: t.id,
    color: t.color,
    x: snap(100),
    y: snap(100),
    w: t.w,
    h: t.h,
    rotation: 0,
    walls
  });

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(ctx, canvas.width, canvas.height);
  pieces.forEach(p => drawPiece(ctx, p));
}

/* UI */

document.getElementById("two").onclick = () => addTerrain("two_red");
document.getElementById("two-inv").onclick = () => addTerrain("two_red_inv");
document.getElementById("three").onclick = () => addTerrain("three_blue");
document.getElementById("three-inv").onclick = () => addTerrain("three_blue_inv");
document.getElementById("proto").onclick = () => addTerrain("prototype");
document.getElementById("cont").onclick = () => addTerrain("container");

document.getElementById("rot-left").onclick = () => {
  if (selected) selected.rotation -= 45;
  draw();
};

document.getElementById("rot-right").onclick = () => {
  if (selected) selected.rotation += 45;
  draw();
};

document.getElementById("export").onclick = () => exportJSON(pieces);
