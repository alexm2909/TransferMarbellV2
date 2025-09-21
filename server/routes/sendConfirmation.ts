import { RequestHandler } from "express";

let _etherealAccount: any = null;

export const handleSendConfirmation: RequestHandler = async (req, res) => {
  try {
    const { to, subject, html, text, reservationTag } = req.body as any;

    if (!to || !reservationTag) {
      return res
        .status(400)
        .json({ error: "Missing 'to' or 'reservationTag'" });
    }

    const smtp = process.env.SMTP_TRANSPORT || process.env.SMTP_TRANSPORT;

    try {
      const nodemailer = await import("nodemailer");

      if (smtp) {
        try {
          let transportConfig: any = smtp;
          try {
            transportConfig = JSON.parse(String(smtp));
          } catch (err) {
            transportConfig = smtp;
          }

          const transporter = nodemailer.createTransport(transportConfig as any);

          const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL || "no-reply@transfermarbell.com",
            to,
            subject: subject || `Confirmación de reserva ${reservationTag}`,
            text: text || "",
            html: html || "",
            headers: {
              "X-Reservation-Tag": reservationTag,
            },
          });

          // If using a real SMTP provider, try to return a provider response
          return res.status(200).json({ success: true, info });
        } catch (err) {
          console.error("Nodemailer failed to send email with provided SMTP_TRANSPORT:", err);
          // continue to try ethereal fallback
        }
      }

      // If no SMTP or it failed, use Ethereal test account (only for development/testing)
      if (!_etherealAccount) {
        _etherealAccount = await nodemailer.createTestAccount();
        console.log("Created Ethereal test account:", {
          user: _etherealAccount.user,
          pass: _etherealAccount.pass,
          smtp: _etherealAccount.smtp,
        });
      }

      const testTransport = {
        host: _etherealAccount.smtp.host,
        port: _etherealAccount.smtp.port,
        secure: _etherealAccount.smtp.secure,
        auth: {
          user: _etherealAccount.user,
          pass: _etherealAccount.pass,
        },
      };

      const testTransporter = nodemailer.createTransport(testTransport as any);

      const info = await testTransporter.sendMail({
        from: process.env.FROM_EMAIL || "no-reply@transfermarbell.test",
        to,
        subject: subject || `Confirmación de reserva ${reservationTag}`,
        text: text || "",
        html: html || "",
        headers: {
          "X-Reservation-Tag": reservationTag,
        },
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || null;

      console.log("Sent test email via Ethereal. Preview URL:", previewUrl);

      return res.status(200).json({ success: true, previewUrl, info });
    } catch (err) {
      console.error("Nodemailer not available or failed:", err);
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
