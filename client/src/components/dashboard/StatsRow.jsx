function StatsRow({ stats }) {
  const items = [
    { label: "Due Today", value: stats?.dueToday ?? 0, accent: "top-accent-red" },
    { label: "Problems Seen", value: stats?.problemsSeen ?? 0, accent: "top-accent-green" },
    { label: "Mastered", value: stats?.mastered ?? 0, accent: "top-accent-blue" },
    { label: "Questions Left", value: stats?.questionsLeft ?? 75, accent: "top-accent-muted" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className={`paper-card stat-card px-4 py-3 ${item.accent}`}
        >
          <div className="display-serif text-3xl font-black leading-none">
            {item.value}
          </div>
          <div
            className="mt-1 text-[10px] uppercase tracking-wider"
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