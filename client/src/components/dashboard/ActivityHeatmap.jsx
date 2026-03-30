function ActivityHeatmap() {
    const cells = Array.from({ length: 7 * 20 }, (_, i) => i);
  
    return (
      <section className="paper-card p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="display-serif text-lg font-bold">Activity</h2>
          <div
            className="h-px flex-1"
            style={{ background: "var(--border)" }}
          />
        </div>
  
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            GitHub-style review activity overview
          </p>
          <p className="text-[11px]" style={{ color: "var(--muted)" }}>
            last 12 months
          </p>
        </div>
  
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="mb-2 grid grid-cols-[auto_1fr] gap-3">
              <div />
              <div className="grid grid-cols-12 text-[10px]" style={{ color: "var(--muted)" }}>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
              </div>
            </div>
  
            <div className="grid grid-cols-[auto_1fr] gap-3">
              <div className="grid grid-rows-7 gap-1 text-[10px]" style={{ color: "var(--muted)" }}>
                <span className="h-3">Mon</span>
                <span className="h-3"></span>
                <span className="h-3">Wed</span>
                <span className="h-3"></span>
                <span className="h-3">Fri</span>
                <span className="h-3"></span>
                <span className="h-3">Sun</span>
              </div>
  
              <div className="grid grid-flow-col grid-rows-7 gap-1">
                {cells.map((cell) => {
                  const level = cell % 5;
                  const backgrounds = [
                    "var(--surface)",
                    "color-mix(in srgb, var(--green) 20%, var(--surface) 80%)",
                    "color-mix(in srgb, var(--green) 40%, var(--surface) 60%)",
                    "color-mix(in srgb, var(--green) 65%, var(--surface) 35%)",
                    "var(--green)",
                  ];
  
                  return (
                    <div
                      key={cell}
                      className="h-3 w-3 rounded-[2px] border"
                      style={{
                        background: backgrounds[level],
                        borderColor: "var(--border)",
                      }}
                      title={`Sample activity ${cell + 1}`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default ActivityHeatmap;