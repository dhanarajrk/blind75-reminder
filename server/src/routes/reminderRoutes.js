import express from "express";
import { triggerReminderTest } from "../controllers/reminderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { runRemindersManually } from "../controllers/reminderController.js";

const router = express.Router();

router.post("/test", protect, triggerReminderTest);
router.post("/run", runRemindersManually);

export default router;