function TopicProgressPanel() {
    const topics = [
      ["Array", "3/10"],
      ["Binary", "0/5"],
      ["DP", "0/10"],
      ["Graph", "0/8"],
      ["Tree", "0/14"],
    ];
  
    return (
      <section className="paper-card p-4">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="display-serif text-lg font-bold">Topic progress</h2>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>
  
        <div className="space-y-4">
          {topics.map(([name, count], i) => (
            <div key={name}>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium">{name}</span>
                <span style={{ color: "var(--muted)" }}>{count}</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-sm border"
                style={{ background: "var(--surface)", borderColor: "var(--border)" }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${20 + i * 12}%`,
                    background: "var(--green)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  function UpcomingReviewsPanel() {
    const items = [
      "Two Sum — tomorrow",
      "Merge Intervals — in 2d",
      "Word Break — in 3d",
      "Clone Graph — in 4d",
    ];
  
    return (
      <section className="paper-card p-4">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="display-serif text-lg font-bold">Upcoming reviews</h2>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>
  
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item}
              className="surface-card flex items-center justify-between gap-3 px-3 py-2 text-xs"
            >
              <span>{item.split(" — ")[0]}</span>
              <span style={{ color: "var(--muted)" }}>{item.split(" — ")[1]}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  function IntervalLegendPanel() {
    const lines = [
      ["Easy + Array/String + Hash", "21 days"],
      ["Easy + DP + Recursion", "11 days"],
      ["Medium + Graph + BFS/DFS", "11 days"],
      ["Hard + Tree + Recursion", "3 days"],
      ["Custom interval override", "user defined"],
    ];
  
    return (
      <section className="paper-card p-4">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="display-serif text-lg font-bold">Interval legend</h2>
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
        </div>
  
        <div className="space-y-3 text-xs">
          {lines.map(([left, right]) => (
            <div key={left} className="flex items-start justify-between gap-3">
              <span style={{ color: "var(--muted)" }}>{left}</span>
              <span className="font-medium">{right}</span>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  function SidePanels() {
    return (
      <div className="flex flex-col gap-4">
        <TopicProgressPanel />
        <UpcomingReviewsPanel />
        <IntervalLegendPanel />
      </div>
    );
  }
  
  export default SidePanels;