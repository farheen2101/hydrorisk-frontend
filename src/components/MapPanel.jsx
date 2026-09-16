import { useMemo, useState } from "react";
import { projectToPercent, SEVERITY_COLORS } from "../data/hyderabadBounds";
import MarkerLegend from "./MarkerLegend";

const RISK_LEVELS = ["All Risk Levels", "Critical", "High", "Moderate", "Low", "Pothole"];

const AREA_LABELS = [
  { name: "Secunderabad", x: 74, y: 30 },
  { name: "Balanagar", x: 22, y: 46 },
  { name: "Miyapur", x: 14, y: 30 },
  { name: "Kukatpally", x: 44, y: 22 },
  { name: "Hyderabad City", x: 46, y: 56 },
  { name: "Mehdipatnam", x: 34, y: 66 },
  { name: "Rajendranagar", x: 24, y: 72 },
  { name: "Charminar", x: 56, y: 70 },
  { name: "LB Nagar", x: 78, y: 62 },
  { name: "Shamshabad", x: 38, y: 86 },
];

export default function MapPanel({ hotspots, loading, error, selected, onSelect, riskFilter, onRiskFilterChange }) {
  const [zoom, setZoom] = useState(1);

  const visible = useMemo(() => {
    if (riskFilter === "All Risk Levels") return hotspots;
    return hotspots.filter((h) => h.severity === riskFilter);
  }, [hotspots, riskFilter]);

  return (
    <div className="map-panel">
      <div className="map-panel-header">
        <div className="location-pill">
          <PinIcon /> Hyderabad
          <ChevronDown />
        </div>

        <div className="risk-filter">
          <select value={riskFilter} onChange={(e) => onRiskFilterChange(e.target.value)}>
            {RISK_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <ChevronDown />
        </div>
      </div>

      <div className="map-canvas" style={{ transform: `scale(${zoom})` }}>
        <div className="map-canvas-city">Hyderabad</div>

        {AREA_LABELS.map((area) => (
          <span
            key={area.name}
            className="map-area-label"
            style={{ left: `${area.x}%`, top: `${area.y}%` }}
          >
            {area.name}
          </span>
        ))}

        {loading && <div className="map-canvas-status">Loading hotspots…</div>}
        {error && <div className="map-canvas-status map-canvas-status-error">{error}</div>}

        {!loading &&
          !error &&
          visible.map((h) => {
            const { x, y } = projectToPercent(h.map_latitude ?? h.latitude, h.map_longitude ?? h.longitude);
            const color = SEVERITY_COLORS[h.severity] || SEVERITY_COLORS.Moderate;
            const isSelected = selected?.hotspot_id === h.hotspot_id;
            return (
              <button
                key={h.hotspot_id}
                type="button"
                className={`map-marker ${isSelected ? "is-selected" : ""}`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => onSelect(h)}
                title={h.location_raw}
              >
                {isSelected && <span className="map-marker-badge" style={{ background: color }}>{h.severity}</span>}
                <span className="map-marker-dot" style={{ background: color }} />
                <span className="map-marker-pulse" style={{ background: color }} />
              </button>
            );
          })}

        <span className="map-count-chip" style={{ left: "94%", top: "36%" }}>
          {visible.length}
        </span>
      </div>

      <div className="map-controls">
        <button type="button" onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))} aria-label="Zoom in">
          +
        </button>
        <button type="button" onClick={() => setZoom((z) => Math.max(0.8, z - 0.15))} aria-label="Zoom out">
          −
        </button>
        <button type="button" onClick={() => setZoom(1)} aria-label="Recenter">
          <TargetIcon />
        </button>
      </div>

      <div className="map-panel-footer">
        <MarkerLegend />
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22s7-7.6 7-13a7 7 0 1 0-14 0c0 5.4 7 13 7 13Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
