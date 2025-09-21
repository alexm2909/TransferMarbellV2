SMTP setup examples for Netlify (nodemailer)

1) SendGrid (SMTP) example
- SMTP_TRANSPORT value (Netlify env):
  smtps://SMTP_USER:SMTP_PASS@smtp.sendgrid.net:465

  Example:
  SMTP_TRANSPORT="smtps://apikey:SG.xxxxxxx@smtp.sendgrid.net:465"
  FROM_EMAIL="no-reply@yourdomain.com"

Notes:
- Nodemailer accepts an SMTP connection URI in the format above.
- For SendGrid use "apikey" as username and your API key as the password (or use SendGrid SMTP credentials).

2) Gmail (App password) example
- If using Gmail, create an app password and use:
  SMTP_TRANSPORT="smtps://your.email%40gmail.com:APP_PASSWORD@smtp.gmail.com:465"
  FROM_EMAIL="your.email@gmail.com"

3) Generic JSON config (optional)
- You can also set SMTP_TRANSPORT to a JSON string that nodemailer.createTransport accepts, e.g.:
  SMTP_TRANSPORT='{"host":"smtp.example.com","port":587,"secure":false,"auth":{"user":"foo","pass":"bar"}}'

4) Testing endpoints locally (example curl)
- Create a booking (pre-booking):
  curl -X POST http://localhost:8888/.netlify/functions/api/bookings -H "Content-Type: application/json" -d '{"clientEmail":"test@example.com","origin":{"address":"A"},"destination":{"address":"B"},"date":"2025-10-01","time":"12:00"}'

- Resend confirmation email:
  curl -X POST http://localhost:8888/.netlify/functions/api/send-confirmation -H "Content-Type: application/json" -d '{"to":"test@example.com","reservationTag":"r_12345","subject":"Test","text":"hi","reservationTag":"r_12345"}'

5) Environment variables to set in Netlify > Site settings > Build & deploy > Environment
- DATABASE_URL (already present)
- SMTP_TRANSPORT (example above)
- FROM_EMAIL

If you want, I can prepare a template Netlify environment configuration (a text file with the values to paste).
