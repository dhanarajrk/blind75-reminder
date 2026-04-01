import mongoose from "mongoose";

const problemReviewLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    result: {
      type: String,
      enum: ["solved", "struggled"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ProblemReviewLog", problemReviewLogSchema);