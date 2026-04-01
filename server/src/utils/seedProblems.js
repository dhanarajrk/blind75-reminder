import Problem from "../models/Problem.js";

export const seedProblems = async () => {
  const count = await Problem.countDocuments();
  if (count > 0) return;

  const problems = [
    { title: "Two Sum", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    { title: "Best Time to Buy and Sell Stock", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    { title: "Contains Duplicate", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    { title: "Product of Array Except Self", topic: "Array", difficulty: "medium", defaultInterval: 14 },
    { title: "Maximum Subarray", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    { title: "Maximum Product Subarray", topic: "Array", difficulty: "medium", defaultInterval: 14 },
    { title: "Find Minimum in Rotated Sorted Array", topic: "Array", difficulty: "medium", defaultInterval: 14 },
    { title: "Search in Rotated Sorted Array", topic: "Array", difficulty: "medium", defaultInterval: 14 },
    { title: "3Sum", topic: "Array", difficulty: "medium", defaultInterval: 14 },
    { title: "Container With Most Water", topic: "Array", difficulty: "medium", defaultInterval: 14 },

    { title: "Sum of Two Integers", topic: "Binary", difficulty: "medium", defaultInterval: 11 },
    { title: "Number of 1 Bits", topic: "Binary", difficulty: "easy", defaultInterval: 18 },
    { title: "Counting Bits", topic: "Binary", difficulty: "easy", defaultInterval: 18 },
    { title: "Missing Number", topic: "Binary", difficulty: "easy", defaultInterval: 18 },
    { title: "Reverse Bits", topic: "Binary", difficulty: "easy", defaultInterval: 18 },

    { title: "Climbing Stairs", topic: "DP", difficulty: "easy", defaultInterval: 11 },
    { title: "Coin Change", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "Longest Increasing Subsequence", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "Longest Common Subsequence", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "Word Break", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "Combination Sum IV", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "House Robber", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "House Robber II", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "Decode Ways", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "Unique Paths", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    { title: "Jump Game", topic: "DP", difficulty: "medium", defaultInterval: 11 },

    { title: "Clone Graph", topic: "Graph", difficulty: "medium", defaultInterval: 11 },
    { title: "Course Schedule", topic: "Graph", difficulty: "medium", defaultInterval: 11 },
    { title: "Pacific Atlantic Water Flow", topic: "Graph", difficulty: "medium", defaultInterval: 11 },
    { title: "Number of Islands", topic: "Graph", difficulty: "medium", defaultInterval: 11 },
    { title: "Longest Consecutive Sequence", topic: "Graph", difficulty: "medium", defaultInterval: 14 },
    { title: "Alien Dictionary", topic: "Graph", difficulty: "hard", defaultInterval: 3 },
    { title: "Graph Valid Tree", topic: "Graph", difficulty: "medium", defaultInterval: 11 },
    { title: "Number of Connected Components in an Undirected Graph", topic: "Graph", difficulty: "medium", defaultInterval: 11 },

    { title: "Insert Interval", topic: "Interval", difficulty: "medium", defaultInterval: 14 },
    { title: "Merge Intervals", topic: "Interval", difficulty: "medium", defaultInterval: 14 },
    { title: "Non-overlapping Intervals", topic: "Interval", difficulty: "medium", defaultInterval: 14 },
    { title: "Meeting Rooms", topic: "Interval", difficulty: "easy", defaultInterval: 21 },
    { title: "Meeting Rooms II", topic: "Interval", difficulty: "medium", defaultInterval: 14 },

    { title: "Reverse Linked List", topic: "Linked List", difficulty: "easy", defaultInterval: 21 },
    { title: "Linked List Cycle", topic: "Linked List", difficulty: "easy", defaultInterval: 21 },
    { title: "Merge Two Sorted Lists", topic: "Linked List", difficulty: "easy", defaultInterval: 21 },
    { title: "Merge K Sorted Lists", topic: "Linked List", difficulty: "hard", defaultInterval: 3 },
    { title: "Remove Nth Node From End of List", topic: "Linked List", difficulty: "medium", defaultInterval: 14 },
    { title: "Reorder List", topic: "Linked List", difficulty: "medium", defaultInterval: 14 },

    { title: "Set Matrix Zeroes", topic: "Matrix", difficulty: "medium", defaultInterval: 14 },
    { title: "Spiral Matrix", topic: "Matrix", difficulty: "medium", defaultInterval: 14 },
    { title: "Rotate Image", topic: "Matrix", difficulty: "medium", defaultInterval: 14 },
    { title: "Word Search", topic: "Matrix", difficulty: "medium", defaultInterval: 10 },

    { title: "Longest Substring Without Repeating Characters", topic: "String", difficulty: "medium", defaultInterval: 14 },
    { title: "Longest Repeating Character Replacement", topic: "String", difficulty: "medium", defaultInterval: 14 },
    { title: "Minimum Window Substring", topic: "String", difficulty: "hard", defaultInterval: 6 },
    { title: "Valid Anagram", topic: "String", difficulty: "easy", defaultInterval: 21 },
    { title: "Group Anagrams", topic: "String", difficulty: "medium", defaultInterval: 14 },
    { title: "Valid Parentheses", topic: "String", difficulty: "easy", defaultInterval: 21 },
    { title: "Valid Palindrome", topic: "String", difficulty: "easy", defaultInterval: 21 },
    { title: "Longest Palindromic Substring", topic: "String", difficulty: "medium", defaultInterval: 14 },
    { title: "Palindromic Substrings", topic: "String", difficulty: "medium", defaultInterval: 14 },
    { title: "Encode and Decode Strings", topic: "String", difficulty: "medium", defaultInterval: 14 },

    { title: "Maximum Depth of Binary Tree", topic: "Tree", difficulty: "easy", defaultInterval: 18 },
    { title: "Same Tree", topic: "Tree", difficulty: "easy", defaultInterval: 18 },
    { title: "Invert Binary Tree", topic: "Tree", difficulty: "easy", defaultInterval: 18 },
    { title: "Binary Tree Maximum Path Sum", topic: "Tree", difficulty: "hard", defaultInterval: 3 },
    { title: "Binary Tree Level Order Traversal", topic: "Tree", difficulty: "medium", defaultInterval: 11 },
    { title: "Serialize and Deserialize Binary Tree", topic: "Tree", difficulty: "hard", defaultInterval: 3 },
    { title: "Subtree of Another Tree", topic: "Tree", difficulty: "easy", defaultInterval: 18 },
    { title: "Construct Binary Tree from Preorder and Inorder Traversal", topic: "Tree", difficulty: "medium", defaultInterval: 10 },
    { title: "Validate Binary Search Tree", topic: "Tree", difficulty: "medium", defaultInterval: 10 },
    { title: "Kth Smallest Element in a BST", topic: "Tree", difficulty: "medium", defaultInterval: 10 },
    { title: "Lowest Common Ancestor of a Binary Search Tree", topic: "Tree", difficulty: "easy", defaultInterval: 18 },
    { title: "Implement Trie (Prefix Tree)", topic: "Tree", difficulty: "medium", defaultInterval: 10 },
    { title: "Design Add and Search Words Data Structure", topic: "Tree", difficulty: "medium", defaultInterval: 10 },
    { title: "Word Search II", topic: "Tree", difficulty: "hard", defaultInterval: 3 },

    { title: "Top K Frequent Elements", topic: "Heap", difficulty: "medium", defaultInterval: 11 },
    { title: "Find Median from Data Stream", topic: "Heap", difficulty: "hard", defaultInterval: 3 },
  ];

  await Problem.insertMany(problems);
  console.log(`Seeded ${problems.length} Blind 75 problems`);
};