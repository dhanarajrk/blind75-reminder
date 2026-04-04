import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const mailOptions = {
      from: `"Blind 75 Reminder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.verify();
    console.log("SMTP ready");

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.messageId);
    return result;
  } catch (err) {
    console.error("Email failed:", err);
    throw err;
  }
};