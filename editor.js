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

/* ================= STATE ================= */

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

let terrain = { pieces: [] };
let objectives = [];

let deployment = {
  player: [],
  enemy: []
};

let deployMode = null;     // "player" | "enemy" | null
let currentPoly = [];

let selected = null;
let selectedObj = null;
let dragging = false;
let mode = "terrain";
let offset = { x: 0, y: 0 };

/* ================= HELPERS ================= */

const snapMM = v => Math.round(v / INCH) * INCH;
const snapIn = v => Math.round(v);

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

  drawPolys(deployment.player, "rgba(0,120,255,0.25)");
  drawPolys(deployment.enemy,  "rgba(255,80,80,0.25)");

  if (currentPoly.length > 0) {
    ctx.strokeStyle = deployMode === "player" ? "blue" : "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    currentPoly.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
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
  draw();
}

/* ================= MOUSE ================= */

canvas.onmousedown = e => {
  const x = e.offsetX;
  const y = e.offsetY;

  /* ---- DEPLOYMENT DRAW ---- */
  if (deployMode) {
    currentPoly.push([snapMM(x), snapMM(y)]);
    draw();
    return;
  }

  /* ---- OBJECTIVES ---- */
  if (mode === "objective") {
    objectives.push({ x: snapIn(x/INCH), y: snapIn(y/INCH) });
    draw();
    return;
  }

  /* ---- TERRAIN ---- */
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

/* ================= KEYBOARD ================= */

window.addEventListener("keydown", e => {
  if (e.key === "Enter" && deployMode && currentPoly.length >= 3) {
    deployment[deployMode].push([...currentPoly]);
    currentPoly = [];
    draw();
  }
});

/* ================= UI ================= */

const bind = (id, fn) =>
  document.getElementById(id)?.addEventListener("click", fn);

bind("two", () => addTerrain("two_red"));
bind("two-inv", () => addTerrain("two_red_inv"));
bind("proto", () => addTerrain("prototype"));

bind("rot-l", () => selected && (selected.rotation -= 5, draw()));
bind("rot-r", () => selected && (selected.rotation += 5, draw()));

bind("add-obj", () => mode = "objective");
bind("del-obj", () => objectives.pop() && draw());

bind("dep-player", () => { deployMode="player"; currentPoly=[]; });
bind("dep-enemy", () => { deployMode="enemy"; currentPoly=[]; });
bind("dep-undo", () => { currentPoly.pop(); draw(); });
bind("dep-cancel", () => { currentPoly=[]; deployMode=null; draw(); });
bind("dep-clear", () => {
  deployment.player=[];
  deployment.enemy=[];
  currentPoly=[];
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

bind("export", () => exportJSON({
  terrain,
  deployment,
  objectives
}));

draw();
