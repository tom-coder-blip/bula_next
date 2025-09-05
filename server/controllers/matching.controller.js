import mongoose from "mongoose";
import Match from "../models/Match.js";
import User from "../models/User.js";
import MatchRequest from "../models/MatchRequest.js";

// Learner → Mentor matching
export const matchMentors = async (req, res) => {
  try {
    const learner = await User.findById(req.user.id);
    if (!learner || learner.role !== "learner") {
      return res.status(403).json({ message: "Access denied" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      role: "mentor",
      interests: { $in: learner.interests },
      location: learner.location,
    };

    const total = await User.countDocuments(filter);
    const mentors = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: mentors,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mentor → Learner matching
export const matchLearners = async (req, res) => {
  try {
    const mentor = await User.findById(req.user.id);
    if (!mentor || mentor.role !== "mentor") {
      return res.status(403).json({ message: "Access denied" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
      role: "learner",
      interests: { $in: mentor.interests },
      location: mentor.location,
    };

    const total = await User.countDocuments(filter);
    const learners = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      data: learners,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE MATCH — also updates both users' statuses
export const createMatch = async (req, res) => {
  try {
    const { mentorId, learnerId } = req.body;

    // Create the match document
    const match = await Match.create({ mentor: mentorId, learner: learnerId });

    // Update both users' statuses to Matched
    await User.findByIdAndUpdate(mentorId, { status: "Matched" });
    await User.findByIdAndUpdate(learnerId, { status: "Matched" });

    res.status(201).json(match);
  } catch (err) {
    res.status(500).json({ message: "Failed to create match" });
  }
};

// GET MY MATCHES
export const getMyMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    let matches;
    if (user.role === "learner") {
      matches = await Match.find({ learner: userId })
        .populate("learner")
        .populate("mentor");
    } else {
      matches = await Match.find({ mentor: userId })
        .populate("learner")
        .populate("mentor");
    }

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// UNMATCH USER — updates both users' statuses to Unmatched
export const unmatchUser = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;

    // Find the match
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: "Match not found" });

    // Check if the logged-in user is part of this match
    if (String(match.learner) !== userId && String(match.mentor) !== userId) {
      return res.status(403).json({ message: "Not authorized to unmatch this user" });
    }

    // Reset learner → always unmatched
    await User.findByIdAndUpdate(match.learner, {
      status: "Unmatched",
      $unset: { mentor: "" }
    });

    // Update mentor: remove learner from list
    const mentor = await User.findByIdAndUpdate(
      match.mentor,
      { $pull: { learners: match.learner } },
      { new: true } // return updated mentor
    );

    // If mentor still has learners, keep them "Matched", otherwise reset to "Unmatched"
    if (mentor.learners.length === 0) {
      mentor.status = "Unmatched";
      await mentor.save();
    }

    // Delete the Match record
    await Match.findByIdAndDelete(matchId);

    // Delete related MatchRequest(s)
    await MatchRequest.deleteMany({
      $or: [
        { from: match.learner, to: match.mentor, status: "accepted" },
        { from: match.mentor, to: match.learner, status: "accepted" }
      ]
    });

    return res.status(200).json({ message: "Unmatched successfully" });
  } catch (err) {
    console.error("Error unmatching:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

