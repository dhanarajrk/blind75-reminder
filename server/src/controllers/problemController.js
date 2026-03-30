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


export const updateReview = async (req, res) => {
    const userId = req.user.id;
    const { problemId, type } = req.body; // solved | struggled
  
    const problem = await Problem.findById(problemId);
  
    let up = await UserProblem.findOne({
      user: userId,
      problem: problemId,
    });
  
    if (!up) {
      up = await UserProblem.create({
        user: userId,
        problem: problemId,
        defaultInterval: problem.defaultInterval,
      });
    }
  
    const interval = up.useCustomInterval
      ? up.customInterval
      : up.defaultInterval;
  
    const now = new Date();
  
    if (type === "solved") {
      up.solveCount += 1;
      up.streak += 1;
      up.nextReviewAt = new Date(now.getTime() + interval * 86400000);
    } else {
      up.struggleCount += 1;
      up.streak = 0;
      const penalty = Math.max(3, interval - 3);
      up.nextReviewAt = new Date(now.getTime() + penalty * 86400000);
    }
  
    up.lastReviewedAt = now;
    up.status = "reviewing";
  
    await up.save();
  
    res.json(up);
  };


  export const updateInterval = async (req, res) => {
    const userId = req.user.id;
    const { problemId, customInterval } = req.body;
  
    let up = await UserProblem.findOne({
      user: userId,
      problem: problemId,
    });
  
    if (!up) {
      const problem = await Problem.findById(problemId);
  
      up = await UserProblem.create({
        user: userId,
        problem: problemId,
        defaultInterval: problem.defaultInterval,
      });
    }
  
    up.customInterval = customInterval;
    up.useCustomInterval = true;
  
    await up.save();
  
    res.json(up);
  };