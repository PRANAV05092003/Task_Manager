import express from "express";
import {
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamController.js";
import { protect } from "../middleware/authMiddleware.js";
import { requireDb } from "../middleware/dbMiddleware.js";

const router = express.Router();

router.use(protect, requireDb);

router.route("/").get(getTeamMembers).post(createTeamMember);
router.route("/:id").put(updateTeamMember).delete(deleteTeamMember);

export default router;
