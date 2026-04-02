import Problem from "../models/Problem.js";

export const seedProblems = async () => {
  const count = await Problem.countDocuments();
  if (count > 0) return;

  const problems = [
    // ─── Array ───────────────────────────────────────────────────────────────
    // Two Sum: hash map trick is intuitive — sticks well
    { title: "Two Sum", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    // Buy/Sell Stock: single-pass min-tracking — intuitive
    { title: "Best Time to Buy and Sell Stock", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    // Contains Duplicate: trivial set usage
    { title: "Contains Duplicate", topic: "Array", difficulty: "easy", defaultInterval: 21 },
    // Product Except Self: prefix+suffix without division — the "no division" constraint trips people up
    { title: "Product of Array Except Self", topic: "Array", difficulty: "medium", defaultInterval: 7 },
    // Maximum Subarray: Kadane's is easy to forget the reset condition
    { title: "Maximum Subarray", topic: "Array", difficulty: "easy", defaultInterval: 10 },
    // Max Product Subarray: tracking both min and max is easy to forget
    { title: "Maximum Product Subarray", topic: "Array", difficulty: "medium", defaultInterval: 5 },
    // Find Min in Rotated: binary search pivot logic is tricky
    { title: "Find Minimum in Rotated Sorted Array", topic: "Array", difficulty: "medium", defaultInterval: 7 },
    // Search in Rotated: two-branch binary search — often blanked on
    { title: "Search in Rotated Sorted Array", topic: "Array", difficulty: "medium", defaultInterval: 7 },
    // 3Sum: dedup logic while iterating is easy to get wrong
    { title: "3Sum", topic: "Array", difficulty: "medium", defaultInterval: 7 },
    // Container With Most Water: two-pointer shrink logic is fairly intuitive
    { title: "Container With Most Water", topic: "Array", difficulty: "medium", defaultInterval: 14 },

    // ─── Binary ──────────────────────────────────────────────────────────────
    // Sum of Two Integers: bit manipulation carry logic is very easy to forget
    { title: "Sum of Two Integers", topic: "Binary", difficulty: "medium", defaultInterval: 3 },
    // Number of 1 Bits: n & (n-1) trick — forgettable
    { title: "Number of 1 Bits", topic: "Binary", difficulty: "easy", defaultInterval: 7 },
    // Counting Bits: DP with bit shift — the recurrence trips people up
    { title: "Counting Bits", topic: "Binary", difficulty: "easy", defaultInterval: 7 },
    // Missing Number: XOR trick is non-obvious
    { title: "Missing Number", topic: "Binary", difficulty: "easy", defaultInterval: 7 },
    // Reverse Bits: bit-by-bit shift pattern — forgettable
    { title: "Reverse Bits", topic: "Binary", difficulty: "easy", defaultInterval: 7 },

    // ─── Dynamic Programming ─────────────────────────────────────────────────
    // Climbing Stairs: classic Fibonacci DP — very sticky
    { title: "Climbing Stairs", topic: "DP", difficulty: "easy", defaultInterval: 21 },
    // Coin Change: BFS/DP setup is fairly standard but amount-array init trips people
    { title: "Coin Change", topic: "DP", difficulty: "medium", defaultInterval: 10 },
    // LIS: patience sort / DP[i] = max of all j<i — the O(n log n) variant fades fast
    { title: "Longest Increasing Subsequence", topic: "DP", difficulty: "medium", defaultInterval: 7 },
    // LCS: 2D DP table direction — people forget the recurrence
    { title: "Longest Common Subsequence", topic: "DP", difficulty: "medium", defaultInterval: 7 },
    // Word Break: DP with substring check in inner loop — pattern is easy to forget
    { title: "Word Break", topic: "DP", difficulty: "medium", defaultInterval: 3 },
    // Combination Sum IV: order-matters unbounded knapsack variant — very forgettable
    { title: "Combination Sum IV", topic: "DP", difficulty: "medium", defaultInterval: 3 },
    // House Robber: simple max(skip, take) DP — quite sticky
    { title: "House Robber", topic: "DP", difficulty: "medium", defaultInterval: 14 },
    // House Robber II: circular array — the two-pass trick is forgettable
    { title: "House Robber II", topic: "DP", difficulty: "medium", defaultInterval: 7 },
    // Decode Ways: DP with one/two digit branching — edge cases forgotten quickly
    { title: "Decode Ways", topic: "DP", difficulty: "medium", defaultInterval: 5 },
    // Unique Paths: simple grid DP — intuitive and sticky
    { title: "Unique Paths", topic: "DP", difficulty: "medium", defaultInterval: 14 },
    // Jump Game: greedy max-reach approach — often confused with DP
    { title: "Jump Game", topic: "DP", difficulty: "medium", defaultInterval: 10 },

    // ─── Graph ───────────────────────────────────────────────────────────────
    // Clone Graph: DFS with visited map — pattern is straightforward
    { title: "Clone Graph", topic: "Graph", difficulty: "medium", defaultInterval: 14 },
    // Course Schedule: cycle detection in directed graph — DFS states (0/1/2) forgotten
    { title: "Course Schedule", topic: "Graph", difficulty: "medium", defaultInterval: 7 },
    // Pacific Atlantic: two-BFS from both coasts — setup direction is easy to flip
    { title: "Pacific Atlantic Water Flow", topic: "Graph", difficulty: "medium", defaultInterval: 5 },
    // Number of Islands: flood-fill DFS — very intuitive and sticky
    { title: "Number of Islands", topic: "Graph", difficulty: "medium", defaultInterval: 14 },
    // Longest Consecutive Sequence: set-based O(n) — the "only start from sequence head" trick fades
    { title: "Longest Consecutive Sequence", topic: "Graph", difficulty: "medium", defaultInterval: 7 },
    // Alien Dictionary: topological sort from character edges — very forgettable
    { title: "Alien Dictionary", topic: "Graph", difficulty: "hard", defaultInterval: 3 },
    // Graph Valid Tree: union-find or DFS cycle + connectivity — pattern fades
    { title: "Graph Valid Tree", topic: "Graph", difficulty: "medium", defaultInterval: 7 },
    // Number of Connected Components: union-find — straightforward but union-find impl fades
    { title: "Number of Connected Components in an Undirected Graph", topic: "Graph", difficulty: "medium", defaultInterval: 7 },

    // ─── Interval ────────────────────────────────────────────────────────────
    // Insert Interval: binary-search + merge — the merge loop boundaries trip people
    { title: "Insert Interval", topic: "Interval", difficulty: "medium", defaultInterval: 7 },
    // Merge Intervals: sort then merge — fairly sticky
    { title: "Merge Intervals", topic: "Interval", difficulty: "medium", defaultInterval: 14 },
    // Non-overlapping Intervals: greedy end-time sort — the "keep end" trick fades
    { title: "Non-overlapping Intervals", topic: "Interval", difficulty: "medium", defaultInterval: 7 },
    // Meeting Rooms: simple sort + overlap check — trivial
    { title: "Meeting Rooms", topic: "Interval", difficulty: "easy", defaultInterval: 21 },
    // Meeting Rooms II: min-heap of end times — the heap approach is forgettable
    { title: "Meeting Rooms II", topic: "Interval", difficulty: "medium", defaultInterval: 7 },

    // ─── Linked List ─────────────────────────────────────────────────────────
    // Reverse Linked List: very sticky — classic
    { title: "Reverse Linked List", topic: "Linked List", difficulty: "easy", defaultInterval: 21 },
    // Linked List Cycle: fast/slow pointer — intuitive
    { title: "Linked List Cycle", topic: "Linked List", difficulty: "easy", defaultInterval: 21 },
    // Merge Two Sorted Lists: pointer merging — intuitive
    { title: "Merge Two Sorted Lists", topic: "Linked List", difficulty: "easy", defaultInterval: 21 },
    // Merge K Sorted Lists: min-heap of k heads — heap setup detail fades fast
    { title: "Merge K Sorted Lists", topic: "Linked List", difficulty: "hard", defaultInterval: 3 },
    // Remove Nth From End: two-pointer with n+1 gap — the off-by-one fades
    { title: "Remove Nth Node From End of List", topic: "Linked List", difficulty: "medium", defaultInterval: 7 },
    // Reorder List: find-mid + reverse-second + merge — multi-step, very forgettable
    { title: "Reorder List", topic: "Linked List", difficulty: "medium", defaultInterval: 5 },

    // ─── Matrix ──────────────────────────────────────────────────────────────
    // Set Matrix Zeroes: mark rows/cols first to avoid contamination — easy to forget why
    { title: "Set Matrix Zeroes", topic: "Matrix", difficulty: "medium", defaultInterval: 7 },
    // Spiral Matrix: boundary-shrink loop — direction tracking is forgettable
    { title: "Spiral Matrix", topic: "Matrix", difficulty: "medium", defaultInterval: 7 },
    // Rotate Image: transpose then reverse — the two-step trick fades
    { title: "Rotate Image", topic: "Matrix", difficulty: "medium", defaultInterval: 7 },
    // Word Search: DFS with visited marking — fairly sticky
    { title: "Word Search", topic: "Matrix", difficulty: "medium", defaultInterval: 14 },

    // ─── String ──────────────────────────────────────────────────────────────
    // Longest Substring Without Repeating: sliding window with set — intuitive
    { title: "Longest Substring Without Repeating Characters", topic: "String", difficulty: "medium", defaultInterval: 14 },
    // Longest Repeating Char Replacement: window with max-freq trick — the k-constraint logic fades
    { title: "Longest Repeating Character Replacement", topic: "String", difficulty: "medium", defaultInterval: 5 },
    // Minimum Window Substring: two-pointer with have/need counters — very forgettable
    { title: "Minimum Window Substring", topic: "String", difficulty: "hard", defaultInterval: 3 },
    // Valid Anagram: char frequency — trivial and sticky
    { title: "Valid Anagram", topic: "String", difficulty: "easy", defaultInterval: 21 },
    // Group Anagrams: sorted-string as key — fairly intuitive
    { title: "Group Anagrams", topic: "String", difficulty: "medium", defaultInterval: 14 },
    // Valid Parentheses: stack push/pop — classic and sticky
    { title: "Valid Parentheses", topic: "String", difficulty: "easy", defaultInterval: 21 },
    // Valid Palindrome: two-pointer — trivial
    { title: "Valid Palindrome", topic: "String", difficulty: "easy", defaultInterval: 21 },
    // Longest Palindromic Substring: expand-around-center — the even/odd call fades
    { title: "Longest Palindromic Substring", topic: "String", difficulty: "medium", defaultInterval: 7 },
    // Palindromic Substrings: same expand technique — slightly forgettable
    { title: "Palindromic Substrings", topic: "String", difficulty: "medium", defaultInterval: 10 },
    // Encode/Decode Strings: length-prefix encoding — the format detail fades fast
    { title: "Encode and Decode Strings", topic: "String", difficulty: "medium", defaultInterval: 5 },

    // ─── Tree ────────────────────────────────────────────────────────────────
    // Max Depth Binary Tree: simple DFS recursion — very sticky
    { title: "Maximum Depth of Binary Tree", topic: "Tree", difficulty: "easy", defaultInterval: 21 },
    // Same Tree: recursive equality — trivial
    { title: "Same Tree", topic: "Tree", difficulty: "easy", defaultInterval: 21 },
    // Invert Binary Tree: swap children recursively — trivial
    { title: "Invert Binary Tree", topic: "Tree", difficulty: "easy", defaultInterval: 21 },
    // Binary Tree Max Path Sum: track local max vs global max — the split-path logic fades fast
    { title: "Binary Tree Maximum Path Sum", topic: "Tree", difficulty: "hard", defaultInterval: 3 },
    // Level Order Traversal: BFS with queue — fairly sticky
    { title: "Binary Tree Level Order Traversal", topic: "Tree", difficulty: "medium", defaultInterval: 14 },
    // Serialize/Deserialize: preorder with null markers + index tracking — very forgettable
    { title: "Serialize and Deserialize Binary Tree", topic: "Tree", difficulty: "hard", defaultInterval: 3 },
    // Subtree of Another Tree: isSame helper recursion — intuitive
    { title: "Subtree of Another Tree", topic: "Tree", difficulty: "easy", defaultInterval: 18 },
    // Construct Tree from Pre+Inorder: index math is very easy to forget
    { title: "Construct Binary Tree from Preorder and Inorder Traversal", topic: "Tree", difficulty: "medium", defaultInterval: 5 },
    // Validate BST: min/max bounds passing — the bounds trick fades
    { title: "Validate Binary Search Tree", topic: "Tree", difficulty: "medium", defaultInterval: 7 },
    // Kth Smallest in BST: inorder traversal count — straightforward
    { title: "Kth Smallest Element in a BST", topic: "Tree", difficulty: "medium", defaultInterval: 14 },
    // LCA of BST: compare val against node — quite intuitive
    { title: "Lowest Common Ancestor of a Binary Search Tree", topic: "Tree", difficulty: "easy", defaultInterval: 18 },
    // Implement Trie: TrieNode children array/map + isEnd — implementation details fade
    { title: "Implement Trie (Prefix Tree)", topic: "Tree", difficulty: "medium", defaultInterval: 7 },
    // Design Add and Search Words: Trie with '.' wildcard DFS — forgettable
    { title: "Design Add and Search Words Data Structure", topic: "Tree", difficulty: "medium", defaultInterval: 5 },
    // Word Search II: Trie + DFS backtracking together — very complex and forgettable
    { title: "Word Search II", topic: "Tree", difficulty: "hard", defaultInterval: 3 },

    // ─── Heap ────────────────────────────────────────────────────────────────
    // Top K Frequent: bucket sort or heap — the bucket sort O(n) insight fades
    { title: "Top K Frequent Elements", topic: "Heap", difficulty: "medium", defaultInterval: 7 },
    // Find Median from Data Stream: two-heap balance trick — very forgettable
    { title: "Find Median from Data Stream", topic: "Heap", difficulty: "hard", defaultInterval: 3 },
  ];

  await Problem.insertMany(problems);
  console.log(`Seeded ${problems.length} Blind 75 problems`);
};