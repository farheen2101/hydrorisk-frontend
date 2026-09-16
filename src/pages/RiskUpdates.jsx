import { useEffect, useState } from "react";
import { getRiskScores } from "../lib/api";
import { SEVERITY_COLORS } from "../data/hyderabadBounds";

export default function RiskUpdates() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRiskScores()
      .then((data) => setItems([...data].sort((a, b) => (b.risk_score ?? 0) - (a.risk_score ?? 0))))
      .catch((err) => setError(err.message || "Couldn't reach the HydroRisk API."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-panel">
      <div className="page-panel-header">
        <h2>Risk Updates</h2>
        <p>Live hotspot readings across Hyderabad, ranked by current risk score.</p>
      </div>

      {loading && <p className="page-panel-status">Loading updates…</p>}
      {error && <p className="page-panel-status page-panel-status-error">{error}</p>}

      <ul className="update-list">
        {items.map((h) => (
          <li key={h.hotspot_id} className="update-row">
            <span
              className="update-dot"
              style={{ background: SEVERITY_COLORS[h.severity] || SEVERITY_COLORS.Moderate }}
            />
            <div className="update-body">
              <strong>{h.location_raw?.split(",")[0]}</strong>
              <span>{h.location_raw}</span>
            </div>
            <div className="update-meta">
              <span className="update-severity">{h.severity}</span>
              <span className="update-score">{h.risk_score != null ? `${Math.round(h.risk_score)}/100` : "—"}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
