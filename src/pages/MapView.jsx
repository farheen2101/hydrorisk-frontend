import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import MapPanel from "../components/MapPanel";
import RiskDetailsPanel from "../components/RiskDetailsPanel";
import StatsBar from "../components/StatsBar";
import { getRiskScores } from "../lib/api";

export default function MapView() {
  const { search } = useOutletContext();
  const [hotspots, setHotspots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [riskFilter, setRiskFilter] = useState("All Risk Levels");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRiskScores()
      .then((data) => {
        if (cancelled) return;
        setHotspots(data);
        // Default the risk panel to the highest-risk hotspot, like the mock.
        const top = [...data].sort((a, b) => (b.risk_score ?? 0) - (a.risk_score ?? 0))[0];
        setSelected(top ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't reach the HydroRisk API.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredBySearch = useMemo(() => {
    if (!search.trim()) return hotspots;
    const q = search.trim().toLowerCase();
    return hotspots.filter((h) => h.location_raw?.toLowerCase().includes(q));
  }, [hotspots, search]);

  const summary = useMemo(() => {
    if (!hotspots.length) return null;
    const avg = (key) => hotspots.reduce((sum, h) => sum + (h[key] ?? 0), 0) / hotspots.length;
    const criticalCount = hotspots.filter((h) => h.severity === "Critical").length;
    return {
      rainfallMm: round1(avg("current_day_rain_mm")),
      saturationPct: Math.min(99, Math.round(avg("cum_rainfall_5day"))),
      criticalCount,
    };
  }, [hotspots]);

  const lastUpdated = new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" });

  return (
    <div className="mapview-page">
      <div className="mapview-main">
        <MapPanel
          hotspots={filteredBySearch}
          loading={loading}
          error={error}
          selected={selected}
          onSelect={setSelected}
          riskFilter={riskFilter}
          onRiskFilterChange={setRiskFilter}
        />

        <StatsBar
          rainfallMm={summary?.rainfallMm}
          saturationPct={summary?.saturationPct}
          riskLabel={summary ? (summary.criticalCount > 0 ? "Critical" : "Moderate") : "—"}
          riskAreasNote={summary ? `${summary.criticalCount} Critical area${summary.criticalCount === 1 ? "" : "s"}` : ""}
          lastUpdated={lastUpdated}
        />
      </div>

      <RiskDetailsPanel hotspot={selected} />
    </div>
  );
}

function round1(n) {
  return Math.round(n * 10) / 10;
}
