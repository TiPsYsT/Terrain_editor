export const INCH = 25.4;

/*
  ENDA SANNINGEN:
  - w / h = footprint i tum → px
  - walls = faktisk vägggeometri
  - inga regler, inga höjder
*/

export const TERRAIN_TYPES = {
  /* ================= RUINS ================= */

  // TWO STOREY RUIN / THREE STOREY RUIN
  // Samma footprint enligt PDF
  ruin_12x6: {
    id: "ruin_12x6",
    type: "ruin",
    w: 12 * INCH,
    h: 6 * INCH,
    wallThickness: 1 * INCH,
    wallType: "L"
  },

  // PROTOTYPE RUIN (BETA)
  // Platta utan vertikala väggar
  prototype_ruin_6x5: {
    id: "prototype_ruin_6x5",
    type: "ruin",
    w: 6 * INCH,
    h: 5 * INCH,
    wallThickness: 0,
    wallType: "none"
  },

  /* ================= CONTAINERS ================= */

  armoured_container_5x2_5: {
    id: "armoured_container_5x2_5",
    type: "container",
    w: 5 * INCH,
    h: 2.5 * INCH,
    wallThickness: 1 * INCH,
    wallType: "box"
  }
};

/* ================= WALL HELPERS ================= */

// Standard WTC L-vägg (ruins)
export function buildLWalls(w, h) {
  return [
    [[0, 0], [w, 0]], // top
    [[0, 0], [0, h]]  // left
  ];
}

// Hel box (containers)
export function buildBoxWalls(w, h) {
  return [
    [[0, 0], [w, 0]],
    [[w, 0], [w, h]],
    [[w, h], [0, h]],
    [[0, h], [0, 0]]
  ];
}
