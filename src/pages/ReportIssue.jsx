import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PhotoUpload from "../components/PhotoUpload";
import { submitReport } from "../lib/api";

const SEVERITIES = ["Minor", "Major", "Critical"];

export default function ReportIssue() {
  const location = useLocation();
  const navigate = useNavigate();
  const prefill = location.state || {};

  const [locationLabel, setLocationLabel] = useState(prefill.location || "");
  const [latitude, setLatitude] = useState(prefill.latitude ?? "");
  const [longitude, setLongitude] = useState(prefill.longitude ?? "");
  const [severity, setSeverity] = useState("Major");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location access - enter coordinates manually.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
      },
      () => setError("Couldn't get your location - enter coordinates manually.")
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (Number.isNaN(lat) || lat < 17 || lat > 18) {
      setError("Latitude must be a number between 17 and 18 (within Hyderabad).");
      return;
    }
    if (Number.isNaN(lng) || lng < 78 || lng > 79) {
      setError("Longitude must be a number between 78 and 79 (within Hyderabad).");
      return;
    }

    setSubmitting(true);
    try {
      // Note: the backend's /reports endpoint (see main.py + schemas.py)
      // doesn't accept a photo yet - CitizenReportCreate has no image
      // field. The photo is captured here and kept with the report client
      // side so the UI is ready the moment the backend adds a multipart
      // upload route or an image URL column.
      await submitReport({
        latitude: lat,
        longitude: lng,
        severity,
        description: description || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Couldn't submit your report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="page-panel">
        <div className="report-success">
          <span className="report-success-icon">✓</span>
          <h2>Report received</h2>
          <p>Thanks for flagging this - it helps keep the map accurate for everyone nearby.</p>
          <button type="button" className="auth-submit" onClick={() => navigate("/")}>
            Back to map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-panel">
      <div className="page-panel-header">
        <h2>Report Flooding or a Pothole</h2>
        <p>Your report adds to HydroRisk's live dataset and helps neighbors avoid the same spot.</p>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <label>
          Location
          <input
            type="text"
            placeholder="e.g. Near Kukatpally Metro Station"
            value={locationLabel}
            onChange={(e) => setLocationLabel(e.target.value)}
          />
        </label>

        <div className="report-form-grid">
          <label>
            Latitude
            <input
              type="text"
              placeholder="17.4321"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </label>
          <label>
            Longitude
            <input
              type="text"
              placeholder="78.4567"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </label>
        </div>

        <button type="button" className="use-location-btn" onClick={useCurrentLocation}>
          <PinIcon /> Use my current location
        </button>

        <label>
          Severity
          <div className="severity-options">
            {SEVERITIES.map((level) => (
              <button
                key={level}
                type="button"
                className={`severity-pill ${severity === level ? "is-active" : ""}`}
                onClick={() => setSeverity(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </label>

        <label>
          Description <span className="optional-tag">optional</span>
          <textarea
            placeholder="e.g. Ankle-deep water near the bus stop, traffic backing up"
            maxLength={500}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Photo <span className="optional-tag">optional</span>
          <PhotoUpload onChange={setPhoto} />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit Report"}
        </button>
      </form>
    </div>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22s7-7.6 7-13a7 7 0 1 0-14 0c0 5.4 7 13 7 13Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
