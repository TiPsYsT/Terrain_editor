import {
  TERRAIN_TYPES,
  buildWTCLWalls,
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

function addTerrain(typeId) {
  const t = TERRAIN_TYPES[typeId];

  const walls = t.hasLWalls ? buildWTCLWalls(t.w, t.h) : [];

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

/* ---------- MOUSE ---------- */

canvas.onmousedown = e => {
  const x = e.offsetX;
  const y = e.offsetY;

  selected = [...pieces].reverse().find(
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

canvas.onmouseup = () => dragging = false;

/* ---------- UI ---------- */

document.getElementById("add-two").onclick = () =>
  addTerrain("two_storey_ruin_12x6");

document.getElementById("add-three").onclick = () =>
  addTerrain("three_storey_ruin_12x6");

document.getElementById("add-proto").onclick = () =>
  addTerrain("prototype_ruin_6x5");

document.getElementById("add-container").onclick = () =>
  addTerrain("armoured_container_5x2_5");

document.getElementById("rot-left").onclick = () => {
  if (selected) selected.rotation -= 45;
  draw();
};

document.getElementById("rot-right").onclick = () => {
  if (selected) selected.rotation += 45;
  draw();
};

document.getElementById("export").onclick = () =>
  exportJSON(pieces);

draw();
