import { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { reviewProblem, updateIntervalApi } from "../../api/problemApi";
import { useAuthStore } from "../../store/authStore";

function ProblemsTable({ data = [], reload }) {
  const token = useAuthStore((s) => s.token);
  const [openDropdownId, setOpenDropdownId] = useState(null);
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
      await reviewProblem(token, { problemId: id, type });
      reload();
    } catch (err) {
      console.error(err);
    }
  };

  const handleIntervalChange = async (problemId, customInterval) => {
    try {
      await updateIntervalApi(token, {
        problemId,
        customInterval: Number(customInterval),
      });
      setOpenDropdownId(null);
      reload();
    } catch (err) {
      console.error(err);
    }
  };

  const getNextReviewLabel = (nextReviewAt) => {
    if (!nextReviewAt) return "not started";

    const now = new Date();
    const next = new Date(nextReviewAt);
    const diff = Math.ceil((next - now) / 86400000);

    if (diff <= 0) return "TODAY";
    if (diff === 1) return "tomorrow";
    return `in ${diff}d`;
  };

  return (
    <section className="paper-card overflow-hidden">
      <div
        className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center md:justify-between"
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
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Fixed interval</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Next review</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Streak</th>
              <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((p, index) => {
              const currentInterval = p.useCustomInterval
                ? p.customInterval
                : p.defaultInterval;

              const nextLabel = getNextReviewLabel(p.nextReviewAt);

              return (
                <tr
                  key={p._id}
                  className="border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td className="px-4 py-3 text-sm font-medium">{p.title}</td>

                  <td className="px-4 py-3 text-xs" style={{ color: "var(--muted)" }}>
                    {p.topic}
                  </td>

                  <td className="px-4 py-3 text-xs">
                    <span
                      className="inline-block rounded px-2 py-1"
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

                  <td className="px-4 py-3 text-sm">
                    <div
                      ref={openDropdownId === p._id ? dropdownRef : null}
                      className="relative inline-flex items-center gap-2"
                    >
                      <span className="font-semibold">{currentInterval}d</span>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdownId(openDropdownId === p._id ? null : p._id)
                        }
                        className="inline-flex h-6 w-6 items-center justify-center rounded border"
                        style={{
                          background: "var(--surface)",
                          borderColor: "var(--border)",
                          color: "var(--muted)",
                        }}
                      >
                        <Settings size={13} />
                      </button>

                      {openDropdownId === p._id && (
                        <div
                          className="absolute left-0 top-8 z-20 w-28 rounded border p-1 shadow-lg"
                          style={{
                            background: "var(--card)",
                            borderColor: "var(--border)",
                          }}
                        >
                          <select
                            autoFocus
                            defaultValue={String(currentInterval)}
                            onChange={(e) =>
                              handleIntervalChange(p._id, e.target.value)
                            }
                            className="w-full border px-2 py-1 text-xs"
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

                  <td className="px-4 py-3 text-xs">{nextLabel}</td>

                  <td className="px-4 py-3 text-xs">
                    {p.streak ? `🔥${p.streak}` : "—"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleReview(p._id, "solved")}
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
                        onClick={() => handleReview(p._id, "struggled")}
                        className="border px-2 py-1 text-[11px]"
                        style={{
                          background: "#fde8e4",
                          borderColor: "#f0b0a8",
                          color: "#8b1a0a",
                        }}
                      >
                        Struggled ✗
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ProblemsTable;