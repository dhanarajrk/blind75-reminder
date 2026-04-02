import { Moon, Sun, LogOut } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { updateReminderSettingsApi } from "../../api/authApi";

function AppHeader() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const fetchMe = useAuthStore((state) => state.fetchMe);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [savingReminder, setSavingReminder] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleReminderToggle = async (checked) => {
    try {
      setSavingReminder(true);
      await updateReminderSettingsApi(token, {
        reminderEnabled: checked,
      });
      await fetchMe(token);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingReminder(false);
    }
  };

  const initial =
    user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="border-b-[3px] px-4 py-3 sm:px-6 lg:px-8"
      style={{
        background: "var(--ink)",
        color: "var(--bg)",
        borderBottomColor: "var(--red)",
      }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div>
          <div className="logo-font text-lg font-black tracking-tight sm:text-2xl">
            Blind 75 REMINDER
          </div>
          <div className="mt-0.5 hidden text-[10px] uppercase tracking-[0.22em] opacity-80 sm:block">
            spaced repetition tracker
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[11px] transition hover:opacity-90"
            style={{
              borderColor: "rgba(255,255,255,0.25)",
              borderRadius: "4px",
            }}
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            <span className="hidden sm:inline">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border"
                style={{
                  borderColor: "rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.12)",
                  color: "var(--bg)",
                }}
                title={user.name || user.email}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[12px] font-bold">{initial}</span>
                )}
              </button>

              {open && (
                <div
                  className="absolute right-0 top-10 z-50 w-64 border p-3 shadow-lg"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                    color: "var(--ink)",
                    borderRadius: "6px",
                  }}
                >
                  <div className="mb-3 border-b pb-3" style={{ borderColor: "var(--border)" }}>
                    <div className="truncate text-[12px] font-semibold">
                      {user.name || "User"}
                    </div>
                    <div
                      className="truncate text-[11px]"
                      style={{ color: "var(--muted)" }}
                    >
                      {user.email}
                    </div>
                  </div>

                  <div
                    className="mb-3 rounded border p-2"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--surface)",
                    }}
                  >
                    <label className="flex items-center justify-between gap-3 text-[12px]">
                      <span style={{ color: "var(--muted)" }}>
                        Due today email reminders
                      </span>

                      <input
                        type="checkbox"
                        checked={!!user.reminderEnabled}
                        disabled={savingReminder}
                        onChange={(e) => handleReminderToggle(e.target.checked)}
                      />
                    </label>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-2 py-2 text-[12px] transition hover:opacity-80"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                    }}
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;