export function exportJSON(pieces) {
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
    }))
  };

  const text = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(text);
  alert("JSON copied to clipboard");
}
