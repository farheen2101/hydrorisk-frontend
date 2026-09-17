import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { getRiskScores } from "../lib/api";
import { SEVERITY_COLORS } from "../data/hyderabadBounds";
import RiskDetailsPanel from "../components/RiskDetailsPanel";

export default function RiskUpdates() {
  const { search } = useOutletContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getRiskScores()
      .then((data) => {
        const sorted = [...data].sort((a, b) => (b.risk_score ?? 0) - (a.risk_score ?? 0));
        setItems(sorted);
      })
      .catch((err) => setError(err.message || "Couldn't reach the HydroRisk API."))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    if (!search?.trim()) return items;
    const q = search.trim().toLowerCase();
    return items.filter((h) => h.location_raw?.toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="riskupdates-page">
      <div className="page-panel">
        <div className="page-panel-header">
          <h2>Risk Updates</h2>
          <p>Live hotspot readings across Hyderabad, ranked by current risk score.</p>
        </div>

        {loading && <p className="page-panel-status">Loading updates…</p>}
        {error && <p className="page-panel-status page-panel-status-error">{error}</p>}
        {!loading && !error && filteredItems.length === 0 && (
          <p className="page-panel-status">No locations match "{search}".</p>
        )}

        <ul className="update-list">
          {filteredItems.map((h) => (
            <li
              key={h.hotspot_id}
              className={`update-row update-row-clickable ${selected?.hotspot_id === h.hotspot_id ? "is-selected" : ""}`}
              onClick={() => setSelected(h)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(h);
              }}
            >
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

      <RiskDetailsPanel hotspot={selected} />
    </div>
  );
}