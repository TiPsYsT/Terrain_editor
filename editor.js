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

  // DEPLOYMENT (NYTT, isolerat)
  let deployment = { player: [], enemy: [] };
  let deployMode = null;           // "player" | "enemy"
  let currentDeployPoly = [];

  // befintlig selection
  let selected = null;
  let selectedObj = null;
  let dragging = false;
  let mode = "terrain";
  let offset = { x: 0, y: 0 };

  const snapMM = v => Math.round(v / INCH) * INCH;
  const snapIn = v => Math.round(v);

  /* ================= DRAW ================= */

  function drawDeployment() {
    const drawPolys = (polys, color) => {
      ctx.fillStyle = color;
      polys.forEach(poly => {
        ctx.beginPath();
        poly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
        ctx.closePath();
        ctx.fill();
      });
    };

    drawPolys(deployment.player, "rgba(0,120,255,0.2)");
    drawPolys(deployment.enemy,  "rgba(255,80,80,0.2)");

    if (currentDeployPoly.length) {
      ctx.strokeStyle = deployMode === "player" ? "blue" : "red";
      ctx.lineWidth = 2;
      ctx.beginPath();
      currentDeployPoly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
      ctx.stroke();
    }
  }

  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    drawDeployment();                 // ⬅ NYTT LAGER
    terrain.pieces.forEach(p => drawPiece(ctx, p));
    drawObjectives(ctx, objectives);
  }

  /* ================= TERRAIN (oförändrat) ================= */

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
    mode = "terrain";
    draw();
  }

  /* ================= MOUSE ================= */

  canvas.onmousedown = e => {
    const x = e.offsetX;
    const y = e.offsetY;

    // DEPLOYMENT DRAW (ISOLERAT)
    if (deployMode) {
      currentDeployPoly.push([snapMM(x), snapMM(y)]);
      draw();
      return;
    }

    // OBJECTIVES (oförändrat)
    if (mode === "objective") {
      objectives.push({ x: snapIn(x/INCH), y: snapIn(y/INCH) });
      draw();
      return;
    }

    // TERRAIN HIT
    selected = [...terrain.pieces].reverse().find(
      p => x>=p.x && x<=p.x+p.w && y>=p.y && y<=p.y+p.h
    );

    if (selected) {
      dragging = true;
      offset.x = x - selected.x;
      offset.y = y - selected.y;
    }
  };

  canvas.onmousemove = e => {
    if (dragging && selected) {
      selected.x = snapMM(e.offsetX - offset.x);
      selected.y = snapMM(e.offsetY - offset.y);
      draw();
    }
  };

  canvas.onmouseup = () => dragging = false;

  /* ================= DEPLOYMENT CONTROLS ================= */

  function finishDeploy() {
    if (!deployMode || currentDeployPoly.length < 3) return;
    deployment[deployMode].push([...currentDeployPoly]);
    currentDeployPoly = [];
    draw();
  }

  /* ================= UI ================= */

  const bind = (id, fn) =>
    document.getElementById(id)?.addEventListener("click", fn);

  // terrain
  bind("two", () => addTerrain("two_red"));
  bind("two-inv", () => addTerrain("two_red_inv"));
  bind("three", () => addTerrain("three_blue"));
  bind("three-inv", () => addTerrain("three_blue_inv"));
  bind("proto", () => addTerrain("prototype"));
  bind("cont", () => addTerrain("container"));

  // rotation
  bind("rot-l", () => selected && (selected.rotation -= 5, draw()));
  bind("rot-r", () => selected && (selected.rotation += 5, draw()));

  // objectives
  bind("add-obj", () => mode = "objective");
  bind("del-obj", () => objectives.pop() && draw());

  // deployment
  bind("dep-player", () => { deployMode="player"; currentDeployPoly=[]; });
  bind("dep-enemy",  () => { deployMode="enemy";  currentDeployPoly=[]; });
  bind("dep-undo",   () => { currentDeployPoly.pop(); draw(); });
  bind("dep-finish", finishDeploy);
  bind("dep-clear",  () => {
    deployment.player=[];
    deployment.enemy=[];
    currentDeployPoly=[];
    deployMode=null;
    draw();
  });

  bind("delete", () => {
    if (selected) {
      terrain.pieces = terrain.pieces.filter(p=>p!==selected);
      selected=null;
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
