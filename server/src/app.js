import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Blind 75 REMINDER API is running",
  });
});

// auth routes
app.use("/api/auth", authRoutes);

export default app;