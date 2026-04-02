import { Outlet, Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

function AuthLayout() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div className="min-h-screen px-4 pt-5 pb-6 sm:px-6 sm:pt-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col sm:min-h-[calc(100vh-3.5rem)]">
        <header
          className="flex items-center justify-between gap-3 border-b pb-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="min-w-0">
            <Link
              to="/"
              className="logo-font block truncate text-xl font-black tracking-tight sm:text-2xl"
              style={{ color: "var(--ink)" }}
            >
              Blind 75 REMINDER
            </Link>
            <div
              className="mt-0.5 hidden text-[10px] uppercase tracking-[0.22em] sm:block"
              style={{ color: "var(--muted)" }}
            >
              spaced repetition tracker
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-[11px] transition hover:opacity-90"
            style={{
              borderColor: "var(--border)",
              borderRadius: "6px",
              background: "var(--surface)",
              color: "var(--ink)",
            }}
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
            <span className="hidden sm:inline">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>
        </header>

        <main className="flex flex-1 items-center justify-center py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AuthLayout;