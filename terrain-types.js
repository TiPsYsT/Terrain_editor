export const INCH = 25.4;

/*
  Enda sanningen:
  - endast geometri
  - färg = visuell identitet
*/

export const TERRAIN_TYPES = {
  two_storey_ruin_12x6: {
    id: "two_storey_ruin_12x6",
    color: "red",
    w: 12 * INCH,
    h: 6 * INCH,
    hasLWalls: true
  },

  three_storey_ruin_12x6: {
    id: "three_storey_ruin_12x6",
    color: "blue",
    w: 12 * INCH,
    h: 6 * INCH,
    hasLWalls: true
  },

  prototype_ruin_6x5: {
    id: "prototype_ruin_6x5",
    color: "gray",
    w: 6 * INCH,
    h: 5 * INCH,
    hasLWalls: false
  },

  armoured_container_5x2_5: {
    id: "armoured_container_5x2_5",
    color: "gray",
    w: 5 * INCH,
    h: 2.5 * INCH,
    hasLWalls: false
  }
};

/* ===== EXAKT WTC L-VÄGG ===== */
export function buildWTCLWalls(w, h) {
  const r = INCH;

  return [
    // Horisontell del
    // Visuellt: 2 rutor in p.g.a. tjocklek
    [
      [1 * r, 1 * r],
      [w - 0.5 * r, 1 * r]
    ],

    // Vertikal del
    // Slutar 7/8 in i sista rutan
    [
      [1 * r, 1 * r],
      [1 * r, h - (1 / 8) * r]
    ]
  ];
}


