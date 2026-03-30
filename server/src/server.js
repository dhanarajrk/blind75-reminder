import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { seedProblems } from "./utils/seedProblems.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    seedProblems();
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});