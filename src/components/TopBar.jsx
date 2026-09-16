import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function TopBar({ search, onSearchChange, alertCount = 1 }) {
  const { dark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <Logo size={36} />
        <div className="topbar-title">
          <span className="topbar-title-main">
            Hydro<span className="accent">Risk</span>
          </span>
          <span className="topbar-title-sub">Citizen View</span>
        </div>
      </div>

      <div className="topbar-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search location (e.g. Banjara Hills, Hyderabad...)"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>

      <div className="topbar-actions">
        <button
          className={`theme-toggle ${dark ? "is-dark" : ""}`}
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          aria-pressed={dark}
          type="button"
        >
          <span className="theme-toggle-sun">☀</span>
          <span className="theme-toggle-knob" />
          <span className="theme-toggle-moon">☾</span>
        </button>

        <button className="icon-btn" type="button" aria-label="Alerts" onClick={() => navigate("/risk-updates")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3a6 6 0 0 0-6 6v3.5l-1.6 3.2A1 1 0 0 0 5.3 17h13.4a1 1 0 0 0 .9-1.3L18 12.5V9a6 6 0 0 0-6-6Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M9.5 20a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          {alertCount > 0 && <span className="badge-dot">{alertCount}</span>}
        </button>

        <div className="user-menu">
          <button className="user-chip" type="button" onClick={() => setMenuOpen((o) => !o)}>
            <span className="avatar">{initials}</span>
            <span className="user-name">{user?.name ?? "Guest"}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          {menuOpen && (
            <div className="user-menu-dropdown">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/settings");
                }}
              >
                Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  signOut();
                  navigate("/signin");
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
