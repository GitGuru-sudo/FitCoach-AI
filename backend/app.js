import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";

import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import aiRoutes from "./routes/aiRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";

dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(limiter);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "fitcoach-ai-backend" });
});

app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
