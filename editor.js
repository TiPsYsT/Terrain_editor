import {
  TERRAIN_TYPES,
  buildLWalls,
  buildBoxWalls,
  INCH
} from "./terrain-types.js";

let pieces = [];
let selected = null;

function snap(v) {
  return Math.round(v / INCH) * INCH;
}

export function addTerrain(typeId) {
  const t = TERRAIN_TYPES[typeId];

  const walls =
    t.wallType === "L" ? buildLWalls(t.w, t.h) :
    t.wallType === "box" ? buildBoxWalls(t.w, t.h) :
    [];

  pieces.push({
    type: t.id,
    x: snap(100),
    y: snap(100),
    w: t.w,
    h: t.h,
    rotation: 0,
    walls
  });

  draw();
}
