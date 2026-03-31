import { Moon, Sun, Bell } from "lucide-react";
import { useThemeStore } from "../../store/themeStore";

function AppHeader() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

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
          <div className="logo-font text-xl font-black tracking-tight sm:text-2xl">
            Blind 75 REMINDER
          </div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.22em] opacity-80">
            spaced repetition tracker
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center gap-1.5 border px-2.5 py-1.5 text-[11px] transition hover:opacity-90"
            style={{
              borderColor: "rgba(255,255,255,0.25)",
              borderRadius: "4px",
            }}
          >
            <Bell size={13} />
            <span className="hidden sm:inline">Notifications</span>
          </button>

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
        </div>
      </div>
    </header>
  );
}

export default AppHeader;