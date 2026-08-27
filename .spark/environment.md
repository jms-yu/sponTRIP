# SponTRIP — Environment Recipe

**Selected:** No single spark-environment-protocol recipe is an exact match.
Adapted composite: `mobile-expo` (client tier progression, unmodified) +
generic principles applied directly to the Supabase backend (informed by the
Supabase-specific pattern under `web-vercel-supabase`, adopted on its own
merits — Vercel itself does not apply) + generic principles applied directly
to the Cloudflare Pages web surface (no recipe names a static-site/Pages
target). Flagged as a candidate for a future `mobile-expo-supabase-cloudflare`
recipe if this composite recurs on another project.

## Dev

- **Mobile:** Expo dev client / Expo Go on physical devices and simulators.
  Local `.env` (gitignored) pointing at the Dev Supabase project.
- **Backend:** Two sub-layers —
  1. Local Docker stack via `supabase start` (fast, free, throwaway) —
     primary target for CI and day-to-day migration/RLS iteration.
  2. A dedicated cloud **Dev Supabase project** — used only for manual
     end-to-end checks that need real external network endpoints (Expo
     Push, Resend, Sentry, PostHog, R2), which a local-only stack can't
     exercise.
- **Web:** `astro dev` local server.
- **Secrets:** Dev-tier Supabase anon + service_role keys, dev-tier
  Resend/Sentry/PostHog/R2/Expo credentials — all distinct from stage/prod,
  held in gitignored local `.env` files. The local-Docker CI job needs no
  real external credentials at all (uses the local stack's built-in
  fake SMTP / test JWT signing).

## Stage

- **Mobile:** EAS Build **internal distribution**, pointing at the Stage
  Supabase project. Feeds TestFlight external testing / Google Play closed
  track from M9 onward.
- **Backend:** A separate, dedicated **Stage Supabase project.** Supabase's
  paid Branching feature (per-PR ephemeral DB, Pro-plan) is available and
  may be enabled later as an enhancement, but is **not** required at M0 —
  the free local-Docker stack is the required CI mechanism, to avoid
  per-branch compute eating into the $40 billing-alert headroom.
- **Web:** Cloudflare Pages **preview deployments per PR/branch** — native
  Cloudflare Pages behavior, directly analogous to Vercel previews.
- **Third-party services:** One PostHog project and one Sentry project
  total (both free-tier, low volume at this scale), distinguished by an
  `environment` tag (`dev`/`stage`/`prod`) rather than three separate
  free-tier accounts each — splitting would fragment the funnel fixture
  data (INF-6) for no real isolation benefit. Resend: one account; dev/stage
  testing uses a fixed small allowlist of founder test addresses to avoid
  burning the 100/day free-tier cap. R2: environment-prefixed paths within
  the same three buckets (`dev/general/...`, `stage/general/...`,
  `prod/general/...`) rather than nine separate buckets — access control is
  enforced by the `mint-storage-url` Edge Function, not bucket ACLs, so
  fewer buckets is simpler with no security cost.
- **Secrets:** Stage-tier Supabase keys + environment-tagged third-party
  credentials, held as GitHub Actions repository secrets for any
  CI-driven stage deploy step.

## Prod

- **Mobile:** Phased/staged store rollout (TestFlight external → Google
  Play closed track per M9, later public phased release). **OTA vs. full
  build — decided now:** non-native changes (JS/TS logic, most fixes, copy,
  minor UI) ship via `eas update` OTA to the production channel; anything
  touching native modules, permissions, Expo SDK version, or `app.json`
  native config requires a full new store build/binary submission. Neither
  `eas update --channel production` nor `eas submit`/`eas build --profile
  production` is ever run by CI — always a deliberate human-run command.
- **Backend:** Dedicated **Production Supabase project**, restricted access
  (founders + CI service_role only). SEC-1/SEC-2 enforced identically to
  every other tier. Billing alert configured at $40 (INF-10).
- **Web:** Protected Cloudflare Pages **production** project on the real
  domain. Cloudflare Pages deploys prod automatically on push to the
  production branch — the human gate is the **PR merge itself** (per
  `spark-commit`: agents never push or merge; a human always does).
- **Secrets:** Prod-tier keys held only in GitHub Actions repository
  secrets (server-side deploy steps) and in EAS's / Cloudflare's own secret
  stores. Never in a local `.env`, never in chat. Rotate immediately if
  ever suspected leaked.

## Promotion gate

Never automatic, per the protocol's generic principle #2:
- **Web:** human merges the reviewed PR to `main` → Cloudflare Pages
  deploys prod on that push. The merge is the human action.
- **Mobile:** a new store build/submit or an `eas update` to the production
  channel is always a distinct, deliberate human-run command — never
  triggered by CI or by a merge.
- **DB migrations to prod:** applied only on merge to `main`, via a
  CI-gated step, additionally requiring a manual approval through a GitHub
  Environment protection rule scoped to jobs touching the production
  Supabase project.

## Smoke test before promotion

A successful build is not sufficient evidence, per principle #3:
- **Web:** the changed route(s) are manually opened on the PR's Cloudflare
  Pages preview URL and checked before merge.
- **Backend:** the CI migration-apply → rollback → re-apply test (§2.5 of
  the M0 technical spec) must pass before a migration merges. Before
  promoting a merged migration to **production**, it must first have been
  applied successfully to the **Stage** Supabase project with the
  negative-authorization suite passing against Stage (not just local
  Docker) — this is the concrete stage-to-prod smoke test.
- **Mobile:** before any production build/submit, the corresponding
  internal-distribution stage build is installed and manually smoke-tested
  on at least one physical device. **N/A until M1** (no UI exists at M0) —
  noted explicitly here so it isn't silently skipped once UI exists.

## Rollback path

Known before promotion, per principle #4:
- **Web:** Cloudflare Pages retains prior deployments — rollback is
  re-promoting the previous known-good deployment via dashboard/API,
  instant, no rebuild.
- **Mobile OTA:** re-point the production channel to the previous EAS
  update group — near-instant. **Full store binary:** rollback requires
  submitting a new build with reverted code and going through store review
  again — **not instant.** This asymmetry is a real operational fact the
  founders must know before promoting a native-touching change.
- **Backend/migrations:** run the paired `.down.sql` rollback script (§2 of
  the M0 technical spec) against the affected project. This is exactly why
  every migration ships with a tested down script from M0 onward — the
  rollback path is rehearsed in CI before it is ever needed for real.
- **CI/secrets:** revert the merge commit on `main` via a human-run
  `git revert` + PR (never a force-push), then re-run the standard
  promotion path.
