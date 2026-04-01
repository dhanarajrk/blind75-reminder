import { useCallback, useEffect, useMemo, useState } from "react";
import StatsRow from "../components/dashboard/StatsRow";
import ConsistencyPanel from "../components/dashboard/ConsistencyPanel";
import SidePanels from "../components/dashboard/SidePanels";
import ProblemsTable from "../components/problems/ProblemsTable";
import ReviewQueueModal from "../components/dashboard/ReviewQueueModal";
import StreakCalendarPanel from "../components/dashboard/StreakCalendarPanel";
import { useAuthStore } from "../store/authStore";
import { fetchDashboard } from "../api/problemApi";
import { fetchAnalytics } from "../api/analyticsApi";

function DashboardPage() {
  const token = useAuthStore((s) => s.token);

  const now = new Date();
  const [calendarView, setCalendarView] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });

  const [data, setData] = useState([]);
  const [analytics, setAnalytics] = useState({
    stats: null,
    consistency: [],
    calendar: null,
  });
  const [queueOpen, setQueueOpen] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;

    try {
      const [dashboardRes, analyticsRes] = await Promise.all([
        fetchDashboard(token),
        fetchAnalytics(token, {
          year: calendarView.year,
          month: calendarView.month,
        }),
      ]);

      setData(dashboardRes);
      setAnalytics(analyticsRes);
    } catch (err) {
      console.error(err);
    }
  }, [token, calendarView.year, calendarView.month]);

  useEffect(() => {
    load();
  }, [load]);

  const dueCount = useMemo(() => {
    const current = new Date();
    const today = new Date(
      current.getFullYear(),
      current.getMonth(),
      current.getDate()
    );

    return data.filter((p) => {
      if (!p.nextReviewAt) return false;
      const target = new Date(p.nextReviewAt);
      const targetDay = new Date(
        target.getFullYear(),
        target.getMonth(),
        target.getDate()
      );
      return targetDay <= today;
    }).length;
  }, [data]);

  const handlePrevMonth = () => {
    setCalendarView((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCalendarView((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  return (
    <div className="space-y-5">
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-1 pb-2 text-[11px]"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium" style={{ color: "var(--ink)" }}>
            Today
          </span>
          <span>{analytics.stats?.dueToday ?? 0} due</span>
          <span>•</span>
          <span>{analytics.stats?.reviewsThisWeek ?? 0} this week</span>
        </div>

        <button
          onClick={() => setQueueOpen(true)}
          className="relative border px-3 py-1.5 text-[11px]"
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            borderColor: "var(--ink)",
          }}
        >
          Review Now
          {dueCount > 0 && (
            <span
              className="absolute -bottom-2 left-1/2 flex h-4 min-w-4 -translate-x-1/2 items-center justify-center rounded-full px-1 text-[10px] font-bold"
              style={{
                background: "var(--red)",
                color: "white",
              }}
            >
              {dueCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-5 min-w-0">
          <StatsRow stats={analytics.stats} />
          <ProblemsTable data={data} reload={load} />
        </div>

        <div className="space-y-5 min-w-0">
          <StreakCalendarPanel
            calendar={analytics.calendar}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <ConsistencyPanel data={analytics.consistency} stats={analytics.stats} />
          <SidePanels data={data} />
        </div>
      </div>

      <ReviewQueueModal
        open={queueOpen}
        onClose={() => setQueueOpen(false)}
        data={data}
        reload={load}
      />
    </div>
  );
}

export default DashboardPage;