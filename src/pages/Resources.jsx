const RESOURCES = [
  {
    title: "GHMC Disaster Management Helpline",
    detail: "Call 040-21111111 to report large-scale waterlogging or request emergency assistance.",
  },
  {
    title: "Before the monsoon",
    detail: "Clear roof and balcony drains, keep sandbags ready if you're in a known low-lying area.",
  },
  {
    title: "During heavy rain",
    detail: "Avoid underpasses and flooded roads - even shallow, fast-moving water can sweep a vehicle away.",
  },
  {
    title: "After flooding",
    detail: "Don't reconnect electrical mains until a professional has checked for water damage.",
  },
];

export default function Resources() {
  return (
    <div className="page-panel">
      <div className="page-panel-header">
        <h2>Resources</h2>
        <p>Practical guidance for staying safe before, during, and after flooding.</p>
      </div>

      <ul className="resource-list">
        {RESOURCES.map((r) => (
          <li key={r.title} className="resource-card">
            <h3>{r.title}</h3>
            <p>{r.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
