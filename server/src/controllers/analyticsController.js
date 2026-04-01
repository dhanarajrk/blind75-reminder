import Problem from "../models/Problem.js";
import UserProblem from "../models/UserProblem.js";
import ActivityLog from "../models/ActivityLog.js";
import ProblemReviewLog from "../models/ProblemReviewLog.js";

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

      current = diff === 1 ? current + 1 : 1;
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

const buildCalendarDays = (year, month, reviewMap) => {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();
  const leading = firstDay.getDay();

  const cells = [];

  for (let i = 0; i < leading; i++) cells.push(null);

  for (let day = 1; day <= lastDate; day++) {
    const date = new Date(year, month, day);
    const key = getDateKey(date);
    const entry = reviewMap[key] || { count: 0, problems: [] };

    cells.push({
      date: key,
      day,
      count: entry.count,
      problems: entry.problems,
    });
  }

  return cells;
};

export const getAnalytics = async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const todayKey = getDateKey(today);

  const requestedYear = Number(req.query.year);
  const requestedMonth = Number(req.query.month);

  const calendarYear = Number.isInteger(requestedYear) ? requestedYear : today.getFullYear();
  const calendarMonth =
    Number.isInteger(requestedMonth) && requestedMonth >= 0 && requestedMonth <= 11
      ? requestedMonth
      : today.getMonth();

  const [problemCount, userProblems, activityLogs, reviewLogs] = await Promise.all([
    Problem.countDocuments(),
    UserProblem.find({ user: userId }),
    ActivityLog.find({ user: userId }),
    ProblemReviewLog.find({ user: userId }).populate("problem", "title"),
  ]);

  const dueToday = userProblems.filter((p) => {
    if (!p.nextReviewAt) return false;
    return getDateKey(new Date(p.nextReviewAt)) <= todayKey;
  }).length;

  const problemsSeen = userProblems.filter(
    (p) => p.solveCount > 0 || p.struggleCount > 0
  ).length;

  const masteredCount = userProblems.filter((p) => p.solveCount >= 3).length;
  const questionsLeft = problemCount - problemsSeen;

  const activityMap = {};
  activityLogs.forEach((log) => {
    activityMap[log.date] = log.count;
  });

  const reviewMap = {};
  reviewLogs.forEach((log) => {
    const key = getDateKey(new Date(log.createdAt));
    if (!reviewMap[key]) {
      reviewMap[key] = { count: 0, problems: [] };
    }
    reviewMap[key].count += 1;
    if (log.problem?.title && !reviewMap[key].problems.includes(log.problem.title)) {
      reviewMap[key].problems.push(log.problem.title);
    }
  });

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
  const bestStreak = getLongestStreak(activityMap);

  const reviewsThisWeek = buildPastDays(7).reduce(
    (acc, date) => acc + (activityMap[date] || 0),
    0
  );

  const reviewsThisMonth = buildPastDays(30).reduce(
    (acc, date) => acc + (activityMap[date] || 0),
    0
  );

  const calendarDays = buildCalendarDays(calendarYear, calendarMonth, reviewMap);

  res.json({
    stats: {
      dueToday,
      problemsSeen,
      mastered: masteredCount,
      questionsLeft,
      currentStreak,
      bestStreak,
      reviewsThisWeek,
      reviewsThisMonth,
    },
    consistency: last30Days,
    calendar: {
      year: calendarYear,
      month: calendarMonth,
      days: calendarDays,
      currentStreak,
      bestStreak,
    },
  });
};