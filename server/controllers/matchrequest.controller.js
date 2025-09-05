import MatchRequest from "../models/MatchRequest.js";
import User from "../models/User.js";
import Match from "../models/Match.js";

export const sendRequest = async (req, res) => {
  try {
    const { toId } = req.params;
    const fromId = req.user.id;

    if (fromId === toId) return res.status(400).json({ message: "Cannot match yourself" });

    const fromUser = await User.findById(fromId);
    const toUser = await User.findById(toId);
    if (!fromUser || !toUser) return res.status(404).json({ message: "User not found" });

    // ✅ Use Match as the authority
    if (fromUser.role === "learner") {
      const existingMatch = await Match.findOne({ learner: fromId });
      if (existingMatch) return res.status(400).json({ message: "Learner already has a mentor" });
    }
    // Optional: also block if the target learner already has a mentor
    if (toUser.role === "learner") {
      const learnerHasMatch = await Match.findOne({ learner: toId });
      if (learnerHasMatch) return res.status(400).json({ message: "This learner already has a mentor" });
    }

    // ✅ Prevent duplicates (pending) in EITHER direction
    const existingPending = await MatchRequest.findOne({
      status: "pending",
      $or: [
        { from: fromId, to: toId },
        { from: toId, to: fromId },
      ],
    });
    if (existingPending) return res.status(400).json({ message: "Request already exists" });

    const request = await MatchRequest.create({ from: fromId, to: toId });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const respondRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // "accept" or "reject"
    const userId = req.user.id;

    const request = await MatchRequest.findById(requestId).populate("from to");
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (String(request.to._id) !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (action === "accept") {
      request.status = "accepted";

      const learner = request.from.role === "learner" ? request.from : request.to;
      const mentor = request.from.role === "mentor" ? request.from : request.to;

      if (!learner || !mentor) {
        return res.status(400).json({ message: "A learner and a mentor are required for a match" });
      }

      // Prevent learner having multiple mentors
      const existingMentor = await Match.findOne({ learner: learner._id });
      if (existingMentor) {
        return res.status(400).json({ message: "This learner already has a mentor" });
      }

      // Prevent duplicate matches
      const existingMatch = await Match.findOne({ learner: learner._id, mentor: mentor._id });
      if (!existingMatch) {
        await Match.create({ learner: learner._id, mentor: mentor._id });

        // 🔹 Update User docs
        await User.findByIdAndUpdate(learner._id, { mentor: mentor._id, status: "Matched" });
        await User.findByIdAndUpdate(mentor._id, { $addToSet: { learners: learner._id }, status: "Matched" });
      }

      await request.save();

      return res.json({
        message: "Request accepted successfully",
        request,
        matched: true,
        learner,
        mentor,
      });
    } else if (action === "reject") {
      // Instead of just marking as rejected, delete it 🔥
      await MatchRequest.findByIdAndDelete(requestId);

      return res.json({
        message: "Request rejected and removed",
        matched: false,
      });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const listRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const requests = await MatchRequest.find({
      $or: [{ from: userId }, { to: userId }]
    }).populate("from to", "firstname lastname role");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};