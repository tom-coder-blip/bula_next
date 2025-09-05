import Career from "../models/Career.js";
import User from "../models/User.js";

// Get all careers with optional search/category filters
export const getCareers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }
    if (req.query.category) {
      filter.categories = { $regex: req.query.category, $options: "i" };
    }
    const careers = await Career.find(filter);
    res.status(200).json(careers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single career details
export const getCareerById = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) return res.status(404).json({ message: "Career not found" });
    res.json(career);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Skill gap analysis (compare user skills vs career required skills)
export const skillGapAnalysis = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    const user = await User.findById(req.user.id);

    if (!career || !user) return res.status(404).json({ message: "Not found" });

    const userSkills = user.skills || [];
    const required = career.requiredSkills || [];

    const has = required.filter(skill => userSkills.includes(skill));
    const needs = required.filter(skill => !userSkills.includes(skill));

    res.json({ has, needs });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};