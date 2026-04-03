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
import supportQr from "../assets/support-upi-qr.jpeg";
import posthog from "posthog-js";

useEffect(() => {
  posthog.capture("test_event_loaded_dashboard");
}, []);

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
  const [supportOpen, setSupportOpen] = useState(false);

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

  useEffect(() => {
    if (!supportOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSupportOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [supportOpen]);

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
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setCalendarView((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  return (
    <div className="space-y-5 pb-28 lg:pb-6">
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
          className="hidden cursor-pointer items-center gap-2 border px-3 py-1.5 text-[12px] shadow-sm lg:flex"
          style={{
            background: "var(--ink)",
            color: "var(--bg)",
            borderColor: "var(--ink)",
            borderRadius: "999px",
          }}
        >
          <span>Review Now</span>
          {dueCount > 0 && (
            <span
              className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
              style={{ background: "var(--red)", color: "white" }}
            >
              {dueCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="min-w-0 flex flex-col gap-5 xl:h-[1047px]">
          <StatsRow stats={analytics.stats} />
          <div className="min-h-0 flex-1">
            <ProblemsTable data={data} reload={load} />
          </div>
        </div>

        <div className="min-w-0 space-y-5">
          <StreakCalendarPanel
            calendar={analytics.calendar}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <ConsistencyPanel
            data={analytics.consistency}
            stats={analytics.stats}
          />
          <SidePanels data={data} />
        </div>
      </div>

      <button
        onClick={() => setQueueOpen(true)}
        className="fixed bottom-4 left-1/2 z-40 flex cursor-pointer -translate-x-1/2 items-center gap-2 border px-4 py-2 text-[12px] shadow-lg lg:hidden"
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          borderColor: "var(--ink)",
          borderRadius: "999px",
        }}
      >
        <span>Review Now</span>
        {dueCount > 0 && (
          <span
            className="flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold"
            style={{ background: "var(--red)", color: "white" }}
          >
            {dueCount}
          </span>
        )}
      </button>

      <ReviewQueueModal
        open={queueOpen}
        onClose={() => setQueueOpen(false)}
        data={data}
        reload={load}
      />

      {supportOpen && (
        <div
          onClick={() => setSupportOpen(false)}
          className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
          style={{ background: "rgba(0, 0, 0, 0.58)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
            style={{
              borderRadius: "28px",
              background:
                "linear-gradient(180deg, #fffdf7 0%, #fff5f8 55%, #f7fff8 100%)",
              border: "2px solid rgba(255,255,255,0.85)",
              boxShadow: "0 22px 60px rgba(0,0,0,0.28)",
              padding: "1.4rem 1.25rem 1.2rem",
            }}
          >
            <button
              type="button"
              onClick={() => setSupportOpen(false)}
              aria-label="Close support modal"
              className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-sm"
              style={{
                background: "#fff",
                color: "#7b4b27",
                borderColor: "#f0d1b2",
              }}
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              <div
                style={{
                  fontSize: "28px",
                  lineHeight: 1,
                  marginBottom: "0.35rem",
                }}
              >
                ✨☕💖
              </div>

              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#b36a1f",
                  marginBottom: "0.4rem",
                }}
              >
                Support this project
              </div>

              <div
                style={{
                  fontFamily:
                    "'Comic Neue', 'Segoe Print', 'Bradley Hand', 'Marker Felt', cursive",
                  fontSize: "30px",
                  fontWeight: 700,
                  color: "#a14667",
                  lineHeight: 1.1,
                  marginBottom: "0.35rem",
                  transform: "rotate(-2deg)",
                }}
              >
                Appreciation
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#8a6a52",
                  marginBottom: "1rem",
                }}
              >
                Scan the QR if this little app made your prep easier 🌷
              </div>

              <div
                style={{
                  width: "100%",
                  maxWidth: "310px",
                  background: "#fff",
                  border: "1.5px solid #f2d9e3",
                  borderRadius: "24px",
                  padding: "0.8rem",
                  boxShadow: "2px 2px 0 rgba(0,0,0,0.08)",
                }}
              >
                <img
                  src={supportQr}
                  alt="UPI QR code for support"
                  className="w-full rounded-[18px] object-contain"
                />
              </div>

              <div
                style={{
                  marginTop: "0.95rem",
                  fontSize: "13px",
                  color: "#9a5571",
                  fontWeight: 700,
                }}
              >
                Thank you so much 😊
              </div>
            </div>
          </div>
        </div>
      )}

      <footer
        style={{
          fontFamily: "'Nunito', sans-serif",
          borderTop: "0.5px solid var(--border)",
          marginTop: "2.5rem",
          paddingTop: "2.5rem",
        }}
      >
        <div className="cute-footer-grid">
          <div
            className="cute-footer-card"
            style={{
              background: "#fff8ee",
              border: "1.5px solid #f6d9a2",
              borderRadius: "20px",
              padding: "1.25rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              textAlign: "center",
              overflow: "visible",
              position: "relative",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.15)",
            }}
          >
            <span
              className="cute-float-icon"
              style={{
                fontSize: "42px",
                lineHeight: 1,
                display: "block",
                marginTop: "-28px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
                animationDelay: "0s",
              }}
            >
              ☕
            </span>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#92580a",
                margin: 0,
              }}
            >
              Buy me a coffee
            </p>
            <p style={{ fontSize: "12px", color: "#b8832e", margin: 0 }}>
              If this helped you, treat me!
            </p>
            <button
              type="button"
              onClick={() => setSupportOpen(true)}
              className="cute-btn-support"
              style={{
                background: "#c05c00",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "0.5rem 1.25rem",
                fontFamily: "'Nunito', sans-serif",
                fontSize: "13px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "transform 0.15s, opacity 0.15s",
              }}
            >
              Support <span style={{ color: "#ffb3b3" }}>♥</span>
            </button>
          </div>

          <div
            className="cute-footer-card"
            style={{
              background: "#fff0f6",
              border: "1.5px solid #f7b8d8",
              borderRadius: "20px",
              padding: "1.25rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              textAlign: "center",
              overflow: "visible",
              position: "relative",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.15)",
            }}
          >
            <span
              className="cute-float-icon"
              style={{
                fontSize: "42px",
                lineHeight: 1,
                display: "block",
                marginTop: "-28px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
                animationDelay: "0.3s",
              }}
            >
              🐾
            </span>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#9c1f5e",
                margin: 0,
              }}
            >
              Find me here
            </p>

            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              {[
                {
                  href: "https://instagram.com/dhanaraj_rk_",
                  title: "Instagram",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4.5" />
                      <circle
                        cx="17.5"
                        cy="6.5"
                        r="1"
                        fill="currentColor"
                        stroke="none"
                      />
                    </svg>
                  ),
                },
                {
                  href: "https://github.com/dhanarajrk",
                  title: "GitHub",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                  ),
                },
                {
                  href: "https://linkedin.com/in/dhanaraj-rk",
                  title: "LinkedIn",
                  icon: (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452H17.21v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.982V9.385h3.105v1.558h.044c.432-.82 1.489-1.684 3.065-1.684 3.279 0 3.883 2.157 3.883 4.965v6.228zM5.337 7.433a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zm1.556 13.019H3.78V9.385h3.113v11.067zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
              ].map(({ href, title, icon }) => (
                <a
                  key={title}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  title={title}
                  className="cute-social-icon"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    background: "#c9185b",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    color: "#fff",
                    transition: "transform 0.15s, background 0.15s",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>

            <p style={{ fontSize: "11px", color: "#c2427a", margin: 0 }}>
              © {new Date().getFullYear()}
            </p>
          </div>

          <div
            className="cute-footer-card"
            style={{
              background: "#f0faf3",
              border: "1.5px solid #a8dab5",
              borderRadius: "20px",
              padding: "1.25rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              textAlign: "center",
              overflow: "visible",
              position: "relative",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.15)",
            }}
          >
            <span
              className="cute-float-icon"
              style={{
                fontSize: "42px",
                lineHeight: 1,
                display: "block",
                marginTop: "-28px",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.12))",
                animationDelay: "0.5s",
              }}
            >
              ⭐
            </span>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#1a6b35",
                margin: 0,
              }}
            >
              Star this app
            </p>
            <p style={{ fontSize: "12px", color: "#2e8a50", margin: 0 }}>
              It means a lot!
            </p>
            <a
              href="https://github.com/dhanarajrk/blind75-reminder"
              target="_blank"
              rel="noreferrer"
            >
              <button
                className="cute-btn-github"
                style={{
                  background: "#166534",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.5rem 1.25rem",
                  fontFamily: "'Nunito', sans-serif",
                  fontSize: "13px",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "transform 0.15s, opacity 0.15s",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default DashboardPage;