import { Toaster } from "react-hot-toast";
import ThemeProvider from "./components/common/ThemeProvider";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}

export default App;