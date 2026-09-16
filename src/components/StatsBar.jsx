export default function StatsBar({ rainfallMm, saturationPct, riskLabel, riskAreasNote, lastUpdated }) {
  const stats = [
    {
      icon: <CloudIcon />,
      iconClass: "stat-icon-rain",
      label: "Live Rainfall",
      value: rainfallMm != null ? `${rainfallMm} mm` : "—",
      note: rainfallCategory(rainfallMm),
    },
    {
      icon: <DropIcon />,
      iconClass: "stat-icon-saturation",
      label: "Soil Saturation",
      value: saturationPct != null ? `${saturationPct}%` : "—",
      note: saturationCategory(saturationPct),
    },
    {
      icon: <AlertIcon />,
      iconClass: "stat-icon-risk",
      label: "Flood Risk Level",
      value: riskLabel,
      note: riskAreasNote,
      valueClass: "stat-value-danger",
    },
    {
      icon: <CalendarIcon />,
      iconClass: "stat-icon-updated",
      label: "Last Updated",
      value: lastUpdated,
      note: "just now",
    },
  ];

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div className="stat-card" key={s.label}>
          <span className={`stat-icon ${s.iconClass}`}>
            {s.icon}
          </span>
          <div className="stat-body">
            <span className="stat-label">{s.label}</span>
            <span className={`stat-value ${s.valueClass ?? ""}`}>{s.value}</span>
            <span className="stat-note">{s.note}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function rainfallCategory(mm) {
  if (mm == null) return "";
  if (mm < 2.5) return "Light Rain";
  if (mm < 15) return "Moderate Rain";
  return "Heavy Rain";
}

function saturationCategory(pct) {
  if (pct == null) return "";
  if (pct < 40) return "Low Saturation";
  if (pct < 75) return "Moderate Saturation";
  return "High Saturation";
}

function CloudIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3s6 6.7 6 11a6 6 0 1 1-12 0c0-4.3 6-11 6-11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 2 20h20L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill="currentColor" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
