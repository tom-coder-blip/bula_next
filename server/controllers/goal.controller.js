import Goal from "../models/Goal.js";

export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({ ...req.body, userId: req.user.id });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: "Failed to create goal" });
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.status(200).json(goals);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch goals" });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedGoal);
  } catch (err) {
    res.status(500).json({ message: "Failed to update goal" });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to delete goal" });
  }
};