import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

function getIntensityStyle(count) {
  if (count <= 0) {
    return {
      background: "transparent",
      border: "1px dashed var(--border)",
      color: "var(--muted)",
    };
  }
  if (count <= 2) {
    return {
      background: "color-mix(in srgb, var(--green) 35%, var(--surface) 65%)",
      border: "1px solid color-mix(in srgb, var(--green) 50%, var(--border) 50%)",
      color: "white",
    };
  }
  if (count <= 4) {
    return {
      background: "color-mix(in srgb, var(--green) 65%, var(--surface) 35%)",
      border: "1px solid color-mix(in srgb, var(--green) 80%, var(--border) 20%)",
      color: "white",
    };
  }
  return {
    background: "color-mix(in srgb, var(--green) 90%, black 10%)",
    border: "1px solid color-mix(in srgb, var(--green) 95%, black 5%)",
    color: "white",
  };
}

function StreakCalendarPanel({ calendar, onPrevMonth, onNextMonth }) {
  const clickableDays = useMemo(
    () => calendar?.days?.filter(Boolean) ?? [],
    [calendar]
  );

  const [activeDay, setActiveDay] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });
  const wrapRef = useRef(null);

  useEffect(() => {
    setActiveDay(null);
  }, [calendar?.month, calendar?.year]);

  const openPopover = (cell, event) => {
    const wrapRect = wrapRef.current?.getBoundingClientRect();
    const btnRect = event.currentTarget.getBoundingClientRect();

    if (!wrapRect) return;

    setPopoverPos({
      top: btnRect.top - wrapRect.top + btnRect.height + 6,
      left: btnRect.left - wrapRect.left + btnRect.width / 2,
    });
    setActiveDay(cell);
  };

  if (!calendar) return null;

  return (
    <section className="paper-card p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <button
          onClick={onPrevMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded border"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <ChevronLeft size={15} />
        </button>

        <h2 className="display-serif text-lg font-bold">
          {monthNames[calendar.month]} {calendar.year}
        </h2>

        <button
          onClick={onNextMonth}
          className="inline-flex h-7 w-7 items-center justify-center rounded border"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
            color: "var(--ink)",
          }}
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div
        className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[10px] font-medium"
        style={{ color: "var(--muted)" }}
      >
        {dayLabels.map((label, i) => (
          <div key={`${label}-${i}`}>{label}</div>
        ))}
      </div>

      <div
        ref={wrapRef}
        className="relative"
        onMouseLeave={() => setActiveDay(null)}
      >
        <div className="grid grid-cols-7 gap-1.5">
          {calendar.days.map((cell, index) => {
            if (!cell) return <div key={`empty-${index}`} className="h-8" />;

            const selected = activeDay?.date === cell.date;
            const style = getIntensityStyle(cell.count);

            return (
              <button
                key={cell.date}
                onMouseEnter={(e) => openPopover(cell, e)}
                onClick={(e) => openPopover(cell, e)}
                className="relative flex h-8 w-full items-center justify-center rounded-full text-[11px] transition"
                style={{
                  ...style,
                  boxShadow: selected ? "0 0 0 2px var(--amber)" : "none",
                }}
                title={`${cell.date} • ${cell.count} review${cell.count !== 1 ? "s" : ""}`}
              >
                {cell.day}
              </button>
            );
          })}
        </div>

        {activeDay && (
          <div
            className="absolute z-20 w-52 -translate-x-1/2 rounded border p-2 shadow-lg"
            style={{
              top: popoverPos.top,
              left: popoverPos.left,
              background: "var(--card)",
              borderColor: "var(--border)",
              color: "var(--ink)",
            }}
            onMouseLeave={() => setActiveDay(null)}
          >
            <div className="mb-1 text-[11px] font-semibold">
              {monthNames[calendar.month]} {activeDay.day}
            </div>

            {activeDay.problems?.length ? (
              <div className="max-h-28 space-y-1 overflow-y-auto pr-1">
                {activeDay.problems.map((name) => (
                  <div
                    key={name}
                    className="rounded px-2 py-1 text-[11px]"
                    style={{ background: "var(--surface)" }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px]" style={{ color: "var(--muted)" }}>
                No reviewed questions
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div
          className="rounded border p-2.5"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="flex items-center gap-2">
            <Flame size={15} style={{ color: "var(--amber)" }} />
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>
              Current
            </span>
          </div>
          <div className="mt-1 text-xl font-bold">
            {calendar.currentStreak}
            <span className="ml-1 text-[11px] font-normal" style={{ color: "var(--muted)" }}>
              days
            </span>
          </div>
        </div>

        <div
          className="rounded border p-2.5"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div className="flex items-center gap-2">
            <Trophy size={15} style={{ color: "var(--amber)" }} />
            <span className="text-[11px]" style={{ color: "var(--muted)" }}>
              Best
            </span>
          </div>
          <div className="mt-1 text-xl font-bold">
            {calendar.bestStreak}
            <span className="ml-1 text-[11px] font-normal" style={{ color: "var(--muted)" }}>
              days
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StreakCalendarPanel;