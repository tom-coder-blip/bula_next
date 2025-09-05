import express from 'express';
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  getAnalytics
} from '../controllers/mentor.controller.js';
import verifyToken from '../middleware/auth.middleware.js';
import Goal from '../models/Goal.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/goals', verifyToken, createGoal);
router.get('/goals', verifyToken, getGoals);
router.put('/goals/:id', verifyToken, updateGoal);
router.delete('/goals/:id', verifyToken, deleteGoal);

// NEW: Mentor Analytics
router.get('/goals/analytics', verifyToken, getAnalytics);

router.get("/learner/:learnerId/goals", verifyToken, async (req, res) => {
  try {
    const learner = await User.findById(req.params.learnerId);
    if (!learner) return res.status(404).json({ message: "Learner not found" });

    const goals = await Goal.find({ userId: learner._id });
    res.status(200).json({ learner, goals });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;