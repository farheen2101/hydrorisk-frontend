import { SEVERITY_COLORS } from "../data/hyderabadBounds";

const ITEMS = [
  { label: "Critical", color: SEVERITY_COLORS.Critical },
  { label: "High", color: SEVERITY_COLORS.High },
  { label: "Moderate", color: SEVERITY_COLORS.Moderate },
  { label: "Low", color: SEVERITY_COLORS.Low },
  { label: "Pothole", color: SEVERITY_COLORS.Pothole },
];

export default function MarkerLegend() {
  return (
    <div className="legend">
      {ITEMS.map((item) => (
        <span className="legend-item" key={item.label}>
          <span className="legend-dot" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
