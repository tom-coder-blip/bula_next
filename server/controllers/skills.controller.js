import User from "../models/User.js";

// Get current user’s skills
export const getMySkills = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.skills || []);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new skill
export const addSkill = async (req, res) => {
  try {
    const { skill } = req.body;
    if (!skill) return res.status(400).json({ message: "Skill required" });

    const user = await User.findById(req.user.id);
    if (!user.skills.includes(skill)) {
      user.skills.push(skill);
      await user.save();
    }
    res.json(user.skills);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a skill
export const removeSkill = async (req, res) => {
  try {
    const { skill } = req.params;

    if (!skill) {
      return res.status(400).json({ message: "Skill required" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the skill from the array
    user.skills = user.skills.filter((s) => s !== skill);
    await user.save();

    res.json(user.skills); // return updated skills array
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};