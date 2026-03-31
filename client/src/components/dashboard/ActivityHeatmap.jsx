function formatDateLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ActivityHeatmap({ data = [] }) {
  const recent = data.slice(-30);
  const safeRecent =
    recent.length === 30
      ? recent
      : Array.from({ length: 30 }, (_, i) => {
        const item = recent[i];
        return item || { date: `empty-${i}`, count: 0, isPlaceholder: true };
      });

  const maxCount = Math.max(...safeRecent.map((d) => d.count || 0), 1);
  const todayStr = new Date().toISOString().split("T")[0];

  const getBarColor = (count) => {
    if (count === 0) return "var(--surface)";
    if (count <= 2) return "color-mix(in srgb, var(--green) 35%, var(--surface) 65%)";
    if (count <= 4) return "color-mix(in srgb, var(--green) 60%, var(--surface) 40%)";
    return "var(--green)";
  };

  return (
    <section className="paper-card min-w-0 p-3 sm:p-4">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="display-serif text-base font-bold">
          Recent Review Activity
        </h2>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="surface-card px-3 py-3">
        <div
          className="mb-3 grid items-end gap-[6px]"
          style={{
            gridTemplateColumns: "repeat(30, minmax(0, 1fr))",
            height: "100px",
          }}
        >
          {safeRecent.map((day, index) => {
            const count = day.count || 0;
            const isToday = day.date === todayStr;
            const heightPx = count === 0 ? 10 : Math.max(14, (count / maxCount) * 78);

            return (
              <div
                key={day.date || index}
                className="flex h-full items-end"
                title={
                  day.isPlaceholder
                    ? ""
                    : `${formatDateLabel(day.date)} — ${count} review${count !== 1 ? "s" : ""}`
                }
              >
                <div className="w-full">
                  <div
                    className="w-full rounded-[3px] border transition-opacity hover:opacity-80"
                    style={{
                      height: `${heightPx}px`,
                      background: getBarColor(count),
                      borderColor: isToday ? "var(--red)" : "var(--border)",
                      boxShadow: isToday ? "0 0 0 1px var(--red)" : "none",
                    }}
                  />
                  <div
                    className="mt-1 h-[3px] w-full rounded-full"
                    style={{
                      background: isToday ? "var(--red)" : "transparent",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="flex items-center justify-between text-[10px]"
          style={{ color: "var(--muted)" }}
        >
          <span>30 days ago</span>

          <div className="flex items-center gap-2">
            <span>Less</span>
            <span
              className="h-3 w-3 rounded-[2px] border"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            />
            <span
              className="h-3 w-3 rounded-[2px] border"
              style={{
                background:
                  "color-mix(in srgb, var(--green) 35%, var(--surface) 65%)",
                borderColor: "var(--border)",
              }}
            />
            <span
              className="h-3 w-3 rounded-[2px] border"
              style={{
                background:
                  "color-mix(in srgb, var(--green) 60%, var(--surface) 40%)",
                borderColor: "var(--border)",
              }}
            />
            <span
              className="h-3 w-3 rounded-[2px] border"
              style={{
                background: "var(--green)",
                borderColor: "var(--border)",
              }}
            />
            <span>More</span>
          </div>

          <span>Today</span>
        </div>
      </div>
    </section>
  );
}

export default ActivityHeatmap;