import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const fetchAnalytics = async (token, params = {}) => {
  const res = await axios.get(`${API}/api/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return res.data;
};