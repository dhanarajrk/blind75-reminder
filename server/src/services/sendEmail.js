import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      requireTLS: true,
    });

    const mailOptions = {
      from: `"Blind 75 Reminder" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.verify();
    const result = await transporter.sendMail(mailOptions);

    console.log("Email sent:", result.messageId);
    return result;
  } catch (err) {
    console.error("Email failed:", err);
    throw err;
  }
};