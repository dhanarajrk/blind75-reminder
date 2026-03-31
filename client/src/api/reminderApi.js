import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export const sendTestReminderApi = async (token) => {
  const res = await axios.post(
    `${API}/api/reminders/test`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};