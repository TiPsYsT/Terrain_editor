export function exportJSON(pieces) {
  const data = {
    pieces: pieces.map(p => ({
      type: p.type,
      x: Math.round(p.x),
      y: Math.round(p.y),
      w: p.w,
      h: p.h,
      rotation: p.rotation,
      walls: p.walls
    }))
  };

  const json = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(json);
  alert("Terrain JSON copied to clipboard");
}
