import express from "express";
import { addSkill, removeSkill, getMySkills } from "../controllers/skills.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

// CRUD for skills
router.get("/", verifyToken, getMySkills);
router.post("/", verifyToken, addSkill);
router.delete("/:skill", verifyToken, removeSkill);

export default router;