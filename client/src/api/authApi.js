import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const fetchMe = async (token) => {
  const res = await axios.get(`${API}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateReminderSettingsApi = async (token, data) => {
  const res = await axios.put(`${API}/api/auth/reminders`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};