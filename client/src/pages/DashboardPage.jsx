import { useCallback, useEffect, useState, useMemo } from "react";
import StatsRow from "../components/dashboard/StatsRow";
import ActivityHeatmap from "../components/dashboard/ActivityHeatmap";
import ConsistencyPanel from "../components/dashboard/ConsistencyPanel";
import SidePanels from "../components/dashboard/SidePanels";
import ProblemsTable from "../components/problems/ProblemsTable";
import { useAuthStore } from "../store/authStore";
import { fetchDashboard } from "../api/problemApi";
import { fetchAnalytics } from "../api/analyticsApi";
import ReviewQueueModal from "../components/dashboard/ReviewQueueModal";


function DashboardPage() {
    const token = useAuthStore((s) => s.token);

    const [data, setData] = useState([]);
    const [analytics, setAnalytics] = useState({
        stats: null,
        heatmap: [],
        consistency: [],
    });
    const [queueOpen, setQueueOpen] = useState(false);

    const dueCount = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

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

    const load = useCallback(async () => {
        if (!token) return;

        try {
            const [dashboardRes, analyticsRes] = await Promise.all([
                fetchDashboard(token),
                fetchAnalytics(token),
            ]);

            setData(dashboardRes);
            setAnalytics(analyticsRes);
        } catch (err) {
            console.error(err);
        }
    }, [token]);

    useEffect(() => {
        load();
    }, [load]);

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
                    <span>•</span>
                    <span>{analytics.stats?.currentStreak ?? 0} day streak</span>
                </div>

                <button
                    onClick={() => setQueueOpen(true)}
                    className="border px-3 py-1.5 text-[11px]"
                    style={{
                        background: "var(--ink)",
                        color: "var(--bg)",
                        borderColor: "var(--ink)",
                    }}
                >
                    Review Now {dueCount > 0 ? `(${dueCount})` : ""}
                </button>
            </div>

            <StatsRow stats={analytics.stats} />

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                <div className="min-w-0">
                    <ProblemsTable data={data} reload={load} />
                </div>

                <div className="min-w-0">
                    <SidePanels stats={analytics.stats} data={data} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 items-start">
                <div className="min-w-0">
                    <ActivityHeatmap data={analytics.heatmap} />
                </div>

                <div className="min-w-0">
                    <ConsistencyPanel
                        data={analytics.consistency}
                        stats={analytics.stats}
                    />
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