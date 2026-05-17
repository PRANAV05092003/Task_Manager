import express from "express";
import { signup, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireDb } from "../middleware/dbMiddleware.js";

const router = express.Router();

router.post("/signup", requireDb, signup);
router.post("/login", requireDb, login);
router.get("/me", protect, getMe);

export default router;
