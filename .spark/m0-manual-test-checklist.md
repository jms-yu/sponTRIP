# M0 Manual Test Checklist — SponTRIP Milestone 0 (Scaffold & security baseline)

**Purpose:** Verify all manual-only acceptance criteria. Everything automatable is CI-tested; this checklist
covers what requires real external accounts, physical devices, or repository settings.

**When to use this:** After the PR merge confirmation in GATE 3, before marking M0 `done` in milestones.md.

**Prerequisites:**
- Repo cloned locally with the milestone branch checked out.
- Local Supabase Docker stack running (`supabase start`).
- `.env.local` populated with dev-tier Supabase anon/service_role keys from the docker stack.
- The PR has been merged to `main` (not checked out yet; just confirmed merged).

---

## 1. CI blocks on a deliberately failing PR

**What to do:**
1. Create a new branch off `milestone/00-scaffold-security-baseline` (or off `main` if already merged).
2. Break a test: edit any test file to add a failing assertion (e.g., change `expect(true)` to `expect(false)` in a Jest or Vitest test).
3. Commit and push to a throwaway branch.
4. Open a PR against `main` on GitHub.
5. Watch GitHub Actions run.
6. Confirm that at least one CI job exits non-zero (red status on the PR).
7. Close the PR without merging.
8. Delete the throwaway branch.

**What a pass looks like:**
- The PR page shows at least one red job in the GitHub Actions summary.
- The status says "Some checks were not successful" or equivalent.
- At least one of the jobs listed is red (e.g., `Test - apps/mobile` or `Test - ci/scripts`).

**Credential/device needed:** GitHub repo access (admin or maintainer).

---

## 2. Schema change applies cleanly and is reversible

**What to do:**
1. On your local machine, ensure the Supabase Docker stack is running and clean (no prior migrations applied).
2. Run `supabase migration up` against the local stack.
3. Verify all three migrations apply without error:
   - `enable_extensions`
   - `smoke_test_fixtures`
   - `scheduled_jobs`
4. Dump the schema: `pg_dump -h 127.0.0.1 -p 54322 -U postgres postgres > schema_up.sql 2>/dev/null` (password: `postgres`).
5. Run the rollback in reverse order:
   - `supabase migration down 3` (most recent first) and note success, repeat for the 2nd and 3rd.
   - Or manually: `psql -h 127.0.0.1 -p 54322 -U postgres postgres < supabase/migrations_down/[timestamp]_scheduled_jobs.down.sql`, then repeat for the other two.
6. Dump the schema again: `pg_dump ... > schema_down.sql`.
7. Re-apply the migrations: `supabase migration up` again.
8. Dump once more: `pg_dump ... > schema_reup.sql`.
9. Verify: `diff schema_up.sql schema_reup.sql` should be empty (no changes between up and re-up).

**What a pass looks like:**
- All three migrations apply without error.
- The down migrations execute without error.
- The schema dump after up, after down, and after re-up are identical (diff is empty).
- No tables, functions, or views are dropped unexpectedly.

**Credential/device needed:** Local Supabase Docker stack (no external account).

---

## 3. INF-3: Deployed web route reachable over HTTPS at project domain

**What to do:**
1. Purchase a domain name (e.g., via Namecheap, Google Domains, or your registrar of choice). Record the domain name and registrar.
2. Log into Cloudflare and create a new project for this domain (add the domain to Cloudflare).
3. Update the domain's nameservers at your registrar to point to Cloudflare's nameservers (obtained from Cloudflare's setup wizard).
4. In Cloudflare, create a deployment for the `apps/web` static site:
   - Navigate to Pages and connect the GitHub repository.
   - Configure it to deploy the `main` branch to production.
   - Set the build command and output directory according to Astro's requirements (`npm run build` → `dist/`).
5. Wait for the deployment to complete (usually 1–2 minutes).
6. Open a browser and navigate to `https://your-domain.com`.
7. Verify the page loads (you should see the placeholder web scaffold page).
8. Verify the certificate is valid (no browser warnings about untrusted/expired certs).

**What a pass looks like:**
- The domain is registered and its nameservers point to Cloudflare.
- Cloudflare shows a successful deployment to Pages.
- `https://your-domain.com` loads without cert warnings.
- The page displays (no 404, no 500 error, no timeout).

**Credential/device needed:** Domain registrar account, Cloudflare account (free tier OK), GitHub admin access to connect the repo to Cloudflare Pages.

---

## 4. INF-4: Scheduled job runs at T+2min and records its run

**What to do:**
1. Ensure the Supabase Docker stack is running and migrations have been applied (from checklist item 2).
2. Open a local Postgres client (psql or Adminer via Supabase Studio) to the local stack.
3. The `job_runs` table was created by the `scheduled_jobs` migration. Query it now: `SELECT * FROM public.job_runs;` — should be empty or contain only old test runs.
4. Run the `cron-jobs.md` runbook provided in the repo:
   - This runbook contains the manual steps to invoke the two Edge Functions (`scheduled-smoke-ok` and `scheduled-smoke-fail`) and verify pg_cron fires.
   - Follow each step in the runbook exactly as written, recording timestamps.
5. Wait for the scheduled job to fire (at T+2min after the trigger time recorded in the runbook).
6. Query `job_runs` again: `SELECT * FROM public.job_runs ORDER BY created_at DESC;` — should show new rows for both the -ok and -fail Edge Function executions.
7. Verify:
   - At least one row exists for each function (scheduled-smoke-ok, scheduled-smoke-fail).
   - The `status` column shows both success and failure cases (at least one `success: true`, at least one `success: false`).
   - The timestamps align with when the functions were invoked (~2 minutes after the start time).

**What a pass looks like:**
- The `job_runs` table contains new entries after the runbook execution.
- Both success and failure cases are logged (you see rows with both `status = true` and `status = false`).
- The `created_at` timestamp is approximately T+2min after invocation.
- The two-minute wall-clock firing is confirmed (you can see the timestamp progression).

**Credential/device needed:** Local Supabase Docker stack, access to run Postgres queries.

---

## 5. INF-5: Sentry receives a test event with PII redacted

**Important — the redaction happens client-side, before Sentry ever sees the
event.** `apps/mobile/src/lib/sentry.ts`'s `beforeSend` hook scrubs
email/phone patterns *inside the app*, then hands the already-redacted event
to the Sentry SDK to send. A test that sends an event directly to Sentry's
ingest API (bypassing the app and its SDK entirely) would **not** exercise
this at all — it must go through the real app.

**What to do:**
1. Create a free Sentry account (if not already created) and a new Sentry project for the `apps/mobile` client.
2. Obtain the Sentry DSN from the project settings.
3. Add this DSN to `apps/mobile`'s local env as `EXPO_PUBLIC_SENTRY_DSN=<your-dsn>`
   (this exact variable name — `apps/mobile/src/lib/sentry.ts` reads it directly;
   it's an `EXPO_PUBLIC_*` var so it's fine that it ships in the client bundle,
   same as the Supabase anon key).
4. Run the mobile app against this DSN (`npm run dev -w apps/mobile` or via Expo Go/dev client).
5. Trigger a real captured error **from inside the running app** whose message or
   context includes an email address and a PH-format phone number — e.g.
   temporarily add a button/dev-menu action that calls
   `Sentry.captureException(new Error("test"), { extra: { email: "test@example.com", phone: "09171234567" } })`,
   or trigger any existing error path and pass those values through `extra`/`contexts`.
   Remove the temporary trigger afterward if you added one — it's a manual
   verification aid, not app code that should ship.
6. Open the Sentry dashboard and navigate to **Issues** or **Events**.
7. Find the test event you just sent.
8. Open the event details and inspect the **Contexts** or **Request** body.
9. Verify:
   - The `user.email` field is **not** present in plaintext or is **redacted** (e.g., `***@***.com` or absent entirely).
   - The `user.phone` field is **not** present in plaintext or is **redacted** (e.g., `***-****` or absent entirely).
   - Other non-PII fields (like `level`, `message`, stack traces) are present normally.

**What a pass looks like:**
- The Sentry event is received and visible in the dashboard.
- Email and phone fields are either absent or plaintext-redacted in the event data.
- Stack traces and error context are visible (non-PII data is present).
- No warning or error in the Sentry UI about data capture.

**Credential/device needed:** Sentry account, Sentry DSN, ability to trigger a test event in the mobile app or via API.

---

## 6. INF-6: PostHog repeat-join funnel renders correctly from seeded fixture data

The funnel is **two** steps, not three — `event_confirmed` → `event_confirmed_repeat`
(decision 123; `user_signed_up` is a separate, unrelated tracked event, not a funnel
step). `ci/scripts/posthog-funnel.merge-test.ts` already automates this end-to-end
(seed + poll the Query API + assert step counts) — this checklist item is really
"provision the credentials so that automated test can run for real," plus one
manual look at the dashboard to confirm it visually renders as expected.

**What to do:**
1. Create a free PostHog account (if not already created) and a new project —
   dedicated to this project's `ci-test`/dev use, per `.spark/environment.md`
   (one PostHog project total, environment-tagged, not per-tier).
2. From the project, obtain:
   - The **Project API Key** (Capture) — a write-only key used to send events.
   - A **Personal API Key** — used to query the Insights/Query API (create one
     under your PostHog user account settings, scoped to this project).
   - The **Project ID** (numeric, visible in the project URL or settings).
   - The **host URL** (`https://us.i.posthog.com` or `https://eu.i.posthog.com`
     depending on your account's region — check which one your project uses).
3. Export these as environment variables in your shell (these are the exact
   names the code reads — do not substitute other names):
   ```bash
   export POSTHOG_HOST="https://us.i.posthog.com"        # or your region's host
   export POSTHOG_CAPTURE_API_KEY="<project API key>"
   export POSTHOG_PERSONAL_API_KEY="<personal API key>"
   export POSTHOG_PROJECT_ID="<numeric project id>"
   ```
4. Run the real automated test locally (this is the same test CI runs on
   merge to `main`, just executed by hand here since it needs real
   credentials CI doesn't have yet):
   ```bash
   npm run test:merge -w ci/scripts
   ```
   This seeds synthetic `event_confirmed`/`event_confirmed_repeat` fixtures
   (tagged `environment: ci-test` and a unique `run_id` so runs don't collide),
   then polls PostHog's Query API for up to 2 minutes (ingestion can lag) until
   the funnel step counts match what was seeded.
5. Confirm the test **passes** (not skipped) — if it prints `SKIPPED`, the
   credentials above aren't fully configured; if it fails after the 2-minute
   poll window, something is wrong with ingestion or the query, not just slow.
6. Separately, open the PostHog dashboard → **Insights** → create a new
   **Funnel** with two steps, `event_confirmed` then `event_confirmed_repeat`,
   filtered to `environment = ci-test`. Confirm it renders visually with
   non-zero counts at both steps — this is the "renders correctly," not just
   "an event was received" half of the AC that only a human eye can confirm.
7. Once confirmed working, add these same four values as **GitHub repository
   secrets** named `POSTHOG_HOST`, `POSTHOG_CI_TEST_CAPTURE_API_KEY`,
   `POSTHOG_CI_TEST_PERSONAL_API_KEY`, `POSTHOG_CI_TEST_PROJECT_ID` (the
   secret names `ci.yml`'s `posthog-funnel-merge-test` job expects — see
   that job for the exact mapping) so this becomes a real, permanent
   merge-to-`main` gate instead of a manual step.

**What a pass looks like:**
- `npm run test:merge -w ci/scripts` passes (not skipped, not failed).
- The PostHog dashboard's Funnel Insight renders both steps with matching,
  non-zero counts.
- After adding the GitHub secrets, the `INF-6 - PostHog repeat-join funnel`
  job goes green on the next push to `main`.

**Credential/device needed:** PostHog account, a Project API (Capture) key, a
Personal API key, the numeric project ID, ability to run npm scripts locally
and add GitHub repository secrets.

---

## 7. INF-7: Push notification delivers to physical device within 10 seconds

**What to do:**
1. Ensure you have:
   - A physical iOS or Android device (or a working simulator/emulator with Expo Go installed).
   - The Expo dev client or Expo Go app installed and running the project in dev mode.
   - Expo Push Notifications credentials configured:
     - For iOS: an Apple Developer account with APN certificates set up in Expo's dashboard.
     - For Android: a Firebase Cloud Messaging (FCM) project with credentials in Expo's dashboard.
2. Run the `send-test-push` Edge Function (a manual diagnostic tool in M0):
   - The function is wired as `POST /functions/v1/send-test-push` in Supabase.
   - It 404s by default in any environment. It only responds once the
     `ALLOW_TEST_PUSH` environment variable is set to the literal string
     `true` on the deployed function — this was added during remediation
     specifically so a live debug endpoint can't be reachable by default.
     Set it (`supabase secrets set ALLOW_TEST_PUSH=true` against the target
     project) before calling it, and unset it again afterward.
   - Call it with a curl command or Postman, passing the target device's
     Expo Push Token in the `expo_push_token` field and the shared secret
     in the `x-cron-secret` header (not `x-shared-secret` — the header name
     matches the other cron-invoked functions):
     ```bash
     curl -X POST "https://[project-id].supabase.co/functions/v1/send-test-push" \
       -H "Content-Type: application/json" \
       -H "x-cron-secret: [CRON_SHARED_SECRET value]" \
       -d '{"expo_push_token": "[your-device-token]", "title": "M0 test", "body": "manual push test"}'
     ```
3. Immediately open the app on your physical device and watch the notification area.
4. Verify:
   - A push notification appears on the device's lock screen or notification center within 10 seconds of the API call.
   - The notification is readable and contains the test message.

**What a pass looks like:**
- A push notification arrives on the physical device within 10 seconds.
- The notification is visible in the device's native notification center.
- Tapping it opens the app (if configured) or navigates as expected.

**Credential/device needed:** Physical iOS or Android device, Expo Push Token for the device, Apple Developer / Firebase account with APNs/FCM credentials, access to call the Edge Function.

---

## 8. INF-8: Password-reset email arrives within 2 minutes

**What to do:**
1. Set up a test email account (create a test inbox or use an existing one you monitor).
   - If you don't have one, use a service like Mailinator, 10minutemail, or a personal email.
2. Use the app's sign-up flow:
   - Sign up with the test email address.
   - Complete the onboarding.
3. Log out and navigate to the password-reset screen.
4. Enter the test email and submit the password-reset request.
5. **Record the exact time** you submitted the request (e.g., 14:23:45).
6. Check your test email inbox.
7. Verify:
   - An email arrives **within 2 minutes** of submitting the request.
   - The subject line indicates it's a password-reset email.
   - The email contains a valid reset link (clickable, not broken).
   - Clicking the link takes you to a reset form in the app or browser.

**What a pass looks like:**
- Email arrives in the test inbox within 120 seconds of the reset request.
- Email is from the configured sender (e.g., from Resend's sender address).
- Email contains a valid clickable reset link.
- Following the link allows you to set a new password.

**Credential/device needed:** Test email address, access to its inbox, ability to sign up and request a password reset in the app.

---

## 9. INF-9: Three R2 locations exist; restricted buckets reject denied-read test

**What to do:**
1. Create a Cloudflare R2 account (free tier OK; first 10 GB/month free).
2. Create three buckets in R2, named exactly `general`, `receipts`,
   `verification` (the test script defaults to these names; you can use
   different names, but then must also set `R2_BUCKET_GENERAL`/
   `R2_BUCKET_RECEIPTS`/`R2_BUCKET_VERIFICATION` env vars to match).
3. In each bucket, verify no public read access is enabled — private by
   default is correct and expected; this test's whole point is proving
   there is no direct/public read path at all, ever, for any of the three.
4. Obtain your R2 credentials (R2 → Manage API Tokens): Account ID, Access
   Key ID, Secret Access Key.
5. Start the local Supabase stack and serve the Edge Functions so
   `mint-storage-url` is reachable (the test calls it, not just raw R2):
   ```bash
   supabase start
   supabase functions serve
   ```
6. In a separate terminal, from the repo root, export the required env vars
   and run the real script directly (there is no npm script wrapper for
   this one — it's invoked with `tsx` directly, matching exactly what CI
   runs):
   ```bash
   export R2_ACCOUNT_ID="<account-id>"
   export R2_ACCESS_KEY_ID="<access-key>"
   export R2_SECRET_ACCESS_KEY="<secret-key>"
   export SUPABASE_URL="http://127.0.0.1:54421"   # or your target project's URL
   export SUPABASE_ANON_KEY="<anon key from `supabase status`>"
   export SUPABASE_SERVICE_ROLE_KEY="<service_role key from `supabase status`>"
   npx tsx ci/scripts/r2-denied-read-test.ts
   ```
7. Verify the test output:
   - A totally unauthenticated, unsigned direct fetch against each of the
     three bucket URLs fails (no bucket is ever publicly readable).
   - Calling `mint-storage-url` for `receipts` or `verification` — as any
     caller, regardless of who — returns exactly `403 { error:
     "location_not_available" }`.
   - The script exits 0 with no failures printed (it prints an honest
     `SKIPPED` warning instead of a false pass if credentials are missing —
     confirm you see real pass/fail output, not a skip notice).
8. Once confirmed, add the same six values as GitHub repository secrets
   (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
   `DEV_SUPABASE_URL`, `DEV_SUPABASE_ANON_KEY`, `DEV_SUPABASE_SERVICE_ROLE_KEY`
   — see `ci.yml`'s `r2-denied-read-test` job for the exact secret-name
   mapping) so this becomes a permanent, every-PR CI gate instead of a
   manual step.

**What a pass looks like:**
- All three R2 buckets exist, are private, and are reachable by the test.
- `npx tsx ci/scripts/r2-denied-read-test.ts` exits 0 with real (not
  skipped) pass output for both the unauthenticated-read and the
  `mint-storage-url` denial checks.
- After adding the GitHub secrets, the `INF-9 - r2-denied-read-test` job
  goes green (for real, not honestly-skipped) on the next PR.

**Credential/device needed:** Cloudflare R2 account, three buckets, R2 API
credentials, local Supabase stack running with functions served, ability to
add GitHub repository secrets.

---

## 10. INF-10: Supabase billing alert configured at $40

**What to do:**
1. Log into the Supabase dashboard for your Production project.
2. Navigate to **Settings** → **Billing** (or **Organization** → **Billing** depending on dashboard layout).
3. Look for **Billing alerts** or **Spending limits**.
4. Set a billing alert threshold at **$40.00** USD (or your local currency equivalent).
5. Verify:
   - The alert is set to notify you (usually via email) when monthly spending reaches $40.
   - The threshold appears in the dashboard (you can see it's saved).
   - If your dashboard allows it, take a screenshot showing the $40 billing alert configured.

**What a pass looks like:**
- The Supabase dashboard displays an active billing alert set to $40.
- If you spend is tracked, the alert would fire an email notification at or near $40.
- You have a screenshot or dashboard confirmation that this is configured.

**Credential/device needed:** Supabase account access, ability to edit billing settings (usually owner/admin role).

---

## 11. Apply branch protection ruleset in GitHub repo settings

**What to do:**
1. Go to your GitHub repository settings.
2. Navigate to **Settings** → **Rules** (or **Branches** → **Branch protection rules**, depending on GitHub's current UI).
3. Click **New branch ruleset** or **Add rule**.
4. Configure it to apply to the `main` branch.
5. Under **Required checks**, add the following (copy the exact names from `.github/workflows/ci.yml`):
   - `Lint (Node 20 — apps/mobile, ci/scripts, and everything not apps/web)`
   - `Typecheck (Node 20 — apps/mobile, ci/scripts)`
   - `Test - ci/scripts (unit)`
   - `Test - apps/mobile (Jest, jest-expo)`
   - `apps/web (Node 22 — lint, typecheck, build, test, its slice of npm audit)`
   - `SEC-3 - check-bundle-keys (real expo export)`
   - `check-migration-pairs`
   - `SEC-1 - check-rls-enabled (static)`
   - `Supabase integration (migrations, SEC-2, SEC-4, Edge Functions)`
   - `INF-9 - r2-denied-read-test (real R2, secrets-gated)`
   - `npm audit (--audit-level=high, Node 20, whole tree)`
6. Save the ruleset.
7. Verify:
   - The ruleset appears in the Settings page.
   - The ruleset is **enabled** (active toggle, not disabled).
   - The target is `main` (not a different branch).

**What a pass looks like:**
- The branch protection ruleset is visible and active in GitHub Settings.
- All required checks are listed in the ruleset.
- The ruleset applies to `main` and will block merges if any required check fails.

**Credential/device needed:** GitHub repository admin access.

---

## 12. SEC-1 through SEC-4 are CI-tested (no manual action required)

These controls are verified by the GitHub Actions pipeline on every PR:

| Control | CI Job | What it verifies |
| --- | --- | --- |
| **SEC-1** | `SEC-1 - check-rls-enabled (static)` | Every table has an RLS policy (deny-by-default); fails if any table is unprotected. |
| **SEC-2** | `Supabase integration (migrations, SEC-2, SEC-4, Edge Functions)` | The negative-authorization suite runs: anon users get zero rows, authenticated non-owners cannot read/write other users' rows, admin tables reject non-admin sessions. |
| **SEC-3** | `SEC-3 - check-bundle-keys (real expo export)` | Scans the Expo export bundle for hardcoded `service_role` keys; fails if any are found. |
| **SEC-4** | `Supabase integration (...)` | Fails if any view lacks `security_invoker`. |

**To verify:**
1. Look at the `.github/workflows/ci.yml` file.
2. Confirm these jobs exist and run on every PR.
3. When you open the test PR in checklist item 1, you'll see these checks execute (either pass or fail).

---

## 13. Apple Developer Program and Google Play account setup (parallel founder tasks)

These are **not** part of this checklist but are documented here for reference:

- **Apple Developer Program:** Must be enrolled **before M0 completes** if you plan to use Sign in with Apple, Expo Push, or any EAS-driven iOS builds. Enrolment takes 1–2 days and requires identity verification.
  - **Owner action:** Visit developer.apple.com, enroll as an individual or organization, set up a team ID.
  - **When:** Start immediately in parallel with M0 development; will be needed for M1's Expo Push setup.

- **Google Play Developer Account:** Required for the beta testing gate (12 testers, 14 continuous days). Decide on account type (Personal vs. Organization) — this is **decided in the early kickoff** (decision 113 records this as a "now" action).
  - **Personal account:** 12-tester/14-day gate is mandatory before production access (no way around it).
  - **Organization account:** Requires a D-U-N-S number (adds lead time).
  - **Owner action:** Decide account type, create the account, and **start recruiting 12 beta testers immediately** — the clock starts when the 12th opts in.
  - **When:** Start immediately in parallel with M0 development; will be active from M9 (beta launch prep).

---

## Summary of Credential/Account Needs

| Manual test item | Credential / Account | Provides |
| --- | --- | --- |
| 1. CI blocks PR | GitHub repo (admin) | Ability to see CI run and fail |
| 2. Schema reversible | Local Supabase Docker | Self-contained, no external account |
| 3. Web domain HTTPS | Domain registrar + Cloudflare | Deployed web site at https://domain |
| 4. Scheduled job T+2min | Local Supabase Docker | Job execution logs |
| 5. Sentry PII redaction | Sentry account + DSN | Error event visibility and redaction check |
| 6. PostHog funnel | PostHog account + API key | Funnel visualization from seeded data |
| 7. Push to device | Expo + Apple/Firebase credentials | Native push delivery to device |
| 8. Password-reset email | Test email inbox + Resend | Email delivery verification |
| 9. R2 buckets | Cloudflare R2 account + credentials | Three segregated buckets + denied-read proof |
| 10. Billing alert | Supabase account (owner) | $40 spending threshold set |
| 11. Branch protection | GitHub repo (admin) | Merge-blocking ruleset on `main` |
| 12. SEC-1…4 | None (CI-tested) | Automatic on every PR |
| 13. Apple/Google Play | Apple + Google developer accounts | Required for M1+ ; start now in parallel |

---

## Notes

- **Timing:** Some items (Apple Developer, Google Play account, domain purchase) have lead times. Start those in parallel with M0 development if possible — waiting until M0 is done is a common bottleneck.
- **Environment:** All credential values should be stored securely (`.env.local` is gitignored; GitHub Actions secrets for CI-driven steps).
- **Re-testing:** If any single item fails, fix and re-run just that item; you don't need to re-run the entire list.
- **Gate decision:** If all items pass, M0 is approved for merge and marked `done` in `milestones.md`. If any fail, record the failure in `progress.md` and route it back to the development team for remediation.
