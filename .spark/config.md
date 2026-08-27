# SPARK Config

project_created: 2026-08-12
project_name: SponTRIP
client: Internal product (Fonya Technology / 2-person founding team)
stack: React Native + Expo (client) / Supabase — Postgres + RLS + Auth + Realtime + Edge Functions (backend) / Cloudflare R2 (object storage, zero egress) / Cloudflare Images (transforms)
deploy_target: Expo EAS (build + submit + OTA) → App Store + Google Play; Supabase managed cloud; **Cloudflare Pages for the web surface** (account-deletion page per Google Play requirement, privacy policy URL, and from Phase 2 the anonymous live-location link)
first_release: CLOSED BETA (TestFlight external + Google Play closed track) — not a public store launch. Public release is a separate later milestone. See decision 76.
analytics: PostHog (free tier) — required from Milestone 0 for the repeat-behavior success metric
monitoring: Sentry (free tier)
email: Resend (free tier — note 100/day cap)
push: Expo Push (free)
excluded: SMS OTP (fraud risk), n8n (no free tier + violates managed-services constraint), in-app maps (cost), payment gateway (no money held)
live: false
