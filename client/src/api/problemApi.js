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

export const reviewProblem = async (token, data) => {
  const res = await axios.post(`${API}/api/problems/review`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateIntervalApi = async (token, data) => {
  const res = await axios.post(`${API}/api/problems/interval`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};