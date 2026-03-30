import StatsRow from "../components/dashboard/StatsRow";
import ActivityHeatmap from "../components/dashboard/ActivityHeatmap";
import ConsistencyPanel from "../components/dashboard/ConsistencyPanel";
import SidePanels from "../components/dashboard/SidePanels";
import ProblemsTable from "../components/problems/ProblemsTable";

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div
        className="flex flex-wrap items-center gap-3 border-b px-1 pb-3 text-xs"
        style={{ borderColor: "var(--border)", color: "var(--muted)" }}
      >
        <span className="font-medium" style={{ color: "var(--ink)" }}>
          Today
        </span>
        <span>0 due right now</span>
        <span>•</span>
        <span>Custom intervals coming next</span>
        <span>•</span>
        <span>Auth integration next phase</span>
      </div>

      <StatsRow />
      <ActivityHeatmap />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <ConsistencyPanel />
          <ProblemsTable />
        </div>

        <SidePanels />
      </div>
    </div>
  );
}

export default DashboardPage;