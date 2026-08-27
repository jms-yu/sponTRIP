import { defineConfig } from "astro/config";

// SponTRIP web surface: account-deletion page (Google Play hard
// requirement, per decision 50 / AUTH-6), privacy policy URL, and from
// Phase 2 the anonymous live-location link. Static output -> Cloudflare
// Pages, per .spark/environment.md. No SSR adapter at M0 — nothing here
// needs a server runtime yet (the account-deletion flow will call Supabase
// directly from the client, same pattern as the mobile app's anon-key-only
// access).
//
// NODE VERSION NOTE (decision 130): this workspace runs on Node >=22.12.0
// (see apps/web/.nvmrc), deliberately different from the rest of the repo
// (Node 20 LTS — root .nvmrc). astro@7.x is what clears the HIGH/CRITICAL
// npm-audit advisories that were unfixable on the astro@5.x line (there is
// no 6.x line), and astro@7 requires Node 22. Not an oversight — see
// .spark/security.md §7 for the full history and .spark/decisions.md 130.
export default defineConfig({
  output: "static",
  site: process.env.SPONTRIP_SITE_URL ?? "https://sponTRIP.app",
});
