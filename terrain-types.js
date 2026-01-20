export const INCH = 25.4;

export const RUINS = {
  small: { w: 203, h: 76 },
  medium: { w: 279, h: 203 },
  large: { w: 330, h: 152 },
  center: { w: 330, h: 178 }
};

export function defaultWalls(w, h) {
  return [
    [[0, 0], [w, 0]],
    [[0, 0], [0, h]]
  ];
}

