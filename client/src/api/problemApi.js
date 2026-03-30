import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const fetchDashboard = async (token) => {
  const res = await axios.get(`${API}/api/problems/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};