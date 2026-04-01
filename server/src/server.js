import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { seedProblems } from "./utils/seedProblems.js";
import { startReminderCron } from "./jobs/reminderCron.js";
import configurePassport from "./config/passport.js";


const PORT = process.env.PORT || 5000;

connectDB().then(async () => {
  await seedProblems();
  configurePassport();
  startReminderCron();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});