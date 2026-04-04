import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Blind 75 Reminder <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Email failed:", error);
      throw error;
    }

    console.log("Email sent:", data.id);
    return data;
  } catch (err) {
    console.error("Email failed:", err);
    throw err;
  }
};