import { useEffect, useMemo, useRef, useState } from "react";
import { Settings, Check, AlertTriangle } from "lucide-react";
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
  const [reviewNotice, setReviewNotice] = useState(null);
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

  useEffect(() => {
    if (!reviewNotice) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setReviewNotice(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [reviewNotice]);

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const getDayDiff = (dateValue) => {
    const now = new Date();
    const next = new Date(dateValue);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(
      next.getFullYear(),
      next.getMonth(),
      next.getDate()
    );

    return Math.ceil((target - today) / 86400000);
  };

  const handleReview = async (id, type) => {
    try {
      setBusyId(`${id}-${type}`);

      const updated = await reviewProblem(token, { problemId: id, type });
      await reload();

      const diffDays = Math.max(1, getDayDiff(updated.nextReviewAt));

      setReviewNotice({
        title:
          type === "solved"
            ? "Congratulations on solving this problem!"
            : "Good effort on this problem!",
        subtitle: `I will remind you again in next ${diffDays} day${
          diffDays > 1 ? "s" : ""
        } (${formatDate(updated.nextReviewAt)})`,
        emoji: type === "solved" ? "🎉" : "💪",
      });
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

  const actionButtonBase = {
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: 600,
    padding: "5px 10px",
    cursor: "pointer",
    transition:
      "transform 160ms ease, box-shadow 160ms ease, opacity 160ms ease, background-color 160ms ease",
    boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
  };

  return (
    <>
      <section className="paper-card flex min-h-0 flex-col overflow-visible lg:h-full lg:overflow-hidden">
        <div
          className="flex items-center justify-between gap-2 border-b p-2 overflow-x-auto"
          style={{ borderColor: "var(--border)" }}
        >
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-2.5 py-1 text-[11px] w-44 sm:w-56 shrink-0"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="border px-1.5 py-1 text-[11px]"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--ink)",
              }}
            >
              <option value="">Topic</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="border px-1.5 py-1 text-[11px]"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--ink)",
              }}
            >
              <option value="">Diff</option>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-1.5 py-1 text-[11px]"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--ink)",
              }}
            >
              <option value="">Status</option>
              <option value="due">Due</option>
              <option value="reviewed">Reviewed</option>
              <option value="not_started">Not started</option>
            </select>

            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="border px-1.5 py-1 text-[11px]"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--ink)",
              }}
            >
              <option value="">Risk</option>
              <option value="high">high</option>
              <option value="medium">medium</option>
              <option value="low">low</option>
            </select>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto hidden md:block">
          <table className="min-w-full border-collapse">
            <thead
              className="sticky top-0 z-10"
              style={{ background: "var(--ink)", color: "var(--bg)" }}
            >
              <tr>
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
                const currentInterval = p.useCustomInterval ? p.customInterval : p.defaultInterval;
                const nextLabel = getNextReviewLabel(p.nextReviewAt);
                const solvedBusy = busyId === `${p._id}-solved`;
                const struggledBusy = busyId === `${p._id}-struggled`;

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
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleReview(p._id, "solved")}
                          disabled={solvedBusy || struggledBusy}
                          className="inline-flex items-center gap-1.5 border disabled:opacity-50"
                          style={{
                            ...actionButtonBase,
                            background: solvedBusy ? "#dff3e5" : "#eef9f1",
                            borderColor: "#c9e8d3",
                            color: "#1d7a46",
                            transform: solvedBusy ? "scale(0.98)" : "scale(1)",
                          }}
                          onMouseEnter={(e) => {
                            if (!solvedBusy && !struggledBusy) {
                              e.currentTarget.style.transform = "translateY(-1px)";
                              e.currentTarget.style.boxShadow = "0 6px 14px rgba(29,122,70,0.12)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = solvedBusy ? "scale(0.98)" : "scale(1)";
                            e.currentTarget.style.boxShadow = "0 1px 0 rgba(0,0,0,0.04)";
                          }}
                        >
                          {solvedBusy ? (
                            <span className="inline-flex items-center gap-1">
                              <AlertTriangle size={11} className="animate-pulse" />
                              ...
                            </span>
                          ) : (
                            <>
                              <Check size={11} />
                              Solved
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleReview(p._id, "struggled")}
                          disabled={solvedBusy || struggledBusy}
                          className="inline-flex items-center gap-1.5 border disabled:opacity-50"
                          style={{
                            ...actionButtonBase,
                            background: struggledBusy ? "#feebe7" : "#fff3f0",
                            borderColor: "#f4d1c8",
                            color: "#a64b33",
                            transform: struggledBusy ? "scale(0.98)" : "scale(1)",
                          }}
                          onMouseEnter={(e) => {
                            if (!solvedBusy && !struggledBusy) {
                              e.currentTarget.style.transform = "translateY(-1px)";
                              e.currentTarget.style.boxShadow = "0 6px 14px rgba(166,75,51,0.12)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = struggledBusy ? "scale(0.98)" : "scale(1)";
                            e.currentTarget.style.boxShadow = "0 1px 0 rgba(0,0,0,0.04)";
                          }}
                        >
                          {struggledBusy ? (
                            <span className="inline-flex items-center gap-1">
                              <AlertTriangle size={11} className="animate-pulse" />
                              ...
                            </span>
                          ) : (
                            <>
                              <AlertTriangle size={11} />
                              Struggle
                            </>
                          )}
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

        <div className="min-h-0 flex-1 overflow-auto p-3 space-y-3 md:hidden">
          {filteredData.map((p) => {
            const currentInterval = p.useCustomInterval ? p.customInterval : p.defaultInterval;
            const nextLabel = getNextReviewLabel(p.nextReviewAt);
            const solvedBusy = busyId === `${p._id}-solved`;
            const struggledBusy = busyId === `${p._id}-struggled`;

            return (
              <div
                key={p._id}
                className="rounded border p-3"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="mt-1 text-[11px]" style={{ color: "var(--muted)" }}>
                      {p.topic} · {nextLabel}
                    </div>
                  </div>

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
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{currentInterval}d</span>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdownId(openDropdownId === p._id ? null : p._id)
                      }
                      className="inline-flex h-5 w-5 items-center justify-center rounded border"
                      style={{
                        background: "var(--card)",
                        borderColor: "var(--border)",
                        color: "var(--muted)",
                      }}
                    >
                      <Settings size={11} />
                    </button>
                  </div>

                  <div>{p.streak ? `🔥${p.streak}` : "—"}</div>
                </div>

                {openDropdownId === p._id && (
                  <div className="mt-2">
                    <select
                      autoFocus
                      defaultValue={String(currentInterval)}
                      onChange={(e) => handleIntervalChange(p._id, e.target.value)}
                      className="w-full border px-2 py-1 text-[11px]"
                      style={{
                        background: "var(--card)",
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

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleReview(p._id, "solved")}
                    disabled={solvedBusy || struggledBusy}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border disabled:opacity-50"
                    style={{
                      ...actionButtonBase,
                      padding: "8px 10px",
                      background: solvedBusy ? "#dff3e5" : "#eef9f1",
                      borderColor: "#c9e8d3",
                      color: "#1d7a46",
                      transform: solvedBusy ? "scale(0.98)" : "scale(1)",
                    }}
                  >
                    {solvedBusy ? (
                      <span className="inline-flex items-center gap-1">
                        <AlertTriangle size={12} className="animate-pulse" />
                        ...
                      </span>
                    ) : (
                      <>
                        <Check size={12} />
                        Solved
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleReview(p._id, "struggled")}
                    disabled={solvedBusy || struggledBusy}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border disabled:opacity-50"
                    style={{
                      ...actionButtonBase,
                      padding: "8px 10px",
                      background: struggledBusy ? "#feebe7" : "#fff3f0",
                      borderColor: "#f4d1c8",
                      color: "#a64b33",
                      transform: struggledBusy ? "scale(0.98)" : "scale(1)",
                    }}
                  >
                    {struggledBusy ? (
                      <span className="inline-flex items-center gap-1">
                        <AlertTriangle size={12} className="animate-pulse" />
                        ...
                      </span>
                    ) : (
                      <>
                        <AlertTriangle size={12} />
                        Struggle
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div
              className="rounded border px-4 py-8 text-center text-sm"
              style={{
                color: "var(--muted)",
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              No problems match your filters.
            </div>
          )}
        </div>
      </section>

      {reviewNotice && (
        <div
          onClick={() => setReviewNotice(null)}
          className="fixed inset-0 z-[120] flex items-center justify-center px-4"
          style={{ background: "rgba(0, 0, 0, 0.45)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-[26px] border p-5 text-center shadow-xl"
            style={{
              background:
                "linear-gradient(180deg, #fffdf8 0%, #fff8f5 45%, #f8fff9 100%)",
              borderColor: "#ecd8c9",
              boxShadow: "0 18px 45px rgba(0,0,0,0.18)",
            }}
          >
            <div className="mb-2 text-3xl">{reviewNotice.emoji}</div>

            <div
              style={{
                color: "#7a4b2f",
                fontSize: "18px",
                fontWeight: 800,
                lineHeight: 1.35,
              }}
            >
              {reviewNotice.title}
            </div>

            <div
              className="mt-2"
              style={{
                color: "#8b6b58",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
            >
              {reviewNotice.subtitle}
            </div>

            <button
              type="button"
              onClick={() => setReviewNotice(null)}
              className="mt-5 cursor-pointer rounded-full border px-4 py-2 text-[12px] font-semibold"
              style={{
                background: "var(--ink)",
                color: "var(--bg)",
                borderColor: "var(--ink)",
              }}
            >
              Okay ✨
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProblemsTable;