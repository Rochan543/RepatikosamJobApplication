import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const { name, email, message } = req.body || {};
  console.log("Contact form submission:", { name, email, message });
  res.json({ success: true });
});

export default router;
