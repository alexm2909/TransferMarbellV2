# Production Readiness Checklist

Use this checklist to prepare the app for preproduction/production.

1) Google Maps (JS + Places)
- Enable APIs: Maps JavaScript API, Places API, Geocoding API.
- Application restrictions: HTTP referrers only.
- Add these referrers (adjust domains):
  - https://586794dccf344b6288f1fab59b79aefe-bcb50ee4fc8b43b6b64170b36.fly.dev/*
  - https://your-netlify-site.netlify.app/*
  - https://your-custom-domain.com/*
  - http://localhost:5173/*
  - http://localhost:3000/*
- Put the API key in Netlify env as VITE_GOOGLE_MAPS_API_KEY and redeploy.

2) Email (SMTP)
- For real emails set on Netlify:
  - SMTP_TRANSPORT=smtp://user:pass@smtp.yourprovider.com:587
  - FROM_EMAIL=no-reply@yourdomain.com
- Or JSON transport string (see docs/SMTP_SETUP.md).
- If not configured, the server uses Ethereal (test) and returns previewUrl in /api/send-confirmation.

3) Database (Neon/Postgres)
- DATABASE_URL must be set in Netlify env.
- Ensure the branch/role has privileges.
- The backend auto-creates schema (tables: vehicles, bookings, payments).

4) Netlify configuration
- netlify.toml already routes /api/* to serverless functions.
- Add env vars in Site settings → Build & deploy → Environment.
- Optional: run npm run verify:netlify to check env + SMTP connection + Maps key.

5) Stripe (optional)
- Replace test cards/UI when moving to live keys (if Stripe used):
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and backend secret (not stored here).

6) Security
- Restrict Google Maps key to required referrers only.
- Do not commit secrets; set them only in Netlify env.

7) Post-deploy validation
- / (home) loads and address autocomplete suggests places.
- /book: creates booking and sends confirmation (SMTP or previewUrl in response).
- /admin: lists bookings; Resend Email works.
- Map shows Málaga by default and routes when origin/destination set.

8) Monitoring
- Consider connecting Sentry MCP for error tracking after go-live.
