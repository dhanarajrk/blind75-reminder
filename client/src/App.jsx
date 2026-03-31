import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/common/ThemeProvider";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./store/authStore";

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  return (
    <ThemeProvider>
      <AppRouter />
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;