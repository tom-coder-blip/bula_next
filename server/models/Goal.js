import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  deadline: { type: Date, required: true },
  progress: { type: Number, default: 0 }, // 0% → 100%
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Goal", goalSchema);