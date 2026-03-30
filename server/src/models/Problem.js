import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: String,
  topic: String,
  difficulty: String,
  defaultInterval: Number,
});

export default mongoose.model("Problem", problemSchema);