const rows = [
    {
      id: 1,
      name: "Two Sum",
      topic: "Array",
      diff: "easy",
      defaultInterval: "21d",
      customInterval: "21d",
      nextReview: "not started",
      streak: "—",
    },
    {
      id: 35,
      name: "Merge Intervals",
      topic: "Interval",
      diff: "medium",
      defaultInterval: "14d",
      customInterval: "10d",
      nextReview: "in 2d",
      streak: "🔥2",
    },
    {
      id: 20,
      name: "Word Break",
      topic: "DP",
      diff: "medium",
      defaultInterval: "10d",
      customInterval: "10d",
      nextReview: "today",
      streak: "🔥4",
    },
  ];
  
  function ProblemsTable() {
    return (
      <section className="paper-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: "var(--border)" }}
        >
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full border px-3 py-2 text-sm md:max-w-xs"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
          />
  
          <div className="flex flex-wrap gap-2">
            {["All topics", "All difficulty", "All status", "All risk"].map((item) => (
              <select
                key={item}
                className="border px-3 py-2 text-sm"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--ink)",
                }}
              >
                <option>{item}</option>
              </select>
            ))}
          </div>
        </div>
  
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr style={{ background: "var(--ink)", color: "var(--bg)" }}>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Problem</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Topic</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Diff</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Default</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Custom</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Next review</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Streak</th>
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
  
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>
                    {String(row.id).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{row.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>
                    {row.topic}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span
                      className="inline-block rounded px-2 py-1"
                      style={{
                        background:
                          row.diff === "easy"
                            ? "#d4edda"
                            : row.diff === "medium"
                            ? "#fff3cd"
                            : "#fde8e4",
                        color:
                          row.diff === "easy"
                            ? "#1a6b3a"
                            : row.diff === "medium"
                            ? "#7a5000"
                            : "#8b1a0a",
                      }}
                    >
                      {row.diff}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{row.defaultInterval}</td>
                  <td className="px-4 py-3 text-sm">{row.customInterval}</td>
                  <td className="px-4 py-3 text-xs">{row.nextReview}</td>
                  <td className="px-4 py-3 text-xs">{row.streak}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="border px-2 py-1 text-[11px]"
                        style={{
                          background: "#d4edda",
                          borderColor: "#a0d4b0",
                          color: "#1a6b3a",
                        }}
                      >
                        Solved ✓
                      </button>
                      <button
                        className="border px-2 py-1 text-[11px]"
                        style={{
                          background: "#fde8e4",
                          borderColor: "#f0b0a8",
                          color: "#8b1a0a",
                        }}
                      >
                        Struggled ✗
                      </button>
                      <button
                        className="border px-2 py-1 text-[11px]"
                        style={{
                          background: "var(--surface)",
                          borderColor: "var(--border)",
                          color: "var(--ink)",
                        }}
                      >
                        Edit interval
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  
  export default ProblemsTable;