import {
  TERRAIN_TYPES,
  buildL,
  buildLInv,
  INCH
} from "./terrain-types.js";

import {
  drawGrid,
  drawPiece,
  drawObjectives
} from "./render.js";

import { exportJSON } from "./export.js";

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");

  /* ================= STATE ================= */

  let pieces = [];
  let objectives = [];

  let selected = null;          // terrain piece
  let selectedObj = null;       // objective index

  let dragging = false;
  let mode = "terrain";         // "terrain" | "objective"

  let offset = { x: 0, y: 0 };

  /* ================= HELPERS ================= */

  function snap(v) {
    return Math.round(v / INCH) * INCH;
  }

  function snapInch(v) {
    return Math.round(v);
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, canvas.width, canvas.height);
    pieces.forEach(p => drawPiece(ctx, p));
    drawObjectives(ctx, objectives);
  }

  /* ================= TERRAIN ================= */

  function addTerrain(key) {
    const t = TERRAIN_TYPES[key];
    if (!t) return;

    let walls = [];
    if (t.l === "normal") walls = buildL(t.w, t.h);
    if (t.l === "mirrored") walls = buildLInv(t.w, t.h);

    selectedObj = null;
    mode = "terrain";

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

  /* ================= OBJECTIVES ================= */

  function addObjectiveAt(x, y) {
    if (objectives.length >= 5) return;

    objectives.push({
      x: snapInch(x / INCH),
      y: snapInch(y / INCH)
    });

    selectedObj = objectives.length - 1;
    selected = null;
    draw();
  }

  function deleteObjective() {
    if (selectedObj === null) return;
    objectives.splice(selectedObj, 1);
    selectedObj = null;
    draw();
  }

  /* ================= MOUSE ================= */

  canvas.onmousedown = e => {
    const x = e.offsetX;
    const y = e.offsetY;

    if (mode === "objective") {
      addObjectiveAt(x, y);
      return;
    }

    // terrain hit test
    selected = [...pieces].reverse().find(
      p => x >= p.x && x <= p.x + p.w &&
           y >= p.y && y <= p.y + p.h
    );

    selectedObj = null;

    if (selected) {
      dragging = true;
      offset.x = x - selected.x;
      offset.y = y - selected.y;
    }

    draw();
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

  /* ================= ROTATION ================= */

  function rotate(dir) {
    if (!selected) return;
    const step = window.event.shiftKey ? 1 : 5;
    selected.rotation += dir * step;
    draw();
  }

  /* ================= DELETE ================= */

  function deleteSelected() {
    if (selected) {
      pieces = pieces.filter(p => p !== selected);
      selected = null;
    }
    draw();
  }

  /* ================= UI BIND ================= */

  function bind(id, fn) {
    const el = document.getElementById(id);
    if (el) el.onclick = fn;
  }

  /* ----- terrain ----- */
  bind("two",      () => addTerrain("two_red"));
  bind("two-inv",  () => addTerrain("two_red_inv"));
  bind("three",    () => addTerrain("three_blue"));
  bind("three-inv",() => addTerrain("three_blue_inv"));
  bind("proto",    () => addTerrain("prototype"));
  bind("cont",     () => addTerrain("container"));

  /* ----- rotation ----- */
  bind("rot-l", () => rotate(-1));
  bind("rot-r", () => rotate(+1));

  /* ----- objectives ----- */
  bind("add-obj", () => {
    mode = "objective";
    selected = null;
  });

  bind("del-obj", deleteObjective);

  /* ----- actions ----- */
  bind("delete", deleteSelected);
  bind("export", () => exportJSON(pieces, objectives));

  draw();
});
