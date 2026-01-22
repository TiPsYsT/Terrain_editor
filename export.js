export function exportJSON(pieces, objectives = []) {
  const data = {
    pieces: pieces.map(p => ({
      type: p.type,
      color: p.color,
      x: Math.round(p.x),
      y: Math.round(p.y),
      w: p.w,
      h: p.h,
      rotation: p.rotation,
      walls: p.walls
    })),

    objectives: objectives.map(o => ({
      x: o.x,
      y: o.y
    }))
  };

  const text = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(text);
  alert("Terrain + objectives JSON copied to clipboard");
}
