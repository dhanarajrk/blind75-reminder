import User from "../models/User.js";
import UserProblem from "../models/UserProblem.js";
import { sendEmail } from "../services/sendEmail.js";

const getDateKey = (date = new Date()) => date.toISOString().split("T")[0];

const buildReminderEmail = ({ userName, dueProblems, frontendUrl }) => {
  const topProblems = dueProblems.slice(0, 8);

  return `
    <div style="margin:0;padding:24px;background:#f5f0e8;font-family:Arial,sans-serif;color:#1a1208;">
      <div style="max-width:640px;margin:0 auto;background:#e8e2d4;border:2px solid #d4ccb8;box-shadow:3px 3px 0px #1a120818;">
        <div style="background:#1a1208;color:#f5f0e8;padding:16px 20px;border-bottom:3px solid #c84b2f;">
          <div style="font-size:28px;font-weight:700;line-height:1.1;">Blind 75 REMINDER</div>
          <div style="margin-top:4px;font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:0.85;">
            spaced repetition tracker
          </div>
        </div>

        <div style="padding:20px;">
          <p style="margin:0 0 12px;font-size:14px;">Hi ${userName || "there"},</p>

          <p style="margin:0 0 14px;font-size:14px;line-height:1.6;">
            You have <strong>${dueProblems.length}</strong> problem${
    dueProblems.length !== 1 ? "s" : ""
  } due for review today.
          </p>

          <div style="margin:16px 0;border:1px solid #d4ccb8;background:#ede8dc;">
            ${topProblems
              .map(
                (item, index) => `
                  <div style="padding:10px 12px;border-bottom:${
                    index !== topProblems.length - 1 ? "1px solid #d4ccb8" : "none"
                  };font-size:13px;line-height:1.5;">
                    <strong>${item.problem?.title || "Problem"}</strong>
                    <span style="color:#7a7060;">
                      — ${
                        item.useCustomInterval
                          ? `${item.customInterval}d custom interval`
                          : `${item.defaultInterval}d interval`
                      }
                    </span>
                  </div>
                `
              )
              .join("")}
          </div>

          ${
            dueProblems.length > 8
              ? `<p style="margin:0 0 14px;font-size:12px;color:#7a7060;">+ ${
                  dueProblems.length - 8
                } more due today</p>`
              : ""
          }

          <div style="margin:20px 0;">
            <a
              href="${frontendUrl}"
              style="display:inline-block;background:#1a1208;color:#f5f0e8;text-decoration:none;padding:10px 16px;font-size:13px;border:2px solid #1a1208;"
            >
              Open Dashboard
            </a>
          </div>

          <p style="margin:16px 0 0;font-size:12px;color:#7a7060;line-height:1.6;">
            Keep the streak going.
          </p>
        </div>
      </div>
    </div>
  `;
};

export const triggerReminderTest = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const todayKey = getDateKey(new Date());
    const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173";

    const userProblems = await UserProblem.find({
      user: user._id,
      nextReviewAt: { $ne: null },
    }).populate("problem");

    const dueProblems = userProblems.filter((item) => {
      if (!item.nextReviewAt) return false;
      return getDateKey(new Date(item.nextReviewAt)) <= todayKey;
    });

    if (!dueProblems.length) {
      return res.json({ message: "No due problems for this user today" });
    }

    const html = buildReminderEmail({
      userName: user.name,
      dueProblems,
      frontendUrl,
    });

    await sendEmail({
      to: user.email,
      subject: `Blind 75 REMINDER — ${dueProblems.length} due today`,
      html,
    });

    res.json({
      message: "Test reminder email sent",
      dueCount: dueProblems.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};