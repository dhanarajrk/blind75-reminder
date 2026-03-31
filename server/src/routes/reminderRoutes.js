import express from "express";
import { triggerReminderTest } from "../controllers/reminderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/test", protect, triggerReminderTest);

export default router;