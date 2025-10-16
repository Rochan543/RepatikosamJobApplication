import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import jobsRouter from "./routes/jobs";
import authRouter from "./routes/auth";
import contactRouter from "./routes/contact";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health and demo
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // App routes
  app.use("/api/jobs", jobsRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/contact", contactRouter);

  return app;
}
