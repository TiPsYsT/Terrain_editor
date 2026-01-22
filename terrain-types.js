export const INCH = 25.4;

/*
  Enda sanningen:
  - samma footprint
  - olika L-orientering
*/

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

/* ===== OBJECTIVES ===== */

export const OBJECTIVE_TYPES = {
  standard: {
    id: "objective",
    r: 40,              // 40mm objective marker
    control: 3 * INCH   // 3" control range (10th)
  }
};
