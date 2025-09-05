// scripts/cleanupMatchRequests.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import Match from "../models/Match.js";
import MatchRequest from "../models/MatchRequest.js";

dotenv.config({ path: "./server/.env" });

(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const accepted = await MatchRequest.find({ status: "accepted" });
  let deleted = 0;

  for (const r of accepted) {
    const exists =
      (await Match.findOne({ learner: r.from, mentor: r.to })) ||
      (await Match.findOne({ learner: r.to, mentor: r.from }));

    if (!exists) {
      await MatchRequest.findByIdAndDelete(r._id);
      deleted++;
    }
  }

  console.log(`Cleanup complete. Deleted ${deleted} stale accepted requests.`);
  await mongoose.disconnect();
  process.exit(0);
})();