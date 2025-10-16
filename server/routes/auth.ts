import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;
  if (!secret) return res.status(500).json({ message: "JWT_SECRET not configured" });
  if (!adminEmail || !adminPassword)
    return res.status(500).json({ message: "Admin credentials not configured" });

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign({ sub: email, role: "admin" }, secret, { expiresIn: "8h" });
    return res.json({ token });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

export default router;
