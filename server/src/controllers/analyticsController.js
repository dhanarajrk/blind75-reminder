import Problem from "../models/Problem.js";
import UserProblem from "../models/UserProblem.js";
import ActivityLog from "../models/ActivityLog.js";

const getDateKey = (date = new Date()) => date.toISOString().split("T")[0];

const buildPastDays = (days) => {
  const arr = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(getDateKey(d));
  }
  return arr;
};

const getLongestStreak = (dateMap) => {
  const dates = Object.keys(dateMap).sort();
  let longest = 0;
  let current = 0;
  let prev = null;

  for (const date of dates) {
    if ((dateMap[date] || 0) <= 0) continue;

    if (!prev) {
      current = 1;
    } else {
      const prevDate = new Date(prev);
      const currDate = new Date(date);
      const diff = Math.round((currDate - prevDate) / 86400000);

      if (diff === 1) current += 1;
      else current = 1;
    }

    longest = Math.max(longest, current);
    prev = date;
  }

  return longest;
};

const getCurrentStreak = (dateMap) => {
  let streak = 0;
  let check = new Date();

  while (true) {
    const key = getDateKey(check);
    if ((dateMap[key] || 0) > 0) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

export const getAnalytics = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const todayKey = getDateKey(today);

  const [problemCount, userProblems, activityLogs] = await Promise.all([
    Problem.countDocuments(),
    UserProblem.find({ user: userId }),
    ActivityLog.find({ user: userId }),
  ]);

  const dueToday = userProblems.filter((p) => {
    if (!p.nextReviewAt) return false;
    return getDateKey(new Date(p.nextReviewAt)) <= todayKey;
  }).length;

  const reviewedCount = userProblems.filter(
    (p) => p.solveCount > 0 || p.struggleCount > 0
  ).length;

  const masteredCount = userProblems.filter((p) => p.solveCount >= 3).length;
  const notStarted = problemCount - reviewedCount;

  const activityMap = {};
  activityLogs.forEach((log) => {
    activityMap[log.date] = log.count;
  });

  const last365Days = buildPastDays(365).map((date) => ({
    date,
    count: activityMap[date] || 0,
  }));

  const last30Days = buildPastDays(30).map((date, index, arr) => {
    const count = activityMap[date] || 0;

    let sum = 0;
    let len = 0;
    for (let i = Math.max(0, index - 6); i <= index; i++) {
      sum += activityMap[arr[i]] || 0;
      len++;
    }

    return {
      date,
      count,
      avg7: Number((sum / len).toFixed(2)),
    };
  });

  const currentStreak = getCurrentStreak(activityMap);
  const longestStreak = getLongestStreak(activityMap);

  const reviewsThisWeek = buildPastDays(7).reduce(
    (acc, date) => acc + (activityMap[date] || 0),
    0
  );

  const reviewsThisMonth = buildPastDays(30).reduce(
    (acc, date) => acc + (activityMap[date] || 0),
    0
  );

  res.json({
    stats: {
      dueToday,
      totalReviewed: reviewedCount,
      currentStreak,
      mastered: masteredCount,
      notStarted,
      longestStreak,
      reviewsThisWeek,
      reviewsThisMonth,
    },
    heatmap: last365Days,
    consistency: last30Days,
  });
};