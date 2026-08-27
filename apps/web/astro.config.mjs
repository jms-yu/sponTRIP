import { defineConfig } from "astro/config";

// SponTRIP web surface: account-deletion page (Google Play hard
// requirement, per decision 50 / AUTH-6), privacy policy URL, and from
// Phase 2 the anonymous live-location link. Static output -> Cloudflare
// Pages, per .spark/environment.md. No SSR adapter at M0 — nothing here
// needs a server runtime yet (the account-deletion flow will call Supabase
// directly from the client, same pattern as the mobile app's anon-key-only
// access).
export default defineConfig({
  output: "static",
  site: process.env.SPONTRIP_SITE_URL ?? "https://sponTRIP.app",
});
