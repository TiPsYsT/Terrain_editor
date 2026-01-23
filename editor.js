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

  let terrain = { pieces: [] };
  let objectives = [];

  // Deployment = linjer
  let deployment = [];
  let deployMode = null;      // "player" | "enemy" | null
  let deployStart = null;     // preview only

  let selected = null;
  let selectedObj = null;

  let dragging = false;
  let draggingObj = false;

  let mode = "terrain";      // terrain | objective
  let offset = { x: 0, y: 0 };

  let mouseX = 0;
  let mouseY = 0;

  const snapMM = v => Math.round(v / INCH) * INCH;
  const snapIn = v => Math.round(v);

  /* ================= MODE RESET ================= */

  function resetModes() {
    mode = "terrain";
    deployMode = null;
    deployStart = null;
    selectedObj = null;
  }

  /* ================= DRAW ================= */

  function drawDeployment() {
    // saved lines
    deployment.forEach(d => {
      ctx.strokeStyle = d.type === "player" ? "blue" : "red";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(d.a[0], d.a[1]);
      ctx.lineTo(d.b[0], d.b[1]);
      ctx.stroke();
    });

    // preview
    if (deployStart) {
      ctx.strokeStyle = deployMode === "player" ? "blue" : "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(deployStart[0], deployStart[1]);
      ctx.lineTo(mouseX, mouseY);
      ctx.stroke();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    drawDeployment();
    terrain.pieces.forEach(p => drawPiece(ctx, p));
    drawObjectives(ctx, objectives, selectedObj);
  }

  /* ================= TERRAIN ================= */

  function addTerrain(key) {
    resetModes();

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
    draw();
  }

  /* ================= OBJECTIVE HIT ================= */

  function hitObjective(x, y) {
    return objectives.findIndex(o =>
      Math.hypot(x - o.x * INCH, y - o.y * INCH) <= 20
    );
  }

  /* ================= MOUSE ================= */

  canvas.onmousedown = e => {
    const x = snapMM(e.offsetX);
    const y = snapMM(e.offsetY);

    // DEPLOYMENT
    if (deployMode) {
      if (!deployStart) {
        deployStart = [x, y];
      } else {
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

    // OBJECTIVE HIT
    const oi = hitObjective(x, y);
    if (oi !== -1) {
      resetModes();
      selectedObj = oi;
      draggingObj = true;
      offset.x = x - objectives[oi].x * INCH;
      offset.y = y - objectives[oi].y * INCH;
      draw();
      return;
    }

    // ADD OBJECTIVE
    if (mode === "objective") {
      objectives.push({ x: snapIn(x / INCH), y: snapIn(y / INCH) });
      draw();
      return;
    }

    // TERRAIN HIT
    selected = [...terrain.pieces].reverse().find(
      p => x >= p.x && x <= p.x + p.w &&
           y >= p.y && y <= p.y + p.h
    );

    if (selected) {
      resetModes();
      dragging = true;
      offset.x = x - selected.x;
      offset.y = y - selected.y;
    } else {
      selected = null;
      selectedObj = null;
    }

    draw();
  };

  canvas.onmousemove = e => {
    mouseX = snapMM(e.offsetX);
    mouseY = snapMM(e.offsetY);

    if (dragging && selected) {
      selected.x = mouseX - offset.x;
      selected.y = mouseY - offset.y;
      draw();
    }

    if (draggingObj && selectedObj !== null) {
      objectives[selectedObj].x = snapIn((mouseX - offset.x) / INCH);
      objectives[selectedObj].y = snapIn((mouseY - offset.y) / INCH);
      draw();
    }

    if (deployStart) draw();
  };

  canvas.onmouseup = () => {
    dragging = false;
    draggingObj = false;
  };

  /* ================= UI ================= */

  const bind = (id, fn) =>
    document.getElementById(id)?.addEventListener("click", fn);

  // Terrain
  bind("two", () => addTerrain("two_red"));
  bind("two-inv", () => addTerrain("two_red_inv"));
  bind("three", () => addTerrain("three_blue"));
  bind("three-inv", () => addTerrain("three_blue_inv"));
  bind("proto", () => addTerrain("prototype"));
  bind("cont", () => addTerrain("container"));

  // Rotation (Shift = 1°)
  bind("rot-l", e => {
    if (!selected) return;
    selected.rotation -= e.shiftKey ? 1 : 5;
    draw();
  });

  bind("rot-r", e => {
    if (!selected) return;
    selected.rotation += e.shiftKey ? 1 : 5;
    draw();
  });

  // Objectives
  bind("add-obj", () => {
    resetModes();
    mode = "objective";
  });

  bind("del-obj", () => {
    if (selectedObj !== null) {
      objectives.splice(selectedObj, 1);
      selectedObj = null;
      draw();
    }
  });

  // Deployment
  bind("dep-player", () => {
    resetModes();
    deployMode = "player";
  });

  bind("dep-enemy", () => {
    resetModes();
    deployMode = "enemy";
  });

  bind("dep-cancel", () => {
    resetModes();
    draw();
  });

  bind("dep-clear", () => {
    deployment.length = 0;
    deployStart = null;
    draw();
  });

  // Delete terrain
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
      objectives,
      deployment
    })
  );

  draw();
});
