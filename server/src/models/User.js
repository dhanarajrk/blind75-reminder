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

    reminderEnabled: {
      type: Boolean,
      default: true,
    },

    // ✅ NEW FIELD (prevents duplicate emails)
    lastReminderDateKey: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);