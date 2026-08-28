# PR Draft — Milestone 0: Scaffold & security baseline

**Status:** awaiting-acceptance (do NOT mark M0 `done` in milestones.md until the
human confirms the merge, per spark-commit protocol).

## Suggested PR title

```
feat(m0): scaffold, CI, and security baseline
```

## Suggested PR body

### Summary

Builds SponTRIP's Milestone 0: npm-workspaces monorepo scaffold (Expo mobile +
Astro web + Supabase backend + CI mechanical-check scripts), three reversible
Postgres migrations, four Deno Edge Functions, a full GitHub Actions CI
pipeline enforcing SEC-1 through SEC-4 and INF-2/INF-4/INF-6/INF-9 mechanically
(not by inspection), and the three-tier environment recipe's foundation. No
product features or UI screens — those start at M1 per the M0 spec.

### Key changes

- **Repo scaffold**: `apps/mobile` (Expo SDK 57, TypeScript, Jest via
  jest-expo), `apps/web` (Astro 7.2.9 static output on Node ≥22.12.0,
  hand-scaffolded because `astro@5.18.2` carried HIGH/CRITICAL audit
  advisories fixed only in 7.2.9 which requires Node 22; `apps/mobile` and
  `ci/scripts` remain on Node 20 LTS), `ci/scripts` (`@sponTRIP/ci-scripts`,
  tsx + Vitest), `supabase/` (migrations, Edge Functions). Root ESLint/
  TypeScript config shared via `tsconfig.base.json`.
- **Migrations** (`supabase/migrations/` + paired `supabase/migrations_down/`):
  `enable_extensions` (pgcrypto), `smoke_test_fixtures` (permanent SEC-1/SEC-4
  canary), `scheduled_jobs` (pg_cron + `job_runs` ledger backing INF-4).
  Verified end-to-end against a real local Supabase Docker stack via
  `migration-reversibility-test.ts` (up → dump → down → dump → re-up → dump,
  asserting the object-level diff matches exactly). This surfaced and fixed a
  real bug: `pg_net`/`pgcrypto` landed in different Postgres schemas
  depending on which tool applied the SQL — pg_net is now correctly treated
  as Supabase-platform-managed (not owned/dropped by our migration), and
  `pgcrypto` explicitly targets the `extensions` schema.
- **Edge Functions**: `scheduled-smoke-ok`/`-fail` (INF-4 proof pair),
  `mint-storage-url` (INF-9's R2 gatekeeper), `send-test-push` (INF-7 manual
  harness). Each exports a testable `handler()`, verified with 19/19 Deno tests
  against the real local stack (not mocked).
- **CI mechanical checks** (`ci/scripts/`): `check-rls-enabled.ts` (SEC-1),
  `check-security-invoker.ts` (SEC-4), `check-bundle-keys.ts` (SEC-3),
  `check-migration-pairs.ts`, `migration-reversibility-test.ts` (INF-2),
  `rls-negative-auth/{matrix,run}.ts` (SEC-2), `r2-denied-read-test.ts`
  (INF-9), `posthog-fixture-seed.ts` + `posthog-funnel.merge-test.ts`
  (INF-6). All verified against the real local stack; `rls-negative-auth`
  was additionally confirmed to actually catch violations (not vacuously
  green) by temporarily adding permissive RLS policies, observing real
  failures, then reverting. **All tests including new write-denial probes
  (INSERT/UPDATE/DELETE) verified independently after remediation.**
- **GitHub Actions** (`.github/workflows/ci.yml`, `.github/dependabot.yml`):
  lint, typecheck, tests per workspace (split Node version per workspace),
  all SEC/INF mechanical checks, a secrets-gated real-R2 job, a
  merge-to-main-only PostHog funnel job, and `npm audit --audit-level=high`.

### Security review history

**Review Gate cycle 1 — NO-GO (11 findings: 2 HIGH, 5 MEDIUM, 3 LOW):**
- **[HIGH] `mint-storage-url` path-traversal bypass** — any authenticated user
  could mint read/write URLs into other users' `general/{uid}/` prefixes and
  into the unconditionally-denied `receipts`/`verification` buckets. Proven
  live with `../` path traversal segments surviving the prefix check and being
  resolved by the URL parser before signing. Neither existing test would catch
  it.
- **[HIGH] SEC-1/SEC-2 write-denial suite gap** — the negative-authorization
  suite only tested `SELECT`; no INSERT/UPDATE/DELETE was ever attempted by
  anon or non-owner. Live DB behavior correct (verified manually), but the
  mechanical control decision 126 relies on didn't actually prove write-denial.
  Subtly broken: `attemptInsert()` chained `.select("id").single()` onto the
  mutating call, and Postgres RLS makes `INSERT ... RETURNING` fail
  identically whether the INSERT itself was denied or only its RETURNING-read
  was denied — the suite couldn't distinguish a real deny from a successful
  insert it merely couldn't read back.

**Remediation cycle 1 — all 11 findings fixed** (1–8 routed back as required;
9–11 recommended fixed since M1's schema would trip them anyway):
- Finding 1 (path traversal) fixed with two layers: `isValidBody` now rejects
  any key containing a `..` segment, backslashes, or percent-encoded
  traversal variants; and, belt-and-suspenders, the resolved `objectUrl`'s
  pathname is re-verified against the expected prefix immediately before
  signing, so the fix doesn't rest on input filtering alone. Regression
  tests added using the reviewer's exact reproduction steps, plus 6 further
  encoding variants added during Review Gate cycle 2's re-verification.
- Finding 2 (write-denial gap) fixed by mirroring `attemptUpdate`/
  `attemptDelete`'s pattern: fire the mutation bare (no `.select()` chained),
  tag payload with per-identity probe, verify via independent service-role
  read. Sanity-checked by planting real permissive INSERT policies and
  confirming the suite caught them before reverting.
- Findings 3–11 (MEDIUM and LOW) all addressed with independent verification
  against the real local Supabase stack.

**QA re-verification post-remediation — finding 2 follow-up required:**
Finding 1 solid. Finding 2's fix proved correct by independent re-read, but
QA's own live exploitation confirmed a remaining gap: `attemptInsert()` as
originally fixed still had the `.select()` issue on two M0 matrix rows. Root
cause traced to a test-isolation bug (a test deleting an env var without
restoring it, silently corrupting later tests). Fixed and re-verified with
QA's exact sanity check: planted permissive INSERT policy, suite now correctly
FAILs loudly on both affected tables; reverted clean.

**Review Gate cycle 2 — GO.**
- Both HIGH findings independently re-verified as closed:
  - Finding 1 survived 17 exploit variants (6 new encoding cases beyond the
    original 3) with zero escapes.
  - Finding 2 was mutation-tested: 8 real permission grants planted live into
    the schema, 6/8 caught, the 2 misses proven to be **equivalent mutants**
    (Postgres denies UPDATE/DELETE with no SELECT policy regardless, so
    nothing was actually being granted — the mutants revealed no real
    vulnerability, confirming the test logic is sound).
- INF-4's `cron-jobs.md` runbook executed end-to-end against real wall-clock
  pg_cron firing (both -ok and -fail paths; `job_runs` ledger confirmed).
- Findings 3–11 each independently re-verified.
- **Zero unresolved Critical/High findings.** Zero scope creep (exactly 4 new
  files, each traceable to a specific finding).

### Known findings / deliberately left for human action

1. **Node version split across workspaces** (decision 130). `apps/web` now
   requires Node ≥22.12.0 (`astro@7.2.9`); `apps/mobile` and `ci/scripts`
   remain on Node 20 LTS. This was a founder decision to clear HIGH/CRITICAL
   audit advisories rather than accept documented risk or weaken the gate.
   `npm audit --audit-level=high` exits **0** under both Node 20 and 22 (11
   moderate-only findings remain, pre-existing Expo SDK 57 `uuid`/`xcode`
   chain, no fix available without a major Expo downgrade).
2. **Two M1-kickoff follow-ups** (logged in `.spark/security.md` §7, not
   routed for a 3rd remediation cycle per Review Gate recommendation):
   - [MEDIUM] `ci/scripts/rls-negative-auth/matrix.ts`: the `ownerWritable`
     INSERT check conflates "owns the seeded row" with "owns the row being
     inserted," causing false failures on correct M1 owner-scoped policies.
     Fix before M1's first owner-scoped table is added: adjust INSERT
     semantics to match M1's actual schema patterns, and add an
     ownership-forgery case that must always be denied.
   - [MEDIUM] Edge Function test files must be hand-enumerated in CI (not
     auto-discovered). New test files run locally but never in the merge-
     blocking pipeline without explicit addition. Fix: replace per-file `deno
     test` steps with directory-level `deno test tests/`.
3. **R2 buckets, Cloudflare Pages, EAS credentials, real PostHog/Sentry
   accounts, Supabase billing alert, physical-device push/email delivery**
   all need real external credentials/accounts this agent doesn't have.
   Everything up to that point is built and code-complete; see the manual
   test checklist for exact manual steps.
4. **pg_cron's real T+2min wall-clock firing** was proven against the
   **local** Docker Supabase stack rather than the dev cloud project —
   same mechanism, different target (no cloud credentials exist). Evidence
   (real timestamps, both -ok and -fail paths, twice each) is in the M0
   checkpoint log.

### Test evidence

- `apps/mobile`: **16/16** Jest tests pass (Sentry PII scrubber).
- `apps/web` (Node 22, astro@7.2.9): **2/2** Vitest tests pass; `astro build`
  + `astro check` clean; `npm audit --audit-level=high` exits 0.
- `ci/scripts` (Node 20, vitest@4.1.11): **29/29** Vitest unit tests pass;
  `tsc --noEmit` clean. `npm audit --audit-level=high` exits 0 under both Node
  20 and 22.
- Real local Supabase Docker stack: `migration-reversibility-test.ts` PASS,
  `check-security-invoker.ts` PASS, `rls-negative-auth/run.ts` PASS (confirmed
  to catch real violations by temporarily adding permissive policies and
  observing failures), **19/19** Deno Edge Function tests PASS.
- Root `npm run lint` clean (0 errors) across the whole repo.
- Deliberately-failing-test simulation confirmed `npm test` exits non-zero
  (the CI-blocking mechanism).

### Migration notes

Three migrations apply cleanly on a fresh database; each has a tested, paired
rollback in `supabase/migrations_down/`. No destructive changes to any existing
schema (greenfield). Migration-reversibility verified end-to-end (up → dump →
down → dump → re-up → dump, schema diffs match exactly).

### Manual steps still owed to a human (Review Gate finding 7, QA follow-up)

`.github/workflows/ci.yml` itself is correctly wired — no `continue-on-error`,
no `|| true`, no `if: always()` anywhere, independently confirmed by the Review
Gate. **But a red GitHub Actions run does not, by itself, block a merge.** Only
a branch protection ruleset requiring these specific checks does, and nothing
in this repo can configure that automatically — it's a GitHub repo-settings
action only a human with admin access can take.

**Required action:** in GitHub repo Settings → Rules → Rulesets → New branch
ruleset (targeting `main`), require these exact status checks (their literal
`name:` string from `ci.yml` — GitHub matches on this, not the job id):

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

**Deliberately NOT in that list:** `INF-6 - PostHog repeat-join funnel (merge
to main only)` — it only runs on `push` to `main` (`if:` condition in
`ci.yml`), so it never reports a status on a pull_request event at all;
requiring it would make every PR wait forever for a check that structurally
cannot fire against it.

A starting-point ruleset JSON matching GitHub's Rulesets API shape is
committed at `.github/rulesets/require-ci-checks.json` — **not auto-applied**
(GitHub doesn't read files from this path the way it reads
`.github/workflows/*.yml` or `dependabot.yml`). Apply it via
`gh api repos/:owner/:repo/rulesets --input <file>` (after stripping the
`"//"` comment key GitHub's API will reject) or recreate it by hand in the
Settings UI — either way, a human enabling it in repo settings is the actual
required action; the file only exists so the exact check list isn't
retyped/lost.

**Also still needs a human, unrelated to branch protection:** repository
secrets for the jobs that are currently honest-skipping without them —
`R2_ACCOUNT_ID`/`R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY` and
`DEV_SUPABASE_URL`/`DEV_SUPABASE_ANON_KEY`/`DEV_SUPABASE_SERVICE_ROLE_KEY`
(the `r2-denied-read-test` job) and
`POSTHOG_HOST`/`POSTHOG_CI_TEST_CAPTURE_API_KEY`/`POSTHOG_CI_TEST_PERSONAL_API_KEY`/`POSTHOG_CI_TEST_PROJECT_ID`
(the `posthog-funnel-merge-test` job) — see the manual test checklist for what
each needs and why this agent couldn't provision them.

## Command for the human

```
git push -u origin milestone/00-scaffold-security-baseline
```

Then open the PR on GitHub and merge after manual testing passes. Per
spark-commit protocol, M0 stays `awaiting-acceptance` in `.spark/milestones.md`
until that merge is confirmed.
