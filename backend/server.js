import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import issueRoutes from "./src/routes/issue.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js"; // Correct import

const app = express(); // define app first
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(morgan("dev"));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 120 });
app.use(limiter);

// Routes
app.get("/", (_req, res) => res.json({ ok: true, name: "Tech for Civic API" }));

app.use("/api/auth", authRoutes);
app.use("/api", issueRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes); // mount analytics routes once

// Global error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, error: err.message || "Internal Server Error" });
});

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
};
start();