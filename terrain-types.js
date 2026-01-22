export const INCH = 25.4;

/* ================= TERRAIN TYPES ================= */

export const TERRAIN_TYPES = {
  two_red: {
    id: "two_storey_red",
    color: "red",
    w: 12 * INCH,
    h: 6 * INCH,
    l: "normal"
  },
  two_red_inv: {
    id: "two_storey_red_inv",
    color: "red",
    w: 12 * INCH,
    h: 6 * INCH,
    l: "mirrored"
  },
  three_blue: {
    id: "three_storey_blue",
    color: "blue",
    w: 12 * INCH,
    h: 6 * INCH,
    l: "normal"
  },
  three_blue_inv: {
    id: "three_storey_blue_inv",
    color: "blue",
    w: 12 * INCH,
    h: 6 * INCH,
    l: "mirrored"
  },
  prototype: {
    id: "prototype_ruin",
    color: "gray",
    w: 6 * INCH,
    h: 5 * INCH,
    l: "none"
  },
  container: {
    id: "container",
    color: "gray",
    w: 5 * INCH,
    h: 2.5 * INCH,
    l: "none"
  }
};

/* ================= OBJECTIVES ================= */

export const OBJECTIVE = {
  r: 20,              // mm
  control: 3 * INCH
};

/* ================= DEPLOYMENT ZONES ================= */

export const DEPLOYMENTS = {
  hammer_anvil: {
    name: "Hammer & Anvil",
    player: [
      [[0,0],[18*INCH,0],[18*INCH,44*INCH],[0,44*INCH]]
    ],
    enemy: [
      [[42*INCH,0],[60*INCH,0],[60*INCH,44*INCH],[42*INCH,44*INCH]]
    ]
  },

  dawn_of_war: {
    name: "Dawn of War",
    player: [
      [[0,0],[60*INCH,0],[60*INCH,18*INCH],[0,18*INCH]]
    ],
    enemy: [
      [[0,26*INCH],[60*INCH,26*INCH],[60*INCH,44*INCH],[0,44*INCH]]
    ]
  }
};

/* ================= L-WALLS ================= */

export function buildL(w, h) {
  const r = INCH;
  return [
    [[1*r-0.5*r,1*r],[(1+9+1/8)*r,1*r]],
    [[1*r,1*r],[1*r,h-(1/8)*r]]
  ];
}

export function buildLInv(w, h) {
  const r = INCH;
  return [
    [[w-(1+9+1/8)*r,1*r],[w-(1*r-0.5*r),1*r]],
    [[w-1*r,1*r],[w-1*r,h-(1/8)*r]]
  ];
}
