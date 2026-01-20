import {
  TERRAIN_TYPES,
  buildL,
  buildLInv,
  INCH
} from "./terrain-types.js";

import { drawGrid, drawPiece } from "./render.js";
import { exportJSON } from "./export.js";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");

  let pieces = [];
  let selected = null;
  let dragging = false;
  let offset = { x: 0, y: 0 };

  function snap(v) {
    return Math.round(v / INCH) * INCH;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    pieces.forEach(p => drawPiece(ctx, p));
  }

  function addTerrain(key) {
    const t = TERRAIN_TYPES[key];
    if (!t) return;

    let walls = [];
    if (t.l === "normal") walls = buildL(t.w, t.h);
    if (t.l === "mirrored") walls = buildLInv(t.w, t.h);

    selected = {
      type: t.id,
      color: t.color,
      x: snap(100),
      y: snap(100),
      w: t.w,
      h: t.h,
      rotation: 0,
      walls
    };

    pieces.push(selected);
    draw();
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

  canvas.onmouseup = () => {
    dragging = false;
  };

  /* ---------- ROTATION ---------- */

  function rotate(deg) {
    if (!selected) return;
    selected.rotation += deg;
    draw();
  }

  /* ---------- DELETE ---------- */

  function deleteSelected() {
    if (!selected) return;
    pieces = pieces.filter(p => p !== selected);
    selected = null;
    draw();
  }

  /* ---------- SAFE BIND ---------- */

  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el) el.onclick = fn;
  }

  /* ---------- UI ---------- */

  bind("two", () => addTerrain("two_red"));
  bind("two-inv", () => addTerrain("two_red_inv"));
  bind("three", () => addTerrain("three_blue"));
  bind("three-inv", () => addTerrain("three_blue_inv"));
  bind("proto", () => addTerrain("prototype"));
  bind("cont", () => addTerrain("container"));

  bind("rot-l-11", () => rotate(-11.25));
  bind("rot-r-11", () => rotate(+11.25));
  bind("rot-l-22", () => rotate(-22.5));
  bind("rot-r-22", () => rotate(+22.5));
  bind("rot-l-45", () => rotate(-45));
  bind("rot-r-45", () => rotate(+45));

  bind("delete", deleteSelected);
  bind("export", () => exportJSON(pieces));

  draw();
});
