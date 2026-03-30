import { create } from "zustand";

const getInitialTheme = () => {
  const saved = localStorage.getItem("blind75-theme");
  if (saved === "light" || saved === "dark") return saved;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
};

export const useThemeStore = create((set) => ({
  theme: getInitialTheme(),

  setTheme: (theme) => {
    localStorage.setItem("blind75-theme", theme);
    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("blind75-theme", next);
      return { theme: next };
    }),
}));