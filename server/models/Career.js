import mongoose from "mongoose";

const roadmapStageSchema = new mongoose.Schema({
  title: String,       // e.g. "Foundation Stage"
  description: String, // e.g. "High School Math, IT, Critical Thinking"
  resources: [String]  // e.g. ["link1", "link2"]
});

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true },  // e.g. "Software Developer"
  overview: String,
  requiredSkills: [String],
  educationPath: String,
  avgSalary: String,
  categories: [String],   // e.g. ["Technology"]
  roadmap: [roadmapStageSchema],
});

export default mongoose.model("Career", careerSchema);