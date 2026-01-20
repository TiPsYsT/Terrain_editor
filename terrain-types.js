export const INCH = 25.4;

/*
  ENDA SANNINGEN:
  - Samma footprint (12x6) men OLIKA TYPER + FÄRG
  - Färg används i render, inte regler
*/

export const TERRAIN_TYPES = {
  /* ===== RUINS ===== */

  two_storey_ruin_12x6: {
    id: "two_storey_ruin_12x6",
    type: "ruin",
    color: "red",
    w: 12 * INCH,
    h: 6 * INCH,
    wallType: "L"
  },

  three_storey_ruin_12x6: {
    id: "three_storey_ruin_12x6",
    type: "ruin",
    color: "blue",
    w: 12 * INCH,
    h: 6 * INCH,
    wallType: "L"
  },

  prototype_ruin_6x5: {
    id: "prototype_ruin_6x5",
    type: "ruin",
    color: "gray",
    w: 6 * INCH,
    h: 5 * INCH,
    wallType: "none"
  },

  /* ===== CONTAINERS ===== */

  armoured_container_5x2_5: {
    id: "armoured_container_5x2_5",
    type: "container",
    color: "gray",
    w: 5 * INCH,
    h: 2.5 * INCH,
    wallType: "box"
  }
};

/* ===== WALL HELPERS ===== */

export function buildLWalls(w, h) {
  return [
    [[0, 0], [w, 0]],
    [[0, 0], [0, h]]
  ];
}

export function buildBoxWalls(w, h) {
  return [
    [[0, 0], [w, 0]],
    [[w, 0], [w, h]],
    [[w, h], [0, h]],
    [[0, h], [0, 0]]
  ];
}
