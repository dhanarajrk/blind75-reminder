import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const fetchAnalytics = async (token) => {
  const res = await axios.get(`${API}/api/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};