import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { createGoal, getGoals, updateGoal, deleteGoal } from "../controllers/goal.controller.js";

const router = express.Router();

router.post("/", verifyToken, createGoal);
router.get("/", verifyToken, getGoals);
router.put("/:id", verifyToken, updateGoal);
router.delete("/:id", verifyToken, deleteGoal);

export default router;