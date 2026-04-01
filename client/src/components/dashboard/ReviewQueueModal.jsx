import { X } from "lucide-react";
import { reviewProblem } from "../../api/problemApi";
import { useAuthStore } from "../../store/authStore";
import { useEffect, useMemo, useState } from "react";

function getQueueLabel(nextReviewAt) {
  if (!nextReviewAt) return "not started";

  const now = new Date();
  const next = new Date(nextReviewAt);

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(next.getFullYear(), next.getMonth(), next.getDate());

  const diff = Math.ceil((target - today) / 86400000);

  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  return `in ${diff}d`;
}

function sortQueueItems(items) {
  return [...items].sort((a, b) => {
    const aDate = a.nextReviewAt ? new Date(a.nextReviewAt) : new Date(8640000000000000);
    const bDate = b.nextReviewAt ? new Date(b.nextReviewAt) : new Date(8640000000000000);
    return aDate - bDate;
  });
}

function getDueItems(data) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return sortQueueItems(
    data.filter((p) => {
      if (!p.nextReviewAt) return false;
      const target = new Date(p.nextReviewAt);
      const targetDay = new Date(
        target.getFullYear(),
        target.getMonth(),
        target.getDate()
      );
      return targetDay <= today;
    })
  );
}

function ReviewQueueModal({ open, onClose, data = [], reload }) {
  const token = useAuthStore((s) => s.token);
  const [queue, setQueue] = useState([]);
  const [busy, setBusy] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    if (open) {
      setQueue(getDueItems(data));
      setDoneCount(0);
    }
  }, [open, data]);

  const current = queue[0];
  const total = queue.length + doneCount;
  const finished = total > 0 && queue.length === 0;

  const handleAnswer = async (type) => {
    if (!current) return;

    try {
      setBusy(true);
      await reviewProblem(token, { problemId: current._id, type });

      setQueue((prev) => prev.slice(1));
      setDoneCount((prev) => prev + 1);

      await reload();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const handleSkip = () => {
    if (!current) return;

    setQueue((prev) => {
      if (prev.length <= 1) return prev;
      return [...prev.slice(1), prev[0]];
    });
  };

  const handleClose = () => {
    setQueue([]);
    setDoneCount(0);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
      onClick={handleClose}
    >
      <div
        className="paper-card w-full max-w-xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="display-serif text-2xl font-bold">Review Now</h2>
            <p className="mt-1 text-[12px]" style={{ color: "var(--muted)" }}>
              {total === 0
                ? "No due problems right now."
                : finished
                ? "Queue completed."
                : `${doneCount + 1} of ${total}`}
            </p>
          </div>

          <button
            onClick={handleClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded border"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {total === 0 && (
          <div
            className="rounded border p-4 text-sm"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--muted)",
            }}
          >
            You’re all caught up. Nothing is due right now.
          </div>
        )}

        {finished && total > 0 && (
          <div
            className="rounded border p-5"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
            }}
          >
            <div className="display-serif text-xl font-bold">Done 🎉</div>
            <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
              You reviewed {doneCount} problem{doneCount !== 1 ? "s" : ""}.
            </p>

            <button
              onClick={handleClose}
              className="mt-4 border px-3 py-2 text-[12px]"
              style={{
                background: "var(--ink)",
                color: "var(--bg)",
                borderColor: "var(--ink)",
              }}
            >
              Close
            </button>
          </div>
        )}

        {!finished && current && (
          <>
            <div
              className="mb-4 h-2 overflow-hidden rounded-full border"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              <div
                className="h-full"
                style={{
                  width: `${(doneCount / total) * 100}%`,
                  background: "var(--green)",
                }}
              />
            </div>

            <div
              className="rounded border p-5"
              style={{
                borderColor: "var(--border)",
                background: "var(--surface)",
              }}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <span
                  className="rounded px-2 py-1 text-[10px]"
                  style={{
                    background:
                      current.difficulty === "easy"
                        ? "#d4edda"
                        : current.difficulty === "medium"
                        ? "#fff3cd"
                        : "#fde8e4",
                    color:
                      current.difficulty === "easy"
                        ? "#1a6b3a"
                        : current.difficulty === "medium"
                        ? "#7a5000"
                        : "#8b1a0a",
                  }}
                >
                  {current.difficulty}
                </span>

                <span className="text-[11px]" style={{ color: "var(--muted)" }}>
                  {getQueueLabel(current.nextReviewAt)}
                </span>
              </div>

              <h3 className="display-serif text-2xl font-bold leading-tight">
                {current.title}
              </h3>

              <div
                className="mt-2 text-[12px]"
                style={{ color: "var(--muted)" }}
              >
                {current.topic} · {current.useCustomInterval
                  ? `${current.customInterval}d custom`
                  : `${current.defaultInterval}d interval`}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => handleAnswer("solved")}
                  disabled={busy}
                  className="border px-4 py-2 text-[12px] disabled:opacity-50"
                  style={{
                    background: "#d4edda",
                    borderColor: "#a0d4b0",
                    color: "#1a6b3a",
                  }}
                >
                  {busy ? "Saving..." : "Solved ✓"}
                </button>

                <button
                  onClick={() => handleAnswer("struggled")}
                  disabled={busy}
                  className="border px-4 py-2 text-[12px] disabled:opacity-50"
                  style={{
                    background: "#fde8e4",
                    borderColor: "#f0b0a8",
                    color: "#8b1a0a",
                  }}
                >
                  {busy ? "Saving..." : "Struggled ✗"}
                </button>

                <button
                  onClick={handleSkip}
                  disabled={busy || queue.length <= 1}
                  className="border px-4 py-2 text-[12px] disabled:opacity-50"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--ink)",
                  }}
                >
                  Skip
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReviewQueueModal;