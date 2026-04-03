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
    const userId = res.data.user?.id || res.data.user?._id;
    if (userId) {
      posthog.identify(userId, {
        email: res.data.user.email,
        name: res.data.user.name,
      });
    }

    posthog.capture("user_signed_up");
  },

  login: async (data) => {
    const res = await axios.post(`${API}/api/auth/login`, data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data.user, token: res.data.token });

    // PostHog tracking
    const userId = res.data.user?.id || res.data.user?._id;
    if (userId) {
      posthog.identify(userId, {
        email: res.data.user.email,
        name: res.data.user.name,
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

      // PostHog tracking
      const userId = res.data?.id || res.data?._id;
      if (userId) {
        posthog.identify(userId, {
          email: res.data.email,
          name: res.data.name,
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