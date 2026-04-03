import { create } from "zustand";
import axios from "axios";
import posthog from "posthog-js";

const API = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,

  // ================= LOGIN =================
  login: async (formData) => {
    try {
      set({ loading: true });

      const res = await axios.post(`${API}/auth/login`, formData);

      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem("token", token);
      set({ user, token });

      // ✅ PostHog tracking (safe)
      if (user?._id) {
        posthog.identify(user._id, {
          email: user.email,
        });

        posthog.capture("user_logged_in", {
          method: "email",
        });
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    } finally {
      set({ loading: false });
    }
  },

  // ================= REGISTER =================
  register: async (formData) => {
    try {
      set({ loading: true });

      const res = await axios.post(`${API}/auth/register`, formData);

      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem("token", token);
      set({ user, token });

      // ✅ PostHog tracking (safe)
      if (user?._id) {
        posthog.identify(user._id, {
          email: user.email,
        });

        posthog.capture("user_signed_up");
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Register failed",
      };
    } finally {
      set({ loading: false });
    }
  },

  // ================= FETCH CURRENT USER =================
  fetchMe: async (tokenParam) => {
    try {
      const token = tokenParam || get().token;
      if (!token) return;

      const res = await axios.get(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = res.data;

      set({ user, token });

      // ✅ PostHog tracking (safe) → covers Google login
      if (user?._id) {
        posthog.identify(user._id, {
          email: user.email,
        });

        posthog.capture("user_logged_in", {
          method: "google",
        });
      }
    } catch (err) {
      console.error("FetchMe failed:", err);
      set({ user: null, token: null });
      localStorage.removeItem("token");
    }
  },

  // ================= LOGOUT =================
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });

    // ✅ Reset PostHog user
    posthog.reset();
  },
}));