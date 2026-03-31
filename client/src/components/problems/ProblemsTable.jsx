import { useEffect, useMemo, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { reviewProblem, updateIntervalApi } from "../../api/problemApi";
import { useAuthStore } from "../../store/authStore";

function ProblemsTable({ data = [], reload }) {
  const token = useAuthStore((s) => s.token);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleReview = async (id, type) => {
    try {
      setBusyId(`${id}-${type}`);
      await reviewProblem(token, { problemId: id, type });
      await reload();
    } catch (err) {
      console.error("Review update failed:", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleIntervalChange = async (problemId, customInterval) => {
    try {
      await updateIntervalApi(token, {
        problemId,
        customInterval: Number(customInterval),
      });
      setOpenDropdownId(null);
      await reload();
    } catch (err) {
      console.error("Interval update failed:", err);
    }
  };

  const getNextReviewLabel = (nextReviewAt) => {
    if (!nextReviewAt) return "not started";

    const now = new Date();
    const next = new Date(nextReviewAt);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(next.getFullYear(), next.getMonth(), next.getDate());

    const diff = Math.ceil((target - today) / 86400000);

    if (diff < 0) return "OVERDUE";
    if (diff === 0) return "TODAY";
    if (diff === 1) return "tomorrow";
    return `in ${diff}d`;
  };

  const getRisk = (interval) => {
    if (interval <= 6) return "high";
    if (interval <= 13) return "medium";
    return "low";
  };

  const topics = useMemo(() => {
    return [...new Set(data.map((p) => p.topic))].sort();
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter((p) => {
      const currentInterval = p.useCustomInterval
        ? p.customInterval
        : p.defaultInterval;

      const risk = getRisk(currentInterval);
      const nextLabel = getNextReviewLabel(p.nextReviewAt);
      const searchMatch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.topic.toLowerCase().includes(search.toLowerCase());

      const status =
        !p.nextReviewAt
          ? "not_started"
          : nextLabel === "TODAY" || nextLabel === "OVERDUE"
          ? "due"
          : "reviewed";

      if (!searchMatch) return false;
      if (topicFilter && p.topic !== topicFilter) return false;
      if (difficultyFilter && p.difficulty !== difficultyFilter) return false;
      if (statusFilter && status !== statusFilter) return false;
      if (riskFilter && risk !== riskFilter) return false;

      return true;
    });
  }, [data, search, topicFilter, difficultyFilter, statusFilter, riskFilter]);

  return (
    <section className="paper-card overflow-hidden">
      <div
        className="flex flex-col gap-2 border-b p-3 md:flex-row md:items-center md:justify-between"
        style={{ borderColor: "var(--border)" }}
      >
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border px-2.5 py-1.5 text-[12px] md:max-w-xs"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        />

        <div className="flex flex-wrap gap-1.5">
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="border px-2 py-1.5 text-[11px]"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
          >
            <option value="">All topics</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="border px-2 py-1.5 text-[11px]"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
          >
            <option value="">All difficulty</option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-2 py-1.5 text-[11px]"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
          >
            <option value="">All status</option>
            <option value="due">Due</option>
            <option value="reviewed">Reviewed</option>
            <option value="not_started">Not started</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="border px-2 py-1.5 text-[11px]"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
          >
            <option value="">All risk</option>
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr style={{ background: "var(--ink)", color: "var(--bg)" }}>
              <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider">#</th>
              <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider">Problem</th>
              <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider">Topic</th>
              <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider">Diff</th>
              <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider">Fixed interval</th>
              <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider">Next review</th>
              <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider">Streak</th>
              <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((p, index) => {
              const currentInterval = p.useCustomInterval
                ? p.customInterval
                : p.defaultInterval;

              const nextLabel = getNextReviewLabel(p.nextReviewAt);

              return (
                <tr
                  key={p._id}
                  className="border-b transition-colors hover:bg-[color:var(--surface)]"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-4 py-2.5 text-xs" style={{ color: "var(--muted)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="px-4 py-2.5 text-sm font-medium">{p.title}</td>

                  <td className="px-4 py-2.5 text-xs" style={{ color: "var(--muted)" }}>
                    {p.topic}
                  </td>

                  <td className="px-4 py-2.5 text-xs">
                    <span
                      className="inline-block rounded px-1.5 py-0.5 text-[10px]"
                      style={{
                        background:
                          p.difficulty === "easy"
                            ? "#d4edda"
                            : p.difficulty === "medium"
                            ? "#fff3cd"
                            : "#fde8e4",
                        color:
                          p.difficulty === "easy"
                            ? "#1a6b3a"
                            : p.difficulty === "medium"
                            ? "#7a5000"
                            : "#8b1a0a",
                      }}
                    >
                      {p.difficulty}
                    </span>
                  </td>

                  <td className="px-4 py-2.5 text-sm">
                    <div
                      ref={openDropdownId === p._id ? dropdownRef : null}
                      className="relative inline-flex items-center gap-1.5"
                    >
                      <span className="font-semibold text-[13px]">{currentInterval}d</span>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdownId(openDropdownId === p._id ? null : p._id)
                        }
                        className="inline-flex h-5 w-5 items-center justify-center rounded border"
                        style={{
                          background: "var(--surface)",
                          borderColor: "var(--border)",
                          color: "var(--muted)",
                        }}
                      >
                        <Settings size={11} />
                      </button>

                      {openDropdownId === p._id && (
                        <div
                          className="absolute left-0 top-7 z-20 w-24 rounded border p-1 shadow-lg"
                          style={{
                            background: "var(--card)",
                            borderColor: "var(--border)",
                          }}
                        >
                          <select
                            autoFocus
                            defaultValue={String(currentInterval)}
                            onChange={(e) => handleIntervalChange(p._id, e.target.value)}
                            className="w-full border px-1.5 py-1 text-[11px]"
                            style={{
                              background: "var(--surface)",
                              borderColor: "var(--border)",
                              color: "var(--ink)",
                            }}
                          >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                              <option key={day} value={day}>
                                {day}d{day === p.defaultInterval ? " (default)" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2.5 text-xs">{nextLabel}</td>

                  <td className="px-4 py-2.5 text-[11px]">
                    {p.streak ? `🔥${p.streak}` : "—"}
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => handleReview(p._id, "solved")}
                        disabled={
                          busyId === `${p._id}-solved` || busyId === `${p._id}-struggled`
                        }
                        className="border px-2 py-1 text-[10px] leading-none disabled:opacity-50"
                        style={{
                          background: "#d4edda",
                          borderColor: "#a0d4b0",
                          color: "#1a6b3a",
                          cursor: "pointer",
                        }}
                      >
                        {busyId === `${p._id}-solved` ? "..." : "Solved"}
                      </button>

                      <button
                        onClick={() => handleReview(p._id, "struggled")}
                        disabled={
                          busyId === `${p._id}-solved` || busyId === `${p._id}-struggled`
                        }
                        className="border px-2 py-1 text-[10px] leading-none disabled:opacity-50"
                        style={{
                          background: "#fde8e4",
                          borderColor: "#f0b0a8",
                          color: "#8b1a0a",
                          cursor: "pointer",
                        }}
                      >
                        {busyId === `${p._id}-struggled` ? "..." : "Struggled"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  No problems match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProblemsTable;