export const INCH = 25.4;

/*
  Enda sanningen:
  - endast geometri
  - färg = visuell identitet
*/

export const TERRAIN_TYPES = {
  /* ===== RUINS ===== */

  two_storey_ruin_12x6: {
    id: "two_storey_ruin_12x6",
    type: "ruin",
    color: "red",
    w: 12 * INCH,
    h: 6 * INCH
  },

  three_storey_ruin_12x6: {
    id: "three_storey_ruin_12x6",
    type: "ruin",
    color: "blue",
    w: 12 * INCH,
    h: 6 * INCH
  },

  prototype_ruin_6x5: {
    id: "prototype_ruin_6x5",
    type: "ruin",
    color: "gray",
    w: 6 * INCH,
    h: 5 * INCH
  },

  /* ===== CONTAINER ===== */

  armoured_container_5x2_5: {
    id: "armoured_container_5x2_5",
    type: "container",
    color: "gray",
    w: 5 * INCH,
    h: 2.5 * INCH
  }
};

/* ===== WTC L-WALL (EXAKT) ===== */

export function buildWTCLWalls(w, h) {
  const r = INCH;

  return [
    // horisontell del (2 rutor in, 1 ruta ner)
    [
      [2 * r, 1 * r],
      [w - 1 * r, 1 * r]
    ],

    // vertikal del (1 ruta in, slutar 7/8 in)
    [
      [1 * r, 1 * r],
      [1 * r, h - (1 / 8) * r]
    ]
  ];
}
