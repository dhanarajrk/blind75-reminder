import Problem from "../models/Problem.js";
import UserProblem from "../models/UserProblem.js";

export const getDashboard = async (req, res) => {
  const userId = req.user.id;

  const problems = await Problem.find();

  const userProblems = await UserProblem.find({ user: userId });

  const map = {};
  userProblems.forEach((up) => {
    map[up.problem.toString()] = up;
  });

  const merged = problems.map((p) => {
    const up = map[p._id] || null;

    return {
      _id: p._id,
      title: p.title,
      topic: p.topic,
      difficulty: p.difficulty,
      defaultInterval: p.defaultInterval,

      customInterval: up?.customInterval || null,
      useCustomInterval: up?.useCustomInterval || false,

      nextReviewAt: up?.nextReviewAt || null,
      streak: up?.streak || 0,
      status: up?.status || "not_started",
    };
  });

  res.json(merged);
};