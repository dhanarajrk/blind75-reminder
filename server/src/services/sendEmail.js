import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Blind 75 Reminder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    // ⛑ Add timeout wrapper (VERY IMPORTANT)
    const sendPromise = transporter.sendMail(mailOptions);

    const result = await Promise.race([
      sendPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Email timeout")), 10000)
      ),
    ]);

    console.log("Email sent:", result.messageId);
    return result;
  } catch (err) {
    console.error("Email failed:", err.message);
    throw err;
  }
};