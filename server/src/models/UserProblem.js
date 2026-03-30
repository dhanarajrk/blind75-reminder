import mongoose from "mongoose";

const userProblemSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: "Problem" },

    status: {
      type: String,
      enum: ["not_started", "learning", "reviewing", "mastered"],
      default: "not_started",
    },

    defaultInterval: Number,
    customInterval: Number,
    useCustomInterval: { type: Boolean, default: false },

    lastReviewedAt: Date,
    nextReviewAt: Date,

    solveCount: { type: Number, default: 0 },
    struggleCount: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("UserProblem", userProblemSchema);