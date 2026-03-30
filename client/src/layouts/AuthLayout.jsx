import { Outlet, Link } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="app-shell px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="logo-font text-3xl font-black tracking-tight">
            Blind 75 REMINDER
          </Link>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            spaced repetition tracker
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;