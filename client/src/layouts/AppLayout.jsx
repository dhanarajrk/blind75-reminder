import { Outlet } from "react-router-dom";
import AppHeader from "../components/common/AppHeader";

function AppLayout() {
  return (
    <div className="app-shell">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;