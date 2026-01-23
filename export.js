export function exportJSON(data) {
  // Bakåtkompatibilitet:
  // om man råkar skicka bara pieces-array
  if (Array.isArray(data)) {
    data = { terrain: { pieces: data } };
  }

  const out = {
    terrain: data.terrain ?? { pieces: [] },
    objectives: data.objectives ?? [],
    deployment: data.deployment ?? []
  };

  const text = JSON.stringify(out, null, 2);

  navigator.clipboard.writeText(text)
    .then(() => alert("JSON copied to clipboard"))
    .catch(() => alert("Failed to copy JSON"));
}
