import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [units, setUnits] = useState("metric");

  return (
    <div className="page-panel">
      <div className="page-panel-header">
        <h2>Settings</h2>
        <p>Manage your account and how HydroRisk alerts you.</p>
      </div>

      <div className="settings-section">
        <h3>Account</h3>
        <div className="settings-row">
          <span>Name</span>
          <span>{user?.name ?? "Guest"}</span>
        </div>
        <div className="settings-row">
          <span>Email</span>
          <span>{user?.email ?? "—"}</span>
        </div>
        <button type="button" className="settings-signout" onClick={signOut}>
          Sign out
        </button>
      </div>

      <div className="settings-section">
        <h3>Preferences</h3>
        <label className="settings-toggle-row">
          <span>Flood risk notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
        </label>
        <label className="settings-row">
          <span>Units</span>
          <select value={units} onChange={(e) => setUnits(e.target.value)}>
            <option value="metric">Metric (mm, °C)</option>
            <option value="imperial">Imperial (in, °F)</option>
          </select>
        </label>
      </div>
    </div>
  );
}
