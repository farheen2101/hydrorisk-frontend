import { useNavigate } from "react-router-dom";
import { SEVERITY_COLORS } from "../data/hyderabadBounds";

export default function RiskDetailsPanel({ hotspot }) {
  const navigate = useNavigate();

  if (!hotspot) {
    return (
      <aside className="risk-panel">
        <div className="risk-panel-header">
          <AlertTriangle />
          <div>
            <h3>Risk Details</h3>
            <p>Select a marker on the map</p>
          </div>
        </div>
        <p className="risk-panel-empty">
          Tap any pin to see its live flood risk, rainfall, and saturation readings here.
        </p>
      </aside>
    );
  }

  const color = SEVERITY_COLORS[hotspot.severity] || SEVERITY_COLORS.Moderate;
  const riskOutOf10 = hotspot.risk_score != null ? Math.round((hotspot.risk_score / 100) * 10 * 10) / 10 : null;

  return (
    <aside className="risk-panel">
      <div className="risk-panel-header">
        <AlertTriangle />
        <div>
          <h3>Risk Details</h3>
          <p>{shortLocation(hotspot.location_raw)}</p>
        </div>
      </div>

      <div className="risk-panel-badges">
        <span className="severity-badge" style={{ background: color }}>
          <AlertTriangle small /> {hotspot.severity?.toUpperCase()}
        </span>
        <div className="flood-risk-chip">
          <span>Flood Risk Level</span>
          <strong>{riskOutOf10 != null ? `${riskOutOf10}/10` : "—"}</strong>
        </div>
      </div>

      <div className="risk-panel-why">
        <p className="risk-panel-why-title">
          <SearchIcon /> Why this risk?
        </p>
        <div className="risk-panel-row">
          <span>
            <CloudIcon /> Rainfall
          </span>
          <strong>{hotspot.current_day_rain_mm != null ? `${hotspot.current_day_rain_mm} mm` : "—"}</strong>
        </div>
        <div className="risk-panel-row">
          <span>
            <DropIcon /> Saturation
          </span>
          <strong>{hotspot.cum_rainfall_5day != null ? `${Math.min(99, Math.round(hotspot.cum_rainfall_5day))}%` : "—"}</strong>
        </div>
        {hotspot.severity === "Critical" && (
          <p className="risk-panel-note">
            <AlertTriangle small /> Conditions resemble Oct 2020 flood.
          </p>
        )}
      </div>

      <button
        type="button"
        className="report-cta"
        onClick={() =>
          navigate("/report", {
            state: {
              latitude: hotspot.map_latitude ?? hotspot.latitude,
              longitude: hotspot.map_longitude ?? hotspot.longitude,
              location: hotspot.location_raw,
            },
          })
        }
      >
        <BellIcon /> Report Flooding Here
        <ChevronRight />
      </button>

      <div className="stay-alert-card">
        <span className="stay-alert-icon">
          <SpeakerIcon />
        </span>
        <div>
          <strong>Stay Alert</strong>
          <p>Report nearby flooding or potholes and help keep your community safe.</p>
        </div>
        <ChevronRight />
      </div>
    </aside>
  );
}

function shortLocation(raw) {
  if (!raw) return "";
  return raw.split(",")[0];
}

function AlertTriangle({ small }) {
  const s = small ? 14 : 20;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 3 2 20h20L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CloudIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 18a4 4 0 0 1-.6-7.96A5 5 0 0 1 16 9a4.5 4.5 0 0 1 1 8.9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3s6 6.7 6 11a6 6 0 1 1-12 0c0-4.3 6-11 6-11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3a6 6 0 0 0-6 6v3.5l-1.6 3.2A1 1 0 0 0 5.3 17h13.4a1 1 0 0 0 .9-1.3L18 12.5V9a6 6 0 0 0-6-6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SpeakerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M17 9a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
