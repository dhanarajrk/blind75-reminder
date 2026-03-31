import User from "../models/User.js";
import UserProblem from "../models/UserProblem.js";
import { sendEmail } from "./sendEmail.js";

const getDateKey = (date = new Date()) => date.toISOString().split("T")[0];

export const sendDueReminders = async () => {
  const users = await User.find({
    reminderEnabled: true,
  });

  const todayKey = getDateKey(new Date());

  for (const user of users) {
    const userProblems = await UserProblem.find({
      user: user._id,
      nextReviewAt: { $ne: null },
    }).populate("problem");

    const dueProblems = userProblems.filter((item) => {
      if (!item.nextReviewAt) return false;
      return getDateKey(new Date(item.nextReviewAt)) <= todayKey;
    });

    if (!dueProblems.length) continue;

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Blind 75 REMINDER</h2>
        <p>Hi ${user.name || "there"},</p>
        <p>You have <strong>${dueProblems.length}</strong> problem${
      dueProblems.length !== 1 ? "s" : ""
    } to review today.</p>

        <ul>
          ${dueProblems
            .slice(0, 12)
            .map(
              (item) =>
                `<li>${item.problem?.title || "Problem"} ${
                  item.useCustomInterval
                    ? `(${item.customInterval}d custom)`
                    : `(${item.defaultInterval}d)`
                }</li>`
            )
            .join("")}
        </ul>

        <p>Keep your streak going.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject: `Blind 75 REMINDER — ${dueProblems.length} due today`,
      html,
    });
  }
};