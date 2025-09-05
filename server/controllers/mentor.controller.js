import Goal from '../models/Goal.js';
import User from "../models/User.js";

export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user.id });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all goals for mentor's learners (with learner info)
export const getGoals = async (req, res) => {
  try {
    const mentor = await User.findById(req.user.id).populate("learners", "firstname lastname email");
    if (!mentor || mentor.role !== "mentor") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Fetch goals for all learners and include learner info
    const goals = await Goal.find({ userId: { $in: mentor.learners.map(l => l._id) } })
      .populate("userId", "firstname lastname email");

    res.status(200).json({ learners: mentor.learners, goals });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch learner goals" });
  }
};

// Update Goal (mentor can only update learner goals they own)
export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    // find mentor + their learners
    const mentor = await User.findById(req.user.id).populate("learners");
    if (!mentor || mentor.role !== "mentor") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // check if this goal belongs to one of mentor’s learners
    if (!mentor.learners.some(l => l._id.equals(goal.userId))) {
      return res.status(403).json({ message: "Not authorized to modify this goal" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Goal (mentor can only delete learner goals they own)
export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    // find mentor + their learners
    const mentor = await User.findById(req.user.id).populate("learners");
    if (!mentor || mentor.role !== "mentor") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // check if this goal belongs to one of mentor’s learners
    if (!mentor.learners.some(l => l._id.equals(goal.userId))) {
      return res.status(403).json({ message: "Not authorized to delete this goal" });
    }

    await Goal.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mentor Analytics
export const getAnalytics = async (req, res) => {
  try {
    const mentor = await User.findById(req.user.id).populate("learners");
    const learnerIds = mentor.learners.map(l => l._id);

    const goals = await Goal.find({ userId: { $in: learnerIds } });

    const totalGoals = goals.length;
    const completedGoals = goals.filter((g) => g.progress === 100).length;
    const activeGoals = goals.filter((g) => g.progress < 100).length;

    const onTimeGoals = goals.filter(
      (g) => g.progress === 100 && new Date(g.deadline) >= new Date(g.updatedAt)
    ).length;

    const avgProgress = totalGoals > 0
      ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / totalGoals)
      : 0;

    res.status(200).json({
      totalGoals,
      completedGoals,
      activeGoals,
      onTimeGoals,
      avgProgress,
      successRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};