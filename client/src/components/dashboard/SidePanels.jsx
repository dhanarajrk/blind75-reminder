

function SidePanels({ stats, data = [] }) {
  const topics = {};
  data.forEach((p) => {
    if (!topics[p.topic]) topics[p.topic] = { total: 0, done: 0 };
    topics[p.topic].total += 1;
    if (p.status !== "not_started") topics[p.topic].done += 1;
  });

  const topicList = Object.entries(topics).slice(0, 6);

  const upcoming = data
    .filter((p) => p.nextReviewAt)
    .sort((a, b) => new Date(a.nextReviewAt) - new Date(b.nextReviewAt))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-4">
      <section className="paper-card p-4">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="display-serif text-base font-bold">Overview</h2>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="surface-card p-3">
            <div style={{ color: "var(--muted)" }}>Longest streak</div>
            <div className="mt-1 text-lg font-bold">{stats?.longestStreak ?? 0}</div>
          </div>
          <div className="surface-card p-3">
            <div style={{ color: "var(--muted)" }}>This month</div>
            <div className="mt-1 text-lg font-bold">{stats?.reviewsThisMonth ?? 0}</div>
          </div>
        </div>
      </section>

      <section className="paper-card p-4">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="display-serif text-base font-bold">Topic progress</h2>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>

        <div className="space-y-3">
          {topicList.map(([name, info]) => {
            const pct = info.total ? Math.round((info.done / info.total) * 100) : 0;
            return (
              <div key={name}>
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span>{name}</span>
                  <span style={{ color: "var(--muted)" }}>
                    {info.done}/{info.total}
                  </span>
                </div>
                <div
                  className="h-2 overflow-hidden rounded-sm border"
                  style={{ background: "var(--surface)", borderColor: "var(--border)" }}
                >
                  <div
                    className="h-full"
                    style={{ width: `${pct}%`, background: "var(--green)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="paper-card p-4">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="display-serif text-base font-bold">Upcoming</h2>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>

        <div className="space-y-2">
          {upcoming.length === 0 ? (
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              No upcoming reviews yet.
            </div>
          ) : (
            upcoming.map((item) => (
              <div
                key={item._id}
                className="surface-card flex items-center justify-between gap-3 px-3 py-2 text-[11px]"
              >
                <span className="truncate">{item.title}</span>
                <span style={{ color: "var(--muted)" }}>
                  {new Date(item.nextReviewAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default SidePanels;