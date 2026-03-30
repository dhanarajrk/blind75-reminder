import { create } from "zustand";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,

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

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));