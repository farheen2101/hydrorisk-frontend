// Rough bounding box around Greater Hyderabad, used only to position
// hotspot markers on the stylized (non-tile) map panel as simple
// percentages. This is intentionally approximate - it's a schematic risk
// map, not a georeferenced one.
export const HYDERABAD_BOUNDS = {
  minLat: 17.25,
  maxLat: 17.55,
  minLng: 78.32,
  maxLng: 78.62,
};

export function projectToPercent(lat, lng) {
  const { minLat, maxLat, minLng, maxLng } = HYDERABAD_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  // Latitude increases upward, screen y increases downward - invert.
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
  return {
    x: Math.min(96, Math.max(4, x)),
    y: Math.min(94, Math.max(6, y)),
  };
}

export const SEVERITY_COLORS = {
  Critical: "#E9483F",
  High: "#F59E0B",
  Moderate: "#F2C94C",
  Low: "#34B27A",
  Pothole: "#8B5CF6",
};
