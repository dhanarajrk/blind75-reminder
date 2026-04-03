import { create } from "zustand";
import axios from "axios";
import posthog from "posthog-js";

const API = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  register: async (data) => {
    const res = await axios.post(`${API}/api/auth/register`, data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data.user, token: res.data.token });

    // PostHog tracking
    if (res.data.user?._id) {
      posthog.identify(res.data.user._id, {
        email: res.data.user.email,
      });
    }

    posthog.capture("user_signed_up");
  },

  login: async (data) => {
    const res = await axios.post(`${API}/api/auth/login`, data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data.user, token: res.data.token });

    // PostHog tracking
    if (res.data.user?._id) {
      posthog.identify(res.data.user._id, {
        email: res.data.user.email,
      });
    }

    posthog.capture("user_logged_in", {
      method: "email",
    });
  },

  fetchMe: async (passedToken) => {
    const token = passedToken || localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${API}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ user: res.data, token });

      // PostHog tracking (covers Google login flow)
      if (res.data?._id) {
        posthog.identify(res.data._id, {
          email: res.data.email,
        });

        posthog.capture("user_logged_in", {
          method: "google",
        });
      }

      return res.data;
    } catch (err) {
      localStorage.removeItem("token");
      set({ user: null, token: null });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    posthog.reset();
    set({ user: null, token: null });
  },
}));