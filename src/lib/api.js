// Thin wrapper around the HydroRisk FastAPI backend (see /main.py in the
// backend folder). Change VITE_API_BASE_URL in a .env file if the API
// isn't running on the default localhost port.

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch {
      // ignore, keep statusText
    }
    throw new Error(detail);
  }
  return res.json();
}

export function getHotspots() {
  return request("/hotspots");
}

export function getRiskScores(rainfallOverrideMm) {
  const qs =
    rainfallOverrideMm !== undefined && rainfallOverrideMm !== null
      ? `?rainfall_override_mm=${encodeURIComponent(rainfallOverrideMm)}`
      : "";
  return request(`/risk-scores${qs}`);
}

export function getReports() {
  return request("/reports");
}

export function getReportsCount() {
  return request("/reports/count");
}

// `photoFile` (optional) is kept client-side today since the backend's
// CitizenReportCreate schema doesn't yet accept an image. It's wired up
// here so the field just needs a backend column + multipart route to go
// live - see the note in ReportIssue.jsx.
export function submitReport({ latitude, longitude, severity, description }) {
  return request("/reports", {
    method: "POST",
    body: JSON.stringify({ latitude, longitude, severity, description }),
  });
}

export { BASE_URL };
