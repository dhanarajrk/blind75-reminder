import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";

import authRoutes from "./routes/authRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blind 75 REMINDER API is running",
  });
});

//routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/reminders", reminderRoutes);

export default app;