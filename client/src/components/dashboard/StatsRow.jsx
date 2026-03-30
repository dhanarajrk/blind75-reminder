const stats = [
    { label: "Due Today", value: 0, accent: "top-accent-red" },
    { label: "Total Reviewed", value: 0, accent: "top-accent-green" },
    { label: "Day Streak 🔥", value: 0, accent: "top-accent-amber" },
    { label: "Mastered", value: 0, accent: "top-accent-blue" },
    { label: "Not Started", value: 75, accent: "top-accent-muted" },
  ];
  
  function StatsRow() {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((item) => (
          <div
            key={item.label}
            className={`paper-card stat-card ${item.accent} p-4`}
          >
            <div className="display-serif text-4xl font-black leading-none">
              {item.value}
            </div>
            <div
              className="mt-2 text-[11px] uppercase tracking-wider"
              style={{ color: "var(--muted)" }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export default StatsRow;