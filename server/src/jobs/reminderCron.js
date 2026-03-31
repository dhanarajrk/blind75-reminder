import cron from "node-cron";
import { sendDueReminders } from "../services/reminderService.js";

export const startReminderCron = () => {
  cron.schedule("0 9 * * *", async () => {
    try {
      console.log("Running daily reminder cron");
      await sendDueReminders();
    } catch (err) {
      console.error("Reminder cron failed:", err.message);
    }
  });
};