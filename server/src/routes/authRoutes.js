import express from "express";
import passport from "passport";
import {
  register,
  login,
  getMe,
  updateReminderSettings,
  googleAuthSuccess,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/reminders", protect, updateReminderSettings);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleAuthSuccess
);

export default router;