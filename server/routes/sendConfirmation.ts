import { RequestHandler } from "express";
import nodemailer from "nodemailer";

export const handleSendConfirmation: RequestHandler = async (req, res) => {
  try {
    const { to, subject, html, text, reservationTag } = req.body as any;

    if (!to || !reservationTag) {
      return res.status(400).json({ error: "Missing 'to' or 'reservationTag'" });
    }

    // If SMTP_TRANSPORT is provided in env, try to send real email via nodemailer
    const smtp = process.env.SMTP_TRANSPORT;

    if (smtp) {
      // smtp should be a connection string like: smtp://user:pass@smtp.example.com:587
      const transporter = nodemailer.createTransport(smtp);

      await transporter.sendMail({
        from: process.env.FROM_EMAIL || 'no-reply@transfermarbell.com',
        to,
        subject: subject || `Confirmación de reserva ${reservationTag}`,
        text: text || '',
        html: html || '',
        headers: {
          'X-Reservation-Tag': reservationTag,
        }
      });

      return res.status(200).json({ success: true });
    }

    // Fallback: log to server console (development mode)
    console.log('Email not sent (no SMTP_TRANSPORT), email payload:');
    console.log({ to, subject, reservationTag, text, html });

    return res.status(200).json({ success: true, message: 'Email logged to server console (SMTP not configured)' });
  } catch (err) {
    console.error('Failed to send confirmation email:', err);
    return res.status(500).json({ error: 'Failed to send confirmation email' });
  }
};
