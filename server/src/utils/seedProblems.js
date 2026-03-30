import Problem from "../models/Problem.js";

export const seedProblems = async () => {
  const count = await Problem.countDocuments();
  if (count > 0) return;

  const problems = [
    { title: "Two Sum", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    { title: "Best Time to Buy/Sell Stock", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    { title: "Contains Duplicate", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    { title: "Product of Array Except Self", topic: "Array", difficulty: "medium", defaultInterval: 14 },
    { title: "Maximum Subarray", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    { title: "Word Break", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "Clone Graph", topic: "Graph", difficulty: "medium", defaultInterval: 11 },
    { title: "Merge Intervals", topic: "Interval", difficulty: "medium", defaultInterval: 14 },
    { title: "Reverse Linked List", topic: "Linked List", difficulty: "easy", defaultInterval: 21 },
    { title: "Binary Tree Maximum Path Sum", topic: "Tree", difficulty: "hard", defaultInterval: 3 },
  ];

  await Problem.insertMany(problems);
  console.log("Problems seeded");
};