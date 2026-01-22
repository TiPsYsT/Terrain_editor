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

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");

  let pieces = [];
  let objectives = [];

  let selected = null;
  let selectedObj = null;
  let dragging = false;
  let mode = "terrain";
  let offset = { x: 0, y: 0 };

  const snapMM = v => Math.round(v / INCH) * INCH;
  const snapIn = v => Math.round(v);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    pieces.forEach(p => drawPiece(ctx, p));
    drawObjectives(ctx, objectives);
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
      x: snapMM(100),
      y: snapMM(100),
      w: t.w,
      h: t.h,
      rotation: 0,
      walls
    };

    pieces.push(selected);
    selectedObj = null;
    mode = "terrain";
    draw();
  }

  function hitObjective(x, y) {
    return objectives.findIndex(o =>
      Math.hypot(x - o.x * INCH, y - o.y * INCH) <= 20
    );
  }

  canvas.onmousedown = e => {
    const x = e.offsetX;
    const y = e.offsetY;

    const oi = hitObjective(x, y);
    if (oi !== -1) {
      selectedObj = oi;
      selected = null;
      dragging = true;
      offset.x = x - objectives[oi].x * INCH;
      offset.y = y - objectives[oi].y * INCH;
      draw();
      return;
    }

    if (mode === "objective") {
      if (objectives.length < 5) {
        objectives.push({
          x: snapIn(x / INCH),
          y: snapIn(y / INCH)
        });
      }
      draw();
      return;
    }

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
    if (!dragging) return;

    if (selectedObj !== null) {
      objectives[selectedObj].x = snapIn((e.offsetX - offset.x) / INCH);
      objectives[selectedObj].y = snapIn((e.offsetY - offset.y) / INCH);
      draw();
      return;
    }

    if (selected) {
      selected.x = snapMM(e.offsetX - offset.x);
      selected.y = snapMM(e.offsetY - offset.y);
      draw();
    }
  };

  canvas.onmouseup = () => dragging = false;

  function rotate(dir) {
    if (!selected) return;
    const step = window.event.shiftKey ? 1 : 5;
    selected.rotation += dir * step;
    draw();
  }

  function deleteSelected() {
    if (selected) {
      pieces = pieces.filter(p => p !== selected);
      selected = null;
    }
    if (selectedObj !== null) {
      objectives.splice(selectedObj, 1);
      selectedObj = null;
    }
    draw();
  }

  const bind = (id, fn) =>
    document.getElementById(id)?.addEventListener("click", fn);

  bind("two", () => addTerrain("two_red"));
  bind("two-inv", () => addTerrain("two_red_inv"));
  bind("three", () => addTerrain("three_blue"));
  bind("three-inv", () => addTerrain("three_blue_inv"));
  bind("proto", () => addTerrain("prototype"));
  bind("cont", () => addTerrain("container"));

  bind("rot-l", () => rotate(-1));
  bind("rot-r", () => rotate(1));

  bind("add-obj", () => mode = "objective");
  bind("del-obj", () => selectedObj !== null && deleteSelected());

  bind("delete", deleteSelected);
  bind("export", () => exportJSON(pieces, objectives));

  draw();
});
