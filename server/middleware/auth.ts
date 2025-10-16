import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "JWT_SECRET not configured" });
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, secret) as { sub: string };
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
