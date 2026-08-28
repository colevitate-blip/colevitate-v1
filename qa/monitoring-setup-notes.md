# Ongoing monitoring — manual steps

The scripted tiers cover pre-deploy checks. Live monitoring runs on the
third-party services' own servers, not in this repo, so these steps are
manual (each is a few minutes, one-time):

## Error tracking (Sentry)
1. Create a project at https://sentry.io (choose "Next.js" as the platform).
2. `npx @sentry/wizard@latest -i nextjs` — wires up `sentry.*.config.ts`,
   the Next.js config wrapper, and source maps for you.
3. Add `SENTRY_DSN` to `.env.local` locally and to your hosting provider's
   env vars (e.g. `vercel env add SENTRY_DSN production`).

## Uptime monitoring
1. Create a free monitor at https://betteruptime.com or
   https://uptimerobot.com pointed at your production URL.
2. Set the check interval (1–5 min) and an alert channel (email/Slack/SMS).

Neither of these needs anything else in this repo — once the DSN/monitor
exists, they run independently of any CI pipeline.
