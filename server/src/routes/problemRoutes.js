import express from "express";
import { getDashboard } from "../controllers/problemController.js";
import { protect } from "../middleware/authMiddleware.js";
import { updateReview, updateInterval } from "../controllers/problemController.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboard);
router.post("/review", protect, updateReview);
router.post("/interval", protect, updateInterval);

export default router;