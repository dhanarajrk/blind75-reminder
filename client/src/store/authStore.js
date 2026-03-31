import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  register: async (data) => {
    const res = await axios.post(`${API}/api/auth/register`, data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data.user, token: res.data.token });
  },

  login: async (data) => {
    const res = await axios.post(`${API}/api/auth/login`, data);
    localStorage.setItem("token", res.data.token);
    set({ user: res.data.user, token: res.data.token });
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
      return res.data;
    } catch (err) {
      localStorage.removeItem("token");
      set({ user: null, token: null });
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));