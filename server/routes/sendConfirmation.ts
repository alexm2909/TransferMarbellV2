import { RequestHandler } from "express";

export const handleSendConfirmation: RequestHandler = async (req, res) => {
  try {
    const { to, subject, html, text, reservationTag } = req.body as any;

    if (!to || !reservationTag) {
      return res
        .status(400)
        .json({ error: "Missing 'to' or 'reservationTag'" });
    }

    // If SMTP_TRANSPORT is provided in env, try to send real email via nodemailer (dynamically imported)
    const smtp = process.env.SMTP_TRANSPORT;

    if (smtp) {
      try {
        const nodemailer = await import("nodemailer");
        let transportConfig: any = smtp;
        try {
          // Allow JSON string in env var
          transportConfig = JSON.parse(String(smtp));
        } catch (err) {
          // not JSON, pass string as-is (e.g. SMTP url)
          transportConfig = smtp;
        }

        const transporter = nodemailer.createTransport(transportConfig as any);

        await transporter.sendMail({
          from: process.env.FROM_EMAIL || "no-reply@transfermarbell.com",
          to,
          subject: subject || `Confirmación de reserva ${reservationTag}`,
          text: text || "",
          html: html || "",
          headers: {
            "X-Reservation-Tag": reservationTag,
          },
        });

        return res.status(200).json({ success: true });
      } catch (err) {
        console.error("Nodemailer failed to send email:", err);
        // Fall through to logging fallback
      }
    }

    // Fallback: log to server console (development mode)
    console.log(
      "Email not sent (SMTP not configured or failed), email payload:",
    );
    console.log({ to, subject, reservationTag, text, html });

    return res
      .status(200)
      .json({
        success: true,
        message:
          "Email logged to server console (SMTP not configured or failed)",
      });
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
    return res.status(500).json({ error: "Failed to send confirmation email" });
  }
};
