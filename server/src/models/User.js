import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);