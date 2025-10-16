import { Router } from "express";
import { connectMongo } from "../db/mongo";
import { Job } from "../models/Job";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", async (_req, res) => {
  const conn = await connectMongo();
  if (!conn) return res.json([]);
  const jobs = await Job.find().sort({ createdAt: -1 }).lean();
  res.json(jobs);
});

router.get("/:id", async (req, res) => {
  const conn = await connectMongo();
  if (!conn) return res.status(404).json({ message: "Not found" });
  const job = await Job.findById(req.params.id).lean();
  if (!job) return res.status(404).json({ message: "Not found" });
  res.json(job);
});

router.post("/", requireAuth, async (req, res) => {
  const conn = await connectMongo();
  if (!conn) return res.status(500).json({ message: "DB not configured" });
  try {
    const created = await Job.create(req.body);
    res.status(201).json(created);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Invalid payload" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  const conn = await connectMongo();
  if (!conn) return res.status(500).json({ message: "DB not configured" });
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({ message: e.message || "Invalid payload" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  const conn = await connectMongo();
  if (!conn) return res.status(500).json({ message: "DB not configured" });
  const deleted = await Job.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Not found" });
  res.json({ success: true });
});

export default router;
