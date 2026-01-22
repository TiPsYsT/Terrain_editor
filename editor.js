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

  /* ================= STATE ================= */

  let terrain = { pieces: [] };
  let objectives = [];

  // DEPLOYMENT LINES (PERSISTENT)
  let deployment = [];            // ← SANNINGEN
  let deployMode = null;          // "player" | "enemy"
  let deployStart = null;         // ← ENDAST PREVIEW

  let selected = null;
  let dragging = false;
  let mode = "terrain";
  let offset = { x: 0, y: 0 };

  const snapMM = v => Math.round(v / INCH) * INCH;
  const snapIn = v => Math.round(v);

  /* ================= DRAW ================= */

  function drawDeployment() {
    // PERMANENTA LINJER
    deployment.forEach(d => {
      ctx.strokeStyle = d.type === "player" ? "blue" : "red";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(d.a[0], d.a[1]);
      ctx.lineTo(d.b[0], d.b[1]);
      ctx.stroke();
    });

    // PREVIEW-LINJE (tillfällig)
    if (deployStart) {
      ctx.strokeStyle = deployMode === "player" ? "blue" : "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(deployStart[0], deployStart[1]);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
  }

  let mouseX = 0, mouseY = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    drawDeployment();
    terrain.pieces.forEach(p => drawPiece(ctx, p));
    drawObjectives(ctx, objectives);
  }

  /* ================= TERRAIN ================= */

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

    terrain.pieces.push(selected);

    // ⬇️ VIKTIGT: rör INTE deployment[]
    deployMode = null;
    deployStart = null;

    draw();
  }

  /* ================= MOUSE ================= */

  canvas.onmousedown = e => {
    const x = snapMM(e.offsetX);
    const y = snapMM(e.offsetY);

    // DEPLOYMENT (KLICK–KLICK)
    if (deployMode) {
      if (!deployStart) {
        deployStart = [x, y];
      } else {
        // ⬇️ SPARAS PERMANENT
        deployment.push({
          type: deployMode,
          a: deployStart,
          b: [x, y]
        });
        deployStart = null;
      }
      draw();
      return;
    }

    // OBJECTIVES
    if (mode === "objective") {
      objectives.push({ x: snapIn(x / INCH), y: snapIn(y / INCH) });
      draw();
      return;
    }

    // TERRAIN DRAG
    selected = [...terrain.pieces].reverse().find(
      p => x >= p.x && x <= p.x + p.w &&
           y >= p.y && y <= p.y + p.h
    );

    if (selected) {
      dragging = true;
      offset.x = x - selected.x;
      offset.y = y - selected.y;
    }
  };

  canvas.onmousemove = e => {
    mouseX = snapMM(e.offsetX);
    mouseY = snapMM(e.offsetY);

    if (dragging && selected) {
      selected.x = mouseX - offset.x;
      selected.y = mouseY - offset.y;
      draw();
    }

    if (deployStart) draw();
  };

  canvas.onmouseup = () => dragging = false;

  /* ================= UI ================= */

  const bind = (id, fn) =>
    document.getElementById(id)?.addEventListener("click", fn);

  // TERRAIN
  bind("two", () => addTerrain("two_red"));
  bind("two-inv", () => addTerrain("two_red_inv"));
  bind("three", () => addTerrain("three_blue"));
  bind("three-inv", () => addTerrain("three_blue_inv"));
  bind("proto", () => addTerrain("prototype"));
  bind("cont", () => addTerrain("container"));

  // ROTATION
  bind("rot-l", () => selected && (selected.rotation -= 5, draw()));
  bind("rot-r", () => selected && (selected.rotation += 5, draw()));

  // OBJECTIVES
  bind("add-obj", () => mode = "objective");
  bind("del-obj", () => objectives.pop() && draw());

  // DEPLOYMENT (RÖR INTE deployment[])
  bind("dep-player", () => {
    deployMode = "player";
    deployStart = null;
  });

  bind("dep-enemy", () => {
    deployMode = "enemy";
    deployStart = null;
  });

  bind("dep-cancel", () => {
    deployMode = null;
    deployStart = null;
    draw();
  });

  bind("dep-clear", () => {
    deployment.length = 0;   // ← ENDA STÄLLET SOM RENSAR
    deployStart = null;
    draw();
  });

  bind("delete", () => {
    if (selected) {
      terrain.pieces = terrain.pieces.filter(p => p !== selected);
      selected = null;
      draw();
    }
  });

  bind("export", () =>
    exportJSON({
      terrain,
      deployment,
      objectives
    })
  );

  draw();
});
