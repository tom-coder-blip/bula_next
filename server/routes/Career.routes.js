import express from "express";
import { getCareers, getCareerById, skillGapAnalysis } from "../controllers/career.controller.js";
import verifyToken from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCareers);                 // public browse/search careers
router.get("/:id", getCareerById);           // career details
router.get("/:id/skill-gap", verifyToken, skillGapAnalysis); // personalized gap

export default router;