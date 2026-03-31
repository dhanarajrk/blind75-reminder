import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
} from "recharts";

function ConsistencyPanel({ data = [], stats }) {
  const chartData = data.map((item, index, arr) => ({
    ...item,
    shortDate: new Date(item.date).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    isToday: index === arr.length - 1,
  }));

  const todayPoint = chartData[chartData.length - 1];

  return (
    <section className="paper-card min-w-0 p-3 sm:p-4">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="display-serif text-base font-bold">Consistency</h2>
        <div className="h-px flex-1" style={{ background: "var(--border)" }} />
      </div>

      <div className="mb-2 flex flex-wrap gap-2 text-[11px]">
        <div className="surface-card px-2.5 py-1 flex items-center gap-1.5">
          <span style={{ color: "var(--muted)" }}>Streak</span>
          <span className="font-bold">{stats?.longestStreak ?? 0}</span>
        </div>

        <div className="surface-card px-2.5 py-1 flex items-center gap-1.5">
          <span style={{ color: "var(--muted)" }}>Week</span>
          <span className="font-bold">{stats?.reviewsThisWeek ?? 0}</span>
        </div>

        <div className="surface-card px-2.5 py-1 flex items-center gap-1.5">
          <span style={{ color: "var(--muted)" }}>Month</span>
          <span className="font-bold">{stats?.reviewsThisMonth ?? 0}</span>
        </div>
      </div>

      <div className="w-full h-[120px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <LineChart
            data={chartData}
            margin={{ top: 4, right: 6, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="shortDate"
              tick={{ fontSize: 9, fill: "var(--muted)" }}
              minTickGap={28}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                fontSize: "11px",
                borderRadius: "4px",
              }}
              labelStyle={{ color: "var(--ink)" }}
            />

            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--red)"
              strokeWidth={1.4}
              dot={false}
              activeDot={{ r: 3 }}
              name="Reviews"
            />

            <Line
              type="monotone"
              dataKey="avg7"
              stroke="var(--blue)"
              strokeWidth={1.4}
              dot={false}
              activeDot={{ r: 3 }}
              name="7-day avg"
            />

            {todayPoint && (
              <ReferenceDot
                x={todayPoint.shortDate}
                y={todayPoint.count}
                r={3}
                fill="var(--red)"
                stroke="var(--ink)"
                strokeWidth={1}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ConsistencyPanel;